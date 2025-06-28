'use client';

import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { IconCoin, IconTarget, IconCalendar } from '@tabler/icons-react';
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

interface SavingsCalculatorProps {
  targetBtc?: number;
  deadline?: Date;
  initialBtc?: number;
}

export default function SavingsCalculator({
  targetBtc = 0.1,
  deadline = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years from now
  initialBtc = 0,
}: SavingsCalculatorProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(9800000);
  const [currentBtc, setCurrentBtc] = useState<number>(initialBtc);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(0);
  const [memo, setMemo] = useState<string>('');
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);

  // Auto-fetch price on component mount
  useEffect(() => {
    handlePriceUpdate();
  }, []);

  // Calculate values
  const monthsLeft = getMonthsDifference(new Date(), deadline);
  const requiredMonthlyAmount = getRequiredMonthlyAmount(currentPrice, targetBtc, currentBtc, monthsLeft);
  const requiredWeeklyAmount = getRequiredWeeklyAmount(requiredMonthlyAmount);
  const achievementRate = getAchievementRate(currentBtc, targetBtc);
  const remainingSats = getRemainingSats(targetBtc, currentBtc);
  const estimatedCompletion = getEstimatedCompletionDate(currentBtc, targetBtc, monthlyDeposit, currentPrice);
  const badgeColor = getBadgeColor(achievementRate);

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

  const handleDepositAdd = () => {
    if (monthlyDeposit > 0) {
      const btcPurchased = monthlyDeposit / currentPrice;
      setCurrentBtc(prev => prev + btcPurchased);
      setMonthlyDeposit(0);
      setMemo('');
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Title order={1} ta="center" c="teal">
          さとし貯金ノート
        </Title>

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
            <Title order={3}>入力</Title>
            
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
                  label="今月積立額 (JPY)"
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
                  color="teal"
                >
                  積立記録を追加
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Goal Summary */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={4}>目標サマリー</Title>
            <Divider />
            <Group justify="space-between">
              <Text size="sm">目標BTC:</Text>
              <Text size="sm" fw={500}>{formatBtc(targetBtc)} BTC</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">現在BTC:</Text>
              <Text size="sm" fw={500}>{formatBtc(currentBtc)} BTC</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">期限:</Text>
              <Text size="sm" fw={500}>
                {deadline.toLocaleDateString('ja-JP')}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">残り期間:</Text>
              <Text size="sm" fw={500}>{monthsLeft.toFixed(1)}ヶ月</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}