import { createElement, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
export const BRAND_TITLE_GAP = 38;
const HEADLINE = colors.ink;
const MUTED = '#3A3A3E';
const PLACEHOLDER = '#9AA0A6';
const FIELD_BG = colors.field;
const LINE = '#E8EAED';
const ERROR = '#D92D20';
const LOGO_ASPECT = 3171 / 369;

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'kx-auth-input-reset';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      input, textarea, input:focus, input:focus-visible, textarea:focus, textarea:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        border: 0 !important;
        background: transparent !important;
        -webkit-appearance: none !important;
        appearance: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

const DARK = colors.ink;

const PERSON_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.4 19c.9-3.4 3.4-5.2 6.6-5.2s5.7 1.8 6.6 5.2"/></svg>`;
const MAIL_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7.5 12 13l7.5-5.5"/></svg>`;
const LOCK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>`;
const EYE_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 12S6.4 6.8 12 6.8 21.2 12 21.2 12 17.6 17.2 12 17.2 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.4"/></svg>`;
const EYE_OFF_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16"/><path d="M10.6 7.1A6.9 6.9 0 0 1 12 6.8c5.6 0 9.2 5.2 9.2 5.2a17 17 0 0 1-3.3 3.4M6.6 8.4A16 16 0 0 0 2.8 12S6.4 17.2 12 17.2c1 0 2-.2 2.8-.5"/><path d="M9.9 9.9a2.4 2.4 0 0 0 3.4 3.4"/></svg>`;
const GOOGLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-4.1 5.6-7.6 6.5l6.3 5.3C36.9 41.3 44 36 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>';
const FACEBOOK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.4 19.2v-6.6h2.2l.3-2.3h-2.5V8.8c0-.7.2-1.1 1.2-1.1H16V5.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2v2.3h2v6.6h3.3z"/></svg>';

type SubmitHandler = () => void | Promise<void>;

// ---------- validation ----------

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isIndianMobile(value: string): boolean {
  const compact = value.replace(/[\s()-]/g, '');
  if (!/^\+?\d+$/.test(compact)) return false;
  let digits = compact.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits);
}

function validateIdentifier(raw: string, strict: boolean): string | null {
  const value = raw.trim();
  if (!value) return strict ? 'Enter your email or phone number' : null;
  if (/[a-zA-Z@]/.test(value)) {
    if (isEmail(value)) return null;
    const domain = value.split('@')[1] ?? '';
    if (!strict && (!value.includes('@') || !domain.includes('.'))) return null;
    return 'Enter a valid email address';
  }
  if (isIndianMobile(value)) return null;
  const digits = value.replace(/\D/g, '');
  if (!strict && digits.length < 10) return null;
  return 'Enter a valid 10-digit mobile number';
}

function validateLoginPassword(raw: string, strict: boolean): string | null {
  if (!raw) return strict ? 'Enter your password' : null;
  if (raw.length < 6) return 'Use at least 6 characters';
  return null;
}

function validateCreatePassword(raw: string, strict: boolean): string | null {
  if (!raw) return strict ? 'Create a password' : null;
  if (raw.length < 8) return 'Use at least 8 characters';
  if (!/[A-Za-z]/.test(raw) || !/[0-9]/.test(raw)) return 'Include letters and numbers';
  return null;
}

function validateName(raw: string, strict: boolean): string | null {
  const value = raw.trim();
  if (!value) return strict ? 'Enter your full name' : null;
  if (/[0-9]/.test(value)) return 'Name should not contain numbers';
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(value)) return 'Use letters only';
  if (value.length < 2) return strict ? 'Enter your full name' : null;
  return null;
}

function shownError(
  value: string,
  blurred: boolean,
  submitted: boolean,
  validate: (raw: string, strict: boolean) => string | null,
): string | null {
  return validate(value, blurred || submitted);
}

// ---------- primitives ----------

function SvgIcon({ svg, size }: { svg: string; size: number }) {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (Platform.OS === 'web') {
    return createElement('img', {
      src: uri,
      width: size,
      height: size,
      alt: '',
      style: { width: size, height: size, display: 'block' },
    });
  }
  return <Image source={{ uri }} style={{ width: size, height: size }} />;
}

export function useBrandType() {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(24, width * 0.1);
  const logoWidth = Math.min(150, Math.max(118, width * 0.36));
  const logoHeight = logoWidth / LOGO_ASPECT;
  const headlineSize = Math.min(42, Math.max(34, width * 0.1));
  const headlineLineHeight = headlineSize * 1.1;
  const contentWidth = width - horizontalPadding * 2;
  const signupHeadlineSize = Math.min(32, Math.max(24, contentWidth / 11.2));
  const signupHeadlineLineHeight = signupHeadlineSize * 1.15;
  const forgotHeadlineSize = Math.min(36, Math.max(26, contentWidth / 9.4));
  const forgotHeadlineLineHeight = forgotHeadlineSize * 1.12;
  return {
    horizontalPadding,
    logoWidth,
    logoHeight,
    headlineSize,
    headlineLineHeight,
    signupHeadlineSize,
    signupHeadlineLineHeight,
    forgotHeadlineSize,
    forgotHeadlineLineHeight,
  };
}

export function AuthHeader({ onBack }: { onBack?: () => void }) {
  const { horizontalPadding, logoWidth, logoHeight } = useBrandType();

  return (
    <View style={[styles.header, { paddingHorizontal: horizontalPadding, minHeight: logoHeight }]}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          style={[styles.backBtn, { left: horizontalPadding, top: 43 + (logoHeight - 36) / 2 }]}
        >
          <Text style={styles.backCaret}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <Image
        source={require('../../../assets/kitchenx-logo-trimmed.png')}
        resizeMode="contain"
        style={{ width: logoWidth, height: logoHeight }}
        accessibilityLabel="KITCHEN X"
      />
    </View>
  );
}

function AuthField({
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  showEye,
  passwordHidden,
  onToggleEye,
  autoComplete,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  testID,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string | null;
  secureTextEntry?: boolean;
  showEye?: boolean;
  passwordHidden?: boolean;
  onToggleEye?: () => void;
  autoComplete?: 'email' | 'password' | 'name' | 'off';
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  returnKeyType?: 'next' | 'done' | 'go';
  onSubmitEditing?: () => void;
  testID?: string;
}) {
  const invalid = Boolean(error);
  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.field, invalid && styles.fieldError]}>
        <SvgIcon svg={icon} size={22} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
          style={styles.input}
        />
        {showEye ? (
          <Pressable
            onPress={onToggleEye}
            accessibilityRole="button"
            accessibilityLabel={passwordHidden ? 'Show password' : 'Hide password'}
            hitSlop={8}
          >
            <SvgIcon svg={passwordHidden ? EYE_OFF_SVG : EYE_SVG} size={22} />
          </Pressable>
        ) : null}
      </View>
      {invalid ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  muted,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  muted?: boolean;
}) {
  const inactive = disabled || loading || muted;
  return (
    <TouchableOpacity
      style={[styles.primaryButton, muted ? styles.primaryMuted : null, !muted && inactive ? styles.primaryButtonDisabled : null]}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.primaryLabel, muted ? styles.primaryMutedLabel : null]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

function SocialButtons({
  pad,
  onGoogle,
  onFacebook,
}: {
  pad: number;
  onGoogle?: () => void;
  onFacebook?: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: pad }}>
      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.orLine} />
      </View>
      <TouchableOpacity onPress={onGoogle} style={styles.socialButton} accessibilityRole="button" accessibilityLabel="Continue with Google">
        <SvgIcon svg={GOOGLE_SVG} size={22} />
        <Text style={styles.socialLabel}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onFacebook} style={styles.socialButton} accessibilityRole="button" accessibilityLabel="Continue with Facebook">
        <SvgIcon svg={FACEBOOK_SVG} size={22} />
        <Text style={styles.socialLabel}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- screens ----------

const COUNTRIES = [
  { code: '+91', name: 'India' },
  { code: '+971', name: 'UAE' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
] as const;

export type MobileDestination = { code: string; national: string; e164: string; masked: string };

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function validateNational(code: string, national: string, strict: boolean): string | null {
  if (!national) return strict ? 'Enter your mobile number' : null;
  if (code === '+91') {
    if (/^[6-9]\d{9}$/.test(national)) return null;
    if (!strict && national.length < 10) return null;
    return 'Enter a valid 10-digit mobile number';
  }
  if (national.length >= 6 && national.length <= 15) return null;
  if (!strict) return null;
  return 'Enter a valid mobile number';
}

function formatDestination(code: string, national: string) {
  if (code === '+91' && national.length === 10) return `${code} ${national.slice(0, 5)} ${national.slice(5)}`;
  return `${code} ${national}`;
}

function IndiaFlag() {
  return (
    <View style={styles.indiaFlag} accessibilityLabel="India">
      <View style={[styles.indiaBand, { backgroundColor: '#FF9933' }]} />
      <View style={[styles.indiaBand, styles.indiaWhite]}>
        <View style={styles.indiaChakra} />
      </View>
      <View style={[styles.indiaBand, { backgroundColor: '#138808' }]} />
    </View>
  );
}

export function LoginScreen({
  onBack,
  onCodeSent,
}: {
  onBack?: () => void;
  onCodeSent?: (destination: MobileDestination) => void;
}) {
  const brand = useBrandType();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const frameWidth = Math.min(windowWidth, 480);
  const naturalHeight = frameWidth * (1024 / 911);
  const heroHeight = Math.round(Math.min(windowHeight - 248, naturalHeight * 1.35));
  const [code, setCode] = useState('+91');
  const [national, setNational] = useState('');
  const [codesOpen, setCodesOpen] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const numberError = validateNational(code, national, blurred || submitted);

  const continueLogin = async () => {
    setSubmitted(true);
    setRequestError(null);
    if (validateNational(code, national, true)) return;
    setSending(true);
    try {
      await requestCustomerOtp(`${code}${national}`);
      onCodeSent?.({ code, national, e164: `${code}${national}`, masked: formatDestination(code, national) });
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Could not send the code. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.root, styles.loginRoot]}>
      <View style={[styles.loginHero, { height: heroHeight }]}>
        <Image
          source={require('../../../assets/login-hero.jpg')}
          resizeMode="cover"
          style={styles.loginPhoto}
          accessibilityLabel="Fresh kitchen ingredients"
        />
        <View style={[styles.loginTop, { paddingHorizontal: brand.horizontalPadding }]}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" hitSlop={12} style={styles.loginBack}>
              <Text style={styles.loginBackMark}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.loginBack} />
          )}
          <Image
            source={require('../../../assets/kitchenx-logo-trimmed.png')}
            resizeMode="contain"
            accessibilityLabel="KITCHEN X"
            style={{ width: brand.logoWidth, height: brand.logoHeight }}
          />
          <View style={styles.loginBack} />
        </View>
        <View style={[styles.loginCopy, { paddingHorizontal: brand.horizontalPadding }]}>
          <Text style={styles.loginHeroTitle}>Fresh Supplies{'\n'}for Growing{'\n'}Businesses</Text>
          <Text style={styles.loginHeroCopy}>Quality ingredients, competitive prices and reliable delivery for your kitchen.</Text>
        </View>
      </View>
      <View style={[styles.loginCard, { paddingHorizontal: brand.horizontalPadding }]}>
        <Text style={styles.loginCardTitle}>Login</Text>
        <Text style={styles.loginCardCopy}>Enter your mobile number to continue.</Text>
        <View style={[styles.loginPhone, numberError ? styles.fieldError : null]}>
          <TouchableOpacity
            style={styles.loginCode}
            onPress={() => setCodesOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel={`Country code ${code}`}
          >
            {code === '+91' ? <IndiaFlag /> : null}
            <Text style={styles.codeText}>{code}</Text>
            <Text style={styles.codeCaret}>▾</Text>
          </TouchableOpacity>
          <View style={styles.loginDivider} />
          <TextInput
            value={national}
            onChangeText={(value) => {
              const next = digitsOnly(value).slice(0, code === '+91' ? 10 : 15);
              setNational(next);
              setRequestError(null);
            }}
            onBlur={() => setBlurred(true)}
            placeholder="10-digit mobile number"
            placeholderTextColor={PLACEHOLDER}
            keyboardType="phone-pad"
            inputMode="tel"
            textContentType="telephoneNumber"
            autoComplete="tel"
            testID="login-mobile"
            style={styles.phoneInput}
          />
        </View>
        {codesOpen ? (
          <View style={styles.codeMenu}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.codeOption}
                onPress={() => {
                  setCode(country.code);
                  setCodesOpen(false);
                }}
              >
                <Text style={styles.codeOptionText}>
                  {country.code} {country.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {numberError ? <Text style={styles.errorText}>{numberError}</Text> : null}
        {requestError ? <Text style={styles.errorText}>{requestError}</Text> : null}
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <PrimaryButton label="Continue" onPress={continueLogin} loading={sending} />
        </View>
      </View>
    </View>
  );
}

// Screen pass-through until an OTP provider is connected. Any 6-digit code continues.
async function requestCustomerOtp(e164: string): Promise<void> {
  void e164;
}

async function verifyCustomerOtp(e164: string, code: string): Promise<void> {
  void e164;
  void code;
}

export function OtpScreen({
  destination,
  onBack,
  onVerified,
  onVerifying,
}: {
  destination: MobileDestination;
  onBack: () => void;
  onVerified: () => void;
  onVerifying: (active: boolean) => void;
}) {
  const brand = useBrandType();
  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const [agreed, setAgreed] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = async () => {
    if (busy) return;
    if (otp.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setBusy(true);
    setShowVerify(true);
    setError(null);
    onVerifying(true);
    try {
      await verifyCustomerOtp(destination.e164, otp);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code could not be verified. Try again.');
      setBusy(false);
      setShowVerify(false);
      onVerifying(false);
    }
  };

  if (showVerify) return <VerifyingScreen onBack={onBack} />;

  const resend = async () => {
    if (seconds > 0 || busy) return;
    setBusy(true);
    setError(null);
    try {
      await requestCustomerOtp(destination.e164);
      setSeconds(120);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <View style={[styles.form, { paddingHorizontal: brand.horizontalPadding }]}>
        <Text style={[styles.headline, styles.otpTitle, { fontSize: brand.forgotHeadlineSize, lineHeight: brand.forgotHeadlineLineHeight }]}>
          Enter the code
        </Text>
        <View style={styles.sentRow}>
          <Text style={styles.sentText}>Sent to {destination.masked}</Text>
          <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Edit mobile number" hitSlop={8}>
            <Text style={styles.editMark}>✎</Text>
          </TouchableOpacity>
        </View>
        <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow} accessibilityRole="none">
          {Array.from({ length: 6 }, (_, index) => (
            <View key={index} style={[styles.otpCell, otp.length === index ? styles.otpCellOn : null]}>
              <Text style={styles.otpDigit}>{otp[index] ?? ''}</Text>
            </View>
          ))}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={(value) => {
              setOtp(digitsOnly(value).slice(0, 6));
              setError(null);
            }}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={6}
            caretHidden
            testID="login-otp"
            style={styles.otpCapture}
          />
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.timer}>{`${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}</Text>
        <Text style={styles.resendLine}>
          Didn't receive the OTP?{' '}
          <Text
            style={[styles.link, seconds > 0 || busy ? styles.resendOff : null]}
            onPress={resend}
            accessibilityRole="button"
          >
            Resend now
          </Text>
        </Text>
        <Pressable style={styles.consentRow} onPress={() => setAgreed((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }}>
          <View style={[styles.checkbox, agreed && styles.checkboxOn]}>{agreed ? <Text style={styles.checkTick}>✓</Text> : null}</View>
          <Text style={styles.termsText}>
            I agree to KitchenX <Text style={styles.link}>terms & conditions</Text>
          </Text>
        </Pressable>
        <Pressable style={styles.consentRow} onPress={() => setWhatsapp((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: whatsapp }}>
          <View style={[styles.checkbox, whatsapp && styles.checkboxOn]}>{whatsapp ? <Text style={styles.checkTick}>✓</Text> : null}</View>
          <Text style={styles.termsText}>Send me offers and updates on WhatsApp</Text>
        </Pressable>
        <View style={{ marginTop: 18 }}>
          <PrimaryButton label="Verify" onPress={verify} loading={busy} muted={otp.length !== 6} />
        </View>
      </View>
    </View>
  );
}

function VerifySpinner() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.verifySpin} accessibilityLabel="Verifying">
      <View style={styles.verifyRing} />
      <Animated.View style={[styles.verifyArc, { transform: [{ rotate }] }]} />
    </View>
  );
}

export function VerifyingScreen({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack ?? (() => undefined)} />
      <View style={styles.verifyBody}>
        <VerifySpinner />
        <Text style={styles.verifyTitle}>Verifying your code...</Text>
        <Text style={styles.verifyCopy}>Please wait while we verify your number.</Text>
      </View>
    </View>
  );
}

export function CreateAccountScreen({
  onBack,
  onLogin,
  onGoogle,
  onFacebook,
  onSuccess,
}: {
  onBack: () => void;
  onLogin: () => void;
  onGoogle?: () => void;
  onFacebook?: () => void;
  onSuccess?: SubmitHandler;
}) {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [blurred, setBlurred] = useState({ name: false, id: false, pw: false });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mark = (key: 'name' | 'id' | 'pw') => setBlurred((current) => ({ ...current, [key]: true }));

  const nameError = shownError(name, blurred.name, submitted, validateName);
  const idError = shownError(identifier, blurred.id, submitted, validateIdentifier);
  const pwError = shownError(password, blurred.pw, submitted, validateCreatePassword);
  const termsError = submitted && !agreed ? 'Please accept the Terms to continue' : null;

  const canSubmit =
    !validateName(name, true) &&
    !validateIdentifier(identifier, true) &&
    !validateCreatePassword(password, true) &&
    agreed &&
    !submitting;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      await onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  const brand = useBrandType();

  return (
    <View style={styles.root}>
      <View>
        <AuthHeader onBack={onBack} />
        <Text
          numberOfLines={1}
          style={[
            styles.headline,
            {
              fontSize: brand.signupHeadlineSize,
              lineHeight: brand.signupHeadlineLineHeight,
              paddingHorizontal: brand.horizontalPadding,
            },
          ]}
        >
          Create an account
        </Text>
        <Text style={[styles.subtext, { paddingHorizontal: brand.horizontalPadding }]}>
          Join thousands of food businesses on KitchenX.
        </Text>
      </View>

      <View style={[styles.form, { paddingHorizontal: brand.horizontalPadding }]}>
        <AuthField
          icon={PERSON_SVG}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          onBlur={() => mark('name')}
          error={nameError}
          autoComplete="name"
          returnKeyType="next"
          testID="signup-name"
        />
        <AuthField
          icon={MAIL_SVG}
          placeholder="Email or phone number"
          value={identifier}
          onChangeText={setIdentifier}
          onBlur={() => mark('id')}
          error={idError}
          autoComplete="email"
          keyboardType="default"
          returnKeyType="next"
          testID="signup-identifier"
        />
        <AuthField
          icon={LOCK_SVG}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => mark('pw')}
          error={pwError}
          secureTextEntry={hidePassword}
          showEye
          passwordHidden={hidePassword}
          onToggleEye={() => setHidePassword((value) => !value)}
          autoComplete="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          testID="signup-password"
        />
        <Pressable
          style={styles.termsRow}
          onPress={() => setAgreed((value) => !value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxOn, termsError && !agreed && styles.checkboxError]}>
            {agreed ? <Text style={styles.checkTick}>✓</Text> : null}
          </View>
          <View style={styles.termsTextWrap}>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.link}>Terms of Use</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
            {termsError ? <Text style={styles.errorText}>Please accept the Terms to continue</Text> : null}
          </View>
        </Pressable>
        <PrimaryButton label="Create account" onPress={handleSubmit} loading={submitting} />
      </View>

      <SocialButtons pad={brand.horizontalPadding} onGoogle={onGoogle} onFacebook={onFacebook} />

      <View style={[styles.footer, { paddingHorizontal: brand.horizontalPadding }]}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={onLogin} accessibilityRole="button" accessibilityLabel="Login">
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ForgotPasswordScreen({ onBack, onSent }: { onBack: () => void; onSent: () => void }) {
  const brand = useBrandType();
  const [identifier, setIdentifier] = useState('');
  const [blurred, setBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const error = shownError(identifier, blurred, submitted, validateIdentifier);

  const handleSend = async () => {
    setSubmitted(true);
    if (validateIdentifier(identifier, true)) return;
    try {
      setSending(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSent();
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.root}>
      <View>
        <AuthHeader onBack={onBack} />
        <Text
          numberOfLines={1}
          style={[
            styles.headline,
            {
              fontSize: brand.forgotHeadlineSize,
              lineHeight: brand.forgotHeadlineLineHeight,
              paddingHorizontal: brand.horizontalPadding,
            },
          ]}
        >
          Forgot Password?
        </Text>
        <Text style={[styles.subtext, { paddingHorizontal: brand.horizontalPadding }]}>
          No worries! Enter your email or phone number and we'll send you a link to reset your password.
        </Text>
      </View>

      <View style={[styles.form, { paddingHorizontal: brand.horizontalPadding }]}>
        <AuthField
          icon={PERSON_SVG}
          placeholder="Email or phone number"
          value={identifier}
          onChangeText={setIdentifier}
          onBlur={() => setBlurred(true)}
          error={error}
          autoComplete="email"
          returnKeyType="go"
          onSubmitEditing={handleSend}
          testID="forgot-identifier"
        />
        <PrimaryButton label="Send reset link" onPress={handleSend} loading={sending} />
      </View>

      <View style={styles.forgotBottom}>
        <View style={styles.forgotLine} />
        <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to Login" style={styles.forgotBack}>
          <Text style={styles.forgotBackText}>‹   Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const RESET_COPY = {
  email: {
    title: 'Check your email',
    body: "We've sent a password reset link to your email address. Please check your inbox and follow the instructions.",
    resend: 'Resend email',
    artLabel: 'Open reset link',
  },
  sms: {
    title: 'Check your SMS',
    body: "We've sent a password reset code to your phone number. Please check your messages and follow the instructions.",
    resend: 'Resend SMS',
    artLabel: 'Open reset code',
  },
} as const;

const MAIL_ASPECT = 749 / 1378;
const SMS_ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 210" fill="none"><rect x="34" y="22" width="176" height="132" rx="30" fill="#FF4F18"/><path d="M86 154l16 32 10-32" fill="#FF4F18"/><rect x="62" y="58" width="120" height="12" rx="6" fill="#fff"/><rect x="62" y="84" width="96" height="12" rx="6" fill="#fff" opacity="0.78"/><rect x="62" y="110" width="72" height="12" rx="6" fill="#fff" opacity="0.55"/><circle cx="198" cy="136" r="40" fill="#22C55E"/><path d="M180 136l12 14 26-30" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function useResendCountdown(start = 58) {
  const [seconds, setSeconds] = useState(start);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return { seconds, restart: () => setSeconds(start) };
}

function BackToLogin({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel="Back to Login" style={styles.forgotBack}>
      <Text style={styles.forgotBackText}>‹   Back to Login</Text>
    </TouchableOpacity>
  );
}

export function CheckResetScreen({
  channel,
  onBack,
  onLogin,
  onOpenLink,
}: {
  channel: 'email' | 'sms';
  onBack: () => void;
  onLogin: () => void;
  onOpenLink: () => void;
}) {
  const brand = useBrandType();
  const { width } = useWindowDimensions();
  const copy = RESET_COPY[channel];
  const { seconds, restart } = useResendCountdown();
  const artWidth = Math.min(280, width * 0.74);
  const artHeight = channel === 'email' ? artWidth * MAIL_ASPECT : artWidth * 0.75;
  const resendLabel = seconds > 0 ? `${copy.resend} (${seconds}s)` : copy.resend;

  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <View style={[styles.checkBody, { paddingHorizontal: brand.horizontalPadding }]}>
        <TouchableOpacity onPress={onOpenLink} accessibilityRole="button" accessibilityLabel={copy.artLabel}>
          {channel === 'email' ? (
            <Image
              source={require('../../../assets/reset-mail.png')}
              resizeMode="contain"
              style={[styles.checkArt, { width: artWidth, height: artHeight }]}
            />
          ) : (
            <Image
              source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SMS_ART)}` }}
              resizeMode="contain"
              style={{ width: artWidth, height: artHeight }}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.checkTitle, { fontSize: brand.forgotHeadlineSize, lineHeight: brand.forgotHeadlineLineHeight }]}>
          {copy.title}
        </Text>
        <Text style={styles.checkBodyText}>{copy.body}</Text>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={seconds > 0 ? undefined : restart}
          accessibilityRole="button"
          accessibilityLabel={resendLabel}
          accessibilityState={{ disabled: seconds > 0 }}
        >
          <Text style={styles.outlineLabel}>{resendLabel}</Text>
        </TouchableOpacity>
        <BackToLogin onPress={onLogin} />
      </View>
    </View>
  );
}

function passwordRules(password: string) {
  return {
    length: password.length >= 8,
    mix: /[A-Za-z]/.test(password) && /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function RuleRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={[styles.ruleMark, ok && styles.ruleMarkOn]}>{ok ? <Text style={styles.ruleTick}>✓</Text> : null}</View>
      <Text style={[styles.ruleLabel, ok && styles.ruleLabelOn]}>{label}</Text>
    </View>
  );
}

export function NewPasswordScreen({
  onBack,
  onLogin,
  onSuccess,
}: {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const brand = useBrandType();
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [blurredConfirm, setBlurredConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const rules = passwordRules(password);
  const rulesMet = rules.length && rules.mix && rules.special;
  const confirmError =
    !confirm && !(blurredConfirm || submitted)
      ? null
      : !confirm
        ? 'Confirm your new password'
        : confirm !== password
          ? 'Passwords do not match'
          : null;
  const titleSize = Math.min(28, Math.max(22, (width - brand.horizontalPadding * 2) / 12.4));

  const handleReset = () => {
    setSubmitted(true);
    if (!rulesMet || confirm !== password || !confirm) return;
    onSuccess();
  };

  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <View style={[styles.form, styles.resetForm, { paddingHorizontal: brand.horizontalPadding }]}>
        <Text style={[styles.headline, styles.resetTitle, { fontSize: titleSize, lineHeight: titleSize * 1.15 }]}>
          Create a new password
        </Text>
        <Text style={styles.subtext}>Your new password must be different from previous passwords.</Text>
        <View style={styles.resetFields}>
          <AuthField
            icon={PERSON_SVG}
            placeholder="New password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            showEye
            passwordHidden={hidePassword}
            onToggleEye={() => setHidePassword((value) => !value)}
            autoComplete="password"
            testID="new-password"
          />
          <AuthField
            icon={LOCK_SVG}
            placeholder="Confirm new password"
            value={confirm}
            onChangeText={setConfirm}
            onBlur={() => setBlurredConfirm(true)}
            error={confirmError}
            secureTextEntry={hideConfirm}
            showEye
            passwordHidden={hideConfirm}
            onToggleEye={() => setHideConfirm((value) => !value)}
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={handleReset}
            testID="confirm-password"
          />
        </View>
        <View style={styles.ruleCard}>
          <Text style={styles.ruleTitle}>Password must contain:</Text>
          <RuleRow ok={rules.length} label="At least 8 characters" />
          <RuleRow ok={rules.mix} label="One letter and one number" />
          <RuleRow ok={rules.special} label="One special character (e.g. !@#)" />
        </View>
        <PrimaryButton label="Reset Password" onPress={handleReset} />
        <View style={styles.resetBack}>
          <BackToLogin onPress={onLogin} />
        </View>
      </View>
    </View>
  );
}

export function ResetSuccessScreen({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const brand = useBrandType();
  const { width } = useWindowDimensions();
  const art = Math.min(168, width * 0.4);

  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <View style={[styles.checkBody, styles.successBody, { paddingHorizontal: brand.horizontalPadding }]}>
        <Image
          source={require('../../../assets/reset-success.png')}
          resizeMode="contain"
          style={{ width: art, height: art }}
          accessibilityLabel="Password reset successful"
        />
        <Text style={[styles.checkTitle, { fontSize: brand.forgotHeadlineSize, lineHeight: brand.forgotHeadlineLineHeight }]}>
          {'Password reset\nsuccessful!'}
        </Text>
        <Text style={styles.checkBodyText}>
          Your password has been updated. You can now log in using your new password.
        </Text>
        <View style={styles.successButton}>
          <PrimaryButton label="Back to Login" onPress={onLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 43,
  },
  backBtn: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCaret: {
    fontSize: 32,
    lineHeight: 32,
    color: HEADLINE,
    fontWeight: '300',
    marginTop: -4,
  },
  headline: {
    marginTop: BRAND_TITLE_GAP,
    fontWeight: '800',
    color: HEADLINE,
    letterSpacing: -0.5,
  },
  subtext: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: MUTED,
  },
  form: {
    marginTop: 22,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  field: {
    height: 56,
    borderRadius: 16,
    backgroundColor: FIELD_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fieldError: {
    borderColor: ERROR,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: HEADLINE,
    paddingVertical: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        boxShadow: 'none',
      } as object,
      default: {},
    }),
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    color: ERROR,
    fontWeight: '500',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 18,
  },
  link: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryMuted: {
    backgroundColor: '#E8EAEE',
  },
  primaryMutedLabel: {
    color: '#98A2B3',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
    marginBottom: 14,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
  },
  orText: {
    color: MUTED,
    fontSize: 14,
  },
  socialButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  socialLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: HEADLINE,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.4,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  checkboxOn: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  checkboxError: {
    borderColor: ERROR,
  },
  checkTick: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  termsTextWrap: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: MUTED,
  },
  forgotBottom: {
    marginTop: 'auto',
    paddingBottom: 28,
  },
  forgotLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
    marginBottom: 22,
  },
  forgotBack: {
    alignItems: 'center',
  },
  forgotBackText: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '700',
  },
  checkBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  successBody: {
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  successButton: {
    alignSelf: 'stretch',
  },
  checkArt: {
    ...Platform.select({
      web: { filter: 'drop-shadow(0 14px 18px rgba(255, 79, 24, 0.16))' },
      default: {},
    }),
  },
  checkTitle: {
    marginTop: 8,
    fontWeight: '800',
    color: HEADLINE,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  checkBodyText: {
    marginTop: 10,
    marginBottom: 22,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: MUTED,
    textAlign: 'center',
  },
  outlineButton: {
    alignSelf: 'stretch',
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: ORANGE,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  outlineLabel: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '700',
  },
  resetTitle: {
    marginTop: 28,
  },
  resetForm: {
    flex: 1,
  },
  resetBack: {
    marginTop: 'auto',
    paddingTop: 28,
    paddingBottom: 8,
  },
  resetFields: {
    marginTop: 18,
  },
  ruleCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    marginBottom: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  ruleMark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleMarkOn: {
    backgroundColor: '#22A06B',
    borderColor: '#22A06B',
  },
  ruleTick: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  ruleLabel: {
    fontSize: 14,
    color: '#98A2B3',
    fontWeight: '500',
  },
  ruleLabelOn: {
    color: '#178A57',
  },
  phoneSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  codeField: {
    height: 56,
    borderRadius: 16,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  numberField: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: FIELD_BG,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700',
    color: HEADLINE,
  },
  codeCaret: {
    fontSize: 12,
    color: MUTED,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: HEADLINE,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      web: { outlineStyle: 'none', outlineWidth: 0, boxShadow: 'none' } as object,
      default: {},
    }),
  },
  codeMenu: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: LINE,
  },
  codeOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  codeOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: HEADLINE,
  },
  otpTitle: {
    marginTop: BRAND_TITLE_GAP + 60,
  },
  sentRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: MUTED,
  },
  editMark: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '700',
  },
  timer: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: HEADLINE,
  },
  resendLine: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
  },
  resendOff: {
    color: '#C4C4C4',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
  },
  otpRow: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  otpCell: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: FIELD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellOn: {
    borderWidth: 1.5,
    borderColor: ORANGE,
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '700',
    color: HEADLINE,
  },
  otpCapture: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
    color: 'transparent',
  },
  verifyLogo: {
    alignItems: 'center',
    paddingTop: 43,
  },
  verifySpin: {
    width: 76,
    height: 76,
  },
  verifyRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: '#F6D2C6',
  },
  verifyArc: {
    ...StyleSheet.absoluteFill,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: 'transparent',
    borderTopColor: colors.orange,
  },
  verifyBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  verifyTitle: {
    marginTop: 22,
    fontSize: 28,
    fontWeight: '800',
    color: HEADLINE,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  verifyCopy: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: MUTED,
    textAlign: 'center',
  },
  loginRoot: {
    paddingBottom: 0,
    backgroundColor: colors.ink,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  loginHero: {
    overflow: 'hidden',
  },
  loginPhoto: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  loginCopy: {
    marginTop: 18,
  },
  loginTop: {
    paddingTop: 18,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginBack: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBackMark: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '300',
    marginTop: -4,
  },
  loginHeroTitle: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  loginHeroCopy: {
    marginTop: 10,
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    maxWidth: 300,
  },
  loginCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingTop: 22,
    paddingBottom: 20,
  },
  loginPhone: {
    height: 56,
    borderRadius: 16,
    backgroundColor: FIELD_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  loginCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loginDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#D0D5DD',
    marginHorizontal: 12,
  },
  indiaFlag: {
    width: 22,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  indiaBand: {
    flex: 1,
  },
  indiaWhite: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indiaChakra: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#000080',
  },
  loginCardTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.ink,
  },
  loginCardCopy: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: MUTED,
  },
});
