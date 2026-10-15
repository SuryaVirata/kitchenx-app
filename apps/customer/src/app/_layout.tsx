import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { fontRole } from '../theme/theme';
import { SplashScreen } from '../shell/SplashScreen';
import { CustomerSessionProvider } from '../shell/CustomerSession';
import { AppRouterProvider, useAppRouter } from '../shell/AppRouter';
import { SplashReadyProvider, useSetSplashReady } from '../shell/SplashReady';
import LoginRoute from './(auth)/login';
import OtpRoute from './(auth)/otp';
import BusinessRoute from './(onboarding)/business';
import NeedsRoute from './(onboarding)/needs';
import LocationRoute from './(onboarding)/location';
import ShopRoute from './(shop)/shop';
import DeliveryRoute from './(shop)/delivery';

const SPLASH_DURATION_MS = 2500;
const SPLASH_FADE_DURATION_MS = 500;

export default function RootLayout() {
  const [fontsReady] = useFonts({
    [fontRole.body]: Inter_400Regular,
    [fontRole.heading]: Inter_700Bold,
  });
  if (!fontsReady) return null;
  return (
    <CustomerSessionProvider>
      <SplashReadyProvider>
        <AppRouterProvider>
          <RootShell />
        </AppRouterProvider>
      </SplashReadyProvider>
    </CustomerSessionProvider>
  );
}

function RootShell() {
  const { href } = useAppRouter();
  const setSplashReady = useSetSplashReady();
  const [splashOverlayVisible, setSplashOverlayVisible] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: SPLASH_FADE_DURATION_MS,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setSplashOverlayVisible(false);
          setSplashReady(true);
        }
      });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [setSplashReady, splashOpacity]);

  return (
    <View style={styles.root}>
        {href === '/' || href === '/login' ? <LoginRoute /> : null}
      {href === '/otp' ? <OtpRoute /> : null}
      {href === '/business' ? <BusinessRoute /> : null}
      {href === '/needs' ? <NeedsRoute /> : null}
      {href === '/location' ? <LocationRoute /> : null}
      {href === '/shop' ? <ShopRoute /> : null}
      {href === '/delivery' ? <DeliveryRoute /> : null}
      {splashOverlayVisible ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.splashOverlay, { opacity: splashOpacity }]}>
          <SplashScreen />
        </Animated.View>
      ) : null}
      <StatusBar style={splashOverlayVisible ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  splashOverlay: { backgroundColor: '#FFFFFF' },
});
