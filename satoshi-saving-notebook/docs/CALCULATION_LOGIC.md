---
created: 2025-06-21T18:23
updated: 2025-06-21T18:30
---
# コア計算ロジック詳細説明

## 📊 主要計算関数の仕組み

### 1. `getRequiredMonthlyAmount()` - 必要月額算出

**目的**: 目標BTC量を期限内に達成するために必要な月間積立額を計算

**計算式**:
```
必要月額 = (目標BTC - 現在BTC) × 現在価格 ÷ 残り月数
```

**具体例**:
```typescript
// 入力例
targetBtc: 0.1 BTC        // 目標
currentBtc: 0.02 BTC      // 現在保有
priceJpy: 10,000,000円    // 現在価格
monthsLeft: 24ヶ月        // 残り期間

// 計算過程
remainingBtc = 0.1 - 0.02 = 0.08 BTC
totalJpyNeeded = 0.08 × 10,000,000 = 800,000円
requiredMonthly = 800,000 ÷ 24 = 33,333円（切り上げ→33,334円）
```

**特徴**:
- 端数は切り上げ（`Math.ceil()`）で確実に目標達成
- 期間が0以下の場合は0を返す
- 既に目標達成している場合も0を返す

---

### 2. `getAchievementRate()` - 達成率計算

**目的**: 現在の進捗を百分率で表示

**計算式**:
```
達成率(%) = (現在BTC ÷ 目標BTC) × 100
```

**具体例**:
```typescript
// 入力例
currentBtc: 0.065 BTC
targetBtc: 0.1 BTC

// 計算結果
achievementRate = (0.065 ÷ 0.1) × 100 = 65%
```

**特徴**:
- 100%を超えた場合は100%で上限設定
- ゼロ除算防止

---

### 3. `getRemainingSats()` - 残りサトシ計算

**目的**: 目標まであと何satoshi必要かを分かりやすく表示

**計算式**:
```
残りsat = (目標BTC - 現在BTC) × 100,000,000
```

**具体例**:
```typescript
// 入力例
targetBtc: 0.1 BTC
currentBtc: 0.065 BTC

// 計算過程
remainingBtc = 0.1 - 0.065 = 0.035 BTC
remainingSats = 0.035 × 100,000,000 = 3,500,000 sats
```

**特徴**:
- 1 BTC = 100,000,000 satoshi の換算
- マイナス値は0に補正

---

### 4. `getEstimatedCompletionDate()` - 完了予定日算出

**目的**: 現在の積立ペースでの目標達成予定日を予測

**計算式**:
```
月間BTC購入量 = 月間積立額 ÷ 現在価格
必要月数 = 残りBTC ÷ 月間BTC購入量
完了予定日 = 現在日 + 必要月数
```

**具体例**:
```typescript
// 入力例
currentBtc: 0.02 BTC
targetBtc: 0.1 BTC
monthlyDepositJpy: 50,000円
currentPriceJpy: 10,000,000円

// 計算過程
remainingBtc = 0.1 - 0.02 = 0.08 BTC
monthlyBtcPurchase = 50,000 ÷ 10,000,000 = 0.005 BTC/月
monthsNeeded = 0.08 ÷ 0.005 = 16ヶ月
// 現在が2025年6月 → 完了予定: 2026年10月
```

---

### 5. `getMonthsDifference()` - 期間計算

**目的**: 開始日から終了日までの正確な月数を算出

**計算式**:
```
月数差 = (終了年 - 開始年) × 12 + (終了月 - 開始月) + (日差調整)
```

**特徴**:
- 日割り計算も含む（1日=1/30月として近似）
- マイナス値は0に補正

---

## 🎨 UI表示ロジック

### Badge色分け判定
```typescript
function getBadgeColor(achievementRate: number): string {
  if (achievementRate >= 90) return 'green';  // 順調
  if (achievementRate >= 50) return 'yellow'; // 注意
  return 'red';                               // 遅れ
}
```

### 通貨フォーマット
```typescript
// 日本円表示: ¥1,234,567
formatCurrency(1234567) // "¥1,234,567"

// BTC表示: 0.12345678
formatBtc(0.123456789, 8) // "0.12345678"

// サトシ表示: 1,234,567 sats
formatSats(1234567) // "1,234,567"
```

---

## 🔄 リアルタイム更新

### 価格変動対応
```typescript
// 価格が変わると以下が自動再計算される
useEffect(() => {
  setRequiredMonthly(getRequiredMonthlyAmount(...));
  setAchievementRate(getAchievementRate(...));
  setEstimatedDate(getEstimatedCompletionDate(...));
}, [currentPrice, currentBtc, monthlyDeposit]);
```

### 積立記録時の更新
```typescript
// 積立額入力時の処理
const handleDepositAdd = () => {
  const btcPurchased = monthlyDeposit / currentPrice;
  setCurrentBtc(prev => prev + btcPurchased);
  
  // Firestoreに記録
  addProgressEntry({
    btcPrice: currentPrice,
    depositJpy: monthlyDeposit,
    memo: memo,
    createdAt: new Date()
  });
};
```

---

## 🧪 計算精度とエラーハンドリング

### 浮動小数点誤差対策
```typescript
// BTCは小数点8桁まで正確に扱う
const SATOSHI_PRECISION = 100_000_000;

function roundToBtc(value: number): number {
  return Math.round(value * SATOSHI_PRECISION) / SATOSHI_PRECISION;
}
```

### エラーケース対応
- **ゼロ除算**: 期間が0の場合は0を返す
- **マイナス値**: 既に目標達成の場合は0を返す  
- **不正な入力**: NaNやInfinityを0に補正
- **オーバーフロー**: 現実的でない大きな値は上限設定

---

## 📈 将来の拡張性

### 通貨対応
```typescript
// 将来的にUSD対応時
interface CurrencyConfig {
  symbol: string;
  precision: number;
  formatter: Intl.NumberFormat;
}

const CURRENCIES = {
  JPY: { symbol: '¥', precision: 0 },
  USD: { symbol: '$', precision: 2 }
};
```

### 複数目標対応
```typescript
// 複数の目標を同時管理
interface MultiGoal {
  id: string;
  name: string;
  targetBtc: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
}
```

このロジックにより、ユーザーは**「あと何sat？」を3秒で確認**し、**価格変動に合わせた最適な積立プランを自動取得**できます。