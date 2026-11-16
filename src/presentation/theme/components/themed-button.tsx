import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { Fonts } from '@/constants/theme';
import { useTheme } from '../hooks/use-theme';

interface Props extends PressableProps {
  children: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedButton = ({ children, icon, style, ...rest }: Props) => {
  const { primary } = useTheme();

  return (
    <Pressable
      {...rest}
      style={({ pressed, hovered }) => [
        { backgroundColor: pressed ? primary + '90' : primary },
        styles.button,
        typeof style === 'function' ? style({ pressed, hovered }) : style,
      ]}
    >
      <Text style={{ color: 'white', fontFamily: Fonts.sans }}>{children}</Text>
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color="white"
          style={{ marginHorizontal: 5 }}
        />
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
