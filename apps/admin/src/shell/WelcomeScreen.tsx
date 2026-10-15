import { useEffect, useState, type ReactNode } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

/**
 * Welcome carousel after splash. Flow is splash → page 1 → 2 → 3 → 4.
 * Each page advances automatically after a short dwell, or sooner if the
 * next button is tapped. Pages 2–4 share the same photo+text position.
 */

const ORANGE = '#FF4F18';
const HEADLINE_COLOR = '#17171A';
const SUBTEXT_COLOR = '#3A3A3E';
const PAGE_BACKGROUND = '#FFFFFF';
const WELCOME_PHOTO_1_ASPECT = 1810 / 869;
const WELCOME_PHOTO_4_ASPECT = 1024 / 1536;
const LOGO_ASPECT = 3171 / 369;
const CONTROL_CLEARANCE = 32;
const SLIDE_COUNT = 4;
const DOT_COUNT = 4;
const SLIDE_DWELL_MS = 3500;

function EdgeFade({ edge, height }: { edge: 'top' | 'bottom'; height: number }) {
  const gradient =
    edge === 'bottom'
      ? 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.55) 72%, #FFFFFF 92%, #FFFFFF 100%)'
      : 'linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)';

  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.fadeBase,
          { height, [edge]: 0 },
          { backgroundImage: gradient } as { backgroundImage: string },
        ]}
      />
    );
  }

  const steps = 12;
  return (
    <View pointerEvents="none" style={[styles.fadeBase, { height, [edge]: 0 }]}>
      {Array.from({ length: steps }, (_, i) => {
        const t = i / (steps - 1);
        const opacity = edge === 'bottom' ? t ** 1.4 : (1 - t) ** 1.4;
        return <View key={i} style={{ flex: 1, backgroundColor: `rgba(255,255,255,${opacity})` }} />;
      })}
    </View>
  );
}

const NEXT_ARROW =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1.4 10H22"/><path d="M14 3.2 22 10 14 16.8"/></svg>';

function NextArrow() {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(NEXT_ARROW)}`;
  return <Image source={{ uri }} style={styles.arrow} />;
}

function WelcomeDots({ active }: { active: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <View key={i} style={i === active ? styles.dotActive : i === 2 ? styles.dotC : i === 3 ? styles.dotD : styles.dotB} />
      ))}
    </View>
  );
}

function WelcomeHeader({
  logoWidth,
  logoHeight,
  horizontalPadding,
  onSkip,
}: {
  logoWidth: number;
  logoHeight: number;
  horizontalPadding: number;
  onSkip?: () => void;
}) {
  return (
    <View style={[styles.topRow, { paddingHorizontal: horizontalPadding }]}>
      <Image
        source={require('../../assets/kitchenx-logo-trimmed.png')}
        resizeMode="contain"
        style={{ width: logoWidth, height: logoHeight }}
        accessibilityLabel="KITCHEN X"
      />
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Skip" onPress={onSkip}>
        <Text style={styles.skip}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

function WelcomePage1({
  width,
  headlineSize,
  headlineLineHeight,
  horizontalPadding,
}: {
  width: number;
  headlineSize: number;
  headlineLineHeight: number;
  horizontalPadding: number;
}) {
  const photoHeight = width * WELCOME_PHOTO_1_ASPECT;

  return (
    <View style={styles.page}>
      <View style={[styles.textBlock, { paddingHorizontal: horizontalPadding }]}>
        <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineLineHeight }]}>
          Manage{'\n'}
          your business{'\n'}
          <Text style={styles.headlineAccent}>with confidence.</Text>
        </Text>
        <Text style={styles.subtext}>
          {'Procurement, inventory, orders\nand finance — all in one place\nfor your team.'}
        </Text>
      </View>

      <View style={styles.imageSection}>
        <Image
          source={require('../../assets/onboarding-welcome-1.png')}
          resizeMode="cover"
          style={[styles.image, { width, height: photoHeight }]}
        />
        <EdgeFade edge="top" height={64} />
        <EdgeFade edge="bottom" height={118} />
      </View>
    </View>
  );
}

function WelcomePhotoSlide({
  width,
  headlineSize,
  headlineLineHeight,
  horizontalPadding,
  photo,
  photoAspect,
  photoLabel,
  headline,
  subtext,
  framed,
  footer,
}: {
  width: number;
  headlineSize: number;
  headlineLineHeight: number;
  horizontalPadding: number;
  photo: number;
  photoAspect: number;
  photoLabel: string;
  headline: string;
  subtext: string;
  framed?: boolean;
  footer?: ReactNode;
}) {
  const photoWidth = width * 1.22;
  const photoHeight = photoWidth * photoAspect;

  if (framed) {
    return (
      <View style={[styles.page, styles.framedPage]}>
        <View style={[styles.frameGrow, { marginHorizontal: width * 0.06 }]}>
          <Image source={photo} resizeMode="cover" style={styles.frameImage} accessibilityLabel={photoLabel} />
        </View>
        <View style={[styles.photoSlideText, { paddingHorizontal: horizontalPadding }]}>
          <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineLineHeight }]}>{headline}</Text>
          <Text style={styles.subtext}>{subtext}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.page, styles.chartPage]}>
      <Image
        source={photo}
        resizeMode="contain"
        style={[styles.photoSlideImage, { width: photoWidth, height: photoHeight }]}
        accessibilityLabel={photoLabel}
      />
      <View style={[styles.photoSlideText, { paddingHorizontal: horizontalPadding, alignSelf: 'stretch' }]}>
        <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineLineHeight }]}>{headline}</Text>
        <Text style={styles.subtext}>{subtext}</Text>
        {footer}
      </View>
    </View>
  );
}

export function WelcomeScreen({
  ready = false,
  onSkip,
  onFinished,
}: {
  ready?: boolean;
  onSkip?: () => void;
  onFinished?: () => void;
}) {
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);

  const horizontalPadding = Math.max(24, width * 0.1);
  const headlineSize = Math.min(42, Math.max(34, width * 0.1));
  const headlineLineHeight = headlineSize * 1.1;
  const logoWidth = Math.min(150, Math.max(118, width * 0.36));
  const logoHeight = logoWidth / LOGO_ASPECT;

  const goNext = () => {
    if (slide >= SLIDE_COUNT - 1) {
      onFinished?.();
      return;
    }
    setSlide((current) => current + 1);
  };

  useEffect(() => {
    if (!ready || slide >= SLIDE_COUNT - 1) return;
    const timer = setTimeout(goNext, SLIDE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [ready, slide]);

  return (
    <View style={styles.root}>
      <WelcomeHeader logoWidth={logoWidth} logoHeight={logoHeight} horizontalPadding={horizontalPadding} onSkip={onSkip} />
      {slide === 0 ? (
        <WelcomePage1
          width={width}
          headlineSize={headlineSize}
          headlineLineHeight={headlineLineHeight}
          horizontalPadding={horizontalPadding}
        />
      ) : slide === 1 ? (
        <WelcomePhotoSlide
          width={width}
          headlineSize={headlineSize}
          headlineLineHeight={headlineLineHeight}
          horizontalPadding={horizontalPadding}
          photo={require('../../assets/admin-welcome-2.png')}
          photoAspect={1}
          photoLabel="Chef reviewing orders"
          headline={'Streamline\nyour operations.'}
          subtext={'Track orders, manage inventory\nand coordinate deliveries\nefficiently.'}
          framed
        />
      ) : slide === 2 ? (
        <WelcomePhotoSlide
          width={width}
          headlineSize={headlineSize}
          headlineLineHeight={headlineLineHeight}
          horizontalPadding={horizontalPadding}
          photo={require('../../assets/admin-welcome-3.png')}
          photoAspect={1}
          photoLabel="Warehouse stock check"
          headline={'Better control,\nlower costs.'}
          subtext={'Real-time stock, smarter\nprocurement and complete\nvisibility.'}
          framed
        />
      ) : (
        <WelcomePhotoSlide
          width={width}
          headlineSize={headlineSize}
          headlineLineHeight={headlineLineHeight}
          horizontalPadding={horizontalPadding}
          photo={require('../../assets/admin-welcome-4.png')}
          photoAspect={WELCOME_PHOTO_4_ASPECT}
          photoLabel="Business insights"
          headline={'Data-driven\ndecisions.'}
          subtext={'Get insights on purchases,\ninventory, expenses and\nteam performance.'}
          footer={
            <TouchableOpacity
              style={styles.getStarted}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
              onPress={goNext}
            >
              <Text style={styles.getStartedLabel}>Get Started</Text>
            </TouchableOpacity>
          }
        />
      )}

      {slide < SLIDE_COUNT - 1 ? (
        <View style={styles.controls}>
          <WelcomeDots active={slide} />
          <TouchableOpacity
            style={styles.nextButton}
            accessibilityRole="button"
            accessibilityLabel="Next"
            onPress={goNext}
          >
            <NextArrow />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  page: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 43,
  },
  skip: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  textBlock: {
    paddingTop: 38,
    paddingBottom: 4,
  },
  framedPage: {
    paddingTop: 10,
    paddingBottom: 96,
  },
  frameGrow: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#F4F5F7',
    minHeight: 220,
  },
  chartPage: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  frameImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  photoSlideBlock: {
    paddingBottom: 0,
  },
  photoSlideHero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSlideImage: {
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 16px 28px rgba(20, 20, 19, 0.12))',
      },
      default: {
        shadowColor: '#141413',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 6,
      },
    }),
  },
  photoSlideText: {
    paddingTop: 22,
  },
  headline: {
    fontWeight: '800',
    color: HEADLINE_COLOR,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: ORANGE,
  },
  subtext: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: SUBTEXT_COLOR,
  },
  imageSection: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    left: 0,
    bottom: CONTROL_CLEARANCE,
  },
  fadeBase: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 10,
  },
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
  nextButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F4571B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 30,
    height: 21,
  },
  getStarted: {
    marginTop: 22,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F4571B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
