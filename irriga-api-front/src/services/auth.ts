import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthToken = {
  async set(token: string) {
    await AsyncStorage.setItem('jwt', token);
  },
  async get() {
    return AsyncStorage.getItem('jwt');
  },
  async remove() {
    await AsyncStorage.removeItem('jwt');
  },
};

