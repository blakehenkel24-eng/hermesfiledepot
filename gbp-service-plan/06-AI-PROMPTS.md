# 06 — AI Prompts: The Prompts That Run the Business

These prompts are the reason this business has 89% gross margin. Save them. Use them daily. Refine them as you go.

---

## 1. The Master Context Prompt (use at start of every Claude/ChatGPT session for this work)

```
You are my operations assistant for Local Lead Engine, a Google
Business Profile management service. I'm working with [N] clients
in [niches: dental, medspa, etc.].

For every task, deliver:
- Specific, concrete output (not generic advice)
- Tone: professional but warm, like a sharp friend who runs
  a marketing agency
- Format: ready to send/publish (no meta-commentary like
  "Here's a draft:")
- Assume the audience is a busy local business owner who
  doesn't care about marketing jargon

When drafting reviews responses, posts, or reports, the
specific business is [BUSINESS NAME, NICHE, CITY]. Their
voice is [casual/professional/luxury/etc.]. Their ideal
customer is [demographic].

The package tier is [Starter/Growth/Pro] so deliver accordingly.
```

---

## 2. GBP Description Generator (600 chars)

```
Write a Google Business Profile description for a
[BUSINESS TYPE] in [CITY, STATE].

Details:
- Business name: [NAME]
- Founded: [YEAR]
- Owner name: [NAME] (include if owner wants personal touch)
- Services: [LIST 5-8 services]
- Differentiators: [3-4 things that make them different]
- Ideal customer: [1-2 sentence description]
- Years in business: [N]

Constraints:
- EXACTLY 600 characters (count carefully)
- Include city name 2-3 times naturally (for local SEO)
- Include primary service 2-3 times naturally
- No exclamation points
- No "we are the best" / "premier" / "#1" language
- Sound like a real human, not marketing copy
- Last sentence should include a soft CTA
  (call, book, visit, etc.)
```

---

## 3. Review Response Generator (positive reviews)

```
Respond to this 5-star Google review for a [BUSINESS TYPE]
in [CITY].

Review:
"[REVIEW TEXT]"

Reviewer first name: [NAME]
Star rating: 5
Business name: [NAME]

Constraints:
- 3-5 sentences max
- Start with "Thank you, [Name]." (not "Hi" or "Hey")
- Mention something specific from their review (proves you read it)
- Mention one of the business's differentiators (without being salesy)
- End with an invitation to come back / refer friends
- Tone: warm, professional, like the owner wrote it
- Do NOT use these phrases: "We strive to," "Our team is dedicated to,"
  "Your satisfaction is our priority," "We look forward to serving you"
- Do NOT use emojis
- Do NOT use exclamation points (one max if absolutely needed)
- No "🙏" or "❤️" or similar
```

**For 1-2 star reviews (negative):**

```
Respond to this [N]-star Google review for a [BUSINESS TYPE].

Review:
"[REVIEW TEXT]"

Constraints:
- 4-6 sentences max
- Start with "Thank you for taking the time to share this, [Name]."
- Acknowledge their frustration WITHOUT being defensive
- Apologize for the specific issue, not in general
- If the issue is fixable, mention what you/the business would do
- Move the conversation OFFLINE ("We'd love to make this right —
  please call us at [number] or email [email]")
- Tone: calm, professional, takes responsibility, doesn't make excuses
- Do NOT: argue, contradict, blame the customer, mention other reviews
- Do NOT: "We're sorry you feel that way"
- Do: take specific, concrete ownership
```

---

## 4. Google Post Generator (weekly)

```
Write a Google Post for [BUSINESS NAME], a [TYPE] in [CITY].

Post type: [One of: What's New, Offer, Event, Product]
This week's post should be: [TOPIC — e.g., "spring cleaning tips"
or "new service launch" or "team spotlight" or "seasonal promo"]

Business details:
- Services: [LIST]
- Current promotion (if any): [DETAILS]
- Voice: [casual/professional/luxury/playful]
- Ideal customer: [DEMOGRAPHIC]
- Recent news/updates: [ANYTHING NEW]

Constraints:
- Post text: 80-150 words (Google truncates around 150)
- 1 clear CTA (call, book, visit, learn more)
- Include the business name once
- Don't start with "We" or "I" — start with the customer
  or the topic
- Use 1 emoji max (and only if it fits the voice)
- Include a suggested image/visual concept after the post
  (e.g., "Suggested image: a clean [subject] with the
  service in action")
- Add 2-3 relevant hashtags at the end (#city #[niche] #[specialty])
```

---

## 5. GBP Audit Generator (for the Loom script)

```
I'm recording a 5-minute Loom audit video for a prospective
client: [BUSINESS NAME], a [TYPE] in [CITY].

Their current GBP stats:
- Reviews: [NUMBER] (rating: [X.X])
- Photos: [NUMBER]
- Posts in last 30 days: [NUMBER]
- Description: [PASTE THEIR DESCRIPTION]
- Categories: [LIST]
- Q&A: [NUMBER] questions

Their top 3 competitors (in their area):
1. [COMPETITOR 1] — [reviews] reviews, [photos] photos, [posts/mo] posts
2. [COMPETITOR 2] — same stats
3. [COMPETITOR 3] — same stats

Write a 5-minute video script (~750 words) that:

SECTION 1 (0:00-0:30) — COLD OPEN
"Hi [Name], thanks for letting me audit your Google listing.
In the next 5 minutes I'll show you 4 specific things
costing you customers and what I'd change in your first
30 days."

SECTION 2 (0:30-2:00) — CURRENT STATE
Walk through their GBP. Identify the top 3 weaknesses with
specific numbers. Be honest but kind. Examples: "You have
12 reviews when your top competitor has 87 — that's 7x the
social proof working against you."

SECTION 3 (2:00-3:00) — COMPETITOR GAP
Compare to top 3 competitors. Highlight the gap in
photo count, review count, and post activity.

SECTION 4 (3:00-4:30) — WHAT I'D DO IN MONTH 1
The exact changes. Audit checklist items. Realistic
expectations (not "I'll get you 100 new reviews" — "I'll
help you get to 25 with a review generation campaign").

SECTION 5 (4:30-5:00) — THE ROI
"At your average customer value, getting from page 3 of
Google to the top 3 map pack typically means [X] more
calls/month. At [$Y] customer value, that's [$Z]/month in
new revenue — the $500 service pays for itself with one
new customer."

SECTION 6 (5:00-5:15) — CLOSE
"If you want to move forward, here's my Calendly.
Month-to-month, no long-term contract, 90-day guarantee."

Tone: confident, diagnostic, like a doctor who has seen
this 100 times. No marketing jargon. No "leverage" or
"optimize" or "synergy." Speak like a real person.
```

---

## 6. Monthly Report Generator

```
Generate a monthly GBP performance report for [CLIENT NAME]
for [MONTH YEAR].

GBP Insights data:
- Total searches: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)
- Total views: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)
- Calls: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)
- Direction requests: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)
- Website clicks: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)
- Photo views: [NUMBER] (vs last month: [NUMBER], [UP/DOWN]%)

Reviews:
- New reviews this month: [NUMBER]
- Average rating: [X.X]
- Response rate: [X]%

Posts published this month:
- [LIST POSTS]

Top post (most engagement): [DETAILS]

Output a clean, scannable report with:

1. EXECUTIVE SUMMARY (3-4 sentences)
   - Highlight biggest win this month
   - One observation about trend
   - One focus for next month

2. KEY METRICS TABLE
   - All metrics with % change vs. last month
   - Use ↑/↓ arrows

3. WINS THIS MONTH (3-4 bullet points)
   - Specific achievements (review gained, photo milestone,
     ranking improvement)

4. WHAT I'M FOCUSING ON NEXT MONTH
   - 2-3 specific initiatives
   - 1-2 things I need from the client

5. ASKS / NEED FROM YOU
   - Photos? Updated hours? Customer list for review gen?
   - Anything to celebrate publicly?

Tone: confident, brief, like a sharp analyst reporting
to a busy executive. No fluff. No jargon. Max 1 page.
```

---

## 7. Q&A Seed Generator

```
Generate 8 Q&A pairs for a Google Business Profile for
[BUSINESS NAME], a [TYPE] in [CITY].

Include:
- 2 questions about services/pricing
- 2 questions about hours/availability
- 1 question about location/parking
- 1 question about insurance/payment
- 1 question about experience/credentials
- 1 question specific to [NICHE] (e.g., for a dentist: "Do you
  see children?"; for a medspa: "How long does [procedure] last?")

For each Q&A:
- Question should be phrased how a real customer would ask it
- Answer should be 2-4 sentences max
- Answer should mention a specific differentiator or fact
  about the business (use placeholders like [N] years,
  $[X] average price, etc.)
- Answer should end with a soft CTA (call, book, visit)
- Make the answers feel real, not corporate
```

---

## 8. Walk-In Cold Open Generator

```
I'm about to walk into a [TYPE] business in [CITY] to introduce
my GBP management service.

Business name: [NAME]
Address: [ADDRESS]
Their niche: [TYPE]

Generate:
1. A 30-second opening pitch (introduce myself, what I do,
   one specific observation about their listing)
2. A one-sentence value prop (what's in it for them)
3. The exact ask (can I send a 5-min free audit video?)
4. A "if they hesitate" rebuttal (one sentence)
5. A "if they say yes" next-step email template (50 words max)

Tone: confident, friendly, not salesy. Like a 23-year-old
who's polished and clearly competent.
```

---

## 9. The "Reputation Manager" Full Review Batch

```
Process this batch of Google reviews for [CLIENT NAME].
Generate a response for each.

Reviews:
[PASTE REVIEWS WITH STAR RATINGS AND REVIEWER NAMES]

For each:
- Draft a response following the [positive/negative] review
  template rules from earlier
- For 1-2 star reviews, flag the most serious ones and
  suggest the owner reply personally + offer to draft
- For 3-star reviews, acknowledge and offer to make it right
- For 4-5 star, thank and personalize

Output: a clean list, one response per review, ready to copy/paste
into GBP. No meta-commentary.
```

---

## 10. The "Audit Report PDF" Generator

```
Generate a Google Business Profile Audit Report for [CLIENT NAME].

Format: clean, professional, 4-6 page PDF (will be designed in
Canva or Google Docs).

Sections:

COVER PAGE
- Client logo
- "Google Business Profile Audit — [Date]"
- Prepared by: [Your Business]

EXECUTIVE SUMMARY
- Current GBP score (1-100, your internal rating)
- Top 3 issues found
- Top 3 opportunities
- Estimated impact if optimized

CURRENT STATE
- GBP completion score
- Photo count vs. competitor average
- Review count and rating vs. competitors
- Post frequency vs. competitors
- Q&A status
- Service listings
- Attribute completeness

COMPETITOR ANALYSIS
- Top 3 competitors in [CITY]
- Side-by-side comparison table
- Key gaps

RECOMMENDATIONS (priority order)
- Quick wins (1-2 weeks)
- Medium-term (1-2 months)
- Long-term (3-6 months)

NEXT STEPS
- The Growth package deliverables
- Timeline to first results
- What client can expect

Tone: professional, specific, diagnostic. This is a sales
document disguised as a deliverable.
```

---

## 11. The "I Just Got a New Client" Onboarding Generator

```
I just signed a new client: [CLIENT NAME], a [TYPE] in [CITY].
Package: [Starter/Growth/Pro]. Start date: [DATE].

Generate:
1. A welcome email (already in templates, regenerate with
   client-specific details)
2. A 5-question discovery call intake form (so I can prep
   the call)
3. A 14-day onboarding checklist (specific to their tier)
4. The first 3 Google Post topics I'd schedule
5. The first 5 Q&A seeds I'd plant

Tone: warm, organized, like you've done this 100 times.
```

---

## 12. The "Client Isn't Seeing Results" Email

```
A client ([NAME], [TYPE], [CITY]) has been with me for [N] months
and is saying they're not seeing results.

Their metrics:
- Profile views: [UP/DOWN/FLAT] over the period
- Calls: [UP/DOWN/FLAT]
- Direction requests: [UP/DOWN/FLAT]
- Reviews gained: [NUMBER]
- Photos added: [NUMBER]
- Posts published: [NUMBER]

Generate:
1. A diagnostic (what's likely happening — algorithm factors,
   seasonal variation, baseline, etc.)
2. An honest email to the client explaining the situation
3. A revised 90-day plan with new focus areas
4. The conversation to have on the next monthly call

Tone: honest, takes ownership, doesn't over-promise, but
also doesn't throw yourself under the bus.
```

---

## 13. The "Quarterly Strategy" Generator

```
Generate a quarterly strategy memo for [CLIENT NAME] based on
the last 90 days of work.

Quarter: [Q1/Q2/Q3/Q4] [YEAR]

Inputs:
- 90 days of GBP Insights data
- 12 Google Posts published
- [NUMBER] new reviews gained
- [NUMBER] photos uploaded
- [NUMBER] Q&As answered
- Top competitor's recent moves: [OBSERVATIONS]

Output a 1-page memo with:

1. WHAT WE SAID WE'D DO (recap of last quarter's plan)
2. WHAT WE ACTUALLY DID
3. WHAT MOVED (with specific numbers)
4. WHAT DIDN'T MOVE (and why)
5. COMPETITIVE LANDSCAPE UPDATE
6. NEXT QUARTER'S FOCUS (3 initiatives)
7. THE CLIENT'S ROLE (what I need from them)

Tone: like a quarterly business review from a partner at
a consulting firm. Strategic, specific, no fluff.
```

---

## 14. The "Sales Objection" Reframer

```
A prospect just said: "[THEIR OBJECTION]"

Generate 3 different ways to respond, each in 2-3 sentences
max. Make them:
- Empathetic first (acknowledge their concern)
- Reframe (different angle on the same situation)
- Forward (move toward the close)

Tone: confident, not defensive, not pushy.
```

---

## 15. The "Cold Email 2.0" Generator

```
Generate a cold email for [PROSPECT NAME], [TITLE] at [COMPANY],
a [NICHE] in [CITY].

Their GBP issues I noticed:
- [ISSUE 1: e.g., "Only 4 photos"]
- [ISSUE 2: e.g., "12 reviews vs. competitor's 87"]
- [ISSUE 3: e.g., "No posts in last 60 days"]

Their top competitor: [NAME] who has [BENCHMARK STATS].

Length: 80-100 words max. Subject line: 5-7 words. One CTA.
Tone: like a peer giving them a tip, not a salesperson.
Don't use: "I help businesses," "leverage," "synergy,"
"results-driven," "best-in-class."
```

---

## Usage Notes

- **Save each prompt as a snippet** in Claude/ChatGPT with the master context at the top
- **For each new client, customize the master context** with their details
- **For batch work (e.g., 5 clients' posts in one sitting),** change the master context to "Cycle through 5 clients: [list]. For each, generate [deliverable]. Format as: ### [CLIENT NAME]\n[deliverable]"
- **Refine as you go.** The prompts above are good starting points. After 30 days, you'll have your own variations that work better for your voice and your clients.

The 70/30 rule: AI drafts 70% of the work, you edit 20%, you publish 10%. **The 20% edit is where the value lives.** Don't try to AI 100% — clients can tell.
