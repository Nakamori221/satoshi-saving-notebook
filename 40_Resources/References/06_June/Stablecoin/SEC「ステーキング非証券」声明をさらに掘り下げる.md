### SEC「ステーキング非証券」声明をさらに掘り下げる

（※スタッフ見解であり、法的拘束力はありません。引用は末尾に付記）

---

## 1. 時系列で追う規制の流れ

1. **2023 年 2 月**  
    Kraken が米 SEC と和解し、30 百万ドルを支払い米ユーザー向けステーキングを停止。
    
2. **2023 年 6 月**  
    10 州当局が Coinbase のステーキング・アズ・ア・サービス（SaaS）を一斉提訴。([DFPI](https://dfpi.ca.gov/wp-content/uploads/sites/337/2023/06/Coinbase-Securities-Action-PR-June-2023.pdf?utm_source=chatgpt.com "[PDF] DFPI Issues Action Against Coinbase Citing Staking Rewards ..."))
    
3. **2024 年 3 月 ～ 6 月**  
    連邦裁判所が Binance／Coinbase 訴訟で「プール化＋利回り向上の仕組みは投資契約になり得る」と判断。([velaw.com](https://www.velaw.com/insights/another-notch-in-the-secs-belt-sec-v-coinbase-inc/?utm_source=chatgpt.com "Another Notch in the SEC's Belt: SEC v. Coinbase, Inc. | Insights"))
    
4. **2025 年 1 月～4 月**  
    Kraken・Coinbase が **ノンカストディ型**や州限定モデルでステーキングを部分再開。([Investopedia](https://www.investopedia.com/kraken-resumes-staking-for-us-customers-8783288?utm_source=chatgpt.com "Kraken Resumes Staking For US Customers"), [PYMNTS.com](https://www.pymnts.com/cryptocurrency/2025/kraken-resumes-u-s-crypto-staking-following-sec-ordered-shutdown/?utm_source=chatgpt.com "Kraken Resumes U.S. Crypto Staking Service - PYMNTS.com"))
    
5. **2025 年 5 月 29 日**  
    SEC企業財務部が「**ソロ／委任／カストディ**の基本ステークは投資契約に該当しない」と声明。([証券取引委員会](https://www.sec.gov/about/divisions-offices/division-corporation-finance?utm_source=chatgpt.com "Division of Corporation Finance - SEC.gov"))
    
6. **同日**  
    パース委員が歓迎コメント、クレンショー委員が反対声明を発表（SEC内で賛否が分裂）。([証券取引委員会](https://www.sec.gov/newsroom/speeches-statements/peirce-statement-protocol-staking-052925?utm_source=chatgpt.com "Division of Corporation Finance's Statement on Protocol Staking"), [証券取引委員会](https://www.sec.gov/newsroom/speeches-statements/crenshaw-statement-protocol-staking-052925?utm_source=chatgpt.com "Response to Staff Statement on Protocol Staking Activities - SEC.gov"))
    

---

## 2. スタッフ声明のロジックを細分化

### 2-1. Howey テスト各要素

|要素|スタッフの解釈|なぜ該当しないか|
|---|---|---|
|**資金の投下**|トークンのロックは「投下」に該当すると仮定|–|
|**共通事業**|PoSネットワーク自体はオープンで中央主体不在|「利害共有」は分散|
|**利益期待**|報酬＝ネットワークから自動配分される手数料／インフレ分|固定利回り保証なし|
|**他者の起業家的努力**|ノード運用は「行政的・事務的（ministerial）」|上乗せ利回りを産むマネジメント行為ではない|

→ **第4要素が欠ける**ため投資契約に当たらないという立論。([証券取引委員会](https://www.sec.gov/about/divisions-offices/division-corporation-finance?utm_source=chatgpt.com "Division of Corporation Finance - SEC.gov"))

### 2-2. 「行政的・事務的」とされた行為の例

- ブロック生成のためのオンライン稼働
    
- スラッシュ補償、早期アンボンド、報酬スケジュール調整
    
- ステーク最小量を満たすためのプール化  
    これらはいずれも「付加価値サービスではあるが、_起業家的リスクテイク_ではない」と結論づけ。([証券取引委員会](https://www.sec.gov/about/divisions-offices/division-corporation-finance?utm_source=chatgpt.com "Division of Corporation Finance - SEC.gov"))
    

---

## 3. 声明が _適用しない_ グレーゾーン

|項目|懸念ポイント|
|---|---|
|**リキッドステーキング (LST)**|LST トークン＝証券（預託証券）とみなされる余地／二次利用で複利的利回り発生|
|**再ステーキング (EigenLayer 等)**|ベース報酬 + セキュリティ共有料 = 多層利回り → Howey 再検討の可能性|
|**カストディ側の裁量**|「いつ・いくらステークするか」決定権を持つ場合は声明の射程外|
|**州当局の独自訴訟**|カリフォルニアほか 5 州が SaaS を依然係争中（連邦と温度差）|

クレンショー委員はここを突き、「本声明は過去の裁判例と衝突する」と批判。([証券取引委員会](https://www.sec.gov/newsroom/speeches-statements/crenshaw-statement-protocol-staking-052925?utm_source=chatgpt.com "Response to Staff Statement on Protocol Staking Activities - SEC.gov"))

---

## 4. 実務インパクトを"層"ごとに整理

### 4-1. 取引所・カストディ事業者

- **Kraken**：1月に39州で再開、ETH/SOL 含む 17銘柄対応。([Investopedia](https://www.investopedia.com/kraken-resumes-staking-for-us-customers-8783288?utm_source=chatgpt.com "Kraken Resumes Staking For US Customers"))
    
- **Coinbase**：4月に連邦／一部州との和解を公表、残り5州と交渉中。([Coinbase](https://www.coinbase.com/blog/High-Stakes-Litigation-Time-to-End-the-War-on-Staking?utm_source=chatgpt.com "High Stakes Litigation: Time to End the War on Staking - Coinbase"))
    
- **予想**：FTX後に縮小した米系カストディ各社（Anchorage, BitGo など）が PoS オファリングをアグレッシブに拡充。
    

### 4-2. 金融商品

- **Grayscale ETH Trust**：ETH をノード委任するルール変更案の審査期限が 6月1日。([Federal Register](https://www.federalregister.gov/documents/2025/03/03/2025-03336/self-regulatory-organizations-nyse-arca-inc-notice-of-filing-of-proposed-rule-change-to-amend-the?utm_source=chatgpt.com "Self-Regulatory Organizations; NYSE Arca, Inc.; Notice of Filing of ..."), [Federal Register](https://www.federalregister.gov/documents/2025/04/18/2025-06660/self-regulatory-organizations-nyse-arca-inc-notice-of-designation-of-a-longer-period-for-commission?utm_source=chatgpt.com "Federal Register :: Self-Regulatory Organizations; NYSE Arca, Inc."))
    
- **Solana Staking ETF**：Canary Capital が S-1 を改訂、Marinade Select と提携。([solanafloor.com](https://solanafloor.com/news/canary-capital-files-first-u-s-solana-etf-to-include-staking-names-marinade-as-exclusive-staking-provider?utm_source=chatgpt.com "Canary Capital Files First U.S. Solana ETF to Include Staking ..."))
    
- **可能性**：将来的に BTC サイドチェーンや Polkadot など _"利回り付き ETF"_ が連続申請されると予想。([Reuters](https://www.reuters.com/technology/cryptoverse-next-wave-us-crypto-etfs-already-pipeline-2025-01-10/?utm_source=chatgpt.com "Cryptoverse: Next wave of US crypto ETFs already in the pipeline"))
    

### 4-3. ネットワーク・プロトコル側

- **ステーク率上昇 → APR 低下**
    
    - 例）ETH 全体ステーク率が 29%→34% になると、理論APRは約4.5%→3.9%へ低下（模型計算）。
        
- **中央集権リスク**
    
    - Lido 34%超、Coinbase 11%と集中が進む場合、開発者コミュニティから委任上限導入などの議論が再燃。
        

---

## 5. 投資チャンスを精査するための実践フレーム

1. **「規制アービトラージ→制度内利回り」移行の初動を狙う**
    
    - インフラ企業（Figment, Blockdaemon, Stakefish）の _VC ラウンド or 上場株_ をモニター。
        
2. **ETF 上場前後のフロー把握**
    
    - 提携バリデータのノード運営報酬＝売上直結。招致ニュースが出た段階でプレミアム評価されやすい。
        
3. **LST トークンは"再分類リスク・β"と"利回り希薄化・−α"の両面管理**
    
    - ETH 系：LDO / RPL、SOL 系：mSOL / jitoSOL… → ガバナンス動向（手数料改定・委任上限）を随時チェック。
        
4. **保険／スラッシュカバー市場の拡大余地**
    
    - Nexus Mutual、Unslashed などカバー率はまだ ETH ステークの 2～3% 程度。ETF が保険を求めると需給タイト化の可能性。
        
5. **"実質利回り"を絶えず米短期国債と比較**
    
    - APR が 3% を割る局面ではリスクプレミアム消滅→資金逆流シナリオを想定しヘッジを検討。
        

---

## 6. 今後のチェックポイント

- **6 月 1 日**：Grayscale ETH Trust ルール変更の一次判断
    
- **6 月 ～ Q3**：SEC Crypto Task Force が LST／再ステーク草案をパブリックコメントに出すか
    
- **年内**：州当局との訴訟終結タイムライン、SaaS の全国サービス可否
    
- **2026 年予算案**：SEC／CFTC いずれが LST の主監督権を持つかで条項挿入の可能性
    

---

### まとめ

- **基礎的 PoS ステーキングは"合法ゾーン"**とのメッセージで米市場が開放モードに。
    
- ただし **リキッドステーキング／再ステークは未解決**、州規制とも温度差が残る。
    
- 投資家は **(1) バリデータ・インフラ企業、(2) ステーキング付きETF、(3) 保険市場** を中心に機会を探りつつ、**APR 低下と追加規制の二重リスク**を織り込むことが肝要です。

規制・法制: #米国規制 #SEC #州規制 #CFTC #財務省 #EU規制 #日本規制 #規制動向
取引所・事業者: #CEX #DEX #Custody #取引所認可
プロトコル・技術: #Layer1 #Layer2 #DeFi #NFT #Staking #Mining #Bridge #Oracle #GameFi #SocialFi
プロジェクト: #Bitcoin #Ethereum #Solana #Polygon #Avalanche
金融商品・サービス: #ETF #先物 #オプション #レンディング #デリバティブ #機関投資家
セキュリティ: #ハッキング #脆弱性 #セキュリティ #AML #KYC
マーケット: #価格動向 #出来高 #機関投資 #レポート
イベント: #ハードフォーク #アップグレード #カンファレンス #M&A #IPO
地域: #北米 #欧州 #アジア #中東 #アフリカ #中南米
業界動向: #採用 #レイオフ #資金調達 #パートナーシップ #マクロ経済

#SEC #米国規制 #Staking #ETF #Ethereum