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
} from '@mantine/core';
import { IconCoin, IconTarget, IconCalendar, IconPlus, IconSettings } from '@tabler/icons-react';
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
} from '@/lib/calculations';
import {
  getUserProfile,
  getUserGoal,
  addProgressEntry,
  getRecentProgressEntries,
  calculateCurrentBtc,
  initializeUserData,
} from '@/lib/firestore';
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

  // Load user data
  useEffect(() => {
    // Check for demo mode or auth errors
    if (loading) return;
    
    if (!user && !authError) {
      // Demo mode - use default data
      setGoal({
        targetBtc: 0.1,
        deadline: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
        startBtc: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsLoadingData(false);
      return;
    }

    if (!user) return;

    const loadUserData = async () => {
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
        setGoal({
          targetBtc: 0.1,
          deadline: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
          startBtc: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, [user, loading, authError]);

  const handlePriceUpdate = async () => {
    setIsLoadingPrice(true);
    try {
      const response = await fetch('/api/btc-price');
      const data = await response.json();
      
      if (data.success) {
        setCurrentPrice(data.price);
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
    if (!user || monthlyDeposit <= 0) return;

    setIsSaving(true);
    try {
      // Add progress entry to Firestore
      await addProgressEntry(user.uid, {
        btcPrice: currentPrice,
        depositJpy: monthlyDeposit,
        memo: memo,
      });

      // Update local state
      const btcPurchased = monthlyDeposit / currentPrice;
      setCurrentBtc(prev => prev + btcPurchased);

      // Refresh recent entries
      const updatedEntries = await getRecentProgressEntries(user.uid, 5);
      setRecentEntries(updatedEntries);

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

            {/* Key Metrics */}
            <Grid>
              <Grid.Col span={6}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconTarget size={20} color="orange" />
                    <div>
                      <Text size="xs" c="dimmed">残り</Text>
                      <Text size="lg" fw={700}>
                        {formatSats(remainingSats)} sat
                      </Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconCoin size={20} color="green" />
                    <div>
                      <Text size="xs" c="dimmed">必要月額</Text>
                      <Text size="lg" fw={700}>
                        {formatCurrency(requiredMonthlyAmount)}
                      </Text>
                      <Badge color={badgeColor} size="xs">
                        週額: {formatCurrency(requiredWeeklyAmount)}
                      </Badge>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card padding="sm" radius="sm" withBorder>
                  <Group gap="xs">
                    <IconCalendar size={20} color="blue" />
                    <div>
                      <Text size="xs" c="dimmed">達成予定</Text>
                      <Text size="lg" fw={700}>
                        {estimatedCompletion.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit'
                        })}
                      </Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Input Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>積立記録追加</Title>
            
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="BTC価格 (JPY)"
                  value={currentPrice}
                  onChange={(value) => setCurrentPrice(Number(value) || 0)}
                  thousandSeparator=","
                  hideControls
                  rightSection={
                    <Button 
                      size="xs" 
                      variant="light" 
                      onClick={handlePriceUpdate}
                      loading={isLoadingPrice}
                    >
                      更新
                    </Button>
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
                <Button
                  fullWidth
                  onClick={handleDepositAdd}
                  disabled={monthlyDeposit <= 0}
                  loading={isSaving}
                  color="teal"
                  leftSection={<IconPlus size={16} />}
                >
                  積立記録を保存
                </Button>
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

        {/* Goal Summary */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={4}>目標サマリー</Title>
            <Divider />
            <Group justify="space-between">
              <Text size="sm">目標BTC:</Text>
              <Text size="sm" fw={500}>{formatBtc(goal.targetBtc)} BTC</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">現在BTC:</Text>
              <Text size="sm" fw={500}>{formatBtc(currentBtc)} BTC</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">期限:</Text>
              <Text size="sm" fw={500}>
                {goal.deadline.toLocaleDateString('ja-JP')}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">残り期間:</Text>
              <Text size="sm" fw={500}>{monthsLeft.toFixed(1)}ヶ月</Text>
            </Group>
          </Stack>
        </Card>

        {/* Goal Settings Modal */}
        <GoalSettingsModal
          opened={settingsModalOpened}
          onClose={() => setSettingsModalOpened(false)}
          currentGoal={goal}
          userId={user?.uid || ''}
          onGoalUpdated={(updatedGoal) => {
            setGoal(updatedGoal);
            // Reload data to reflect changes
            const loadUserData = async () => {
              const [entries, btcAmount] = await Promise.all([
                getRecentProgressEntries(user?.uid || '', 5),
                calculateCurrentBtc(user?.uid || ''),
              ]);
              setRecentEntries(entries);
              setCurrentBtc(btcAmount);
            };
            loadUserData();
          }}
        />
      </Stack>
    </Container>
  );
}