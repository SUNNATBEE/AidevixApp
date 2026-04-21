import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextInputProps 
} from 'react-native';
import { useTheme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({ 
  label, 
  error, 
  containerStyle, 
  leftIcon, 
  rightIcon, 
  style,
  ...props 
}: InputProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors.card, 
          borderColor: error ? colors.error : colors.border,
          paddingHorizontal: spacing.md
        }
      ]}>
        {leftIcon}
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.text,
              fontSize: typography.sizes.md,
            },
            style
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon}
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
