import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useTheme } from '@/presentation/theme/hooks/use-theme';
import { useToastStore } from '@/presentation/toast/store/use-toast-store';
import { StyleSheet, View } from 'react-native';

const ToastHost = () => {
  const message = useToastStore((state) => state.message);
  const { backgroundElement, primary } = useTheme();

  if (!message) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.host}>
      <View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[
          styles.toast,
          { backgroundColor: backgroundElement, borderLeftColor: primary },
        ]}
      >
        <ThemedText>{message}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  toast: {
    position: 'absolute',
    top: 64,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ToastHost;
