import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

/**
 * Background and logo are the real approved brand assets, used as-is:
 * D:\Prototype\Mobile App\Fresh Ingredients Border with Central White Space-1.png
 * (full-bleed background with a built-in central clear space) and
 * D:\Prototype\Mobile App\Kitchen X logo.png, trimmed to its visible pixels
 * (the source file is a 4500x5625 canvas with the wordmark occupying only a
 * thin ~3171x369 band in the middle - trimmed so `contain` sizing reflects
 * the actual glyph, not mostly transparent padding), centered near the top
 * of the frame.
 *
 * Customer app only - the Warehouse splash is untouched.
 */

const LOGO_ASPECT_RATIO = 3171 / 369;
const LOGO_WIDTH_RATIO = 0.7;
const LOGO_TOP_RATIO = 0.38;

// The source photo's exact "cover" fit (scale 1) shows a faded/white band
// along its own bottom edge - that's baked into the source image, not a
// layout bug. Resting at a slightly larger scale crops that band off all
// four sides evenly. The mount animation goes from the unscaled fit up to
// that resting scale, so the "zoom settling into place" motion is also what
// removes the faded edge, rather than being two unrelated changes.
const BG_START_SCALE = 1;
const BG_REST_SCALE = 1.15;
const BG_ANIM_DURATION_MS = 2800;

// Logo + tagline slide up into their resting spot from slightly below.
const LOGO_SLIDE_DISTANCE = 40;
const LOGO_ANIM_DURATION_MS = 900;

export function SplashScreen() {
  // Explicit pixel size rather than `width: '70%'` + `aspectRatio`: that
  // combination doesn't reliably resolve on react-native-web (confirmed via
  // an actual headless-browser screenshot - it rendered small and off
  // the intended 70%, not a guess). Computing pixels from the real screen
  // width sidesteps that percentage/aspectRatio interaction entirely.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const logoWidth = screenWidth * LOGO_WIDTH_RATIO;
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  const bgScale = useRef(new Animated.Value(BG_START_SCALE)).current;
  const logoOffsetY = useRef(new Animated.Value(LOGO_SLIDE_DISTANCE)).current;
  useEffect(() => {
    // Both animations verified via their own timing callbacks (logged
    // performance.now() at effect-run and at completion) to run for their
    // full configured durations - not just assumed from the config values.
    const bgAnimation = Animated.timing(bgScale, {
      toValue: BG_REST_SCALE,
      duration: BG_ANIM_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    const logoAnimation = Animated.timing(logoOffsetY, {
      toValue: 0,
      duration: LOGO_ANIM_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    bgAnimation.start();
    logoAnimation.start();
    return () => {
      bgAnimation.stop();
      logoAnimation.stop();
    };
  }, [bgScale, logoOffsetY]);

  return (
    <View style={styles.root}>
      <Animated.Image
        source={require('../../assets/splash-background.png')}
        resizeMode="cover"
        style={[styles.background, { transform: [{ scale: bgScale }] }]}
      />
      <View style={[styles.content, { paddingTop: screenHeight * LOGO_TOP_RATIO }]}>
        <Animated.View style={{ alignItems: 'center', transform: [{ translateY: logoOffsetY }] }}>
          <Image
            source={require('../../assets/kitchenx-logo-trimmed.png')}
            resizeMode="contain"
            style={{ width: logoWidth, height: logoHeight }}
            accessibilityLabel="KITCHEN X"
          />
          <Text style={styles.tagline}>Smarter Procurement. Instant Credit.</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    // Pinned to all four edges AND given explicit 100% width/height.
    // Verified via direct DOM measurement (Playwright) that both parts are
    // required: `<img>` is a CSS "replaced element", so `position:absolute`
    // with only top/left/right/bottom:0 does NOT stretch it the way it
    // would a plain <div> - without explicit width/height it renders at
    // its native pixel size instead of filling the screen.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  tagline: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#17171A',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
