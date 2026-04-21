import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface StreakCounterProps {
  count: number;
  size?: 'small' | 'large';
}

const StreakCounter = ({ count, size = 'small' }: StreakCounterProps) => {
  const { colors, spacing } = useTheme();
  
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.largeContainer]}>
      <Ionicons 
        name="flame" 
        size={isLarge ? 80 : 24} 
        color={colors.accent} 
      />
      <View style={styles.textContainer}>
        <Text style={[
          styles.count, 
          { color: colors.text, fontSize: isLarge ? 32 : 18 }
        ]}>
          {count}
        </Text>
        {isLarge && (
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            KUNLIK STREAK
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  smallFire: {
    width: 30,
    height: 30,
  },
  largeFire: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
  },
  count: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default StreakCounter;
