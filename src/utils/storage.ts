import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'aidevix_token';
const REFRESH_TOKEN_KEY = 'aidevix_refresh_token';

export const storage = {
  async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
  async setRefreshToken(token: string) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  async getRefreshToken() {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async clearTokens() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
  async setItem(key: string, value: any) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async getItem(key: string) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  }
};
