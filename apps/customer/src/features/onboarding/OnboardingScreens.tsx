import { createElement, ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { AuthHeader, BRAND_TITLE_GAP, useBrandType } from '../auth/AuthScreens';

const ORANGE = '#FF4F18';
const INK = '#17171A';
const MUTED = '#6B7280';
const FIELD = '#F3F4F6';
const BENEFIT = '#1B9E4B';

export type SocialSession = {
  provider: 'Google' | 'Facebook';
  name: string;
  email: string;
};

export type BusinessRegistration = 'registered' | 'unregistered';

const LOGO_ASPECT = 3171 / 369;

function strokeIcon(color: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const DOC_ICON =
  '<path d="M8 3.6h5.1L19 9.4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 7 20V5.1A1.5 1.5 0 0 1 8.5 3.6Z"/><path d="M13 3.8V9.2h5.2"/><path d="M9.4 13h5.4M9.4 16.2h3.6"/>';
const ID_ICON =
  '<rect x="3.6" y="5" width="16.8" height="14" rx="2.2"/><circle cx="9" cy="11" r="1.7"/><path d="M6.5 16.1c.4-1.5 1.45-2.2 2.5-2.2s2.1.7 2.5 2.2"/><path d="M14 10.2h4M14 13.2h3"/>';
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BENEFIT}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`;

const NEEDS = [
  { id: 'produce', title: 'Fresh Produce', subtitle: 'Fruits and vegetables' },
  { id: 'dairy', title: 'Dairy & Eggs', subtitle: 'Milk, butter, cream' },
  { id: 'meat', title: 'Meat & Seafood', subtitle: 'Poultry, meat, fish' },
  { id: 'staples', title: 'Staples & Grains', subtitle: 'Rice, flour, oil' },
  { id: 'drinks', title: 'Beverages', subtitle: 'Tea, coffee, drinks' },
  { id: 'pack', title: 'Packaging', subtitle: 'Boxes, bags, wraps' },
  { id: 'equip', title: 'Kitchen Equipment', subtitle: 'Tools and appliances' },
  { id: 'clean', title: 'Cleaning & Hygiene', subtitle: 'Kitchen sanitation' },
] as const;

const CITIES = [
  { name: 'Hyderabad', pin: '500081' },
  { name: 'Bengaluru', pin: '560001' },
  { name: 'Mumbai', pin: '400001' },
  { name: 'Chennai', pin: '600001' },
];

const CHEVRON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

function Icon({ svg: source, size }: { svg: string; size: number }) {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
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

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items: Array<1 | 2 | 3> = [1, 2, 3];
  return (
    <View style={styles.stepper}>
      {items.map((item, index) => {
        const active = item === step;
        const done = item < step;
        return (
          <View key={item} style={styles.stepChunk}>
            {index > 0 ? <View style={[styles.stepLine, item <= step && styles.stepLineOn]} /> : null}
            <View style={[styles.stepDot, active && styles.stepDotOn, done && styles.stepDotDone]}>
              <Text style={[styles.stepNum, active && styles.stepNumOn, done && styles.stepNumDone]}>{item}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function SignedInBanner({ social }: { social: SocialSession }) {
  return (
    <View style={styles.signedIn}>
      <Text style={styles.signedInText}>
        Signed in with {social.provider} as {social.name} · {social.email}
      </Text>
    </View>
  );
}

function Pairs<T extends { id: string }>({
  items,
  render,
  style,
}: {
  items: readonly T[];
  render: (item: T) => ReactNode;
  style?: object;
}) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += 2) rows.push(items.slice(index, index + 2));
  return (
    <View style={[styles.pairs, style]}>
      {rows.map((pair) => (
        <View key={pair.map((item) => item.id).join('-')} style={styles.pair}>
          <View style={styles.pairCell}>{render(pair[0])}</View>
          <View style={styles.pairCell}>{pair[1] ? render(pair[1]) : null}</View>
        </View>
      ))}
    </View>
  );
}

function OnboardingChrome({
  step,
  social,
  onBack,
  children,
  footer,
}: {
  step: 1 | 2 | 3;
  social?: SocialSession | null;
  onBack: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  const brand = useBrandType();
  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 4 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: BRAND_TITLE_GAP, paddingHorizontal: brand.horizontalPadding }}>
          {social ? <SignedInBanner social={social} /> : null}
          <Stepper step={step} />
          {children}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingHorizontal: brand.horizontalPadding }]}>{footer}</View>
    </View>
  );
}

function ContinueButton({ onPress, flex }: { onPress: () => void; flex?: number }) {
  return (
    <TouchableOpacity
      style={[styles.continue, flex ? { flex } : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Continue"
    >
      <Text style={styles.continueLabel}>Continue</Text>
    </TouchableOpacity>
  );
}

export function BusinessTypeScreen({
  initial,
  onClose,
  onContinue,
}: {
  initial?: BusinessRegistration | null;
  onClose: () => void;
  onContinue: (type: BusinessRegistration) => void | Promise<void>;
}) {
  const { width, height } = useWindowDimensions();
  const pad = 20;
  const art = Math.min(248, width - pad * 2, height < 720 ? 156 : 248);
  const logoWidth = Math.min(176, width * 0.48);
  const [selected, setSelected] = useState<BusinessRegistration | null>(initial ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = (type: BusinessRegistration) => {
    if (saving) return;
    setSelected(type);
    setError(null);
  };

  const submit = () => {
    if (saving || (selected !== 'registered' && selected !== 'unregistered')) return;
    const type = selected;
    setSaving(true);
    setError(null);
    Promise.resolve()
      .then(() => onContinue(type))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not save your business type. Try again.');
        setSaving(false);
      });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.btTop, { paddingHorizontal: pad, paddingTop: Platform.OS === 'web' ? 8 : 44 }]}>
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          style={styles.btClose}
        >
          <Text style={styles.btCloseMark}>×</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.btScroll, { paddingHorizontal: pad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../../assets/business-stall.png')}
          resizeMode="contain"
          accessibilityLabel="KitchenX store"
          style={{ width: art, height: art * (696 / 743), alignSelf: 'center' }}
        />
        <Image
          source={require('../../../assets/kitchenx-logo-trimmed.png')}
          resizeMode="contain"
          accessibilityLabel="KITCHEN X"
          style={{ width: logoWidth, height: logoWidth / LOGO_ASPECT, alignSelf: 'center', marginTop: 8 }}
        />
        <Text style={styles.btHeading}>Select your business type</Text>
        <View accessibilityRole="radiogroup" style={styles.btList}>
          <TypeCard
            title="I have GST or FSSAI"
            subtitle="For registered businesses"
            icon={DOC_ICON}
            selected={selected === 'registered'}
            onPress={() => choose('registered')}
            benefits={[
              'Better prices',
              'Potential eligibility for credit, subject to verification and approval',
            ]}
          />
          <TypeCard
            title="I don’t have GST or FSSAI"
            subtitle="For non-registered businesses"
            icon={ID_ICON}
            selected={selected === 'unregistered'}
            onPress={() => choose('unregistered')}
            benefits={['Easy onboarding (no documents required)']}
          />
        </View>
      </ScrollView>
      <View style={[styles.btFooter, { paddingHorizontal: pad, paddingBottom: Platform.OS === 'web' ? 16 : 28 }]}>
        {error ? <Text style={styles.btError}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.btContinue, !selected && styles.btContinueOff]}
          onPress={submit}
          disabled={!selected || saving}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !selected || saving, busy: saving }}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.btContinueLabel, !selected && styles.btContinueLabelOff]}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TypeCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
  benefits,
}: {
  title: string;
  subtitle: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  benefits: string[];
}) {
  const color = selected ? ORANGE : '#4B5563';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ selected, checked: selected }}
      style={[styles.btCard, selected && styles.btCardOn]}
    >
      <View style={styles.btRow}>
        <Icon svg={strokeIcon(color, icon)} size={22} />
        <View style={styles.btCopy}>
          <Text style={styles.btCardTitle}>{title}</Text>
          <Text style={styles.btCardSub}>{subtitle}</Text>
        </View>
        <View style={[styles.btRadio, selected && styles.btRadioOn]}>{selected ? <View style={styles.btRadioDot} /> : null}</View>
      </View>
      {selected ? (
        <View style={styles.btBenefits}>
          {benefits.map((benefit) => (
            <View key={benefit} style={styles.btBenefit}>
              <Icon svg={CHECK_ICON} size={16} />
              <Text style={styles.btBenefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

export function BusinessNeedsScreen({
  social,
  onBack,
  onContinue,
}: {
  social?: SocialSession | null;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [tried, setTried] = useState(false);

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <OnboardingChrome
      step={2}
      social={social}
      onBack={onBack}
      footer={
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.backButtonLabel}>Back</Text>
          </TouchableOpacity>
          <ContinueButton
            flex={1.45}
            onPress={() => {
              setTried(true);
              if (selected.length === 0) return;
              onContinue();
            }}
          />
        </View>
      }
    >
      <Text style={[styles.title, { fontSize: 28, lineHeight: 36 }]}>
        What do you need{'\n'}for your business?
      </Text>
      <Text style={styles.subtext}>Select all that you usually buy. You can change this later.</Text>
      <Pairs
        items={NEEDS}
        render={(item) => {
          const on = selected.includes(item.id);
          return (
            <Pressable
              onPress={() => toggle(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityState={{ selected: on }}
              style={[styles.needCard, on && styles.needCardOn]}
            >
              <Text style={styles.needTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </Pressable>
          );
        }}
      />
      {tried && selected.length === 0 ? <Text style={styles.fieldErrorText}>Select at least one</Text> : null}
    </OnboardingChrome>
  );
}

export function LocationScreen({
  social,
  onBack,
  onContinue,
}: {
  social?: SocialSession | null;
  onBack: () => void;
  onContinue: (city: string) => void;
}) {
  const brand = useBrandType();
  const { width } = useWindowDimensions();
  const [city, setCity] = useState('Hyderabad');
  const [pin, setPin] = useState('500081');
  const [address, setAddress] = useState('');
  const [open, setOpen] = useState(false);
  const [pinBlurred, setPinBlurred] = useState(false);
  const [pinTried, setPinTried] = useState(false);
  const pinDigits = pin.replace(/\D/g, '');
  const pinInvalid = !/^\d{6}$/.test(pinDigits);
  const pinError = !pinInvalid
    ? null
    : pinTried || pinBlurred
      ? pinDigits
        ? 'Enter a 6-digit pincode'
        : 'Enter your pincode'
      : pinDigits.length >= 6
        ? 'Enter a 6-digit pincode'
        : null;
  const lineSize = Math.min(brand.headlineSize, (width - brand.horizontalPadding * 2) / 10.2);

  return (
    <OnboardingChrome
      step={3}
      social={social}
      onBack={onBack}
      footer={
        <ContinueButton
          onPress={() => {
            setPinTried(true);
            if (pinInvalid) return;
            onContinue(city);
          }}
        />
      }
    >
      <Text style={[styles.title, { fontSize: lineSize, lineHeight: lineSize * 1.15 }]}>
        Where is your{'\n'}business located?
      </Text>
      <Text style={styles.subtext}>This helps us for delivery slots and serviceable areas.</Text>
      <View style={{ marginTop: 14 }}>
        <Text style={styles.label}>City</Text>
        <View>
          <Pressable style={styles.field} onPress={() => setOpen((value) => !value)} accessibilityRole="button" accessibilityLabel="City">
            <Text style={styles.fieldValue}>{city}</Text>
            <Icon svg={CHEVRON} size={18} />
          </Pressable>
          {open ? (
            <View style={styles.menu}>
              {CITIES.map((item) => (
                <Pressable
                  key={item.name}
                  style={styles.menuItem}
                  onPress={() => {
                    setCity(item.name);
                    setPin(item.pin);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.fieldValue, item.name === city && styles.menuOn]}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Area / Pincode</Text>
        <View style={[styles.field, pinError && styles.fieldError]}>
          <TextInput
            value={pin}
            onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, 6))}
            onBlur={() => setPinBlurred(true)}
            keyboardType="number-pad"
            placeholder="Pincode"
            placeholderTextColor="#9AA0A6"
            style={styles.input}
          />
        </View>
        {pinError ? <Text style={styles.fieldErrorText}>{pinError}</Text> : null}

        <Text style={[styles.label, { marginTop: 12 }]}>Business address</Text>
        <View style={styles.field}>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address (optional)"
            placeholderTextColor="#9AA0A6"
            style={styles.input}
          />
        </View>
      </View>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    ...(Platform.OS === 'web' ? ({ overflow: 'hidden' } as object) : {}),
  },
  signedIn: {
    backgroundColor: '#FFF1EC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 3,
    marginBottom: 10,
  },
  signedInText: {
    textAlign: 'left',
    color: '#3A3A3E',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  stepper: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  stepChunk: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepLine: {
    width: 72,
    height: 2,
    backgroundColor: '#E7E8EC',
    marginHorizontal: 8,
  },
  stepLineOn: {
    backgroundColor: '#FFD3C4',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotOn: {
    backgroundColor: ORANGE,
  },
  stepDotDone: {
    backgroundColor: '#FFE4DA',
  },
  stepNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C5C8D0',
  },
  stepNumOn: {
    color: '#FFFFFF',
  },
  stepNumDone: {
    color: ORANGE,
  },
  title: {
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.5,
  },
  subtext: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
    color: '#3A3A3E',
  },
  pairs: {
    marginTop: 16,
  },
  pair: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'stretch',
  },
  pairCell: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8EAEE',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(23, 23, 26, 0.05)' } as object,
      default: {
        shadowColor: '#17171A',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      },
    }),
  },
  needCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8EAEE',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 84,
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(23, 23, 26, 0.05)' } as object,
      default: {
        shadowColor: '#17171A',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      },
    }),
  },
  needCardOn: {
    borderColor: ORANGE,
    backgroundColor: '#FFF1EC',
  },
  cardOn: {
    borderColor: ORANGE,
    backgroundColor: '#FFF1EC',
  },
  needTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    color: INK,
  },
  cardTitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: INK,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
    color: INK,
  },
  field: {
    height: 50,
    borderRadius: 16,
    backgroundColor: FIELD,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fieldError: {
    borderColor: '#D92D20',
  },
  fieldErrorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#D92D20',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: INK,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: INK,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {}),
  },
  menu: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuOn: {
    color: ORANGE,
    fontWeight: '700',
  },
  footer: {
    paddingTop: 6,
    paddingBottom: 16,
    marginTop: -8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E4E6EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonLabel: {
    color: INK,
    fontSize: 16,
    fontWeight: '700',
  },
  continue: {
    height: 50,
    borderRadius: 25,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btScroll: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  btTop: {
    alignItems: 'flex-end',
  },
  btClose: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  btCloseMark: {
    fontSize: 28,
    lineHeight: 30,
    color: INK,
    fontWeight: '300',
  },
  btHeading: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.3,
  },
  btList: {
    marginTop: 22,
    gap: 12,
  },
  btCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E4E6EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  btCardOn: {
    borderColor: ORANGE,
    backgroundColor: '#FFF1EC',
  },
  btRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  btCardTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    color: INK,
  },
  btCardSub: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  btRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C5CAD3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  btRadioOn: {
    borderColor: ORANGE,
  },
  btRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  btBenefits: {
    marginTop: 12,
    marginLeft: 34,
    gap: 8,
  },
  btBenefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  btBenefitText: {
    flex: 1,
    color: BENEFIT,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  btFooter: {
    paddingTop: 8,
  },
  btError: {
    marginBottom: 8,
    color: '#D92D20',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  btContinue: {
    height: 54,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btContinueOff: {
    backgroundColor: '#E8EAEE',
  },
  btContinueLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btContinueLabelOff: {
    color: '#98A2B3',
  },
});
