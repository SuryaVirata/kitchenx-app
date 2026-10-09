import { Image, Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

/**
 * Second screen in the startup flow (shown automatically after the splash
 * screen - see App.tsx). First slide of a welcome/intro carousel; the
 * pagination dots below reflect that more slides are coming, but only this
 * first slide's copy and asset exist right now, so it's static rather than
 * a working carousel.
 *
 * Background photo is the real approved asset
 * D:\Prototype\Mobile App\assets\welcome 1.png, pre-cropped to start ~30%
 * down (onboarding-welcome-1-tall-crop.png) so the produce box is biased
 * toward being visible rather than centered out of frame. Fills
 * imageSection as a true full-cover background (position:absolute +
 * explicit 100% width/height - the same `<img>`-is-a-replaced-element fix
 * used on the splash screen), with the rounded white nav panel floating on
 * top of its bottom edge.
 *
 * Tried using the FULL uncropped photo with plain `resizeMode="cover"`
 * first - resizeMode="cover" centers its crop by default, and on this very
 * tall source image (869x1810) that crops out the produce box entirely
 * (it sits well below center), leaving only blurred sky visible. Confirmed
 * by screenshot, not assumed. The pre-crop biases the visible window
 * toward the box without needing a manual scale/offset hack - an earlier
 * version tried `height: '245%'` + `bottom: 20` on the full image instead,
 * which also worked but fights the image's own aspect ratio rather than
 * just covering a correctly-framed source.
 *
 * Headline font size and other key metrics scale with screen width rather
 * than being fixed, but the scaling range is anchored to fontSize 44 at
 * ~393px width specifically because that value was verified by direct
 * pixel-measurement against the design reference (not guessed) to match
 * its proportions - see WelcomeScreen git history / KNOWLEDGE-TRANSFER.md
 * bug #10 for the measurement method.
 *
 * Skip and the arrow button are not wired to anything yet - there is no
 * next screen or route to send them to.
 */

const ORANGE = '#FF4F18';
const HEADLINE_COLOR = '#17171A';
const SUBTEXT_COLOR = '#6B7280';
// Sampled directly from the photo's own top-edge pixels (not a guess) -
// they're close to white but not pure #FFFFFF. Using pure white behind the
// text block created a visible seam where the photo begins.
const PAGE_BACKGROUND = '#F5F6F8';

export function WelcomeScreen() {
  const { width } = useWindowDimensions();

  const horizontalPadding = Math.max(24, width * 0.1);
  // Anchored at fontSize 44 for width 393 (393 * 0.112 = 44.0), the
  // pixel-measured value - not an arbitrary cap like 38 would be.
  const headlineSize = Math.min(48, Math.max(36, width * 0.112));
  const headlineLineHeight = headlineSize * 1.136; // matches the verified 44/50 ratio
  const logoWidth = Math.min(130, Math.max(100, width * 0.3));
  const logoHeight = logoWidth / (3171 / 369);

  return (
    <View style={styles.root}>
      <View style={[styles.topRow, { paddingHorizontal: horizontalPadding }]}>
        <Image
          source={require('../../assets/kitchenx-logo-trimmed.png')}
          resizeMode="contain"
          style={{ width: logoWidth, height: logoHeight }}
          accessibilityLabel="KITCHEN X"
        />
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Skip">
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.textBlock, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineLineHeight }]}>
          Everything{'\n'}
          your kitchen{'\n'}
          needs,{'\n'}
          <Text style={styles.headlineAccent}>one reliable{'\n'}source.</Text>
        </Text>
        <Text style={styles.subtext}>Quality ingredients at wholesale prices for your food business.</Text>
      </View>

      <View style={styles.imageSection}>
        <Image
          source={require('../../assets/onboarding-welcome-1-tall-crop.png')}
          resizeMode="cover"
          style={styles.image}
        />
        {/* The two white shapes (body + bulge) live inside one wrapper so a
            single wrapper-level shadow traces their merged union outline,
            not two overlapping per-shape shadows that'd show a visible
            seam where they meet. Native shadow props are used on iOS/Android
            and CSS box-shadow is used on web; the shapes themselves carry
            no shadow of their own. */}
        <View style={styles.navWrapper}>
          <View style={styles.navBulge} />
          <View style={styles.navBody}>
            <View style={styles.dots}>
              <View style={styles.dotActive} />
              <View style={styles.dotB} />
              <View style={styles.dotC} />
              <View style={styles.dotD} />
            </View>
          </View>
        </View>
        {/* Orange button + arrow sit above the wrapper, outside its
            shadow pass, so the orange disc doesn't get its own shadow. */}
        <TouchableOpacity style={styles.nextButton} accessibilityRole="button" accessibilityLabel="Next">
          <View style={styles.arrowShaft} />
          <View style={styles.arrowHeadTop} />
          <View style={styles.arrowHeadBottom} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 46,
  },
  skip: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  textBlock: {
    paddingTop: 18,
    paddingBottom: 8,
  },
  headline: {
    fontWeight: '800',
    color: HEADLINE_COLOR,
    letterSpacing: -0.4,
  },
  headlineAccent: {
    color: ORANGE,
  },
  subtext: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: SUBTEXT_COLOR,
  },
  imageSection: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    // Pinned to all four edges AND given explicit 100% width/height -
    // verified on the splash screen that an `<img>` (a CSS "replaced
    // element") does not stretch via position:absolute inset alone.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // Wrapper for the merged body+bulge silhouette. Shadow goes here, so
  // the two child shapes read as one blob under one soft upward glow -
  // not two per-shape shadows meeting with a visible seam.
  navWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 18px rgba(20, 20, 19, 0.22)',
      },
      default: {
        shadowColor: '#141413',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },
  navBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
  },
  // 80px white disc, centre ~50px in from the right edge, breaking ~13px
  // above the body's top. Fused seamlessly with the body (same white, no
  // border) so it reads as a bulge in the top edge, not a separate disc.
  navBulge: {
    position: 'absolute',
    right: 10,
    bottom: 13,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
  },
  // Spec: four dots at sizes 10/9/9/8 with 9px gaps, first is orange
  // (slightly elongated as a pill), rest are a soft warm-grey progression.
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  dotActive: {
    width: 22,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4571B',
  },
  dotB: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#DAD8D4' },
  dotC: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#DFDDD9' },
  dotD: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E3E1DD' },

  // 62px orange button, concentric with the 80px bulge above (bulge right:
  // 10, button right: 19 - difference 9px gives the 9px white ring the
  // spec calls for; same relationship vertically).
  nextButton: {
    position: 'absolute',
    right: 19,
    bottom: 22,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F4571B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stroke arrow built from three thin Views (not an emoji glyph): a
  // horizontal shaft plus two angled bars for the chevron head. Thin
  // (1.6px) and white, matching the spec.
  arrowShaft: {
    position: 'absolute',
    width: 20,
    height: 1.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    left: (62 - 20) / 2,
    top: (62 - 1.6) / 2,
  },
  arrowHeadTop: {
    position: 'absolute',
    width: 10,
    height: 1.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    right: 18,
    top: 24,
    transform: [{ rotate: '45deg' }],
  },
  arrowHeadBottom: {
    position: 'absolute',
    width: 10,
    height: 1.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    right: 18,
    bottom: 24,
    transform: [{ rotate: '-45deg' }],
  },
});
