import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen'
import EmailLoginScreen from '../screens/EmailLoginScreen';
import RNBootSplash from "react-native-bootsplash";
import SignUpScreen from '../screens/SignUpScreen';
import { useEffect } from "react";
import InitialPage from '../screens/InitialPageScreen';
import ProgrammingScreen from '../screens/ProgrammingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Stack = createNativeStackNavigator();

const Routes = () => {
    
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <Stack.Navigator initialRouteName="SettingsPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name='EmailLoginScreen' component={EmailLoginScreen} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
      <Stack.Screen name='InitialPage' component={InitialPage} />
      <Stack.Screen name='ProgrammingPage' component={ProgrammingScreen}/>
      <Stack.Screen name='HistoryPage' component={HistoryScreen}/>
      <Stack.Screen name='SettingsPage' component={SettingsScreen}/>
    </Stack.Navigator>
  );
};

export default Routes;
