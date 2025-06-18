CoinGecko MCPツールの46個の機能について詳しく説明します。

## 基本的な暗号通貨情報取得

**get_asset_platforms** - サポートされているブロックチェーンプラットフォーム（Ethereum、BSC、Polygonなど）の一覧を取得

**get_id_coins** - 特定のコインIDに基づいて、価格、市場データ、メタデータ（画像、ウェブサイト、SNS、説明、契約アドレスなど）を取得

**get_coins_list** - CoinGeckoでサポートされている全コインのID、名前、シンボルのリストを取得

**get_new_coins_list** - 最近CoinGeckoに追加された200個の新しいコインのリストを取得

**get_coins_markets** - 価格、時価総額、取引量などの市場データを含むコイン情報を取得

## 市場分析・トレンド情報

**get_coins_top_gainers_losers** - 特定期間における価格上昇率・下落率トップ30のコインを取得

**get_list_coins_categories** - CoinGeckoの全コインカテゴリ（DeFi、NFT、Gamingなど）を取得

**get_coins_contract** - 特定のプラットフォームとコントラクトアドレスに基づくコイン情報を取得

## 履歴データ・チャート情報

**get_coins_history** - 特定日付のコインの履歴データ（価格、時価総額、24時間取引量など）を取得

**get_range_coins_market_chart** - 指定期間内のコインの価格、時価総額、取引量の履歴チャートデータを取得

**get_range_contract_coins_market_chart** - コントラクトアドレスベースでの履歴チャートデータを取得

**get_range_coins_ohlc** - 指定期間のOHLC（始値、高値、安値、終値）データを取得

## グローバル市場情報

**get_global** - アクティブな暗号通貨数、市場数、総暗号通貨時価総額などのグローバルデータを取得

## NFT関連情報

**get_id_nfts** - 特定NFTコレクションの名前、フロア価格、24時間取引量などのデータを取得

**get_list_nfts** - CoinGeckoでサポートされている全NFTのID、コントラクトアドレス、名前などのリストを取得

**get_nfts_market_chart** - NFTコレクションのフロア価格、時価総額、24時間取引量の履歴データを取得

## オンチェーン分析（GeckoTerminal）

### カテゴリ・ネットワーク情報

**get_onchain_categories** - GeckoTerminalでサポートされている全カテゴリを取得

**get_pools_onchain_categories** - 特定カテゴリIDに基づくプールのリストを取得

**get_onchain_networks** - GeckoTerminalでサポートされている全ネットワークを取得

### プール情報

**get_networks_onchain_new_pools** - 全ネットワークの最新プールを取得

**get_network_networks_onchain_new_pools** - 特定ネットワークの最新プールを取得

**get_networks_onchain_trending_pools** - 全ネットワークのトレンドプールを取得

**get_network_networks_onchain_trending_pools** - 特定ネットワークのトレンドプールを取得

**get_networks_onchain_dexes** - 特定ネットワークでサポートされている分散型取引所（DEX）を取得

**get_pools_networks_onchain_dexes** - 特定ネットワーク・DEXのトッププールを取得

**get_networks_onchain_pools** - 特定ネットワークのトッププールを取得

**get_address_networks_onchain_pools** - 特定ネットワーク・プールアドレスの詳細プール情報を取得

**get_pools_networks_onchain_info** - プールのメタデータ（ベース・クォートトークン詳細、画像、SNS、ウェブサイトなど）を取得

### OHLCV・取引データ

**get_timeframe_pools_networks_onchain_ohlcv** - プールのOHLCV（始値、高値、安値、終値、取引量）チャートデータを取得

**get_pools_networks_onchain_trades** - 過去24時間の最新300取引を取得

### トークン情報

**get_address_networks_onchain_tokens** - 特定ネットワーク・トークンアドレスのトークンデータを取得

**get_tokens_networks_onchain_info** - トークンのメタデータ（名前、シンボル、CoinGecko ID、画像、SNSなど）を取得

**get_tokens_networks_onchain_top_holders** - トークンの上位保有者情報を取得

**get_tokens_networks_onchain_holders_chart** - トークン保有者数の履歴チャートを取得

**get_timeframe_tokens_networks_onchain_ohlcv** - トークンのOHLCVチャートデータを取得

**get_tokens_networks_onchain_pools** - 特定トークンのトッププールを取得

**get_tokens_networks_onchain_trades** - 特定トークンの全プールでの最新300取引を取得

### 高度な検索・フィルタリング

**get_pools_onchain_megafilter** - 様々なフィルター（税金、取引量、時価総額など）を使用したプール検索

**get_pools_onchain_trending_search** - 全ネットワークのトレンド検索プール取得

**get_search_onchain_pools** - 特定ネットワークでのプール検索

## 価格情報取得

**get_addresses_networks_simple_onchain_token_price** - 特定ネットワーク・トークンアドレスの価格取得

**get_simple_price** - コインIDを使用した価格取得

**get_simple_supported_vs_currencies** - サポートされている通貨のリスト取得

**get_id_simple_token_price** - コントラクトアドレスを使用したトークン価格取得

## 検索機能

**get_search** - CoinGeckoでのコイン、カテゴリ、市場の検索

**get_search_trending** - 過去24時間のトレンド検索（コイン、NFT、カテゴリ）取得

これらの機能により、暗号通貨の基本情報から高度なオンチェーン分析まで、包括的な暗号通貨データの調査が可能です。