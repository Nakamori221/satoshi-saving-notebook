'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import {
  Container,
  Card,
  Stack,
  Title,
  Text,
  RingProgress,
  Badge,
  NumberInput,
  Textarea,
  Button,
  Grid,
  Group,
  Divider,
  LoadingOverlay,
  Alert,
  List,
  ActionIcon,
  Tooltip,
  Flex,
} from '@mantine/core';
import { IconCoin, IconTarget, IconCalendar, IconPlus, IconSettings, IconTrendingUp, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import PWAInstaller from '@/components/PWAInstaller';
import GoalSettingsModal from '@/components/GoalSettingsModal';
import {
  getRequiredMonthlyAmount,
  getRequiredWeeklyAmount,
  getAchievementRate,
  getRemainingSats,
  getEstimatedCompletionDate,
  getMonthsDifference,
  getBadgeColor,
  formatCurrency,
  formatBtc,
  formatSats,
  getPreviousMonthComparison,
  getPriceChangeBadgeColor,
  formatTimeRemaining,
} from '@/lib/calculations';
import {
  getUserProfile,
  getUserGoal,
  addProgressEntry,
  getRecentProgressEntries,
  calculateCurrentBtc,
  initializeUserData,
} from '@/lib/firestore';
import {
  saveGoalToLocalStorage,
  getGoalFromLocalStorage,
  saveProgressToLocalStorage,
  getProgressFromLocalStorage,
  calculateCurrentBtcFromLocalStorage,
} from '@/lib/localStorage';
import { UserProfile, UserGoal, ProgressEntry } from '@/types';

export default function SavingsCalculatorWithData() {
  const [user, loading] = useAuthState(auth);
  const [authError, setAuthError] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [currentBtc, setCurrentBtc] = useState<number>(0);
  const [recentEntries, setRecentEntries] = useState<ProgressEntry[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(9800000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(0);
  const [memo, setMemo] = useState<string>('');
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [settingsModalOpened, setSettingsModalOpened] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(-2.5); // Simulated price change for demo
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date>(new Date());

  // Load user data
  useEffect(() => {
    // Check for demo mode or auth errors
    if (loading) return;
    
    if (!user) {
      // Demo mode - use localStorage
      setIsDemoMode(true);
      loadDemoModeData();
      return;
    }

    loadFirebaseData();
  }, [user, loading]);

  const loadDemoModeData = () => {
    try {
      setIsLoadingData(true);
      
      // Load goal from localStorage or create default
      let loadedGoal = getGoalFromLocalStorage();
      if (!loadedGoal) {
        loadedGoal = {
          targetBtc: 0.1,
          deadline: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
          startBtc: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        saveGoalToLocalStorage(loadedGoal);
      }
      
      // Load progress from localStorage
      const loadedEntries = getProgressFromLocalStorage();
      const loadedBtc = calculateCurrentBtcFromLocalStorage();
      
      setGoal(loadedGoal);
      setRecentEntries(loadedEntries.slice(0, 5));
      setCurrentBtc(loadedBtc);
      
      // Auto-fetch current price
      handlePriceUpdate();
    } catch (error) {
      console.error('Error loading demo mode data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadFirebaseData = async () => {
    if (!user) return;

    try {
      setIsLoadingData(true);

      // Initialize user data if first time
      await initializeUserData(user.uid, user.email || '');

      // Load profile, goal, and progress
      const [profileData, goalData, entries, btcAmount] = await Promise.all([
        getUserProfile(user.uid),
        getUserGoal(user.uid),
        getRecentProgressEntries(user.uid, 5),
        calculateCurrentBtc(user.uid),
      ]);

      setProfile(profileData);
      setGoal(goalData);
      setRecentEntries(entries);
      setCurrentBtc(btcAmount);

      // Auto-fetch current price
      handlePriceUpdate();
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthError(true);
      // Fallback to demo mode
      setIsDemoMode(true);
      loadDemoModeData();
    } finally {
      setIsLoadingData(false);
    }
  };

  const handlePriceUpdate = async () => {
    setIsLoadingPrice(true);
    try {
      const response = await fetch('/api/btc-price');
      const data = await response.json();
      
      if (data.success) {
        setCurrentPrice(data.price);
        setLastPriceUpdate(new Date());
        console.log('✅ Price updated:', data.price);
      } else {
        console.error('❌ Price update failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Price update error:', error);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const handleDepositAdd = async () => {
    if (monthlyDeposit <= 0) return;

    setIsSaving(true);
    try {
      const btcPurchased = monthlyDeposit / currentPrice;
      const newEntry: ProgressEntry = {
        id: Date.now().toString(),
        btcPrice: currentPrice,
        depositJpy: monthlyDeposit,
        memo: memo,
        createdAt: new Date(),
      };

      if (isDemoMode) {
        // Demo mode - save to localStorage
        saveProgressToLocalStorage(newEntry);
        
        // Update local state
        setCurrentBtc(prev => prev + btcPurchased);
        
        // Refresh recent entries from localStorage
        const updatedEntries = getProgressFromLocalStorage();
        setRecentEntries(updatedEntries.slice(0, 5));
      } else if (user) {
        // Firebase mode
        await addProgressEntry(user.uid, {
          btcPrice: currentPrice,
          depositJpy: monthlyDeposit,
          memo: memo,
        });

        // Update local state
        setCurrentBtc(prev => prev + btcPurchased);

        // Refresh recent entries
        const updatedEntries = await getRecentProgressEntries(user.uid, 5);
        setRecentEntries(updatedEntries);
      }

      // Reset form
      setMonthlyDeposit(0);
      setMemo('');

      notifications.show({
        title: '✅ 積立記録を追加しました',
        message: `${formatCurrency(monthlyDeposit)} (${formatBtc(btcPurchased, 6)} BTC)`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error adding deposit:', error);
      notifications.show({
        title: 'エラー',
        message: '積立記録の保存に失敗しました',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoadingData) {
    return (
      <Container size="md" py="xl">
        <LoadingOverlay visible />
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text ta="center">データを読み込み中...</Text>
        </Card>
      </Container>
    );
  }

  if (!goal) {
    return (
      <Container size="md" py="xl">
        <Alert color="red">
          目標データの読み込みに失敗しました。ページを再読み込みしてください。
        </Alert>
      </Container>
    );
  }

  // Calculate values
  const monthsLeft = getMonthsDifference(new Date(), goal.deadline);
  const requiredMonthlyAmount = getRequiredMonthlyAmount(currentPrice, goal.targetBtc, currentBtc, monthsLeft);
  const requiredWeeklyAmount = getRequiredWeeklyAmount(requiredMonthlyAmount);
  const achievementRate = getAchievementRate(currentBtc, goal.targetBtc);
  const remainingSats = getRemainingSats(goal.targetBtc, currentBtc);
  const estimatedCompletion = getEstimatedCompletionDate(currentBtc, goal.targetBtc, monthlyDeposit, currentPrice);
  const badgeColor = getBadgeColor(achievementRate);
  const timeRemaining = formatTimeRemaining(monthsLeft);
  const monthComparison = getPreviousMonthComparison(currentPrice, goal.targetBtc, currentBtc, monthsLeft, priceChangePercent);
  const priceChangeBadgeColor = getPriceChangeBadgeColor(monthComparison.changePercent);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* PWA Install Prompt */}
        <PWAInstaller />
        
        {/* Header */}
        <Group justify="space-between" align="center">
          <Title order={1} c="teal" style={{ flex: 1, textAlign: 'center' }}>
            さとし貯金ノート
          </Title>
          <ActionIcon
            variant="light"
            color="teal"
            size="lg"
            onClick={() => setSettingsModalOpened(true)}
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>

        {/* Main Progress Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            {/* Progress Ring */}
            <Group justify="center">
              <RingProgress
                size={200}
                thickness={16}
                sections={[
                  { value: achievementRate, color: badgeColor }
                ]}
                label={
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700}>
                      {achievementRate.toFixed(1)}%
                    </Text>
                    <Text size="sm" c="dimmed">
                      達成率
                    </Text>
                  </div>
                }
              />
            </Group>

            {/* Enhanced Three-Layer Metrics Dashboard */}
            <Grid>
              {/* Current Holdings - Three Layer Display */}
              <Grid.Col span={12}>
                <Card padding="md" radius="sm" withBorder style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed" fw={500}>現在の積立額</Text>
                    <Group justify="space-between" align="center">
                      <div>
                        <Text size="xl" fw={900} c="teal">
                          {formatCurrency(currentBtc * currentPrice)}
                        </Text>
                        <Text size="sm" c="dimmed">評価額 (JPY)</Text>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Text size="lg" fw={700}>
                          {formatBtc(currentBtc, 6)} BTC
                        </Text>
                        <Text size="xs" c="dimmed">ビットコイン</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text size="md" fw={600} c="orange">
                          {formatSats(Math.round(currentBtc * 100_000_000))} sat
                        </Text>
                        <Text size="xs" c="dimmed">サトシ</Text>
                      </div>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Remaining Target */}
              <Grid.Col span={4}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconTarget size={18} color="orange" />
                    <div>
                      <Text size="xs" c="dimmed">残り目標</Text>
                      <Text size="md" fw={700}>
                        {formatSats(remainingSats)} sat
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatBtc(goal.targetBtc - currentBtc, 6)} BTC
                      </Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>

              {/* Required Monthly Amount with Comparison */}
              <Grid.Col span={4}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconCoin size={18} color="green" />
                    <div>
                      <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed">必要月額</Text>
                        {Math.abs(monthComparison.changePercent) > 1 && (
                          <Badge 
                            color={priceChangeBadgeColor} 
                            size="xs" 
                            variant="light"
                          >
                            {monthComparison.isDecrease ? '↓' : '↑'}
                            {Math.abs(monthComparison.changePercent).toFixed(1)}%
                          </Badge>
                        )}
                      </Group>
                      <Text size="md" fw={700}>
                        {formatCurrency(requiredMonthlyAmount)}
                      </Text>
                      <Badge color={badgeColor} size="xs">
                        週: {formatCurrency(requiredWeeklyAmount)}
                      </Badge>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>

              {/* Enhanced Remaining Time */}
              <Grid.Col span={4}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconCalendar size={18} color={timeRemaining.urgencyLevel === 'high' ? 'red' : timeRemaining.urgencyLevel === 'medium' ? 'orange' : 'blue'} />
                    <div>
                      <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed">残期間</Text>
                        {timeRemaining.urgencyLevel === 'high' && (
                          <Badge color="red" size="xs" variant="light">
                            緊急
                          </Badge>
                        )}
                      </Group>
                      <Text size="md" fw={700} c={timeRemaining.urgencyLevel === 'high' ? 'red' : undefined}>
                        {timeRemaining.displayText}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {goal.deadline.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}まで
                      </Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Enhanced Input Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3}>積立記録追加</Title>
              <Badge variant="light" color="gray" size="sm">
                前回更新: {lastPriceUpdate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label={
                    <Group gap="xs">
                      <Text size="sm">BTC価格 (JPY)</Text>
                      <Tooltip label="コインゲッコー API経由で取得">
                        <Badge variant="outline" size="xs" color="blue">
                          CoinGecko
                        </Badge>
                      </Tooltip>
                    </Group>
                  }
                  value={currentPrice}
                  onChange={(value) => setCurrentPrice(Number(value) || 0)}
                  thousandSeparator=","
                  hideControls
                  rightSection={
                    <Tooltip label="最新価格を取得">
                      <ActionIcon 
                        variant="light" 
                        onClick={handlePriceUpdate}
                        loading={isLoadingPrice}
                        color="blue"
                      >
                        <IconRefresh size={16} />
                      </ActionIcon>
                    </Tooltip>
                  }
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <NumberInput
                  label="積立額 (JPY)"
                  value={monthlyDeposit}
                  onChange={(value) => setMonthlyDeposit(Number(value) || 0)}
                  thousandSeparator=","
                  hideControls
                />
                
                {/* Quick Amount Buttons */}
                <Group gap="xs" mt="xs">
                  <Text size="xs" c="dimmed">クイック入力:</Text>
                  {[10000, 30000, 50000, 100000].map((amount) => (
                    <Button
                      key={amount}
                      size="xs"
                      variant="light"
                      color="teal"
                      onClick={() => setMonthlyDeposit(prev => prev + amount)}
                    >
                      +{(amount / 10000).toFixed(0)}万
                    </Button>
                  ))}
                </Group>
              </Grid.Col>

              <Grid.Col span={12}>
                <Textarea
                  label="メモ"
                  placeholder="給料日、特別ボーナスなど"
                  value={memo}
                  onChange={(event) => setMemo(event.currentTarget.value)}
                  rows={2}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Group grow>
                  <Button
                    onClick={handleDepositAdd}
                    disabled={monthlyDeposit <= 0}
                    loading={isSaving}
                    color="teal"
                    leftSection={<IconPlus size={16} />}
                  >
                    積立記録を保存
                  </Button>
                  
                  {monthComparison.isDecrease && (
                    <Tooltip label="価格下落時の追加買いチャンス！">
                      <Button
                        onClick={() => setMonthlyDeposit(prev => prev + Math.round(requiredMonthlyAmount * 0.5))}
                        variant="light"
                        color="green"
                        leftSection={<IconTrendingUp size={16} />}
                      >
                        追加買い
                      </Button>
                    </Tooltip>
                  )}
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={4}>最近の積立記録</Title>
              <Divider />
              <List>
                {recentEntries.map((entry, index) => (
                  <List.Item key={index}>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>
                          {entry.createdAt.toLocaleDateString('ja-JP')}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {entry.memo || '(メモなし)'}
                        </Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={500}>
                          {formatCurrency(entry.depositJpy)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatBtc(entry.depositJpy / entry.btcPrice, 6)} BTC
                        </Text>
                      </div>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Card>
        )}

        {/* Action Insights & Recommendations */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #e8f5e8 100%)' }}>
          <Stack gap="sm">
            <Group gap="xs">
              <IconTrendingUp size={20} color="green" />
              <Title order={4}>アクション提案</Title>
            </Group>
            <Divider />
            
            {/* Smart Recommendations */}
            {achievementRate < 50 && timeRemaining.urgencyLevel === 'high' && (
              <Alert color="orange" variant="light">
                <Text size="sm" fw={500}>
                  🔥 達成まで残りわずか！月額を{formatCurrency(requiredMonthlyAmount - (monthlyDeposit || 0))}増額して目標達成を目指しましょう。
                </Text>
              </Alert>
            )}
            
            {monthComparison.isDecrease && Math.abs(monthComparison.changePercent) > 3 && (
              <Alert color="green" variant="light">
                <Text size="sm" fw={500}>
                  📉 BTC価格下落で必要月額が{Math.abs(monthComparison.changePercent).toFixed(1)}%減少！今が買い増しのチャンスです。
                </Text>
              </Alert>
            )}
            
            {!monthComparison.isDecrease && monthComparison.changePercent > 5 && (
              <Alert color="blue" variant="light">
                <Text size="sm" fw={500}>
                  📈 価格上昇中ですが、焦らず定額積立を継続することがDCA成功の鍵です。
                </Text>
              </Alert>
            )}
            
            {achievementRate > 80 && (
              <Alert color="teal" variant="light">
                <Text size="sm" fw={500}>
                  🎉 達成率{achievementRate.toFixed(1)}%！あと少しで目標達成です。継続して頑張りましょう！
                </Text>
              </Alert>
            )}
            
            {/* Quick Stats */}
            <Group grow>
              <div>
                <Text size="xs" c="dimmed">目標BTC</Text>
                <Text size="sm" fw={500}>{formatBtc(goal.targetBtc)} BTC</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">現在BTC</Text>
                <Text size="sm" fw={500}>{formatBtc(currentBtc)} BTC</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">期限</Text>
                <Text size="sm" fw={500}>
                  {goal.deadline.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}
                </Text>
              </div>
            </Group>
          </Stack>
        </Card>

        {/* Goal Settings Modal */}
        <GoalSettingsModal
          opened={settingsModalOpened}
          onClose={() => setSettingsModalOpened(false)}
          currentGoal={goal}
          userId={user?.uid || ''}
          isDemoMode={isDemoMode}
          onGoalUpdated={(updatedGoal) => {
            setGoal(updatedGoal);
            
            if (isDemoMode) {
              // Demo mode - save to localStorage and reload from localStorage
              saveGoalToLocalStorage(updatedGoal);
              const entries = getProgressFromLocalStorage();
              const btcAmount = calculateCurrentBtcFromLocalStorage();
              setRecentEntries(entries.slice(0, 5));
              setCurrentBtc(btcAmount);
            } else {
              // Firebase mode - reload from Firebase
              const loadUserData = async () => {
                const [entries, btcAmount] = await Promise.all([
                  getRecentProgressEntries(user?.uid || '', 5),
                  calculateCurrentBtc(user?.uid || ''),
                ]);
                setRecentEntries(entries);
                setCurrentBtc(btcAmount);
              };
              loadUserData();
            }
          }}
        />
      </Stack>
    </Container>
  );
}