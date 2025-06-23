# API セキュリティ管理ガイド

## 🚨 重要な注意事項

### 秘匿情報の取り扱い
- **絶対にGitにコミットしない情報**
  - Firebase APIキー
  - LINE Notify クライアントシークレット
  - CoinGecko API キー（Pro版使用時）
  - その他の認証情報

### 環境変数管理

#### 開発環境 (.env.local)
```bash
# Firebase Configuration - 🔥 機密情報
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAVh4bypzcNW3waAr_B8GIuhs_SGa1dRqI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=satoshi-saving-notebook.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=satoshi-saving-notebook
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=satoshi-saving-notebook.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=495612798895
NEXT_PUBLIC_FIREBASE_APP_ID=1:495612798895:web:7e58a6821f9dce2c2fb15a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8KDZS2GEZ6

# CoinGecko API - 🔑 必要に応じて有料プラン
COINGECKO_API_KEY=

# LINE Notify - 🔐 OAuth認証情報
LINE_NOTIFY_CLIENT_ID=
LINE_NOTIFY_CLIENT_SECRET=
LINE_NOTIFY_REDIRECT_URI=http://localhost:3000/api/line/callback
```

#### 本番環境設定
- Vercel環境変数に設定
- GitHub Secretsでの管理
- 環境別設定ファイルの分離

## 📋 API使用履歴・監視

### CoinGecko API
- **無料プラン制限**: 10-50 calls/minute
- **監視項目**:
  - リクエスト回数/分
  - エラーレスポンス率
  - レート制限到達回数

### Firebase API
- **監視項目**:
  - 認証試行回数
  - Firestore読み書き回数
  - ストレージ使用量

### LINE Notify API
- **監視項目**:
  - 通知送信成功率
  - OAuth認証フロー完了率
  - トークン期限切れ頻度

## 🛡️ セキュリティ対策

### Firestore セキュリティルール
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 進捗データも同様
    match /progress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開例文データは読み取り専用
    match /examples/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### API レート制限対策
```typescript
// CoinGecko API キャッシュ機能
const CACHE_DURATION = 5 * 60 * 1000; // 5分間キャッシュ
const priceCache = new Map();

export async function getCachedBtcPrice(): Promise<number> {
  const cacheKey = 'btc-jpy-price';
  const cached = priceCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }
  
  // API呼び出し実行
  const newPrice = await fetchBtcPrice();
  priceCache.set(cacheKey, { price: newPrice, timestamp: Date.now() });
  
  return newPrice;
}
```

## 📊 ログ管理

### エラー追跡
- Sentry設定
- Firebase Crashlytics
- カスタムエラーログ

### アクセスログ
- API呼び出し履歴
- ユーザーアクション記録
- パフォーマンス計測

## 🔄 定期メンテナンス

### 月次チェック項目
- [ ] API使用量確認
- [ ] セキュリティルール見直し
- [ ] 期限切れトークンクリーンアップ
- [ ] ログ容量確認

### 四半期チェック項目
- [ ] API キーローテーション
- [ ] 依存関係アップデート
- [ ] セキュリティ監査

## 🚨 インシデント対応

### APIキー漏洩時の対応
1. 即座にキーを無効化
2. 新しいキーを生成
3. 環境変数を更新
4. 影響範囲の調査
5. 再発防止策の実装

### 不正アクセス検知時
1. 該当アカウントの一時停止
2. アクセスログの詳細確認
3. セキュリティルールの強化
4. ユーザーへの通知

---

**⚠️ 重要**: このドキュメントは定期的に更新し、チーム全体で共有すること