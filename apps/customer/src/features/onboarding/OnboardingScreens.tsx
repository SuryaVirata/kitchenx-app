import { createElement, ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { AuthHeader, BRAND_TITLE_GAP, useBrandType } from '../auth/AuthScreens';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#6B7280';
const FIELD = colors.field;

export type SocialSession = {
  provider: 'Google' | 'Facebook';
  name: string;
  email: string;
};

export type BusinessRegistration = 'registered' | 'unregistered';

function strokeIcon(color: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const DOC_ICON =
  '<path d="M7 3.8h6.2L18.2 9v10.2A1.3 1.3 0 0 1 16.9 20.5H8.3A1.3 1.3 0 0 1 7 19.2V5.1A1.3 1.3 0 0 1 8.3 3.8Z"/><path d="M13 4v5h5"/><circle cx="16.2" cy="16.4" r="2.7"/><path d="m14.9 16.4 1 1 2.1-2.2"/>';
const ID_ICON =
  '<rect x="4.2" y="5" width="15.6" height="14" rx="2"/><path d="M8 16.2 16 8.2"/><path d="M9 10h.1M8.2 13H12"/>';
const TAG_ICON =
  '<path d="M3.8 12.2 11 5h6.6v6.6l-7.4 7.4a1.5 1.5 0 0 1-2.1 0L3.8 14.4a1.6 1.6 0 0 1 0-2.2Z"/><circle cx="15.4" cy="8.2" r="1"/>';
const CHART_ICON = '<path d="M5 19V10.5M10 19V6.5M15 19v-6.5M20 19H4"/>';
const BOLT_ICON = '<path d="M13.2 3.2 6.2 13h5.2l-.8 7.8 7.4-11.2h-5.2l.4-6.4Z"/>';

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
  const { width } = useWindowDimensions();
  const pad = 20;
  const frame = Math.min(width, 440);
  const content = frame - pad * 2;
  const titleSlot = 178;
  const artWidth = Math.round(Math.max(72, content - titleSlot));
  const artHeight = Math.round(artWidth * (405 / 536));
  const fullW = Math.round(artWidth * (640 / 536));
  const fullH = Math.round(fullW * (426 / 640));
  const cropLeft = Math.round(fullW * (51 / 640));
  const cropTop = Math.round(fullH * (15 / 426));
  const [selected, setSelected] = useState<BusinessRegistration | null>(initial ?? 'registered');
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
    <View style={[styles.root, styles.btFrame]}>
      <View style={styles.btColumn}>
      <View style={[styles.btTop, { paddingHorizontal: pad, paddingTop: Platform.OS === 'web' ? 12 : 44 }]}>
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          style={styles.btClose}
        >
          <Text style={styles.btCloseMark}>‹</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.btScroll, { paddingHorizontal: pad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.btHero}>
          <View style={styles.btHeroCopy}>
            <Text style={styles.btHeading}>Select your{'\n'}business type</Text>
            <Text style={styles.btSub}>This helps us personalise your pricing, services and experience on KitchenX.</Text>
          </View>
          <View style={{ width: artWidth, height: artHeight, marginTop: -10, overflow: 'hidden' }}>
            <Image
              source={require('../../../assets/business-type-chef.png')}
              resizeMode="stretch"
              accessibilityLabel="Chef outside a fresh market stall"
              style={{ width: fullW, height: fullH, marginLeft: -cropLeft, marginTop: -cropTop }}
            />
          </View>
        </View>
        <View accessibilityRole="radiogroup" style={styles.btList}>
          <TypeCard
            title="I have GST or FSSAI"
            subtitle="For registered businesses"
            icon={DOC_ICON}
            selected={selected === 'registered'}
            onPress={() => choose('registered')}
            benefits={[
              { icon: TAG_ICON, label: 'Better prices' },
              { icon: CHART_ICON, label: 'Potential eligibility for credit, subject to verification and approval.' },
            ]}
          />
          <TypeCard
            title="I don’t have GST or FSSAI"
            subtitle="For non-registered businesses"
            icon={ID_ICON}
            selected={selected === 'unregistered'}
            onPress={() => choose('unregistered')}
            benefits={[{ icon: BOLT_ICON, label: 'Easy onboarding — no documents required.' }]}
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
            <Text style={[styles.btContinueLabel, !selected && styles.btContinueLabelOff]}>Continue  →</Text>
          )}
        </TouchableOpacity>
      </View>
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
  benefits: { icon: string; label: string }[];
}) {
  const tone = selected ? ORANGE : '#6B7280';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ selected, checked: selected }}
      style={[styles.btCard, selected && styles.btCardOn]}
    >
      <View style={styles.btRow}>
        <View style={[styles.btIconBubble, selected ? styles.btIconBubbleOn : null]}>
          <Icon svg={strokeIcon(tone, icon)} size={24} />
        </View>
        <View style={styles.btCopy}>
          <Text style={styles.btCardTitle}>{title}</Text>
          <Text style={styles.btCardSub}>{subtitle}</Text>
        </View>
        <View style={[styles.btRadio, selected && styles.btRadioOn]}>
          {selected ? <View style={styles.btRadioDot} /> : <View style={styles.btRadioIdle} />}
        </View>
      </View>
      <View style={styles.btBenefits}>
        {benefits.map((benefit) => (
          <View key={benefit.label} style={styles.btBenefit}>
            <View style={[styles.btMiniBubble, selected ? styles.btIconBubbleOn : null]}>
              <Icon svg={strokeIcon(tone, benefit.icon)} size={16} />
            </View>
            <Text style={styles.btBenefitText}>{benefit.label}</Text>
          </View>
        ))}
      </View>
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
        shadowColor: '#141517',
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
        shadowColor: '#141517',
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
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  btClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btCloseMark: {
    fontSize: 28,
    lineHeight: 30,
    color: INK,
    fontWeight: '300',
    marginLeft: -2,
  },
  btFrame: {
    alignItems: 'center',
  },
  btColumn: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
  },
  btHero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  btHeroCopy: {
    flex: 1,
    paddingRight: 6,
  },
  btHeading: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
    color: INK,
    letterSpacing: -1.2,
  },
  btSub: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    color: MUTED,
  },
  btList: {
    marginTop: 18,
    gap: 14,
  },
  btCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E4E6EB',
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  btCardTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: INK,
  },
  btCardOn: {
    borderColor: ORANGE,
    backgroundColor: '#FFF1EC',
  },
  btRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btIconBubbleOn: {
    backgroundColor: colors.white,
  },
  btMiniBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: FIELD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  btCardSub: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  btRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  btRadioOn: {
    borderColor: ORANGE,
  },
  btRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ORANGE,
  },
  btRadioIdle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ink,
  },
  btBenefits: {
    marginTop: 14,
    paddingLeft: 56,
    gap: 12,
  },
  btBenefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  btBenefitText: {
    flex: 1,
    color: INK,
    fontSize: 14,
    lineHeight: 20,
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
