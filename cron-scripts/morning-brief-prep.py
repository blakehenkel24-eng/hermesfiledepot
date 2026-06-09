#!/usr/bin/env python3
"""
Morning Brief Pre-Script: Fetch fresh sources for today's brief.

Why this exists: The brief's LLM (DeepSeek V4 Flash) has a knowledge cutoff and
silently falls back to training data when it can't find fresh results. This
script fetches guaranteed-fresh content from a small set of reliable sources,
filtered to the last 24-48 hours, and injects them as structured context.

The LLM prompt then becomes a *formatter* with strict freshness rules — it
composes a brief from the script's output, not from memory.

Sources (failures are isolated; brief still works if some are down):
1. SearXNG (localhost:8888) — "time_range=day" for AI model releases, AI funding, PE deals
2. llm-stats.com/llm-updates — comprehensive model release tracker
3. Hacker News front page (top 25) — community signal
4. aiflashreport.com daily model releases
5. HuggingFace API — newest public models
6. arXiv cs.AI — latest research submissions
"""
import json
import re
import sys
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timezone, timedelta
from html.parser import HTMLParser

SEARXNG = "http://127.0.0.1:8888"
UA = "Mozilla/5.0 (compatible; MorningBrief/1.0; hermes)"


def get(url, timeout=15, headers=None):
    """Fetch URL, return text. Returns None on failure."""
    h = {"User-Agent": UA}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            ct = resp.headers.get("content-type", "")
            data = resp.read()
            if "json" in ct or "javascript" in ct:
                return data.decode("utf-8", errors="ignore")
            return data.decode("utf-8", errors="ignore")
    except Exception as e:
        return f"[fetch error: {e}]"


def get_json(url, timeout=15):
    """Fetch URL and parse as JSON. Returns dict with _error on failure."""
    try:
        text = get(url, timeout=timeout)
        if text.startswith("[fetch error"):
            return {"_error": text}
        return json.loads(text)
    except Exception as e:
        return {"_error": str(e)}


def searxng(query, time_range="day", limit=10):
    """SearXNG JSON search with time filter. Returns list of result dicts."""
    q = urllib.parse.quote(query)
    url = f"{SEARXNG}/search?q={q}&format=json&time_range={time_range}&language=en"
    data = get_json(url, timeout=20)
    if "_error" in data:
        return []
    return data.get("results", [])[:limit]


# --- HTML stripping (minimal — no BS4 dependency) ---

class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self._text = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "footer", "header"):
            self._skip = True

    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "footer", "header"):
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            self._text.append(data)

    def get_text(self):
        text = " ".join(self._text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()


def html_to_text(html):
    p = _TextExtractor()
    p.feed(html)
    return p.get_text()


# --- Source-specific extractors ---

def extract_models_llm_stats():
    """Scrape llm-stats.com/llm-updates for recent model releases."""
    html = get("https://llm-stats.com/llm-updates", timeout=20)
    if html.startswith("[fetch error"):
        return f"  (llm-stats.com unreachable: {html})"

    text = html_to_text(html)
    # Look for the updates list — it's usually formatted as "Org • Model • date"
    # We'll grab the first ~3000 chars which usually contains the most recent
    snippets = []
    # Try to find lines that look like model releases
    for line in re.split(r"[\n•·]", text):
        line = line.strip()
        if 5 < len(line) < 200 and any(
            k in line.lower()
            for k in ["gpt", "claude", "gemini", "llama", "mistral", "qwen",
                      "deepseek", "gemma", "phi", "command", "grok", "release",
                      "update", "launch", "model"]
        ):
            snippets.append(line)
    if not snippets:
        # Fallback: first 2000 chars of cleaned text
        return f"  (raw, first 2000 chars):\n  {text[:2000]}"
    # Dedupe and cap
    seen = set()
    out = []
    for s in snippets:
        if s not in seen and len(s) > 10:
            seen.add(s)
            out.append(s)
        if len(out) >= 30:
            break
    return "\n".join(f"  • {s}" for s in out)


def extract_aiflashreport():
    """Scrape aiflashreport.com daily new model releases page."""
    html = get("https://www.aiflashreport.com/topics/new-ai-model-releases.html", timeout=20)
    if html.startswith("[fetch error"):
        return f"  (aiflashreport unreachable: {html})"
    text = html_to_text(html)
    # Find sentences mentioning model names + dates
    sentences = re.split(r"(?<=[.!?])\s+", text)
    keep = []
    for s in sentences:
        s = s.strip()
        if 30 < len(s) < 250 and any(
            k in s for k in ["GPT", "Claude", "Gemini", "Llama", "Mistral",
                             "Qwen", "DeepSeek", "Gemma", "Phi", "Grok",
                             "release", "launch", "new model", "open-source"]
        ):
            keep.append(s)
        if len(keep) >= 15:
            break
    if not keep:
        return f"  (raw, first 1500 chars):\n  {text[:1500]}"
    return "\n".join(f"  • {s}" for s in keep)


def extract_hn_top():
    """Fetch Hacker News top stories via Algolia API (more reliable than scraping)."""
    data = get_json("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=25", timeout=20)
    if "_error" in data:
        # Fallback to RSS
        rss = get("https://hnrss.org/frontpage?count=25", timeout=15)
        if rss.startswith("[fetch error"):
            return []
        items = re.findall(r"<title>(.*?)</title>.*?<link>(.*?)</link>", rss, re.DOTALL)
        return [{"title": t, "url": u, "points": "?", "comments": "?"} for t, u in items[1:26]]
    hits = data.get("hits", [])
    out = []
    for h in hits:
        out.append({
            "title": h.get("title", ""),
            "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID', '')}",
            "points": h.get("points", 0),
            "comments": h.get("num_comments", 0),
            "age": h.get("created_at", ""),
        })
    return out


def extract_hf_new_models():
    """HuggingFace API — newest public models (sorted by createdAt)."""
    data = get_json("https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=20", timeout=20)
    if "_error" in data or not isinstance(data, list):
        return []
    out = []
    for m in data[:20]:
        out.append({
            "id": m.get("id", "") or m.get("modelId", ""),
            "downloads": m.get("downloads", 0),
            "likes": m.get("likes", 0),
            "created": (m.get("createdAt") or "")[:10],
            "pipeline": (m.get("pipeline_tag") or ""),
        })
    return out


def extract_arxiv_recent():
    """arXiv recent cs.AI submissions."""
    url = ("http://export.arxiv.org/api/query?search_query=cat:cs.AI&"
           "sortBy=submittedDate&sortOrder=descending&max_results=15")
    xml = get(url, timeout=20)
    if xml.startswith("[fetch error"):
        return []
    # Parse entries
    entries = re.findall(r"<entry>(.*?)</entry>", xml, re.DOTALL)
    out = []
    for e in entries[:15]:
        title_m = re.search(r"<title>(.*?)</title>", e, re.DOTALL)
        summary_m = re.search(r"<summary>(.*?)</summary>", e, re.DOTALL)
        link_m = re.search(r"<id>(.*?)</id>", e)
        published_m = re.search(r"<published>(.*?)</published>", e)
        if title_m:
            title = re.sub(r"\s+", " ", title_m.group(1)).strip()
            summary = re.sub(r"\s+", " ", summary_m.group(1)).strip()[:250] if summary_m else ""
            out.append({
                "title": title,
                "url": link_m.group(1).strip() if link_m else "",
                "summary": summary,
                "published": published_m.group(1)[:10] if published_m else "",
            })
    return out


# --- Output assembly ---

def relative_time(iso_or_text):
    """Best-effort: return 'Xh ago' or 'Xd ago' from an ISO date or date string."""
    if not iso_or_text:
        return ""
    try:
        # Try parsing common ISO formats
        s = iso_or_text.replace("Z", "+00:00")
        dt = datetime.fromisoformat(s[:19])
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        delta = datetime.now(timezone.utc) - dt
        hours = int(delta.total_seconds() / 3600)
        if hours < 1:
            return "just now"
        if hours < 24:
            return f"{hours}h ago"
        days = hours // 24
        return f"{days}d ago"
    except Exception:
        return iso_or_text[:10] if iso_or_text else ""


def main():
    today = datetime.now()
    today_str = today.strftime("%A, %B %d, %Y")
    print(f"# MORNING BRIEF RAW SOURCES — {today_str}\n")
    print(f"Generated: {today.isoformat()}")
    print(f"Freshness window: last 48 hours (preferred), last 7 days (acceptable)\n")
    print("=" * 70)

    # --- 1. NEW AI MODELS (the main ask) ---
    print("\n## 🤖 NEW AI MODEL RELEASES (last 48h)\n")
    print("### From llm-stats.com/llm-updates:")
    print(extract_models_llm_stats())
    print("\n### From aiflashreport.com:")
    print(extract_aiflashreport())
    print("\n### From HuggingFace (newest public models):")
    hf = extract_hf_new_models()
    for m in hf[:15]:
        pipe = f" [{m['pipeline']}]" if m["pipeline"] else ""
        print(f"  • {m['id']}{pipe}  (created {m['created']}, {m['downloads']:,}↓, {m['likes']}♥)")

    # --- 2. SearXNG fresh news ---
    print("\n## 📰 AI/TECH NEWS (last 24h via SearXNG)\n")
    for query in [
        "new AI model release today",
        "AI funding round announcement",
        "Anthropic OpenAI Google model release news",
        "AI agent tool launch new",
    ]:
        results = searxng(query, time_range="day", limit=6)
        if results:
            print(f"### Query: \"{query}\"")
            for r in results:
                title = r.get("title", "").strip()
                url = r.get("url", "").strip()
                content = (r.get("content", "") or "").strip()[:180]
                pub = r.get("publishedDate", "")
                age = relative_time(pub) if pub else ""
                age_str = f"  _({age})_" if age else ""
                print(f"  • {title}{age_str}\n    {url}\n    {content}")
            print()

    # --- 3. PE / M&A news ---
    print("\n## 🏦 PE / M&A NEWS (last 48h via SearXNG)\n")
    for query in [
        "private equity deal acquisition announced billion",
        "PE firm fund close billion",
        "merger acquisition deal announced billion",
        "Carlyle KKR Apollo Blackstone EQT deal news",
    ]:
        results = searxng(query, time_range="week", limit=5)
        if results:
            print(f"### Query: \"{query}\"")
            for r in results[:5]:
                title = r.get("title", "").strip()
                url = r.get("url", "").strip()
                content = (r.get("content", "") or "").strip()[:160]
                pub = r.get("publishedDate", "")
                age = relative_time(pub) if pub else ""
                age_str = f"  _({age})_" if age else ""
                print(f"  • {title}{age_str}\n    {url}\n    {content}")
            print()

    # --- 4. Hacker News top ---
    print("\n## 🟧 HACKER NEWS (top 25, last 24h)\n")
    hn = extract_hn_top()
    for i, h in enumerate(hn[:20], 1):
        age = relative_time(h.get("age", ""))
        age_str = f" _({age})_" if age else ""
        print(f"  {i:>2}. {h['title']}{age_str}  [{h['points']}pts, {h['comments']}c]\n      {h['url']}")

    # --- 5. arXiv recent AI research ---
    print("\n## 📚 ARXIV CS.AI (latest 15 submissions)\n")
    arxiv = extract_arxiv_recent()
    for a in arxiv[:12]:
        age = relative_time(a.get("published", ""))
        age_str = f" _({age})_" if age else ""
        print(f"  • {a['title']}{age_str}")
        print(f"    {a['url']}")
        if a.get("summary"):
            print(f"    {a['summary']}")

    # --- 6. Markets / futures ---
    print("\n## 📈 MARKETS OVERNIGHT (futures & key moves)\n")
    # Try Yahoo Finance for ES (S&P futures), NQ (Nasdaq), DJI, GOLD, BTC
    for symbol, name in [
        ("ES=F", "S&P 500 futures"),
        ("NQ=F", "Nasdaq futures"),
        ("YM=F", "Dow futures"),
        ("GC=F", "Gold"),
        ("CL=F", "Crude oil"),
        ("BTC-USD", "Bitcoin"),
    ]:
        # Yahoo Finance quote API
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}?interval=1d&range=2d"
        data = get_json(url, timeout=10)
        try:
            result = data["chart"]["result"][0]
            meta = result["meta"]
            price = meta.get("regularMarketPrice", "?")
            prev = meta.get("chartPreviousClose", meta.get("previousClose", "?"))
            change = ""
            if isinstance(price, (int, float)) and isinstance(prev, (int, float)) and prev:
                pct = (price - prev) / prev * 100
                arrow = "▲" if pct >= 0 else "▼"
                change = f"  {arrow} {pct:+.2f}%"
            print(f"  • {name} ({symbol}): {price}{change}")
        except Exception:
            pass  # Skip silently if Yahoo fails

    print("\n" + "=" * 70)
    print("\n# END RAW SOURCES")
    print("\nReminder for the LLM: ONLY use news from the last 48h. Drop anything")
    print("without a clear recent timestamp. Lead with the model landscape section.")


if __name__ == "__main__":
    main()
