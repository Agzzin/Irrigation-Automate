import React, { useEffect } from 'react';
import { Linking, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';

const AuthCallbackScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleUrl = (url: string) => {
      const tokenMatch = url.match(/[?&]token=([^&]+)/);
      if (tokenMatch) {
        const token = decodeURIComponent(tokenMatch[1]);
        AsyncStorage.setItem('jwt', token).then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTabs' }],
          });
        });
      } else {
        navigation.navigate('WelcomeScreen');
      }
    };

    const getUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleUrl(url);
    };

    const listener = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    getUrl();
    return () => {
      listener.remove();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#00CB21" />
    </View>
  );
};

export default AuthCallbackScreen;