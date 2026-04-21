import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

const Loader = ({ fullScreen, size = 'large', color }: LoaderProps) => {
  const { colors } = useTheme();

  const containerStyle = fullScreen ? styles.fullScreen : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor: fullScreen ? colors.background : 'transparent' }]}>
      <ActivityIndicator size={size} color={color || colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
