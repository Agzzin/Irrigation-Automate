import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import EmailLoginScreen from '../screens/EmailLoginScreen';
import RNBootSplash from 'react-native-bootsplash';
import SignUpScreen from '../screens/SignUpScreen';
import {useEffect} from 'react';
import InitialPage from '../screens/InitialPageScreen';
import ZonesScreen from '../screens/ZonesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SmsScreen from '../screens/oAuthSmsScreen';
import BottomTabs from './BottomTabs';
import SmsConfirmScreen from '../screens/oAuthSmsConfScreen'
import ResetPasswordPage from '../screens/ResetPassword';
import EnterNewPasswordPage from '../screens/EnterNewPassword'
import AccounRecoveryScreen from '../screens/AccountRecovery';
import CheckEmailScreen from '../screens/CheckEmailScreen';
import CreateNewPasswordScreen from '../screens/CreateNewPasswordScreen';
import PersonalizedSchedulesScreen from '../screens/PersonalizedSchedulesScreen';

const Stack = createNativeStackNavigator();

const Routes = () => {
  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="BottomTabs"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name='CreateNewPassword' component={CreateNewPasswordScreen}/>
      <Stack.Screen name='PersonalizedSchedules' component={PersonalizedSchedulesScreen}/>
      <Stack.Screen name='EnterPassword' component={EnterNewPasswordPage}/>
      <Stack.Screen name='CheckEmail' component={CheckEmailScreen}/>
      <Stack.Screen name='AccountRecovery' component={AccounRecoveryScreen}/>
      <Stack.Screen name='ResetPassword' component={ResetPasswordPage}/>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="EmailLoginScreen" component={EmailLoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="InitialPage" component={InitialPage} />
      <Stack.Screen name="ZonesPage" component={ZonesScreen} />
      <Stack.Screen name="HistoryPage" component={HistoryScreen} />
      <Stack.Screen name="SettingsPage" component={SettingsScreen} />
      <Stack.Screen name="SmsPage" component={SmsScreen} />
      <Stack.Screen name="SmsPageConfirm" component={SmsConfirmScreen} />
    </Stack.Navigator>
  );
};

export default Routes;
