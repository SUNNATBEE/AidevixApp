import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';

const SubscriptionScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Obuna bo'lish</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Videolarni ko'rish uchun Telegram va Instagram kanallarimizga obuna bo'lishingiz kerak.
      </Text>

      <View style={styles.step}>
        <Ionicons name="logo-telegram" size={32} color="#0088cc" />
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>1-qadam: Telegram</Text>
          <Button 
            title="Kanalga qo'shilish" 
            onPress={() => Linking.openURL('https://t.me/aidevix')} 
            size="small"
            style={styles.stepButton}
          />
        </View>
      </View>

      <View style={styles.step}>
        <Ionicons name="logo-instagram" size={32} color="#e1306c" />
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>2-qadam: Instagram</Text>
          <Button 
            title="Obuna bo'lish" 
            onPress={() => Linking.openURL('https://instagram.com/aidevix.uz')} 
            size="small"
            variant="secondary"
            style={styles.stepButton}
          />
        </View>
      </View>

      <Button title="Tasdiqlash" onPress={() => {}} style={{ marginTop: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
  },
  stepContent: {
    flex: 1,
    marginLeft: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepButton: {
    alignSelf: 'flex-start',
  },
});

export default SubscriptionScreen;
