import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors, splashGradient } from '../theme/theme';
import { Text } from '../ui/Text';

/**
 * Orange gradient between a taller white cap and a shorter one.
 * The wordmark is the existing logo, shown white. The tagline is two lines.
 * The logo eases up into place. The fade out of this screen lives in the root layout.
 */

const SPLASH_FILL = `linear-gradient(180deg, ${splashGradient.top} 0%, ${splashGradient.mid} 22%, ${splashGradient.mid} 78%, ${splashGradient.bottom} 100%)`;

function mix(from: string, to: string, t: number) {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  const parts = [0, 1, 2].map((index) => Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * t));
  return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
}

function splashColor(t: number) {
  if (t <= 0.22) return mix(splashGradient.top, splashGradient.mid, t / 0.22);
  if (t >= 0.78) return mix(splashGradient.mid, splashGradient.bottom, (t - 0.78) / 0.22);
  return splashGradient.mid;
}

const LOGO_ASPECT_RATIO = 3171 / 369;
const LOGO_WIDTH_RATIO = 0.72;

const LOGO_SLIDE_DISTANCE = 40;
const LOGO_ANIM_DURATION_MS = 900;

function OrangeField({ top, bottom }: { top: number; bottom: number }) {
  const frame = { position: 'absolute' as const, left: 0, right: 0, top, bottom };
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          frame,
          {
            backgroundColor: splashGradient.mid,
            backgroundImage: SPLASH_FILL,
          } as object,
        ]}
      />
    );
  }

  const steps = 16;
  return (
    <View style={[frame, { backgroundColor: splashGradient.mid }]}>
      {Array.from({ length: steps }, (_, index) => {
        const t = index / (steps - 1);
        return <View key={index} style={{ flex: 1, backgroundColor: splashColor(t) }} />;
      })}
    </View>
  );
}

export function SplashScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const topCap = Math.max(48, Math.round(screenHeight * 0.062));
  const bottomCap = Math.max(20, Math.round(screenHeight * 0.026));
  const frameWidth = screenWidth > 600 ? Math.min(screenWidth, 480) : screenWidth;
  const logoWidth = frameWidth * LOGO_WIDTH_RATIO;
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  const logoOffsetY = useRef(new Animated.Value(LOGO_SLIDE_DISTANCE)).current;
  useEffect(() => {
    const logoAnimation = Animated.timing(logoOffsetY, {
      toValue: 0,
      duration: LOGO_ANIM_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    logoAnimation.start();
    return () => {
      logoAnimation.stop();
    };
  }, [logoOffsetY]);

  return (
    <View style={styles.root}>
      <OrangeField top={topCap} bottom={bottomCap} />
      <View style={[styles.content, { top: topCap, bottom: bottomCap }]}>
        <Animated.View style={[styles.lockup, { transform: [{ translateY: logoOffsetY }] }]}>
          <Image
            source={require('../../assets/kitchenx-logo-trimmed.png')}
            resizeMode="contain"
            tintColor={colors.white}
            accessibilityLabel="KitchenX"
            style={{ width: logoWidth, height: logoHeight }}
          />
          <Text style={styles.tagline}>Smarter Procurement.{'\n'}Instant Credit.</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  lockup: {
    alignItems: 'center',
    width: '100%',
  },
  tagline: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.white,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
