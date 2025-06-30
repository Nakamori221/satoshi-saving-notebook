---
title: "Lido gears up for Dual Governance"
source: "https://blockworks.co/news/lido-dao-dual-governance"
author:
  - "[[Macauley Peterson]]"
  - "[[Katherine Ross]]"
  - "[[Byron Gilliam]]"
  - "[[Felix Jauvin]]"
  - "[[Kate Irwin]]"
  - "[[Donovan Choy]]"
  - "[[David Canellis]]"
published: 2025-06-27
created: 2025-06-30
description: "A vote ending Monday could introduce a new layer of security for Ethereum’s largest liquid staking protocol."
tags:
  - "clippings"
---
A vote ending Monday could introduce a new layer of security for Ethereum’s largest liquid staking protocol

by [Macauley Peterson](https://blockworks.co/author/macauleypeterson) /

June 27, 2025 10:03 am

![article-image](https://blockworks.co/_next/image?url=https%3A%2F%2Fblockworks-co.imgix.net%2Fwp-content%2Fuploads%2F2025%2F06%2Fbw-lido-dao.jpg&w=1920&q=75)

mim.girl/Shutterstock and Adobe modified by Blockworks

shareThe stage is set for Lido DAO to finally implement “Dual Governance.” 

A vote of LDO holders running through 10:00 a.m. ET on Monday, June 30, will determine whether to change how power is distributed within Ethereum’s largest liquid staking protocol.

If approved, the proposal will activate a new framework that gives stETH holders — users whose ether is staked via Lido — a formal mechanism to delay or veto governance actions, adding a novel layer of accountability to the voting system. The new technical mechanism has implications for all of crypto, not just Lido, according to the prominent albeit pseudonymous researcher and advisor Hasu.

“Lido really reduces the risk that users have from any kind of governance attack \[and\] the trust that they need in the maintainer companies and the LDO holders,” Hasu told Blockworks.

That should further institutional adoption of stETH, the team expects. 

At the heart of Dual Governance is a custom-built dynamic timelock module. Unlike static timelocks that simply delay execution by a fixed period, this design scales in response to opposition registered from [stETH](https://blockworks.co/tag/steth) holders. For example, if 1% of the total stETH supply signals objection to a proposal, execution is delayed by an additional five days. If opposition grows to 10%, the delay extends linearly up to 45 days. This mechanism ensures that in the event of a controversial or potentially harmful decision by LDO token holders, stETH users have a predictable window to exit before changes take effect.

That’s never been done before in a governance system, but is absolutely essential for Lido, given the variability of the Ethereum staking withdrawal queue itself.

The idea emerged from the core tension between providing liquidity and minimizing trust assumptions. Liquid staking protocols inherently rely on pooled delegation and active protocol maintenance to stay compatible with Ethereum upgrades. We saw this in practice during [debates around the delayed Pectra upgrade](https://blockworks.co/news/ethereum-hard-fork-updates), in which Lido’s Ivan Metrikin was an important voice in the All-Core Devs decision-making process.

While traditional time locks give users a chance to exit before governance decisions are enforced, to withdraw stETH back to native ether can sometimes take weeks, making a short fixed period inadequate. The dynamic timelock aims to bridge that gap by adjusting execution delays to match the scale of user opposition, rather than applying a one-size-fits-all delay. Simple or uncontroversial changes can pass quickly, while the governance system will automatically hit the brakes on the process if big stETH holders begin to object.

Lido contributors, including Hasu and Victor “kadmil” from the DAO operations team, acknowledged the design was [years in the making](https://blockworks.co/news/lido-dao-proposes-governance-switch-up) and incorporated dedicated stress tests to ensure it could resist governance attacks and flash loan manipulation.

“We have paid people to try to break the design with flash loans,” Victor told Blockworks, with subsequent adjustments tailored “to make it flash-loan resistant.”

Wrapped versions of stETH — like those used in [EigenLayer](https://blockworks.co/tag/eigenlayer) restaking or [Pendle](https://blockworks.co/podcast/0xresearch/65fe22d6-fd1e-11ee-b6dd-27c1387857db) yield strategies — are not eligible to vote directly, but the withdrawal process gives holders time to reclaim their base stETH and participate if needed.

This is about giving users access to liquidity while preserving the right to exit in a way no other protocol has managed, Hasu explained.

“There used to be this dilemma between trust and liquidity, and dual governance is effectively breaking that dilemma,” he said. “You no longer have to choose — you can have both.”

The initiative has drawn comparisons to [MakerDAO’s](https://blockworks.co/tag/makerdao) “emergency shutdown” lever, but differs by offering a non-destructive, graduated response rather than a single catastrophic reset. It also reflects a broader trend in DeFi governance toward more nuanced, multi-stakeholder systems that separate capital voting from user safeguards. 

Hasu expects Lido’s implementation to become a blueprint for other protocols facing similar governance risks.

An earlier Snapshot vote on the proposal [passed](https://snapshot.box/#/s:lido-snapshot.eth/proposal/0x3bdf528b31956e029e867ebf79b02ee07e9a973987b34c5cffc14392e8b4480c) nearly unanimously. If the on-chain Aragon vote passes as anticipated, it will formally decouple the authority to propose and pass measures from the power to immediately execute them, thus placing stETH holders effectively in the role of constitutional overseers of the DAO.

As of 9:00 a.m. ET Friday, just 4% of token holders have participated. To pass, [the on-chain Aragon vote](https://vote.lido.fi/vote/189) requires a minimum quorum of 5%.

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
- [blockchain](https://blockworks.co/tag/blockchain)
- [Ethereum](https://blockworks.co/tag/ethereum)
- [staking](https://blockworks.co/tag/staking)