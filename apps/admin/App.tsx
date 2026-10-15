import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/shell/SplashScreen';
import { WelcomeScreen } from './src/shell/WelcomeScreen';
import {
  CheckResetScreen,
  ForgotPasswordScreen,
  LoginScreen,
  NewPasswordScreen,
  ResetSuccessScreen,
} from './src/features/auth/AuthScreens';
import { AdminDashboard } from './src/features/home/AdminDashboard';

type AppScreen = 'welcome' | 'login' | 'forgot' | 'check' | 'newPassword' | 'resetSuccess' | 'home';

const SPLASH_DURATION_MS = 2500;
const SPLASH_FADE_DURATION_MS = 500;
const ORANGE = '#FF4F18';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [splashOverlayVisible, setSplashOverlayVisible] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  const signIn = () => setScreen('home');

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: SPLASH_FADE_DURATION_MS,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) setSplashOverlayVisible(false);
      });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [splashOpacity]);

  return (
    <>
      {screen === 'welcome' ? (
        <WelcomeScreen
          ready={!splashOverlayVisible}
          onSkip={() => setScreen('login')}
          onFinished={() => setScreen('login')}
        />
      ) : screen === 'login' ? (
        <LoginScreen
          onBack={() => setScreen('welcome')}
          onForgotPassword={() => setScreen('forgot')}
          onGoogle={signIn}
          onFacebook={signIn}
          onSuccess={signIn}
        />
      ) : screen === 'forgot' ? (
        <ForgotPasswordScreen onBack={() => setScreen('login')} onSent={() => setScreen('check')} />
      ) : screen === 'check' ? (
        <CheckResetScreen
          channel="email"
          onBack={() => setScreen('forgot')}
          onLogin={() => setScreen('login')}
          onOpenLink={() => setScreen('newPassword')}
        />
      ) : screen === 'newPassword' ? (
        <NewPasswordScreen
          onBack={() => setScreen('check')}
          onLogin={() => setScreen('login')}
          onSuccess={() => setScreen('resetSuccess')}
        />
      ) : screen === 'resetSuccess' ? (
        <ResetSuccessScreen onBack={() => setScreen('login')} onLogin={() => setScreen('login')} />
      ) : (
        <AdminDashboard />
      )}
      {splashOverlayVisible && (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.splashOverlay, { opacity: splashOpacity, pointerEvents: 'none' }]}
        >
          <SplashScreen />
        </Animated.View>
      )}
      <StatusBar style={splashOverlayVisible ? 'light' : 'dark'} />
    </>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    backgroundColor: ORANGE,
  },
});
