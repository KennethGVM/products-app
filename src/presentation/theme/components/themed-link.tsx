import { Link, type LinkProps } from 'expo-router';
import { Fonts } from '@/constants/theme';
import { useTheme } from '../hooks/use-theme';

const ThemedLink = ({ children, style, ...rest }: LinkProps) => {
  const { primary } = useTheme();

  return (
    <Link
      {...rest}
      style={[{ color: primary, fontFamily: Fonts.sans }, style]}
    >
      {children}
    </Link>
  );
};

export default ThemedLink;
