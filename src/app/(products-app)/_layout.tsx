import LogoutIconButton from '@/presentation/auth/components/LogoutIconButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useTheme } from '@/presentation/theme/hooks/use-theme';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const { background } = useTheme();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (status === 'checking') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: background },
        contentStyle: { backgroundColor: background },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: 'Productos',
          headerLeft: () => <LogoutIconButton />,
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
