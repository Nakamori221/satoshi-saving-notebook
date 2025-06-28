// Bitcoin積立管理アプリ - JavaScript

class BitcoinSavingsApp {
    constructor() {
        this.currentBtcPrice = 15000000; // 現在のBTC価格（円）
        this.storageKey = 'btc-savings-tracker-data';
        
        // ローカルストレージからデータを復元
        this.data = this.loadData();
        
        this.isFirstTime = !this.data.goal.targetBtc || this.data.purchases.length === 0;
        this.chart = null;
        this.calculationMode = 'monthly'; // 'monthly', 'period', 'manual'
        
        this.init();
    }
    
    loadData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsedData = JSON.parse(saved);
                // デフォルト値とマージ
                return {
                    goal: {
                        targetBtc: 1.0,
                        period: 24,
                        monthlyAmount: 50000,
                        ...parsedData.goal
                    },
                    purchases: parsedData.purchases || [],
                    achievements: parsedData.achievements || [],
                    settings: {
                        soundEnabled: true,
                        currency: "JPY",
                        ...parsedData.settings
                    }
                };
            }
        } catch (error) {
            console.warn('Failed to load data from localStorage:', error);
        }
        
        // デフォルトデータ（初回用のサンプル）
        return {
            goal: {
                targetBtc: 1.0,
                period: 24,
                monthlyAmount: 50000,
                originalBtcPrice: 15000000, // 計画時のBTC価格
                startDate: new Date().toISOString() // 計画開始日
            },
            purchases: [],
            achievements: [],
            settings: {
                soundEnabled: true,
                currency: "JPY"
            }
        };
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.warn('Failed to save data to localStorage:', error);
        }
    }
    
    init() {
        this.setupEventListeners();
        this.checkFirstTime();
        this.updateCurrentPrice();
        
        // 価格の定期更新（デモ用）
        setInterval(() => {
            this.updateCurrentPrice();
        }, 30000);
    }
    
    setupEventListeners() {
        // 新しいスライダー・入力システム
        this.setupSliderInputPairs();
        this.setupCalculationModes();
        document.getElementById('start-saving').addEventListener('click', () => this.startSaving());
        
        // タブナビゲーション
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-button').dataset.tab));
        });
        
        // 購入フォーム
        document.getElementById('purchase-form').addEventListener('submit', (e) => this.handlePurchase(e));
        document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('purchase-price').value = this.currentBtcPrice;
        
        // 設定
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('sound-enabled').addEventListener('change', (e) => {
            this.data.settings.soundEnabled = e.target.checked;
        });
        
        // 達成モーダル
        document.getElementById('close-achievement').addEventListener('click', () => this.closeAchievement());
    }
    
    setupSliderInputPairs() {
        const pairs = [
            { slider: 'target-btc-slider', input: 'target-btc-input', display: 'target-btc-display', suffix: '' },
            { slider: 'period-slider', input: 'period-input', display: 'period-display', suffix: '' },
            { slider: 'monthly-amount-slider', input: 'monthly-amount-input', display: 'monthly-amount-display', suffix: '' }
        ];
        
        pairs.forEach(pair => {
            const slider = document.getElementById(pair.slider);
            const input = document.getElementById(pair.input);
            const display = document.getElementById(pair.display);
            
            if (slider && input && display) {
                // スライダー変更時
                slider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    input.value = value;
                    this.updateDisplay(pair, value);
                    this.handleValueChange(pair.slider.replace('-slider', ''));
                });
                
                // 入力フィールド変更時
                input.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value) || 0;
                    slider.value = Math.min(Math.max(value, parseFloat(slider.min)), parseFloat(slider.max));
                    this.updateDisplay(pair, value);
                    this.handleValueChange(pair.input.replace('-input', ''));
                });
                
                // 初期表示更新
                this.updateDisplay(pair, parseFloat(input.value));
            }
        });
    }
    
    updateDisplay(pair, value) {
        const display = document.getElementById(pair.display);
        if (pair.display.includes('monthly-amount')) {
            display.textContent = this.formatNumber(value);
        } else {
            display.textContent = value.toString();
        }
    }
    
    setupCalculationModes() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // アクティブボタンの切り替え
                modeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.calculationMode = e.target.dataset.mode;
                this.updateSimulation();
            });
        });
    }
    
    handleValueChange(fieldType) {
        // 計算モードに応じて自動計算を実行
        if (this.calculationMode === 'monthly' && fieldType !== 'monthly-amount') {
            this.calculateMonthlyAmount();
        } else if (this.calculationMode === 'period' && fieldType !== 'period') {
            this.calculatePeriod();
        }
        
        this.updateSimulation();
    }
    
    calculateMonthlyAmount() {
        const targetBtc = parseFloat(document.getElementById('target-btc-input').value);
        const period = parseInt(document.getElementById('period-input').value);
        
        const totalAmount = targetBtc * this.currentBtcPrice;
        const monthlyAmount = Math.ceil(totalAmount / period);
        
        document.getElementById('monthly-amount-slider').value = monthlyAmount;
        document.getElementById('monthly-amount-input').value = monthlyAmount;
        document.getElementById('monthly-amount-display').textContent = this.formatNumber(monthlyAmount);
    }
    
    calculatePeriod() {
        const targetBtc = parseFloat(document.getElementById('target-btc-input').value);
        const monthlyAmount = parseInt(document.getElementById('monthly-amount-input').value);
        
        const totalAmount = targetBtc * this.currentBtcPrice;
        const period = Math.ceil(totalAmount / monthlyAmount);
        
        document.getElementById('period-slider').value = period;
        document.getElementById('period-input').value = period;
        document.getElementById('period-display').textContent = period.toString();
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat('ja-JP').format(Math.floor(num));
    }
    
    checkFirstTime() {
        if (this.isFirstTime) {
            document.getElementById('setup-screen').classList.remove('hidden');
            document.getElementById('main-app').classList.add('hidden');
            this.updateSimulation();
        } else {
            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            this.updateDashboard();
        }
    }
    
    async updateCurrentPrice() {
        try {
            // リアルタイムBTC価格を取得
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy');
            const data = await response.json();
            
            if (data.bitcoin && data.bitcoin.jpy) {
                this.currentBtcPrice = Math.floor(data.bitcoin.jpy);
            } else {
                // APIが失敗した場合はデモ価格を使用
                const variation = (Math.random() - 0.5) * 0.04;
                this.currentBtcPrice = Math.floor(15000000 * (1 + variation));
            }
        } catch (error) {
            console.warn('Price fetch failed, using demo price:', error);
            // APIエラー時はデモ価格を使用
            const variation = (Math.random() - 0.5) * 0.04;
            this.currentBtcPrice = Math.floor(15000000 * (1 + variation));
        }
        
        // 価格表示を更新
        const priceElements = document.querySelectorAll('#current-price, #dashboard-price');
        priceElements.forEach(element => {
            element.textContent = this.formatCurrency(this.currentBtcPrice);
        });
        
        // 購入フォームの価格も更新
        document.getElementById('purchase-price').value = this.currentBtcPrice;
    }
    
    updateSimulation() {
        const targetBtc = parseFloat(document.getElementById('target-btc-input').value);
        const period = parseInt(document.getElementById('period-input').value);
        const monthlyAmount = parseInt(document.getElementById('monthly-amount-input').value);
        
        const estimatedMonthly = Math.ceil((targetBtc * this.currentBtcPrice) / period);
        const totalEstimated = targetBtc * this.currentBtcPrice;
        
        document.getElementById('estimated-monthly').textContent = this.formatCurrency(estimatedMonthly);
        document.getElementById('total-estimated').textContent = this.formatCurrency(totalEstimated);
    }
    
    startSaving() {
        // 設定を保存
        this.data.goal.targetBtc = parseFloat(document.getElementById('target-btc-input').value);
        this.data.goal.period = parseInt(document.getElementById('period-input').value);
        this.data.goal.monthlyAmount = parseInt(document.getElementById('monthly-amount-input').value);
        this.data.goal.originalBtcPrice = this.currentBtcPrice; // 計画時の価格を記録
        this.data.goal.startDate = new Date().toISOString(); // 開始日を記録
        
        this.saveData();
        this.isFirstTime = false;
        
        // メイン画面に移行
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        this.updateDashboard();
        this.updateSettingsForm();
    }
    
    switchTab(tabName) {
        // タブボタンの状態更新
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // タブコンテンツの表示切り替え
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // タブごとの初期化処理
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'purchase') {
            this.updatePurchaseHistory();
            this.resetPurchaseForm();
        } else if (tabName === 'settings') {
            this.updateSettingsForm();
        }
    }
    
    updateDashboard() {
        const currentBtc = this.getCurrentBtc();
        const progressPercent = (currentBtc / this.data.goal.targetBtc) * 100;
        const remainingBtc = Math.max(0, this.data.goal.targetBtc - currentBtc);
        const totalInvested = this.getTotalInvested();
        
        // 進捗更新
        document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
        document.getElementById('current-btc').textContent = `${currentBtc.toFixed(3)} BTC`;
        document.getElementById('remaining-btc').textContent = `${remainingBtc.toFixed(3)} BTC`;
        document.getElementById('total-invested').textContent = this.formatCurrency(totalInvested);
        
        // 円形プログレスバーの更新
        this.updateProgressCircle(progressPercent);
        
        // チャート更新
        this.updateChart();
        
        // リスク分析更新
        this.updateRiskAnalysis();
        
        // 達成チェック
        this.checkAchievements(progressPercent);
    }
    
    updateProgressCircle(percent) {
        const circle = document.getElementById('progress-circle');
        const degree = (percent / 100) * 360;
        
        // 色の変更（進捗に応じて）
        let color1, color2;
        if (percent < 30) {
            color1 = '#ff6b6b';
            color2 = '#ff8e8e';
        } else if (percent < 70) {
            color1 = '#ffd93d';
            color2 = '#ffed4a';
        } else {
            color1 = '#6bcf7f';
            color2 = '#4d9de0';
        }
        
        circle.style.background = `conic-gradient(${color1} 0deg, ${color2} ${degree}deg, #e0e0e0 ${degree}deg, #e0e0e0 360deg)`;
    }
    
    updateChart() {
        const ctx = document.getElementById('progress-chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        // 月別の累積データを作成
        const monthlyData = this.generateMonthlyData();
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: '保有BTC数',
                    data: monthlyData.data,
                    borderColor: '#F7931A',
                    backgroundColor: 'rgba(247, 147, 26, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: this.data.goal.targetBtc,
                        title: {
                            display: true,
                            text: 'BTC'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '月'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    generateMonthlyData() {
        const labels = [];
        const data = [];
        let cumulativeBtc = 0;
        
        // 過去3ヶ月のデータ
        for (let i = 2; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            labels.push(`${date.getMonth() + 1}月`);
            
            // その月の購入データを集計
            const monthPurchases = this.data.purchases.filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                return purchaseDate.getMonth() === date.getMonth() && 
                       purchaseDate.getFullYear() === date.getFullYear();
            });
            
            const monthlyBtc = monthPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
            cumulativeBtc += monthlyBtc;
            data.push(cumulativeBtc);
        }
        
        return { labels, data };
    }
    
    handlePurchase(e) {
        e.preventDefault();
        
        const date = document.getElementById('purchase-date').value;
        const amount = parseFloat(document.getElementById('purchase-amount').value);
        const price = parseInt(document.getElementById('purchase-price').value);
        const memo = document.getElementById('purchase-memo').value.trim();
        const total = Math.floor(amount * price);
        
        if (!date || !amount || !price) {
            alert('すべての項目を入力してください。');
            return;
        }
        
        const purchase = {
            id: Date.now(),
            date,
            amount,
            price,
            total,
            memo: memo || ''
        };
        
        this.data.purchases.push(purchase);
        
        // データを保存
        this.saveData();
        
        // 効果音再生
        this.playPurchaseSound();
        
        // フォーム完全リセット
        this.resetPurchaseForm();
        
        // 表示更新
        this.updatePurchaseHistory();
        this.updateDashboard();
        
        // 成功メッセージ
        this.showToast('購入を記録しました！', 'success');
        
        // ダッシュボードに自動遷移
        setTimeout(() => {
            this.switchTab('dashboard');
        }, 1000);
    }
    
    resetPurchaseForm() {
        // フォーム要素を個別にリセット
        document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('purchase-amount').value = '';
        document.getElementById('purchase-price').value = this.currentBtcPrice;
        document.getElementById('purchase-memo').value = '';
        
        // フォーム全体もリセット
        document.getElementById('purchase-form').reset();
        
        // 再度デフォルト値を設定
        document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('purchase-price').value = this.currentBtcPrice;
    }
    
    updatePurchaseHistory() {
        const historyContainer = document.getElementById('purchase-history');
        
        if (this.data.purchases.length === 0) {
            historyContainer.innerHTML = '<p class="text-center">購入履歴がありません</p>';
            return;
        }
        
        const historyHTML = this.data.purchases
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(purchase => `
                <div class="history-item">
                    <div class="history-item-main">
                        <div class="history-item-date">${this.formatDate(purchase.date)}</div>
                        <div class="history-item-amount">${purchase.amount.toFixed(3)} BTC</div>
                        <div class="history-item-price">${this.formatCurrency(purchase.price)}</div>
                        <div class="history-item-actions">
                            <button class="btn-icon btn-icon--danger" onclick="app.deletePurchase(${purchase.id})" title="削除">
                                🗑️
                            </button>
                        </div>
                    </div>
                    ${purchase.memo ? `<div class="history-item-memo">📝 ${purchase.memo}</div>` : ''}
                </div>
            `).join('');
        
        historyContainer.innerHTML = historyHTML;
    }
    
    deletePurchase(id) {
        if (confirm('この購入記録を削除しますか？')) {
            this.data.purchases = this.data.purchases.filter(purchase => purchase.id !== id);
            this.saveData();
            this.updatePurchaseHistory();
            this.updateDashboard();
            this.showToast('購入記録を削除しました', 'info');
        }
    }
    
    updateSettingsForm() {
        document.getElementById('settings-target-btc').value = this.data.goal.targetBtc;
        document.getElementById('settings-period').value = this.data.goal.period;
        document.getElementById('settings-monthly-amount').value = this.data.goal.monthlyAmount;
        document.getElementById('sound-enabled').checked = this.data.settings.soundEnabled;
    }
    
    saveSettings() {
        this.data.goal.targetBtc = parseFloat(document.getElementById('settings-target-btc').value);
        this.data.goal.period = parseInt(document.getElementById('settings-period').value);
        this.data.goal.monthlyAmount = parseInt(document.getElementById('settings-monthly-amount').value);
        
        this.saveData();
        this.updateDashboard();
        this.showToast('設定を保存しました', 'success');
    }
    
    checkAchievements(currentPercent) {
        const milestones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        
        for (const milestone of milestones) {
            if (currentPercent >= milestone && !this.data.achievements.includes(milestone)) {
                this.data.achievements.push(milestone);
                this.saveData();
                this.showAchievement(milestone);
                break; // 一度に一つずつ表示
            }
        }
    }
    
    showAchievement(percent) {
        const modal = document.getElementById('achievement-modal');
        const title = document.getElementById('achievement-title');
        const message = document.getElementById('achievement-message');
        
        let messageText = '';
        if (percent === 100) {
            messageText = '🎉 目標達成おめでとうございます！';
        } else if (percent >= 50) {
            messageText = `目標の${percent}%を達成しました！半分以上クリアです！`;
        } else {
            messageText = `目標の${percent}%を達成しました！順調に進んでいます！`;
        }
        
        title.textContent = percent === 100 ? '目標達成！' : 'マイルストーン達成！';
        message.textContent = messageText;
        
        modal.classList.remove('hidden');
        
        // 達成音再生
        this.playAchievementSound();
    }
    
    closeAchievement() {
        document.getElementById('achievement-modal').classList.add('hidden');
    }
    
    playPurchaseSound() {
        if (!this.data.settings.soundEnabled) return;
        
        // Web Audio APIを使用した効果音生成
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    playAchievementSound() {
        if (!this.data.settings.soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 3つの音を重ねて達成音を作成
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const frequencies = [523, 659, 784]; // C, E, G
            oscillator.frequency.setValueAtTime(frequencies[i], audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.1);
            
            oscillator.start(audioContext.currentTime + i * 0.1);
            oscillator.stop(audioContext.currentTime + 0.5 + i * 0.1);
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    getCurrentBtc() {
        return this.data.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    }
    
    getTotalInvested() {
        return this.data.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    updateRiskAnalysis() {
        if (!this.data.goal.originalBtcPrice || !this.data.goal.startDate) {
            return; // 計画データがない場合はスキップ
        }
        
        const analysis = this.calculateRiskAnalysis();
        
        // 当初計画の表示
        document.getElementById('original-btc-price').textContent = this.formatCurrency(this.data.goal.originalBtcPrice);
        document.getElementById('planned-completion').textContent = analysis.plannedCompletionDate;
        document.getElementById('planned-monthly').textContent = this.formatCurrency(analysis.plannedMonthlyAmount);
        
        // 現在の状況の表示
        document.getElementById('current-pace').textContent = analysis.currentPace;
        document.getElementById('predicted-completion').textContent = analysis.predictedCompletionDate;
        
        // 計画との差異の表示
        const deviationElement = document.getElementById('plan-deviation');
        deviationElement.textContent = analysis.planDeviation;
        
        // 差異に応じてスタイルを変更
        const deviationContainer = deviationElement.closest('.reality-item');
        deviationContainer.classList.remove('positive', 'negative');
        if (analysis.deviationMonths > 0) {
            deviationContainer.classList.add('negative'); // 遅延は赤色
        } else if (analysis.deviationMonths < 0) {
            deviationContainer.classList.add('positive'); // 早期は緑色
        }
        
        // 推奨アクションの表示
        document.getElementById('recommendation-text').innerHTML = analysis.recommendationText;
    }
    
    calculateRiskAnalysis() {
        const currentBtc = this.getCurrentBtc();
        const startDate = new Date(this.data.goal.startDate);
        const currentDate = new Date();
        const monthsElapsed = this.getMonthsDifference(startDate, currentDate);
        
        // 当初計画
        const plannedMonthlyAmount = Math.ceil((this.data.goal.targetBtc * this.data.goal.originalBtcPrice) / this.data.goal.period);
        const plannedCompletionDate = new Date(startDate);
        plannedCompletionDate.setMonth(plannedCompletionDate.getMonth() + this.data.goal.period);
        
        // 現在のペース分析
        const expectedBtcByNow = (this.data.goal.targetBtc * monthsElapsed) / this.data.goal.period;
        const progressRatio = monthsElapsed > 0 ? currentBtc / expectedBtcByNow : 1;
        
        let currentPace;
        if (progressRatio >= 1.1) {
            currentPace = "順調（予定より早い）";
        } else if (progressRatio >= 0.9) {
            currentPace = "順調";
        } else if (progressRatio >= 0.7) {
            currentPace = "やや遅れ";
        } else {
            currentPace = "大幅遅れ";
        }
        
        // 現在のペースでの完了予測
        const remainingBtc = this.data.goal.targetBtc - currentBtc;
        const averageMonthlyBtc = monthsElapsed > 0 ? currentBtc / monthsElapsed : 0;
        const remainingMonths = averageMonthlyBtc > 0 ? Math.ceil(remainingBtc / averageMonthlyBtc) : this.data.goal.period;
        
        const predictedCompletionDate = new Date(currentDate);
        predictedCompletionDate.setMonth(predictedCompletionDate.getMonth() + remainingMonths);
        
        // 計画との差異計算
        const deviationMonths = this.getMonthsDifference(plannedCompletionDate, predictedCompletionDate);
        let planDeviation;
        if (deviationMonths > 0) {
            planDeviation = `+${deviationMonths}ヶ月遅延`;
        } else if (deviationMonths < 0) {
            planDeviation = `${Math.abs(deviationMonths)}ヶ月早期`;
        } else {
            planDeviation = "計画通り";
        }
        
        // 推奨アクション
        let recommendationText = this.generateRecommendation(deviationMonths, remainingBtc, remainingMonths);
        
        return {
            plannedMonthlyAmount,
            plannedCompletionDate: this.formatDateYearMonth(plannedCompletionDate),
            currentPace,
            predictedCompletionDate: this.formatDateYearMonth(predictedCompletionDate),
            planDeviation,
            deviationMonths,
            recommendationText
        };
    }
    
    generateRecommendation(deviationMonths, remainingBtc, remainingMonths) {
        if (deviationMonths <= 0) {
            return `<span style="color: var(--color-success);">✅ 順調に進んでいます！現在のペースを維持してください。</span>`;
        } else if (deviationMonths <= 2) {
            const additionalMonthly = Math.ceil((remainingBtc * this.currentBtcPrice) / (remainingMonths - deviationMonths)) - 
                                     Math.ceil((remainingBtc * this.currentBtcPrice) / remainingMonths);
            return `BTCの価格変動により、目標達成が<strong>${deviationMonths}ヶ月遅れる</strong>見込みです。
                    当初計画通りに達成するには、月次積立額を<strong>${this.formatCurrency(additionalMonthly)}</strong>増額することをお勧めします。`;
        } else {
            return `⚠️ 大幅な遅延が予想されます（<strong>+${deviationMonths}ヶ月</strong>）。
                    目標の見直しまたは積立額の大幅な増額を検討することをお勧めします。`;
        }
    }
    
    getMonthsDifference(date1, date2) {
        const years = date2.getFullYear() - date1.getFullYear();
        const months = date2.getMonth() - date1.getMonth();
        return years * 12 + months;
    }
    
    formatDateYearMonth(date) {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long'
        });
    }
}

// アプリケーション初期化
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new BitcoinSavingsApp();
    
    // CSSアニメーションの追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .toast {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
});