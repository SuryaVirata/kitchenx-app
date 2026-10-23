import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { colors, fontRole } from '../theme/theme';
import { SplashScreen } from '../shell/SplashScreen';
import { CustomerSessionProvider } from '../shell/CustomerSession';
import { AppRouterProvider, useAppRouter } from '../shell/AppRouter';
import { SplashReadyProvider, useSetSplashReady } from '../shell/SplashReady';
import LoginRoute from './(auth)/login';
import WelcomeRoute from './index';
import OtpRoute from './(auth)/otp';
import BusinessRoute from './(onboarding)/business';
import ShopRoute from './(shop)/shop';
import DeliveryRoute from './(shop)/delivery';
import SetupRoute from './(onboarding)/setup';
import PanRoute from './(onboarding)/pan';
import GstRoute from './(onboarding)/gst';
import FssaiRoute from './(onboarding)/fssai';
import EditDetailsRoute from './(onboarding)/edit-details';
import EditOutletRoute from './(onboarding)/edit-outlet';

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
        {href === '/' ? <WelcomeRoute /> : null}
        {href === '/login' ? <LoginRoute /> : null}
      {href === '/otp' ? <OtpRoute /> : null}
      {href === '/business' ? <BusinessRoute /> : null}
      {href === '/shop' ? <ShopRoute /> : null}
      {href === '/delivery' ? <DeliveryRoute /> : null}
      {href === '/setup' ? <SetupRoute /> : null}
      {href === '/pan' ? <PanRoute /> : null}
      {href === '/gst' ? <GstRoute /> : null}
      {href === '/fssai' ? <FssaiRoute /> : null}
      {href === '/edit-details' ? <EditDetailsRoute /> : null}
      {href === '/edit-outlet' ? <EditOutletRoute /> : null}
      {splashOverlayVisible ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.splashOverlay, { opacity: splashOpacity }]}>
          <SplashScreen />
        </Animated.View>
      ) : null}
      <StatusBar style={splashOverlayVisible ? 'dark' : href === '/login' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  splashOverlay: { backgroundColor: colors.white },
});
