**■ 素材**

**●チートシート（5:10～）**

**Cloud Sonnet 3.7 に事前インプットする "n8n JSON 生成チートシート"――厳守すべきルール**

- **出力は JSON 本文のみ**
    - コードブロック記号 `や`json は付けない
    - プレーンテキスト／注釈／改行上部の空行・下部の空行も禁止
    - 末尾カンマ・多重引用符の混在は不可
- **トップレベル 5 キーを必ず含める**
    1. `meta` (例 `{ "instanceId": "placeholder", "workflowName": "<任意名>" }`)
    2. `settings` (例 `{ "executionOrder": "v1", "executionTimeout": 300 }`)
    3. `nodes` (配列)
    4. `connections` (オブジェクト)
    5. `version` (固定値 `2`)
- **各ノード共通必須プロパティ**
    - `id` : UUID形式の文字列 (例 `"1b35b5a7-3b22-4936-b252-08ed8a6927b7"`)
    - `name` : 表示名
    - `type` : 例 `"n8n-nodes-base.httpRequest"`
    - `typeVersion` : 数値 (通常 1)
    - `position` : `[x, y]` 数値ペア
    - `parameters` : オブジェクト（ノード固有設定）
- `credentials` が要るノードは正しい形式で記述
    - HTTP Requestの場合、parametersに `"authentication": "headerAuth"` を追加
    - 認証情報は後からUIで手動設定するため、実際のキーは含めない
- **接続定義の書式 (重要)**
    - 最上位キー：ソースノード名
    - 第二キー：出力タイプ (`"main"` または `"false"` など)
    - 値：`{ "node": <宛先ノード名>, "type": "main", "index": 0 }` の配列
    - 例:

```

"When clicking \\"Test workflow\\"": {
  "main": [
    [
      {
        "node": "Set Count",
        "type": "main",
        "index": 0
      }
    ]
  ]
}

```

- **ノード配置を被らせない**
    - `position` は x 座標 200 刻み・y 座標 0→200→400‥などで整列
- **日本語テキスト・UTF-8 利用可**
    - 文字化け回避のためエスケープ必要な記号（\n, \t, \ など）に注意
- **ファイルサイズと行数に配慮**
    - Claude の 200 k トークン制限を超えないようノード数が多い場合は分割依頼
- **デバッグ簡易化のための推奨**
    - `meta` 内に `"workflowName": "<任意名>"` を追加すると n8n UI で判別しやすい
    - タイムアウト等は `settings`: `{ "executionTimeout": 300 }` で明示
- **n8n最新バージョンに必須の追加キー**
    - `pinData`: `{}`
    - `staticData`: `null`
    - `tags`: `[]`
    - `triggerCount`: `0`
    - `updatedAt`: 日時文字列
    - `versionId`: UUID形式の文字列
- **最後に "EOF" トークンを付与**（任意）
    - Claude が余計な文字列を追加しないよう `"EOF"` で締める設計を推奨 </aside>