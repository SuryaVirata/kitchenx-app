import { Image, Platform, StyleSheet, Text, View } from 'react-native';

const ORANGE = '#FF4F18';
const LOGO_ASPECT = 3171 / 369;

export function SplashScreen() {
  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/kitchenx-logo-white.png')}
        resizeMode="contain"
        style={styles.logo}
        accessibilityLabel="KITCHEN X"
      />
      <Text style={styles.tagline}>
        Smarter Procurement.{'\n'}Instant Credit.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(ellipse at 50% 42%, #FF7340 0%, #FF4F18 52%, #F03C09 100%)',
      },
      default: {},
    }),
  },
  logo: {
    width: 232,
    height: 232 / LOGO_ASPECT,
  },
  tagline: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.94)',
    textAlign: 'center',
  },
});
