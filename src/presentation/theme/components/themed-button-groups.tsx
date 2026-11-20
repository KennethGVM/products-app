import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/use-theme';

interface Props {
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
}

const ThemedButtonGroup = ({ options, selectedOptions, onSelect }: Props) => {
  const { primary } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[
            styles.button,
            selectedOptions.includes(option) && {
              backgroundColor: primary,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOptions.includes(option) && styles.selectedButtonText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ThemedButtonGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 56,
    marginVertical: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  buttonText: {
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#FFF',
  },
});
