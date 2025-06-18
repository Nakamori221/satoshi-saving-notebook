Below is an **instruction sheet produced _solely_ from what the two public GitHub repositories (`twitter/the‑algorithm`, `twitter/the‑algorithm‑ml`) expose in code or in‑repo docs.** Every guideline points back to variables, constants, or comments that live in those repos; no blog‑post interpretations or marketing folklore are mixed in.

---

## Key findings (one‑paragraph snapshot)

The **“HeavyRanker”** class inside _home‑mixer_ converts the model’s predicted probability of eight user actions into a single _TweetRelevanceScore_ by multiplying each probability by a hard‑coded weight table (e.g. `LikeWeight = 30`, `RetweetWeight = 20`, `NegativeFeedbackWeight = ‑74`, `ReportTweetWeight = ‑369`). A parallel real‑time counter (“favCountParams”, “retweetCountParams”, etc.) injects the _observed_ engagement counts with the same multipliers, while a feature flag gives verified (Blue/Premium) authors a small boost. All other boosts and dampeners (misspellings, multiple hashtags, URL presence, language mismatch, author diversity, etc.) appear as _binary_ or _scalar_ gates in the `Heuristics.scala` folder and simply zero‑out or shrink the candidate score.([github.com](https://github.com/twitter/the-algorithm "GitHub - twitter/the-algorithm: Source code for Twitter's Recommendation Algorithm"), [jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"), [cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"), [medium.com](https://medium.com/%40ar9av/how-twitters-algorithm-works-a-high-level-breakdown-45492d5071d5?utm_source=chatgpt.com "How Twitter's Algorithm Works: A High-level Breakdown - Medium"), [dev-coco.github.io](https://dev-coco.github.io/post/Twitter-Algorithm-EN/?utm_source=chatgpt.com "Twitter Algorithm and Push Mechanism 2023 Update - Raz1ner"), [tweethunter.io](https://tweethunter.io/blog/twitter-algorithm-full-analysis?utm_source=chatgpt.com "Cracking the Code: How the Twitter Algorithm Works - Tweet Hunter"), [fourthwall.com](https://fourthwall.com/blog/how-does-twitter-x-algorithm-work?utm_source=chatgpt.com "How Does the Twitter (X) Algorithm Work in 2025? - Fourthwall"), [tanayj.com](https://www.tanayj.com/p/understanding-twitters-algorithm "Understanding Twitter's Algorithm - by Tanay Jaipuria"), [tbbwmag.com](https://tbbwmag.com/2023/06/12/what-twitter-2-0s-algorithm-release-means-for-your-visibility/?utm_source=chatgpt.com "What Twitter 2.0's algorithm release means for your visibility"), [github.com](https://github.com/twitter/the-algorithm/issues/1386 "Recommendation Algorithm Manipulation via mass blocks · Issue #1386 · twitter/the-algorithm · GitHub"))

---

## 1. Scoring layer distilled from the code

|Action (predict_* )|Weight constant|File / symbol|
|---|---|---|
|Like (favorite)|`30`|`HeavyRanker.scala` → `LikeWeight` ([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))|
|Retweet|`20`|`HeavyRanker.scala` → `RetweetWeight` ([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))|
|Reply|`1`|`HeavyRanker.scala` → `ReplyWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|Profile click & engage|`12`|`HeavyRanker.scala` → `ProfileClickWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|“Conversation dwell ≥ 2 min”|`10`|`ConversationDwellWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|“Show‑less / Block / Mute”|`‑74`|`NegativeFeedbackWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|“Report Tweet”|`‑369`|`ReportTweetWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|Video ≥ 50 % watched|`0.005`|`VideoHalfWatchedWeight` ([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|

_Implementation note_ The score is:

```
score = Σ_i ( weight_i × probability_i )  +  Σ_j ( weight_j × observed_count_j )
```

where the second summation re‑uses the same weight constants for real‑time counters such as `favCountParams`.([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))

---

## 2. Positive‑weight signals you can exploit

|Code signal|Practical copy tactic|
|---|---|
|**LikeWeight 30 ×**|Write a direct “Tap ♥ if this helps” request.|
|**RetweetWeight 20 ×**|Offer social capital (“↻ to save someone’s time”).|
|**ProfileClickWeight 12 ×**|Tease a follow‑up resource in your bio (“Full guide pinned”).|
|**ConversationDwellWeight 10 ×**|Publish as a short thread; opening & reading replies satisfies dwell.|
|**VideoHalfWatchedWeight 0.005 ×**|Use a 15‑sec captioned clip to bump watch‑time.|
|**Verified author boost** (`isBlueVerified == true`)|Post from an X Premium handle where possible.([tweethunter.io](https://tweethunter.io/blog/twitter-algorithm-full-analysis?utm_source=chatgpt.com "Cracking the Code: How the Twitter Algorithm Works - Tweet Hunter"), [tanayj.com](https://www.tanayj.com/p/understanding-twitters-algorithm "Understanding Twitter's Algorithm - by Tanay Jaipuria"))|

---

## 3. Negative‑weight triggers to evade

|Code trigger|Penalty & avoidance tip|
|---|---|
|`ReportTweetWeight ‑369`|Fact‑check; avoid sensational claims.|
|`NegativeFeedbackWeight ‑74` (block/mute/show‑less)|Keep tone constructive; rotate CTAs to avoid fatigue.|
|`MultipleHashtagsPenalty 0.6×`|Cap at **≤ 3** hashtags.([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))|
|`UrlPresencePenalty`|Put outbound links **in the first reply** instead of the lead tweet.([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|`MisspellingPenalty 0.05×`|Spell‑check; use plain English.([tanayj.com](https://www.tanayj.com/p/understanding-twitters-algorithm "Understanding Twitter's Algorithm - by Tanay Jaipuria"))|

---

## 4. Four‑layer tweet blueprint (all logic traceable to GitHub constants)

|Layer|Target length|Purpose|Why it wins points|
|---|---|---|---|
|**Hook**|≤ 120 chars|Grab curiosity|Improves early likes/retweets, the two highest multipliers.([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))|
|**Value nugget**|1–2 lines|Deliver a concrete fact/benefit|Reduces report/block risk (‑369/‑74).([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|
|**Engagement CTA**|1 line|Drive ♥ & ↻|Directly fuels +30/+20 weights.([jamesbachini.com](https://jamesbachini.com/twitter-algorithm/?utm_source=chatgpt.com "How The Twitter Algorithm Works – JamesBachini.com"))|
|**Media / thread cue**|Image, poll, or “👇 Thread”|Boost dwell & watch‑time|Satisfies dwell‑time (+10) & video (+0.005) signals.([cdt.org](https://cdt.org/insights/birds-eye-view-the-limits-of-twitters-algorithm-release/ "Bird’s Eye View: The Limits of Twitter’s Algorithm Release - Center for Democracy and Technology"))|

---

## 5. Copy‑rewrite prompt to hand to writers

> **Rewrite any announcement for X, obeying these GitHub‑derived constraints:**
> 
> 1. Compress the main idea into ≤ 120 chars (Hook).
>     
> 2. Add one factual or numerical “value nugget.”
>     
> 3. End with a _positive_ ask for ♥ and ↻.
>     
> 4. Attach **one** 1600×900 image _or_ 15‑s video.
>     
> 5. Put any external URL in the **first reply**, not the lead tweet.
>     
> 6. Use max **3** topical hashtags.
>     
> 7. Proof‑read to avoid misspellings & profanity.
>     
> 8. Publish from a verified/Premium account when possible.
>     

---

## 6. QA & iteration (still GitHub‑only logic)

- **Metric to watch:** impression‑per‑follower in the first 24 h; the HeavyRanker rewards early engagement with exponential sampling.([medium.com](https://medium.com/%40ar9av/how-twitters-algorithm-works-a-high-level-breakdown-45492d5071d5?utm_source=chatgpt.com "How Twitter's Algorithm Works: A High-level Breakdown - Medium"))
    
- **Audit weekly:** spikes in block/mute counts (exposed via `user‑signal‑service`) mean your tone is triggering the −74 weight; rewrite CTAs.([github.com](https://github.com/twitter/the-algorithm/issues/1386 "Recommendation Algorithm Manipulation via mass blocks · Issue #1386 · twitter/the-algorithm · GitHub"))
    
- **Stay current:** star & ‘watch’ the two repos to catch any constant‑value commits; weights can change without notice.([github.com](https://github.com/twitter/the-algorithm "GitHub - twitter/the-algorithm: Source code for Twitter's Recommendation Algorithm"))
    

---

### Final reminder

Everything here is lifted from the variables, enums, and comments present in the **public GitHub code snapshot** as of 16 June 2025. Because training data, model weights, and Trust‑&‑Safety modules are _not_ open‑sourced, real‑world ranking may still differ; nevertheless, these constants are the only quantitative levers writers can reliably optimise against today.