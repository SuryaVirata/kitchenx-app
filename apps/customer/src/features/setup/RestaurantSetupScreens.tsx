import { createElement, ReactNode, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#6B7280';
const LINE = '#E4E6EB';
const ERROR = '#D92D20';
const OK = '#1B9E4B';
const DISABLED = '#E8EAEE';
const DISABLED_TEXT = '#98A2B3';
const SOFT = '#FFF1EC';
const LOGO_ASPECT = 3171 / 369;

/** Offer shown inside the restaurant setup banner. */
export const SETUP_OFFER = { label: 'Save ₹1,200 on first 4 orders' };

/** Chat, call, and email actions render only when a destination is set. */
export const SUPPORT: { chat?: string; phone?: string; email?: string } = {};

/** Local outlet-type list until the backend sends the real catalogue. */
export const OUTLET_TYPES = ['Restaurant', 'Cloud kitchen', 'Cafe', 'Bakery', 'Caterer'] as const;

export const DOCUMENT_RULE = {
  maxBytes: 5 * 1024 * 1024,
  label: 'PDF, JPG or PNG (Max 5 MB)',
};

export type SetupPhone = { number: string; name: string };

export type SetupDraft = {
  pan: string;
  legalName: string;
  registrationDate: string;
  gstin: string;
  gstFileName: string | null;
  fssaiNumber: string;
  fssaiFileName: string | null;
  email: string;
  phones: SetupPhone[];
  outletName: string;
  outletAddress: string;
  outletType: string;
};

export const EMPTY_SETUP: SetupDraft = {
  pan: '',
  legalName: '',
  registrationDate: '',
  gstin: '',
  gstFileName: null,
  fssaiNumber: '',
  fssaiFileName: null,
  email: '',
  phones: [{ number: '', name: '' }],
  outletName: '',
  outletAddress: '',
  outletType: '',
};

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function outletReady(draft: SetupDraft): boolean {
  return Boolean(draft.outletName.trim() && draft.outletAddress.trim());
}

function cleanPan(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

function cleanGst(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
}

function cleanDigits(value: string, max: number): string {
  return value.replace(/\D/g, '').slice(0, max);
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function dateIssue(value: string): string | null {
  if (!value.trim()) return 'Enter the date of birth or registration';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return 'Use the date format DD/MM/YYYY';
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return 'Enter a real date';
  }
  if (year < 1900 || date.getTime() > Date.now()) return 'Enter a date that is not in the future';
  return null;
}

function nameIssue(value: string): string | null {
  const name = value.trim();
  if (name.length < 2) return 'Enter the legal entity name';
  return null;
}

export function panIssues(draft: SetupDraft): Record<'pan' | 'legalName' | 'registrationDate', string | null> {
  const pan = cleanPan(draft.pan);
  return {
    pan: PAN_RE.test(pan) ? null : 'Enter a valid PAN, like ABCDE1234F',
    legalName: nameIssue(draft.legalName),
    registrationDate: dateIssue(draft.registrationDate),
  };
}

export function gstIssue(draft: SetupDraft): string | null {
  const gstin = cleanGst(draft.gstin);
  if (gstin.length < 15) return 'Enter a 15-character GST number';
  return null;
}

export function fssaiIssue(draft: SetupDraft): string | null {
  return /^\d{14}$/.test(draft.fssaiNumber) ? null : 'Enter a 14-digit FSSAI number';
}

function emailIssue(value: string): string | null {
  const email = value.trim();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? null : 'Enter a valid email address';
}

function phoneIssue(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? null : 'Enter a valid 10-digit mobile number';
}

function documentIssue(file: { name: string; size: number; mime: string }): string | null {
  const mime = file.mime.toLowerCase();
  const name = file.name.toLowerCase();
  const allowed =
    mime === 'application/pdf' ||
    mime === 'image/jpeg' ||
    mime === 'image/png' ||
    name.endsWith('.pdf') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png');
  if (!allowed) return 'Use a PDF, JPG or PNG';
  if (file.size > DOCUMENT_RULE.maxBytes) return 'File must be 5 MB or smaller';
  return null;
}

function openDate(current: string, onPick: (value: string) => void) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const input = document.createElement('input');
  input.type = 'date';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(current.trim());
  if (match) input.value = `${match[3]}-${match[2]}-${match[1]}`;
  input.max = new Date().toISOString().slice(0, 10);
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    const [year, month, day] = input.value.split('-');
    if (year && month && day) onPick(`${day}/${month}/${year}`);
    input.remove();
  });
  if (typeof input.showPicker === 'function') input.showPicker();
  else input.click();
}

function chooseFile(onFile: (file: { name: string; size: number; mime: string }) => void, onUnavailable: () => void) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    onUnavailable();
    return;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) onFile({ name: file.name, size: file.size, mime: file.type });
  };
  input.click();
}

function svg(body: string, color: string = ORANGE) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function filled(body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`;
}

const ICONS = {
  store: filled(
    `<path fill="${ORANGE}" d="M3.2 10.2 5.8 4.6h12.4l2.6 5.6v1.1c0 1.15-.95 2.1-2.1 2.1-.62 0-1.18-.27-1.56-.7a2.05 2.05 0 0 1-3.28 0 2.05 2.05 0 0 1-3.28 0 2.05 2.05 0 0 1-1.56.7c-1.15 0-2.1-.95-2.1-2.1v-1.1z"/><path fill="${ORANGE}" d="M6 14.1h12V20H6z"/><path fill="#fff" d="M10.2 16.2h3.6V20h-3.6z"/>`,
  ),
  doc: filled(
    `<path fill="${ORANGE}" d="M6.2 2.8h7.1l4.5 4.5V21.2H6.2z"/><path fill="#fff" d="M13 2.8v4.6h4.6"/><path fill="#fff" d="M8.6 12.2h6.8v1.5H8.6zm0 3.2h6.8v1.5H8.6z"/>`,
  ),
  docBlue: filled(
    `<path fill="#2F6BFF" d="M6.2 2.8h7.1l4.5 4.5V21.2H6.2z"/><path fill="#fff" d="M13 2.8v4.6h4.6"/><path fill="#fff" d="M8.6 12.2h6.8v1.5H8.6zm0 3.2h6.8v1.5H8.6z"/>`,
  ),
  user: filled(
    `<circle cx="12" cy="8" r="3.5" fill="#2F6BFF"/><path fill="#2F6BFF" d="M4.8 19.4c1-3.4 3.6-5.2 7.2-5.2s6.2 1.8 7.2 5.2"/>`,
  ),
  userBlue: filled(
    `<circle cx="12" cy="8" r="3.5" fill="#2F6BFF"/><path fill="#2F6BFF" d="M4.8 19.4c1-3.4 3.6-5.2 7.2-5.2s6.2 1.8 7.2 5.2"/>`,
  ),
  check: svg('<path d="m6.5 12.5 3.2 3.2 7.8-8"/>', colors.white),
  chevron: svg('<path d="m9 6 6 6-6 6"/>', ORANGE),
  chevronMuted: svg('<path d="m9 6 6 6-6 6"/>', MUTED),
  percent: filled(
    `<circle cx="8" cy="8" r="2.6" fill="${ORANGE}"/><circle cx="16" cy="16" r="2.6" fill="${ORANGE}"/><path stroke="${ORANGE}" stroke-width="2.2" stroke-linecap="round" d="M7 17 17 7"/>`,
  ),
  close: svg('<path d="M7 7l10 10M17 7 7 17"/>', MUTED),
  calendar: svg('<rect x="4" y="5" width="16" height="14.5" rx="2"/><path d="M8 3.2v4M16 3.2v4M4 10h16"/>', '#667085'),
  upload: filled(
    `<path fill="${ORANGE}" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5z"/>`,
  ),
  info: filled(`<circle cx="12" cy="12" r="9" fill="${ORANGE}"/><path stroke="#fff" stroke-width="1.8" stroke-linecap="round" d="M12 10.6v5"/><circle cx="12" cy="8" r="1" fill="#fff"/>`),
};

function Mark({ name, size = 22 }: { name: keyof typeof ICONS; size?: number }) {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ICONS[name])}`;
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

function Frame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.column, { maxWidth: width > 600 ? 480 : width }]}>{children}</View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TopBar({ onBack, step, roomy }: { onBack: () => void; step?: string; roomy?: boolean }) {
  const logoWidth = roomy ? 128 : 118;
  return (
    <View style={[styles.top, roomy && styles.topRoomy]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" hitSlop={12} style={[styles.back, roomy && styles.backRoomy]}>
        <Text style={styles.caret}>‹</Text>
      </Pressable>
      <Image
        source={require('../../../assets/kitchenx-logo-trimmed.png')}
        resizeMode="contain"
        accessibilityLabel="KitchenX"
        style={{ width: logoWidth, height: logoWidth / LOGO_ASPECT }}
      />
      {step ? (
        <View style={styles.step}>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ) : (
        <View style={styles.stepSlot} />
      )}
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
  right,
  multiline,
  compact,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string | null;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'characters';
  right?: ReactNode;
  multiline?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.field, multiline && styles.fieldTall, error ? styles.fieldError : null]}>
        <View style={styles.fieldBody}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9AA0A6"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? 'none'}
            autoCorrect={false}
            multiline={multiline}
            style={[styles.input, compact && styles.inputCompact, multiline && styles.inputTall]}
          />
        </View>
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function Continue({ label = 'Continue', enabled, onPress }: { label?: string; enabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      style={styles.continue}
    >
      <Text style={styles.continueLabel}>{label}</Text>
    </Pressable>
  );
}

function TextAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.textAction}>
      <Text style={styles.textActionLabel}>{label}</Text>
    </Pressable>
  );
}

function FormIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <View style={styles.intro}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.support}>{body}</Text>
    </View>
  );
}

export function RestaurantSetupScreen({
  draft,
  onBack,
  onRestaurant,
  onVerify,
  onSkip,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onRestaurant: () => void;
  onVerify: () => void;
  onSkip: () => void;
}) {
  return (
    <Frame>
      <TopBar onBack={onBack} roomy />
      <ScrollView contentContainerStyle={styles.hubScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.banner,
            Platform.OS === 'web'
              ? ({ backgroundImage: 'linear-gradient(180deg, #FF7A3C 0%, #FF4F18 100%)' } as object)
              : null,
          ]}
        >
          <Text style={styles.bannerTitle}>Complete restaurant{'\n'}setup</Text>
          <Text style={styles.bannerBody}>to place orders and get the full experience</Text>
          {SETUP_OFFER ? (
            <View style={styles.offer}>
              <View style={styles.offerIcon}>
                <Mark name="percent" size={16} />
              </View>
              <Text style={styles.offerText} numberOfLines={1}>{SETUP_OFFER.label}</Text>
              <Mark name="chevronMuted" size={16} />
            </View>
          ) : null}
        </View>
        <Pressable onPress={onRestaurant} accessibilityRole="button" style={styles.progressCard}>
          <View style={styles.hubBubble}>
            <Mark name="store" size={26} />
          </View>
          <View style={styles.progressCopy}>
            <Text style={styles.hubTitle}>Restaurant details</Text>
            <Text style={styles.hubBody}>Basic information about your outlet</Text>
          </View>
          <View style={styles.check}>
            <Mark name="check" size={18} />
          </View>
        </Pressable>
        <View style={styles.progressCard}>
          <View style={styles.hubBubble}>
            <Mark name="doc" size={26} />
          </View>
          <View style={styles.progressCopy}>
            <Text style={styles.hubTitle}>Verify GST or FSSAI</Text>
            <Text style={styles.hubBody}>Required to unlock wholesale pricing</Text>
          </View>
          <Pressable onPress={onVerify} accessibilityRole="button" style={styles.add}>
            <Text style={styles.addLabel}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={onSkip} accessibilityRole="button" style={styles.outline}>
          <Text style={styles.outlineLabel}>Don’t have GST or FSSAI?</Text>
          <Mark name="chevron" size={18} />
        </Pressable>
        <Text style={styles.note}>
          You can still complete setup & place orders. Product prices and onboarding offers may vary for non-registered businesses.
        </Text>
      </ScrollView>
    </Frame>
  );
}

export function PanScreen({
  draft,
  onBack,
  onChange,
  onContinue,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onChange: (patch: Partial<SetupDraft>) => void;
  onContinue: () => void;
}) {
  const [touched, setTouched] = useState({ pan: false, legalName: false, registrationDate: false });
  const issues = panIssues(draft);
  const ready = !issues.pan && !issues.legalName && !issues.registrationDate;
  const show = (key: keyof typeof touched, value: string) => (touched[key] || value.trim() ? issues[key] : null);
  return (
    <Frame>
      <TopBar onBack={onBack} step="1/3" />
      <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FormIntro
          kicker="Business details"
          title="Enter PAN of legal entity"
          body="This will be your primary PAN number and will be used for all your outlets."
        />
        <Field
          label="PAN number"
          value={draft.pan}
          placeholder="ABCDE1234F"
          autoCapitalize="characters"
          error={show('pan', draft.pan)}
          onChangeText={(value) => {
            setTouched((current) => ({ ...current, pan: true }));
            onChange({ pan: cleanPan(value) });
          }}
        />
        <Field
          label="Legal entity name"
          value={draft.legalName}
          placeholder="Enter legal entity name"
          autoCapitalize="words"
          error={show('legalName', draft.legalName)}
          onChangeText={(value) => {
            setTouched((current) => ({ ...current, legalName: true }));
            onChange({ legalName: value });
          }}
        />
        <Field
          label="Date of birth/registration"
          value={draft.registrationDate}
          placeholder="DD/MM/YYYY"
          keyboardType="number-pad"
          error={show('registrationDate', draft.registrationDate)}
          right={
            <Pressable
              onPress={() =>
                openDate(draft.registrationDate, (registrationDate) => {
                  setTouched((current) => ({ ...current, registrationDate: true }));
                  onChange({ registrationDate });
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Choose date"
              hitSlop={8}
            >
              <Mark name="calendar" size={22} />
            </Pressable>
          }
          onChangeText={(value) => {
            setTouched((current) => ({ ...current, registrationDate: true }));
            onChange({ registrationDate: maskDate(value) });
          }}
        />
        <View style={styles.footer}>
          <Continue enabled={ready} onPress={onContinue} />
        </View>
      </ScrollView>
    </Frame>
  );
}

export function GstScreen({
  draft,
  onBack,
  onChange,
  onContinue,
  onFssai,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onChange: (patch: Partial<SetupDraft>) => void;
  onContinue: () => void;
  onFssai: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const issue = gstIssue(draft);
  return (
    <Frame>
      <TopBar onBack={onBack} step="2/3" />
      <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FormIntro
          kicker="Business details"
          title="Enter your GST number"
          body="GST number should be linked to the PAN you had provided earlier."
        />
        <Field
          label="GST number"
          value={draft.gstin}
          placeholder="Enter 15-digit GST number"
          autoCapitalize="characters"
          error={touched || draft.gstin.trim() ? issue : null}
          onChangeText={(value) => {
            setTouched(true);
            onChange({ gstin: cleanGst(value) });
          }}
        />
        <View style={styles.footer}>
          <Continue enabled={!issue} onPress={onContinue} />
          <TextAction label="I’m not GST registered" onPress={() => setOpen(true)} />
        </View>
      </ScrollView>
      {open ? (
        <View style={styles.scrim}>
          <View style={styles.modal} accessibilityRole="alert">
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close" style={styles.modalClose}>
              <Mark name="close" size={18} />
            </Pressable>
            <View style={styles.infoBubble}>
              <Mark name="info" size={22} />
            </View>
            <Text style={styles.modalTitle}>Not GST registered?</Text>
            <Text style={styles.modalBody}>You can continue by providing your FSSAI details.</Text>
            <Continue label="Continue with FSSAI" enabled onPress={onFssai} />
            <TextAction label="Go back to GST" onPress={() => setOpen(false)} />
          </View>
        </View>
      ) : null}
    </Frame>
  );
}

export function FssaiScreen({
  draft,
  onBack,
  onChange,
  onContinue,
  onGst,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onChange: (patch: Partial<SetupDraft>) => void;
  onContinue: () => void;
  onGst: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const issue = fssaiIssue(draft);
  const pick = () => {
    chooseFile(
      (file) => {
        const problem = documentIssue(file);
        setFileError(problem);
        if (!problem) onChange({ fssaiFileName: file.name });
      },
      () => setFileError('Document selection is not available in this build.'),
    );
  };
  return (
    <Frame>
      <TopBar onBack={onBack} step="2/3" />
      <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FormIntro
          kicker="Business details"
          title="Enter your FSSAI details"
          body="Required if your business is not GST registered."
        />
        <View style={styles.fieldWrap}>
          <Pressable onPress={pick} accessibilityRole="button" style={styles.field}>
            <View style={styles.fieldBody}>
              <Text style={styles.fieldLabel}>FSSAI document</Text>
              <Text style={draft.fssaiFileName ? styles.fileName : styles.placeholder}>
                {draft.fssaiFileName ?? 'Upload document'}
              </Text>
              <Text style={styles.fileHint}>{DOCUMENT_RULE.label}</Text>
              {draft.fssaiFileName ? <Text style={styles.fileStatus}>Selected on this device. Not uploaded.</Text> : null}
            </View>
            <View style={styles.uploadBubble}>
              <Mark name="upload" size={22} />
            </View>
          </Pressable>
          {fileError ? <Text style={styles.error}>{fileError}</Text> : null}
        </View>
        <Field
          label="FSSAI number"
          value={draft.fssaiNumber}
          placeholder="Enter 14-digit FSSAI number"
          keyboardType="number-pad"
          error={touched || draft.fssaiNumber.trim() ? issue : null}
          onChangeText={(value) => {
            setTouched(true);
            onChange({ fssaiNumber: cleanDigits(value, 14) });
          }}
        />
        <View style={styles.footer}>
          <Continue enabled={!issue && !fileError} onPress={onContinue} />
          <TextAction label="I want to proceed with GST" onPress={onGst} />
        </View>
      </ScrollView>
    </Frame>
  );
}

function ContactFields({
  draft,
  onChange,
  narrow,
}: {
  draft: SetupDraft;
  onChange: (patch: Partial<SetupDraft>) => void;
  narrow: boolean;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const updatePhone = (index: number, patch: Partial<SetupPhone>) => {
    const phones = draft.phones.map((phone, item) => (item === index ? { ...phone, ...patch } : phone));
    onChange({ phones });
  };
  const addPhone = () => {
    const filled = draft.phones.map((phone) => phone.number.replace(/\D/g, '')).filter(Boolean);
    if (draft.phones.some((phone) => !phone.number.trim())) {
      setNotice('Enter the current number before adding another.');
      return;
    }
    if (new Set(filled).size !== filled.length) {
      setNotice('That number is already added.');
      return;
    }
    setNotice(null);
    onChange({ phones: [...draft.phones, { number: '', name: '' }] });
  };
  return (
    <View>
      <Field
        label="Email address"
        value={draft.email}
        placeholder="Enter email address"
        keyboardType="email-address"
        error={emailIssue(draft.email)}
        onChangeText={(email) => onChange({ email })}
      />
      {draft.phones.map((phone, index) => (
        <View key={`phone-${index}`} style={[styles.pair, narrow && styles.pairStack]}>
          <View style={styles.pairItem}>
            <Field
              label="Phone number"
              value={phone.number}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              compact={!narrow}
              error={phoneIssue(phone.number)}
              onChangeText={(number) => updatePhone(index, { number })}
            />
          </View>
          <View style={styles.pairItem}>
            <Field
              label="Name"
              value={phone.name}
              placeholder="Enter name"
              autoCapitalize="words"
              compact={!narrow}
              onChangeText={(name) => updatePhone(index, { name })}
            />
          </View>
        </View>
      ))}
      {notice ? <Text style={styles.error}>{notice}</Text> : null}
      <Pressable onPress={addPhone} accessibilityRole="button" style={styles.addNumber}>
        <Text style={styles.addNumberLabel}>+ Add another number</Text>
      </Pressable>
    </View>
  );
}

function BusinessFields({
  draft,
  onChange,
}: {
  draft: SetupDraft;
  onChange: (patch: Partial<SetupDraft>) => void;
}) {
  const [gstError, setGstError] = useState<string | null>(null);
  const [fssaiError, setFssaiError] = useState<string | null>(null);
  const pick = (which: 'gst' | 'fssai') => {
    const fail = which === 'gst' ? setGstError : setFssaiError;
    chooseFile(
      (file) => {
        const problem = documentIssue(file);
        fail(problem);
        if (!problem) onChange(which === 'gst' ? { gstFileName: file.name } : { fssaiFileName: file.name });
      },
      () => fail('Document selection is not available in this build.'),
    );
  };
  return (
    <View>
      <Field
        label="GST number"
        value={draft.gstin}
        placeholder="Enter GST number"
        autoCapitalize="characters"
        error={draft.gstin.trim() ? gstIssue({ ...draft, gstin: draft.gstin }) : gstError}
        right={
          <Pressable onPress={() => pick('gst')} accessibilityRole="button">
            <Text style={styles.uploadLabel}>Upload</Text>
          </Pressable>
        }
        onChangeText={(value) => onChange({ gstin: cleanGst(value) })}
      />
      {draft.gstFileName ? <Text style={styles.fileStatus}>Selected: {draft.gstFileName}. Not uploaded.</Text> : null}
      <Field
        label="FSSAI number"
        value={draft.fssaiNumber}
        placeholder="Enter FSSAI number"
        keyboardType="number-pad"
        error={draft.fssaiNumber.trim() ? fssaiIssue(draft) : fssaiError}
        right={
          <Pressable onPress={() => pick('fssai')} accessibilityRole="button">
            <Text style={styles.uploadLabel}>Upload</Text>
          </Pressable>
        }
        onChangeText={(value) => onChange({ fssaiNumber: cleanDigits(value, 14) })}
      />
      {draft.fssaiFileName ? <Text style={styles.fileStatus}>Selected: {draft.fssaiFileName}. Not uploaded.</Text> : null}
    </View>
  );
}

function SectionCard({
  icon,
  title,
  body,
  children,
}: {
  icon: keyof typeof ICONS;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={[styles.bubble, icon === 'store' ? styles.bubbleOn : styles.bubbleBlue]}>
          <Mark name={icon === 'doc' ? 'docBlue' : icon === 'user' ? 'userBlue' : icon} size={22} />
        </View>
        <View style={styles.progressCopy}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardBody}>{body}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

function SupportRow() {
  const items = [
    SUPPORT.chat ? { label: 'Chat with us', href: SUPPORT.chat } : null,
    SUPPORT.phone ? { label: 'Call us', href: SUPPORT.phone } : null,
    SUPPORT.email ? { label: 'Email us', href: SUPPORT.email } : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item));
  if (!items.length) return null;
  return (
    <View style={styles.helpBox}>
      <Text style={styles.helpTitle}>Need help updating your details?</Text>
      <View style={styles.helpRow}>
        {items.map((item) => (
          <TextAction key={item.label} label={item.label} onPress={() => openSupport(item.href)} />
        ))}
      </View>
    </View>
  );
}

function openSupport(href: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') window.open(href, '_blank', 'noopener,noreferrer');
}

export function EditDetailsScreen({
  draft,
  onBack,
  onChange,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onChange: (patch: Partial<SetupDraft>) => void;
}) {
  const { width } = useWindowDimensions();
  const narrow = Math.min(width, 480) < 380;
  return (
    <Frame>
      <TopBar onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Edit details</Text>
        <Text style={styles.pageBody}>Update your contact and business information.</Text>
        <SectionCard icon="user" title="Contact details" body="for OTP, delivery status and updates">
          <ContactFields draft={draft} onChange={onChange} narrow={narrow} />
        </SectionCard>
        <SectionCard icon="doc" title="Business details" body="official details of your outlet">
          <BusinessFields draft={draft} onChange={onChange} />
        </SectionCard>
        <SupportRow />
      </ScrollView>
    </Frame>
  );
}

export function EditOutletScreen({
  draft,
  onBack,
  onChange,
}: {
  draft: SetupDraft;
  onBack: () => void;
  onChange: (patch: Partial<SetupDraft>) => void;
}) {
  const { width } = useWindowDimensions();
  const narrow = Math.min(width, 480) < 380;
  const [open, setOpen] = useState(false);
  return (
    <Frame>
      <TopBar onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Edit outlet details</Text>
        <Text style={styles.pageBody}>Update your outlet information.</Text>
        <SectionCard icon="store" title="Outlet details" body="for accurate delivery of orders">
          <Field
            label="Outlet name"
            value={draft.outletName}
            placeholder="Enter outlet name"
            autoCapitalize="words"
            onChangeText={(outletName) => onChange({ outletName })}
          />
          <Field
            label="Outlet address"
            value={draft.outletAddress}
            placeholder="Enter complete address"
            multiline
            onChangeText={(outletAddress) => onChange({ outletAddress })}
          />
          <View style={styles.fieldWrap}>
            <Pressable onPress={() => setOpen((value) => !value)} accessibilityRole="button" style={styles.field}>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Outlet type</Text>
                <Text style={draft.outletType ? styles.fileName : styles.placeholder}>
                  {draft.outletType || 'Select outlet type'}
                </Text>
              </View>
              <Text style={styles.chevronDown}>▾</Text>
            </Pressable>
            {open ? (
              <View style={styles.menu}>
                {OUTLET_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    accessibilityRole="button"
                    style={styles.menuItem}
                    onPress={() => {
                      onChange({ outletType: type });
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.menuLabel}>{type}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </SectionCard>
        <SectionCard icon="user" title="Contact details" body="for OTP, delivery status and updates">
          <ContactFields draft={draft} onChange={onChange} narrow={narrow} />
        </SectionCard>
        <SectionCard icon="doc" title="Business details" body="official details of your outlet">
          <BusinessFields draft={draft} onChange={onChange} />
        </SectionCard>
      </ScrollView>
    </Frame>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white, alignItems: 'center' },
  flex: { flex: 1, width: '100%' },
  column: { flex: 1, width: '100%', alignSelf: 'center' },
  top: {
    minHeight: 72,
    paddingTop: Platform.OS === 'web' ? 36 : 56,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  topRoomy: {
    minHeight: 84,
    paddingTop: Platform.OS === 'web' ? 44 : 64,
    paddingBottom: 22,
  },
  back: { position: 'absolute', left: 8, bottom: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backRoomy: { bottom: 14 },
  caret: { fontSize: 32, lineHeight: 34, fontWeight: '300', color: INK, marginTop: -2 },
  step: {
    position: 'absolute',
    right: 16,
    bottom: 10,
    borderWidth: 1.5,
    borderColor: OK,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepText: { color: OK, fontSize: 13, fontWeight: '700' },
  stepSlot: { width: 40 },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  hubScroll: { width: '100%', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 36 },
  formScroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 28 },
  banner: {
    backgroundColor: ORANGE,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 18,
    marginTop: 4,
    width: '100%',
  },
  bannerTitle: { color: colors.white, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  bannerBody: { color: colors.white, fontSize: 16, lineHeight: 22, fontWeight: '500', marginTop: 12 },
  offer: {
    marginTop: 22,
    backgroundColor: '#FFF7F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  offerText: { flex: 1, minWidth: 0, color: INK, fontSize: 15, lineHeight: 20, fontWeight: '700' },
  progressCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleOn: { backgroundColor: SOFT },
  bubbleBlue: { backgroundColor: '#E7F0FF' },
  progressCopy: { flex: 1, minWidth: 0, marginLeft: 14, marginRight: 10 },
  hubBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hubTitle: { color: INK, fontSize: 17, lineHeight: 22, fontWeight: '800' },
  hubBody: { color: MUTED, fontSize: 14, lineHeight: 20, marginTop: 4 },
  cardTitle: { color: INK, fontSize: 16, fontWeight: '800' },
  cardBody: { color: MUTED, fontSize: 13, lineHeight: 18, marginTop: 2 },
  check: { width: 32, height: 32, borderRadius: 16, backgroundColor: OK, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  add: { backgroundColor: ORANGE, borderRadius: 14, paddingHorizontal: 18, minHeight: 40, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  addLabel: { color: colors.white, fontSize: 15, fontWeight: '800' },
  divider: { height: 1, backgroundColor: LINE, marginTop: 22, marginBottom: 6 },
  outline: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: 16,
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  outlineLabel: { color: ORANGE, fontSize: 16, fontWeight: '800' },
  note: { color: MUTED, fontSize: 14, lineHeight: 21, marginTop: 16, width: '100%' },
  intro: { marginTop: 18, marginBottom: 18 },
  kicker: { color: MUTED, fontSize: 14, fontWeight: '600' },
  heading: { color: INK, fontSize: 26, lineHeight: 32, fontWeight: '800', marginTop: 6 },
  support: { color: MUTED, fontSize: 15, lineHeight: 21, marginTop: 8 },
  fieldWrap: { marginBottom: 14 },
  field: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldTall: { minHeight: 96, alignItems: 'flex-start' },
  fieldError: { borderColor: ERROR },
  fieldBody: { flex: 1 },
  fieldLabel: { color: MUTED, fontSize: 12, fontWeight: '600' },
  input: { color: INK, fontSize: 15, paddingVertical: 2, paddingHorizontal: 0 },
  inputCompact: { fontSize: 14 },
  inputTall: { minHeight: 48, textAlignVertical: 'top' },
  placeholder: { color: '#9AA0A6', fontSize: 16, marginTop: 2 },
  fileName: { color: INK, fontSize: 16, marginTop: 2 },
  fileHint: { color: MUTED, fontSize: 12, marginTop: 4 },
  fileStatus: { color: MUTED, fontSize: 12, marginTop: 4, marginBottom: 8 },
  error: { color: ERROR, fontSize: 12, marginTop: 6 },
  footer: { marginTop: 'auto', paddingTop: 28 },
  continue: {
    height: 54,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueOff: { backgroundColor: DISABLED },
  continueLabel: { color: colors.white, fontSize: 16, fontWeight: '800' },
  continueLabelOff: { color: DISABLED_TEXT },
  textAction: { alignItems: 'center', paddingVertical: 14 },
  textActionLabel: { color: ORANGE, fontSize: 15, fontWeight: '800' },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(20, 21, 23, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  modalClose: { position: 'absolute', right: 12, top: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  infoBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalTitle: { color: INK, fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 14 },
  modalBody: { color: MUTED, fontSize: 15, lineHeight: 21, textAlign: 'center', marginTop: 8, marginBottom: 18 },
  pageTitle: { color: INK, fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 18 },
  pageBody: { color: MUTED, fontSize: 15, lineHeight: 21, marginTop: 6, marginBottom: 16 },
  section: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    backgroundColor: colors.white,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  pair: { flexDirection: 'row', gap: 8 },
  pairStack: { flexDirection: 'column' },
  pairItem: { flex: 1 },
  addNumber: { paddingVertical: 4 },
  addNumberLabel: { color: ORANGE, fontSize: 15, fontWeight: '800' },
  uploadBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadLabel: { color: ORANGE, fontSize: 14, fontWeight: '800' },
  chevronDown: { color: MUTED, fontSize: 16, marginLeft: 8 },
  menu: { marginTop: 8, borderWidth: 1, borderColor: LINE, borderRadius: 14, overflow: 'hidden' },
  menuItem: { paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.white },
  menuLabel: { color: INK, fontSize: 15, fontWeight: '600' },
  helpBox: { borderWidth: 1, borderColor: LINE, borderRadius: 18, padding: 14, backgroundColor: colors.field },
  helpTitle: { color: INK, fontSize: 14, fontWeight: '700' },
  helpRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
