#!/usr/bin/env python3
"""
Daily GitHub Side Project Radar — Fresh Discovery for Blake

Strategy:
- Use GitHub Search API (unauth, 60 req/hr) to find recently-created repos with momentum
- Rotate focus by day-of-week so we don't hammer the same AI repos every day
- Persistent shown-list with 30-day cooldown so the same repos don't reappear
- Strong novelty bias (created_recently AND stars) over absolute popularity
"""
import json
import os
import re
import sys
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

STATE_DIR = Path.home() / ".hermes" / "cron" / "output" / "d2b3bd20b6b3"
STATE_FILE = STATE_DIR / "shown.json"
COOLDOWN_DAYS = 30  # Don't re-show a repo we've surfaced in the last 30 days
SEARCH_WINDOW_DAYS = 14  # Only consider repos created in the last 14 days
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()

# Blake's interest profile — used for scoring matches
INTEREST_KEYWORDS = {
    "AI-Agents": ["ai-agent", "agent", "llm", "gpt", "claude", "rag", "mcp",
                  "openai", "anthropic", "gemini", "langchain", "llamaindex",
                  "prompt", "tool-use", "function-calling", "multi-agent",
                  "reasoning", "inference", "embedding", "harness"],
    "Coding": ["cursor", "copilot", "code-generation", "ai-coding", "vibe-coding",
               "cline", "windsurf", "bolt", "lovable", "v0", "devin",
               "scaffold", "ide-plugin", "codex", "code assistant"],
    "DevTools": ["cli", "tui", "developer-tools", "productivity", "automation",
                 "workflow", "vscode", "neovim", "terminal", "debugger",
                 "linter", "formatter", "build-tool"],
    "Indie": ["saas", "boilerplate", "starter", "micro-saas", "indie",
              "producthunt", "launch", "stripe", "auth-template",
              "subscription", "billing", "pricing"],
    "Finance": ["quant", "trading", "backtest", "fintech", "portfolio",
                "options", "defi", "equity", "valuation", "algorithmic",
                "market-data", "earnings", "stock", "hedge-fund"],
    "Automation": ["scraper", "crawler", "parser", "webhook", "orchestrat",
                   "pipeline", "etl", "rpa", "data-pipeline"],
    "DataViz": ["dashboard", "monitoring", "analytics", "visualization", "chart"],
}

# Detect non-English descriptions (rough heuristic — block Chinese/CJK heavy)
CJK_PATTERN = re.compile(r"[\u4e00-\u9fff]{4,}")

# Day-of-week theme rotation (0=Mon, 4=Fri)
# Each theme: (label, list of GitHub search queries that target that theme)
# REPLACE is substituted with the date range (e.g. "2026-05-26..2026-06-09")
# We intentionally do NOT use `stars:>N` qualifiers — fresh repos in narrow
# categories (SaaS boilerplates, trading bots) often have <10 stars. The score
# function handles quality ranking; the search just finds recent candidates.
THEMES = {
    0: {  # Monday: AI agents & LLM tooling
        "label": "AI Agents & LLM Tooling",
        "queries": [
            "ai agent created:REPLACE",
            "llm agent created:REPLACE",
            "mcp server created:REPLACE",
            "claude code created:REPLACE",
            "openai agent created:REPLACE",
        ],
    },
    1: {  # Tuesday: Indie SaaS / side-project infra
        "label": "Indie SaaS & Side-Project Infra",
        "queries": [
            "saas boilerplate created:REPLACE",
            "indie hacker created:REPLACE",
            "nextjs saas created:REPLACE",
            "stripe saas created:REPLACE",
            "producthunt launch created:REPLACE",
        ],
    },
    2: {  # Wednesday: Quant & finance tooling
        "label": "Quant & Finance Tooling",
        "queries": [
            "trading bot created:REPLACE",
            "backtest created:REPLACE",
            "algorithmic trading created:REPLACE",
            "fintech created:REPLACE",
            "market data created:REPLACE",
        ],
    },
    3: {  # Thursday: Dev tools & productivity
        "label": "Dev Tools & Productivity",
        "queries": [
            "cli tool created:REPLACE",
            "developer tools created:REPLACE",
            "tui created:REPLACE",
            "vscode extension created:REPLACE",
            "productivity created:REPLACE",
        ],
    },
    4: {  # Friday: Wildcards — anything blowing up this week (broader pool)
        "label": "Wildcards (blowing up this week)",
        "queries": [
            "stars:200..10000 created:REPLACE",  # 200-10k stars in 2 weeks
            "stars:100..10000 llm created:REPLACE",
            "stars:100..10000 agent created:REPLACE",
            "stars:100..10000 ai created:REPLACE",
            "stars:50..10000 startup created:REPLACE",
        ],
    },
}


def load_shown():
    """Load {full_name: last_shown_iso} from persistent state."""
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            return {}
    return {}


def save_shown(state):
    """Persist shown-state so we can dedupe across days."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def search_github(query, per_page=25):
    """Search GitHub for repos matching the query.

    Query should already include the created: date range.
    Returns list of repo dicts from the GitHub Search API.
    """
    url = (
        f"https://api.github.com/search/repositories"
        f"?q={urllib.parse.quote(query)}&sort=stars&order=desc&per_page={per_page}"
    )
    headers = {
        "User-Agent": "blake-radar/1.0",
        "Accept": "application/vnd.github+json",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("items", [])
    except urllib.error.HTTPError as e:
        print(f"  [warn] GitHub API {e.code} for query: {e.reason}", file=sys.stderr)
        if e.code == 403:
            return "_RATE_LIMITED_"
        return []
    except Exception as e:
        print(f"  [warn] GitHub search failed: {e}", file=sys.stderr)
        return []


def score_repo(repo, theme_label):
    """Score a repo against Blake's interests + novelty bias."""
    text = (repo.get("description") or "").lower()
    name = repo.get("name", "").lower()
    topics = " ".join(t.lower() for t in repo.get("topics", []))
    readme = (repo.get("description") or "").lower()  # API doesn't give us readme text directly
    full = f"{name} {text} {topics} {readme}"

    # Skip non-English repos
    desc = repo.get("description") or ""
    if CJK_PATTERN.search(desc):
        return -100, [], 0  # Effectively excluded

    score = 0
    matched = []
    for cat, keywords in INTEREST_KEYWORDS.items():
        for kw in keywords:
            if kw in full:
                score += 2
                if cat not in matched:
                    matched.append(cat)
                break

    # Star count light bonus (recency dominates)
    stars = repo.get("stargazers_count", 0)
    if stars > 100:
        score += 1
    if stars > 500:
        score += 2
    if stars > 1000:
        score += 3

    # Strong novelty boost — favor repos that are NEW and have momentum
    created = datetime.fromisoformat(repo["created_at"].replace("Z", "+00:00"))
    days_old = (datetime.now(timezone.utc) - created).days
    if days_old <= 3 and stars >= 20:
        score += 5  # super-fresh with any traction = jackpot
    elif days_old <= 7 and stars >= 30:
        score += 4
    elif days_old <= 14 and stars >= 50:
        score += 2

    # Penalty for stale or weak repos
    if days_old > 60:
        score -= 2
    if stars < 20:
        score -= 3

    # Small theme alignment boost (so the day's theme gets preference)
    theme_keywords = theme_label.lower().split()
    if any(kw in full for kw in theme_keywords):
        score += 1

    return score, matched, days_old


def fmt_repo(repo, days_old, matched=None):
    """Format a repo for display in the radar output."""
    desc = (repo.get("description") or "No description").strip()
    if len(desc) > 280:
        desc = desc[:277] + "..."
    lang = repo.get("language") or "?"
    stars = repo.get("stargazers_count", 0)
    url = repo.get("html_url", "")
    topics = repo.get("topics", [])[:4]
    topics_str = " · " + " ".join(f"#{t}" for t in topics) if topics else ""

    cat_names = {
        "AI-Agents": "#AI", "Coding": "#Coding", "DevTools": "#DevTools",
        "Indie": "#Indie", "Finance": "#Finance", "Automation": "#Automation",
        "DataViz": "#DataViz",
    }
    tag_str = ""
    if matched:
        tag_str = " · " + " ".join(cat_names.get(c, f"#{c}") for c in matched[:3])

    return (
        f"→ [{repo['full_name']}]({url})  ·  `{lang}` · ⭐{stars:,} · {days_old}d old{topics_str}{tag_str}\n"
        f"   {desc}"
    )


def main():
    today = datetime.now()
    weekday = today.weekday()  # 0=Mon, 4=Fri
    theme = THEMES.get(weekday, THEMES[4])

    # Date range for "fresh" — last 14 days
    end_date = today.strftime("%Y-%m-%d")
    start_date = (today - timedelta(days=SEARCH_WINDOW_DAYS)).strftime("%Y-%m-%d")
    date_range = f"{start_date}..{end_date}"

    # Load shown-state and build cooldown set
    state = load_shown()
    cutoff = today - timedelta(days=COOLDOWN_DAYS)
    cooldown_keys = {k for k, v in state.items() if datetime.fromisoformat(v) > cutoff}
    # Prune entries older than 90 days to keep state file lean
    state = {k: v for k, v in state.items() if datetime.fromisoformat(v) > today - timedelta(days=90)}

    print(f"=== GitHub Radar — {today.strftime('%Y-%m-%d')} — {theme['label']} ===")
    print(f"Window: repos created {start_date} → {end_date}")
    print(f"Cooldown: {len(cooldown_keys)} repos already shown in last {COOLDOWN_DAYS} days\n")

    # Fetch from all theme queries
    all_repos = {}  # full_name -> repo
    rate_limited = False
    for query_template in theme["queries"]:
        if rate_limited:
            break
        query = query_template.replace("REPLACE", date_range)
        items = search_github(query, per_page=20)
        if items == "_RATE_LIMITED_":
            rate_limited = True
            print("  [warn] Rate limited by GitHub — using partial results.", file=sys.stderr)
            continue
        for item in items:
            full_name = item["full_name"]
            if full_name not in all_repos:
                all_repos[full_name] = item

    if not all_repos:
        print("RESULT: Could not fetch any fresh repos from GitHub today. Will retry tomorrow.")
        return

    # Filter out cooldown
    fresh = {k: v for k, v in all_repos.items() if k not in cooldown_keys}
    skipped_cooldown = len(all_repos) - len(fresh)

    if not fresh:
        # Edge case: all in cooldown. Keep the highest-starred ones anyway.
        print(f"  [info] All {len(all_repos)} repos in cooldown; showing best of cooldown set", file=sys.stderr)
        fresh = dict(sorted(all_repos.items(), key=lambda x: -x[1].get("stargazers_count", 0))[:10])

    if not fresh:
        print("RESULT: No repos available. Will retry tomorrow.")
        return

    # Score
    scored = []
    for full_name, repo in fresh.items():
        s, matched, days_old = score_repo(repo, theme["label"])
        if s < 0:
            continue  # Skip non-English / very low quality
        scored.append((s, repo, matched, days_old))
    scored.sort(key=lambda x: (-x[0], -x[1]["stargazers_count"]))

    if not scored:
        print("RESULT: All candidates were non-English or low quality. Will retry tomorrow.")
        return

    # Pick: 1 top match, 3 alternates, 2 wildcards
    top_pick = scored[0]
    alternates = scored[1:4]

    # Wildcards: any remaining high-star repos (showing the radar can surprise)
    main_keys = {s[1]["full_name"] for s in [top_pick] + alternates}
    wildcards = [s for s in scored[4:] if s[1]["stargazers_count"] >= 50][:2]

    # Update shown-state with today's picks (top + alternates)
    for s in [top_pick] + alternates:
        state[s[1]["full_name"]] = today.isoformat()
    save_shown(state)

    # Build output
    output = []
    output.append(f"📡 **GitHub Radar** · {today.strftime('%a, %b %d')} · {theme['label']}")
    output.append(f"_{len(fresh)} fresh repos analyzed · {skipped_cooldown} in cooldown · window: last {SEARCH_WINDOW_DAYS} days_")
    output.append("")

    s, repo, matched, days_old = top_pick
    output.append("⭐ **TOP MATCH**")
    output.append(fmt_repo(repo, days_old, matched))
    output.append("")

    if alternates:
        output.append("**Also worth a look:**")
        for s, repo, matched, days_old in alternates:
            output.append(fmt_repo(repo, days_old, matched))
        output.append("")

    if wildcards:
        output.append("**🔥 Bonus finds (blowing up):**")
        for s, repo, matched, days_old in wildcards:
            output.append(fmt_repo(repo, days_old, matched))
        output.append("")

    result = "\n".join(output)
    print(result)
    print(f"\n---\nRESULT:\n{result}")


if __name__ == "__main__":
    main()
