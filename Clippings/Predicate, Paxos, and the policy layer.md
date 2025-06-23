---
title: Predicate, Paxos, and the policy layer
source: https://blockworks.co/news/uniswap-pre-trade-rules-composability
author:
  - "[[Macauley Peterson]]"
  - "[[David Canellis]]"
  - "[[Dan Smith]]"
  - "[[Byron Gilliam]]"
  - "[[Casey Wagner]]"
  - "[[Jack Kubinec]]"
published: 2025-06-19
created: 2025-06-19
description: Hooks in Uniswap v4 can now enforce asset-specific rules before swaps or liquidity deposits occur, supporting compliance and composability.
tags:
  - clippings
updated: 2025-06-19T09:56
---
![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2FBTC-trending-up.png&w=1920&q=75)

share

  
*This is a segment from the 0xResearch newsletter. To read full editions,* [*subscribe*](https://blockworks.co/newsletter/0xresearch)*.*

---

On June 12, a massive outage originating in Google Cloud disrupted over 70 services globally, affecting platforms like OpenAI (ChatGPT suffered its longest outage to date), Cloudflare, Spotify, Discord, Snapchat, UPS, DoorDash and more. We often don’t appreciate how much critical infrastructure we’re now routing through opaque, centralized systems. And it’s not just a Web2 story. It’s also a DeFi one.

Before the likes of OpenAI were scrambling to reboot, another less publicized outage rippled through crypto: TRM Labs, a widely used blockchain compliance provider, went down on June 10 for nearly 12 hours after a Salesforce-related failure. If you were using TRM directly to screen transactions, your policy layer went offline.

If, on the other hand, you were using Predicate, you simply switched providers and kept running.

## What is Predicate?

Predicate is building a programmable policy enforcement layer for DeFi. Think of it as an operating system for pre-transaction compliance. Its latest [white paper](https://predicate.io/blog/risk-management-framework-for-institutional-liquidity-on-uniswap-v4), co-published with and , outlines how hooks in [Uniswap v4](https://blockworks.co/news/uniswap-v4-goes-live) can now enforce asset-specific rules before swaps or liquidity deposits occur. That’s things like jurisdictional geofencing, market conduct constraints or investor accreditations, according to Predicate CEO Nikhil Raghuveera.

“You might have a pool that enforces different rules for different users that could be based on their IP \[or\] on accreditation or some other kind of entity status,” Raghuveera told Blockworks. “It could be literally anything.” That includes onchain or offchain data.

In the case of Paxos, whose USDL stablecoin is yield-bearing and rebasing, the situation is especially nuanced. US regulators may treat such an instrument as a money market fund, so Paxos International, which issues USDL from Abu Dhabi, must geofence US access. Using Predicate, the Paxos liquidity pool on Uniswap enforces a custom policy enforced via frontend IP gating or onchain attestations. A second hook wraps USDL into a non-rebasing token behind the scenes so it can interact with Uniswap’s accounting model. Thus, Paxos meets its regulatory constraints without compromising composability.

## Part of the modular movement

When recalling the outage headaches, a highlight is Predicate’s fallback architecture. Compliance “verdicts” (e.g., “This wallet passes TRM’s screen”) are signed by off-chain operators and checked onchain via Uniswap hooks. If one provider like TRM fails, another — say, Elliptic or Crystal — can step in without changing the smart contracts.

This modularity mirrors trends in decentralized AI, where teams like [Venice AI](https://blockworks.co/newsletter/daily/issue/post_ffe9ae74-0750-4e9c-9475-0b45e2612965) use decentralized networks such as [Akash](https://blockworks.co/newsletter/daily/issue/post_9690fc34-cf42-4cb2-94fe-a7589dc910bc) to route around centralized GPU bottlenecks.

“Policy is critical infrastructure because policies determine whether a transaction can go through or not,” said Raghuveera. “You need a holistic set of different pieces in case something goes down.”

We’ve spent years making smart contracts composable. Predicate reminds us that policy must be composable too: resilient to upstream failures, upgradable without liquidity migration and adaptable to jurisdictional nuance.

Institutional DeFi won’t scale on a “one-size-fits-all KYC.” But programmable, source-agnostic compliance enforcement might just work…and still keep the cypherpunks happy.

---

**Get the news in your inbox. Explore Blockworks newsletters:**

- [**The Breakdown**](https://blockworks.co/newsletter/thebreakdown): Decoding crypto and the markets. Daily.
- [**Empire**](https://blockworks.co/newsletter/empire): Crypto news and analysis to start your day.
- [**Forward Guidance**](https://blockworks.co/newsletter/forwardguidance): The intersection of crypto, macro and policy.
- [**0xResearch**](https://blockworks.co/newsletter/0xresearch): Alpha directly in your inbox.
- [**Lightspeed**](https://blockworks.co/newsletter/lightspeed): All things Solana.
- [**The Drop**](https://blockworks.co/newsletter/thedrop): Apps, games, memes and more.
- [**Supply Shock**](https://blockworks.co/newsletter/supplyshock): Bitcoin, bitcoin, bitcoin.

Tags

Upcoming Events

[Digital Asset Summit 2025](https://blockworks.co/event/digital-asset-summit-2025-london)

Old Billingsgate

Mon - Wed, October 13 - 15, 2025

Blockworks’ Digital Asset Summit (DAS) will feature conversations between the builders, allocators, and legislators who will shape the trajectory of the digital asset ecosystem in the US and abroad.

[Permissionless IV](https://blockworks.co/event/permissionless)

Industry City | Brooklyn, NY

TUES - THURS, JUNE 24 - 26, 2025

Permissionless IV serves as the definitive gathering for crypto’s technical founders, developers, and builders to come together and create the future.If you’re ready to shape the future of crypto, Permissionless IV is where it happens.

[Permissionless IV Hackathon](https://blockworks.co/event/permissionless-iv-hackathon)

Brooklyn, NY

SUN - MON, JUN. 22 - 23, 2025

Blockworks and Cracked Labs are teaming up for the third installment of the Permissionless Hackathon, happening June 22–23, 2025 in Brooklyn, NY. This is a 36-hour IRL builder sprint where developers, designers, and creatives ship real projects solving real problems across \[…\]

[learn more](https://blockworks.co/event/permissionless-iv-hackathon)

recent research

[![Research Report Templates (10).png](https://blockworks.co/_next/image?url=https%3A%2F%2Fimpressive-horses-5641a8b530.media.strapiapp.com%2FResearch_Report_Templates_10_82b9e9785b.png&w=1920&q=20)](https://app.blockworksresearch.com/research/kamino-v2-a-new-growth-lever)

Research

[Kamino V2: A New Growth Lever](https://app.blockworksresearch.com/research/kamino-v2-a-new-growth-lever)

Kamino has evolved into a full-stack asset scaling suite with V2: unlocking new markets, improving capital efficiency, and catering to various risk profiles. We believe it is best positioned to become the credit backbone of Solana as the ecosystem matures. Simply put, KMNO remains our highest-conviction bet in the Solana ecosystem. This report lays out our thesis.

by [Carlos Gonzalez Campo](https://app.blockworksresearch.com/team/carlos-gonzalez-campo)

/

## news

[more from news](https://blockworks.co/news)

[![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2Fbw-ulbrict-auction.jpg&w=1536&q=40)](https://blockworks.co/news/ross-ulbricht-bitcoin-auction-value)

[How Ross Ulbricht could’ve been the richest Bitcoiner on Earth](https://blockworks.co/news/ross-ulbricht-bitcoin-auction-value)

You can’t put a price on freedom, but this comes close

by /

[![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2Ftt_20250617a.png&w=1536&q=40)](https://blockworks.co/news/token-transparency-framework)

[A new framework for token market transparency](https://blockworks.co/news/token-transparency-framework)

Introducing the Token Transparency Framework, a publicly available token disclosure standard

by /

[![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2Fdefiict.jpg&w=1536&q=40)](https://blockworks.co/news/federal-reserve-runaway-spending)

[Will the Fed sign off on runaway spending?](https://blockworks.co/news/federal-reserve-runaway-spending)

Even in today’s fully fiat system, the question of who ultimately stands behind the dollar still matters

by /

[![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2Fbw-genius-senate.jpg&w=1536&q=40)](https://blockworks.co/news/genius-stablecoin-act-passes-senate-vote)

[Stablecoin bill passes the Senate with bipartisan support](https://blockworks.co/news/genius-stablecoin-act-passes-senate-vote)

The GENIUS Act passed the Senate in a 68-30 vote Tuesday evening

by /

<audio></audio>