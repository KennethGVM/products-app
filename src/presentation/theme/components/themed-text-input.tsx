import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Fonts } from '@/constants/theme';
import { useTheme } from '../hooks/use-theme';

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedTextInput = ({ icon, ...rest }: Props) => {
  const { primary, text } = useTheme();

  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  return (
    <View
      style={{
        ...styles.border,
        borderColor: isActive ? primary : '#ccc',
      }}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={text}
          style={{ marginRight: 10 }}
        />
      )}
      <TextInput
        ref={inputRef}
        placeholderTextColor="#5c5c5c"
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          color: text,
          fontFamily: Fonts.sans,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
