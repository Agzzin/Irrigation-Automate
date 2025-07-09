import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/routes';
import {AuthProvider} from './src/contexts/AuthContext';
import { ZonesProvider } from './src/contexts/ZonesContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ZonesProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </ZonesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
