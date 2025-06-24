 /* eslint-disable */
  'use client';

  import { useEffect, useState } from 'react';
  import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from     
   'firebase/auth';
  import { auth } from '@/lib/firebase';
  import {
    Container,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Stack,
    Tabs,
    LoadingOverlay,
    Alert
  } from '@mantine/core';
  import { IconMail, IconLock, IconInfoCircle } from '@tabler/icons-react';

  interface AuthWrapperProps {
    children: React.ReactNode;
  }

  export default function AuthWrapper({ children }: AuthWrapperProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
      setAuthLoading(true);
      setError('');

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: unknown) {
        const firebaseError = error as { code: string };
        setError(getErrorMessage(firebaseError.code));
      } finally {
        setAuthLoading(false);
      }
    };

    const handleSignUp = async () => {
      setAuthLoading(true);
      setError('');

      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error: unknown) {
        const firebaseError = error as { code: string };
        setError(getErrorMessage(firebaseError.code));
      } finally {
        setAuthLoading(false);
      }
    };

    const handleSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Sign out error:', error);
      }
    };

    const getErrorMessage = (errorCode: string): string => {
      switch (errorCode) {
        case 'auth/user-not-found':
          return 'このメールアドレスのアカウントが見つかりません';
        case 'auth/wrong-password':
          return 'パスワードが正しくありません';
        case 'auth/email-already-in-use':
          return 'このメールアドレスは既に使用されています';
        case 'auth/weak-password':
          return 'パスワードは6文字以上で設定してください';
        case 'auth/invalid-email':
          return 'メールアドレスの形式が正しくありません';
        case 'auth/too-many-requests':
          return 'ログイン試行回数が上限に達しました。しばらく待ってから再試行してください';
        default:
          return 'エラーが発生しました。もう一度お試しください';
      }
    };

    if (loading) {
      return (
        <Container size="sm" py="xl">
          <LoadingOverlay visible />
          <Paper p="xl" radius="md" withBorder>
            <Text ta="center">読み込み中...</Text>
          </Paper>
        </Container>
      );
    }

    if (!user) {
      return (
        <Container size="sm" py="xl">
          <Paper p="xl" radius="md" withBorder>
            <Title order={2} ta="center" mb="md">
              さとし貯金ノート
            </Title>

            <Alert icon={<IconInfoCircle size={16} />} mb="md" color="blue">
              アカウントを作成してデータを安全に保存しましょう
            </Alert>

            <Tabs defaultValue="signin">
              <Tabs.List grow>
                <Tabs.Tab value="signin">ログイン</Tabs.Tab>
                <Tabs.Tab value="signup">新規登録</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="signin" pt="md">
                <Stack gap="md">
                  <TextInput
                    label="メールアドレス"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    leftSection={<IconMail size={16} />}
                    required
                  />
                  <PasswordInput
                    label="パスワード"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    leftSection={<IconLock size={16} />}
                    required
                  />
                  {error && (
                    <Alert color="red" variant="light">
                      {error}
                    </Alert>
                  )}
                  <Button
                    onClick={handleSignIn}
                    loading={authLoading}
                    fullWidth
                    color="teal"
                  >
                    ログイン
                  </Button>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="signup" pt="md">
                <Stack gap="md">
                  <TextInput
                    label="メールアドレス"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    leftSection={<IconMail size={16} />}
                    required
                  />
                  <PasswordInput
                    label="パスワード"
                    placeholder="6文字以上のパスワード"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    leftSection={<IconLock size={16} />}
                    required
                  />
                  {error && (
                    <Alert color="red" variant="light">
                      {error}
                    </Alert>
                  )}
                  <Button
                    onClick={handleSignUp}
                    loading={authLoading}
                    fullWidth
                    color="blue"
                  >
                    アカウント作成
                  </Button>
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Text ta="center" size="sm" c="dimmed" mt="md">
              セキュアな暗号化でデータを保護します
            </Text>
          </Paper>
        </Container>
      );
    }

    return (
      <div>
        <Container fluid p="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:       
  '1rem' }}>
            <Text size="sm" c="dimmed">
              {user.email} でログイン中
            </Text>
            <Button variant="subtle" size="xs" onClick={handleSignOut}>
              ログアウト
            </Button>
          </div>
        </Container>
        {children}
      </div>
    );
  }
