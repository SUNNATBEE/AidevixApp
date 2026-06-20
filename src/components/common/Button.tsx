import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const { colors, spacing, typography, radii } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      // Minimal "tinted" tugma — yengil fon, asosiy rangli matn
      case 'secondary':
        return { backgroundColor: colors.primarySoft };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: colors.error };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#ffffff';
    }
  };

  // Izchil balandlik minimal uslubning asosiy belgisi
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { minHeight: 40, paddingHorizontal: spacing.lg };
      case 'large':
        return { minHeight: 56, paddingHorizontal: spacing.xxxl };
      default:
        return { minHeight: 48, paddingHorizontal: spacing.xl };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        { borderRadius: radii.md, gap: spacing.sm },
        getVariantStyles(),
        getSizeStyles(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: typography.sizes[size === 'small' ? 'sm' : 'md'] },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
