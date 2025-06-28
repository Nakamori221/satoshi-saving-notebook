'use client';

import { useState } from 'react';
import {
  Modal,
  Stack,
  Title,
  NumberInput,
  Button,
  Group,
  Text,
  Alert,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconTarget, IconCalendar, IconCoin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { UserGoal } from '@/types';
import { saveUserGoal } from '@/lib/firestore';
import { saveGoalToLocalStorage } from '@/lib/localStorage';

interface GoalSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  currentGoal: UserGoal | null;
  userId: string;
  isDemoMode?: boolean;
  onGoalUpdated: (goal: UserGoal) => void;
}

export default function GoalSettingsModal({
  opened,
  onClose,
  currentGoal,
  userId,
  isDemoMode = false,
  onGoalUpdated,
}: GoalSettingsModalProps) {
  const [targetBtc, setTargetBtc] = useState(currentGoal?.targetBtc || 0.1);
  const [deadline, setDeadline] = useState<Date | null>(
    currentGoal?.deadline || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
  );
  const [deadlineString, setDeadlineString] = useState<string>(
    deadline?.toISOString().split('T')[0] || ''
  );
  const [startBtc, setStartBtc] = useState(currentGoal?.startBtc || 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!deadline) {
      notifications.show({
        title: 'エラー',
        message: '期限を設定してください',
        color: 'red',
      });
      return;
    }

    if (targetBtc <= 0) {
      notifications.show({
        title: 'エラー',
        message: '目標BTC額は0より大きい値を設定してください',
        color: 'red',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedGoal: UserGoal = {
        targetBtc,
        deadline,
        startBtc,
        createdAt: currentGoal?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (isDemoMode) {
        // Demo mode - save to localStorage
        saveGoalToLocalStorage(updatedGoal);
      } else {
        // Firebase mode - save to Firestore
        const goalData: Partial<UserGoal> = {
          targetBtc,
          deadline,
          startBtc,
        };
        await saveUserGoal(userId, goalData);
      }

      onGoalUpdated(updatedGoal);
      onClose();

      notifications.show({
        title: '✅ 設定を保存しました',
        message: '目標が更新されました',
        color: 'green',
      });
    } catch (error) {
      console.error('Error saving goal:', error);
      notifications.show({
        title: 'エラー',
        message: '設定の保存に失敗しました',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconTarget size={20} />
          <Title order={3}>目標設定</Title>
        </Group>
      }
      size="md"
    >
      <Stack gap="md">
        <Alert color="blue" variant="light">
          ビットコイン積立の目標を設定してください
        </Alert>

        <NumberInput
          label="目標BTC額"
          description="達成したいBTC量を入力してください"
          value={targetBtc}
          onChange={(value) => setTargetBtc(Number(value) || 0)}
          min={0}
          max={10}
          step={0.01}
          decimalScale={8}
          leftSection={<IconCoin size={16} />}
          suffix=" BTC"
        />

        <DateInput
          label="達成期限"
          description="目標を達成したい日付を選択してください"
          value={deadlineString}
          onChange={(value: string | null) => {
            setDeadlineString(value || '');
            setDeadline(value ? new Date(value) : null);
          }}
          leftSection={<IconCalendar size={16} />}
          minDate={new Date().toISOString().split('T')[0]}
        />

        <NumberInput
          label="開始時BTC額"
          description="既に保有しているBTC量（任意）"
          value={startBtc}
          onChange={(value) => setStartBtc(Number(value) || 0)}
          min={0}
          step={0.01}
          decimalScale={8}
          leftSection={<IconCoin size={16} />}
          suffix=" BTC"
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave} loading={isSaving} color="teal">
            保存
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 