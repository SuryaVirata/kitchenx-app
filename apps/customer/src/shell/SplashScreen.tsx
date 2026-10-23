import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/theme';
import { Text } from '../ui/Text';

/**
 * Brand orange between matching white caps at the top and bottom.
 * The wordmark is the existing logo, shown white. The tagline is two lines.
 * The logo eases up into place. The fade out of this screen lives in the root layout.
 */

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
            backgroundColor: colors.orange,
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 100%)',
          } as object,
        ]}
      />
    );
  }

  const steps = 16;
  return (
    <View style={[frame, { backgroundColor: colors.orange }]}>
      {Array.from({ length: steps }, (_, index) => {
        const t = index / (steps - 1);
        const opacity = (1 - t) * 0.2;
        return <View key={index} style={{ flex: 1, backgroundColor: `rgba(255,255,255,${opacity.toFixed(3)})` }} />;
      })}
    </View>
  );
}

export function SplashScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const cap = Math.max(36, Math.round(screenHeight * 0.045));
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
      <OrangeField top={cap} bottom={cap} />
      <View style={[styles.content, { top: cap, bottom: cap }]}>
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
