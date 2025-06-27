import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/routes';
import {AuthProvider} from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
