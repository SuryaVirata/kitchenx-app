import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/shell/SplashScreen';
import { WelcomeScreen } from './src/shell/WelcomeScreen';
import { LoginScreen, MobileDestination, OtpScreen } from './src/features/auth/AuthScreens';
import { BusinessNeedsScreen, BusinessRegistration, BusinessTypeScreen, LocationScreen, SocialSession } from './src/features/onboarding/OnboardingScreens';
import { ShopFlow } from './src/features/catalogue/ShopScreens';
import { DeliveryLocationFlow } from './src/features/location/DeliveryLocation';

type AppScreen = 'welcome' | 'login' | 'otp' | 'business' | 'needs' | 'location' | 'delivery' | 'shop';

/**
 * Temporary root: renders splash then welcome directly since Expo Router and
 * the rest of the shell's startup gate (restore session → load /me and
 * /config → choose route tree, per src/shell/README.md) are not wired up
 * yet — that's explicitly deferred in PR #1. Once Router lands, this becomes
 * the initial route tree instead of the whole app's render output.
 *
 * Welcome renders underneath from the start and Splash sits over it as a
 * fading overlay, rather than an instant swap at the timeout - an abrupt
 * cut between the two screens read as a jarring jump, not a continuous
 * onboarding flow.
 */

const SPLASH_DURATION_MS = 2500;
const SPLASH_FADE_DURATION_MS = 500;

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [city, setCity] = useState('Hyderabad');
  const [social, setSocial] = useState<SocialSession | null>(null);
  const [destination, setDestination] = useState<MobileDestination | null>(null);
  const [businessType, setBusinessType] = useState<BusinessRegistration | null>(null);
  const [splashOverlayVisible, setSplashOverlayVisible] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#delivery') setScreen('delivery');
    if (window.location.hash === '#business') setScreen('business');
    if (window.location.hash === '#shop') setScreen('shop');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: SPLASH_FADE_DURATION_MS,
        // Deliberately false, not true: measured directly (via the
        // animation's own start/finish timestamps, not a guess) that
        // useNativeDriver: true does not honor the configured duration on
        // this web build - it jumped to ~58% of its target within 20ms
        // regardless of what duration was set. false tracks the
        // configured duration accurately. See KNOWLEDGE-TRANSFER.md bug
        // list before changing this back.
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setSplashOverlayVisible(false);
        }
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
          onCodeSent={(next) => {
            setDestination(next);
            setScreen('otp');
          }}
        />
      ) : screen === 'otp' && destination ? (
        <OtpScreen
          destination={destination}
          onBack={() => setScreen('login')}
          onVerifying={() => undefined}
          onVerified={() => {
            setSocial(null);
            setScreen(businessType ? 'needs' : 'business');
          }}
        />
      ) : screen === 'business' ? (
        <BusinessTypeScreen
          initial={businessType}
          onClose={() => setScreen('login')}
          onContinue={(type) => {
            setBusinessType(type);
            setScreen('needs');
          }}
        />
      ) : screen === 'needs' ? (
        <BusinessNeedsScreen
          social={social}
          onBack={() => setScreen('business')}
          onContinue={() => setScreen('location')}
        />
      ) : screen === 'location' ? (
        <LocationScreen
          social={social}
          onBack={() => setScreen('needs')}
          onContinue={(next) => {
            setCity(next);
            setScreen('shop');
          }}
        />
      ) : screen === 'delivery' ? (
        <DeliveryLocationFlow
          onBack={() => setScreen('shop')}
          onSave={(next) => {
            setCity(next);
            setScreen('shop');
          }}
        />
      ) : (
        <ShopFlow
          city={city}
          onDeliver={() => setScreen('delivery')}
        />
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
  // The splash background asset has some non-fully-opaque pixels in its
  // soft center area (fine when splash only ever sat on a plain page
  // background, but confirmed via screenshot to let Welcome's content
  // ghost through once composited directly over it). An explicit opaque
  // backdrop here keeps the overlay solid until it deliberately fades.
  splashOverlay: {
    backgroundColor: '#FFFFFF',
  },
});
