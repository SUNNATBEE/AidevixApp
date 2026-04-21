import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { Ionicons } from '@expo/vector-icons';

const FocusModeScreen = () => {
  const { colors, spacing } = useTheme();
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      triggerHaptic('success');
      // Reward XP here
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    triggerHaptic('medium');
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(25 * 60);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Focus Mode</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Deep work sessiyasini boshlang
      </Text>

      <View style={[styles.timerContainer, { borderColor: colors.primary }]}>
        <Text style={[styles.timer, { color: colors.text }]}>{formatTime(seconds)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={toggleTimer}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={32} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
          <Text style={{ color: colors.textSecondary }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Ionicons name="flash" size={24} color={colors.accent} />
        <Text style={[styles.cardText, { color: colors.text }]}>
          Sessiya tugashiga +20 XP olasiz
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
  },
  timerContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    marginLeft: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: '100%',
  },
  cardText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FocusModeScreen;
