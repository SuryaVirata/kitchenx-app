import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const ORANGE = '#FF4F18';
const INK = '#17171A';
const MUTED = '#667085';
const FIELD = '#F3F4F6';

const STATES = ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'];

type Step = 'ask' | 'map' | 'manual' | 'search';
type Coords = { lat: number; lng: number };
type AddressDraft = {
  house: string;
  street: string;
  landmark: string;
  city: string;
  pin: string;
  state: string;
};

const EMPTY: AddressDraft = { house: '', street: '', landmark: '', city: '', pin: '', state: '' };

export function DeliveryLocationFlow({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: (city: string) => void;
}) {
  const [step, setStep] = useState<Step>('ask');
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [permissionNote, setPermissionNote] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY);
  const [tried, setTried] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [searchFrom, setSearchFrom] = useState<Step>('map');

  const locate = async (next: Step) => {
    setLocating(true);
    setPermissionNote(null);
    try {
      const point = await readDeviceLocation();
      setCoords(point);
      setStep(next);
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? Number((error as { code: number }).code) : 0;
      setPermissionNote(
        code === 1
          ? 'Location permission was denied. Enter the address manually.'
          : 'Location is unavailable on this device.',
      );
      setStep('ask');
    } finally {
      setLocating(false);
    }
  };

  if (step === 'search') {
    return (
      <SearchScreen
        query={query}
        onQuery={setQuery}
        onBack={() => setStep(searchFrom)}
        onUseCurrent={() => locate('map')}
        locating={locating}
      />
    );
  }

  if (step === 'manual') {
    return (
      <ManualScreen
        draft={draft}
        setDraft={setDraft}
        tried={tried}
        stateOpen={stateOpen}
        setStateOpen={setStateOpen}
        locating={locating}
        onBack={() => setStep('ask')}
        onSearch={() => {
          setSearchFrom('manual');
          setStep('search');
        }}
        onUseCurrent={() => locate('manual')}
        onSave={() => {
          setTried(true);
          if (!isAddressComplete(draft)) return;
          onSave(draft.city.trim());
        }}
      />
    );
  }

  if (step === 'map') {
    return (
      <MapScreen
        coords={coords}
        onBack={() => setStep('ask')}
        onSearch={() => {
          setSearchFrom('map');
          setStep('search');
        }}
        onUseCurrent={() => locate('map')}
        locating={locating}
      />
    );
  }

  return (
    <View style={styles.root}>
      <Header title="" onBack={onBack} />
      <View style={styles.askBody}>
        <Image source={require('../../../assets/location-pin-map.png')} resizeMode="contain" style={styles.art} accessibilityLabel="Map pin" />
        <Text style={styles.askTitle}>Allow location access</Text>
        <Text style={styles.askCopy}>Use your location to find delivery availability near you.</Text>
        {permissionNote ? <Text style={styles.error}>{permissionNote}</Text> : null}
      </View>
      <View style={styles.askActions}>
        <Pressable style={styles.outline} onPress={() => setStep('manual')} accessibilityRole="button">
          <Text style={styles.outlineLabel}>Enter manually</Text>
        </Pressable>
        <Pressable style={styles.solidHalf} onPress={() => locate('map')} disabled={locating} accessibilityRole="button">
          {locating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.solidLabel}>Allow location</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function MapScreen({
  coords,
  onBack,
  onSearch,
  onUseCurrent,
  locating,
}: {
  coords: Coords | null;
  onBack: () => void;
  onSearch: () => void;
  onUseCurrent: () => void;
  locating: boolean;
}) {
  return (
    <View style={styles.root}>
      <Header title="Delivery Location" onBack={onBack} />
      <Pressable style={styles.search} onPress={onSearch} accessibilityRole="button" accessibilityLabel="Search for area, street name">
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchPlaceholder}>Search for area, street name</Text>
      </Pressable>
      <View style={styles.mapPane}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>We can't confirm delivery for this point yet</Text>
          <Text style={styles.bannerCopy}>No map or delivery service is connected.</Text>
        </View>
        <Image source={require('../../../assets/location-pin-map.png')} resizeMode="contain" style={styles.mapArt} />
        <Pressable style={styles.current} onPress={onUseCurrent} accessibilityRole="button">
          {locating ? <ActivityIndicator color={ORANGE} /> : <Text style={styles.currentLabel}>⌖  Use current location</Text>}
        </Pressable>
      </View>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{coords ? 'Current location' : 'Location not selected'}</Text>
        <Text style={styles.sheetCopy}>
          {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Allow location or search for an address.'}
        </Text>
        <View style={styles.disabledBtn}>
          <Text style={styles.disabledLabel}>Confirm location</Text>
        </View>
      </View>
    </View>
  );
}

function SearchScreen({
  query,
  onQuery,
  onBack,
  onUseCurrent,
  locating,
}: {
  query: string;
  onQuery: (value: string) => void;
  onBack: () => void;
  onUseCurrent: () => void;
  locating: boolean;
}) {
  return (
    <View style={styles.root}>
      <Header title="Delivery Location" onBack={onBack} />
      <View style={styles.searchLive}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onQuery}
          placeholder="Search area, street, landmark"
          placeholderTextColor="#9AA0A6"
          autoFocus
          returnKeyType="search"
          style={styles.searchInput}
        />
        {query ? (
          <Pressable onPress={() => onQuery('')} accessibilityLabel="Clear search">
            <Text style={styles.clear}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.searchBody}>
        <Text style={styles.suggestTitle}>Suggested locations</Text>
        <Text style={styles.empty}>
          {query
            ? 'Address suggestions aren’t available. No maps provider is connected.'
            : 'Type an area, street, or landmark.'}
        </Text>
      </View>
      <Pressable style={styles.currentWide} onPress={onUseCurrent} accessibilityRole="button">
        {locating ? <ActivityIndicator color={ORANGE} /> : <Text style={styles.currentLabel}>⌖  Use current location</Text>}
      </Pressable>
    </View>
  );
}

function ManualScreen({
  draft,
  setDraft,
  tried,
  stateOpen,
  setStateOpen,
  locating,
  onBack,
  onSearch,
  onUseCurrent,
  onSave,
}: {
  draft: AddressDraft;
  setDraft: (next: AddressDraft) => void;
  tried: boolean;
  stateOpen: boolean;
  setStateOpen: (open: boolean) => void;
  locating: boolean;
  onBack: () => void;
  onSearch: () => void;
  onUseCurrent: () => void;
  onSave: () => void;
}) {
  const pin = draft.pin.replace(/\D/g, '');
  const missing = {
    house: !draft.house.trim(),
    street: !draft.street.trim(),
    city: !draft.city.trim(),
    pin: !/^\d{6}$/.test(pin),
    state: !draft.state,
  };
  const set = (key: keyof AddressDraft, value: string) => setDraft({ ...draft, [key]: value });

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Enter delivery address" onBack={onBack} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formScroll}>
        <Pressable style={styles.search} onPress={onSearch} accessibilityRole="button">
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search area, street, landmark</Text>
        </Pressable>
        <Text style={styles.formTitle}>Enter address details</Text>
        <Field label="House / flat / building" value={draft.house} placeholder="e.g. Flat 204, Green Residency" error={tried && missing.house ? 'Enter the house or building' : null} onChange={(value) => set('house', value)} />
        <Field label="Street / area" value={draft.street} placeholder="Street name, colony or area" error={tried && missing.street ? 'Enter the street or area' : null} onChange={(value) => set('street', value)} />
        <Field label="Landmark (optional)" value={draft.landmark} placeholder="Nearby landmark" onChange={(value) => set('landmark', value)} />
        <View style={styles.split}>
          <View style={{ flex: 1 }}>
            <Field label="City" value={draft.city} placeholder="City" error={tried && missing.city ? 'Enter the city' : null} onChange={(value) => set('city', value)} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="PIN code" value={pin} placeholder="6-digit PIN code" keyboard="number-pad" error={tried && missing.pin ? 'Enter a 6-digit PIN code' : null} onChange={(value) => set('pin', value.replace(/\D/g, '').slice(0, 6))} />
          </View>
        </View>
        <Text style={styles.fieldLabel}>State</Text>
        <Pressable style={styles.field} onPress={() => setStateOpen(!stateOpen)} accessibilityRole="button" accessibilityLabel="Select state">
          <Text style={draft.state ? styles.fieldValue : styles.fieldPlaceholder}>{draft.state || 'Select state'}</Text>
          <Text style={styles.caret}>▾</Text>
        </Pressable>
        {tried && missing.state ? <Text style={styles.error}>Select a state</Text> : null}
        {stateOpen ? (
          <View style={styles.menu}>
            {STATES.map((name) => (
              <Pressable key={name} style={styles.menuItem} onPress={() => { set('state', name); setStateOpen(false); }}>
                <Text style={styles.fieldValue}>{name}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Text style={styles.note}>Delivery availability can’t be confirmed. No serviceability check is connected.</Text>
        <Pressable style={styles.currentWide} onPress={onUseCurrent} accessibilityRole="button">
          {locating ? <ActivityIndicator color={ORANGE} /> : <Text style={styles.currentLabel}>⌖  Use current location instead</Text>}
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.solid} onPress={onSave} accessibilityRole="button">
          <Text style={styles.solidLabel}>Save and continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" hitSlop={12}>
        <Text style={styles.back}>‹</Text>
      </Pressable>
      {title ? <Text style={styles.headerTitle}>{title}</Text> : <View style={{ flex: 1 }} />}
    </View>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  error,
  keyboard = 'default',
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  error?: string | null;
  keyboard?: 'default' | 'number-pad';
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, error ? styles.fieldBad : null]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9AA0A6"
          keyboardType={keyboard}
          inputMode={keyboard === 'number-pad' ? 'numeric' : 'text'}
          style={styles.fieldInput}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function isAddressComplete(draft: AddressDraft) {
  return Boolean(draft.house.trim() && draft.street.trim() && draft.city.trim() && draft.state && /^\d{6}$/.test(draft.pin));
}

function readDeviceLocation(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    const geo = typeof navigator !== 'undefined' ? navigator.geolocation : undefined;
    if (!geo) {
      reject(new Error('unavailable'));
      return;
    }
    geo.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 18, paddingHorizontal: 16, paddingBottom: 8 },
  back: { fontSize: 32, lineHeight: 34, fontWeight: '300', color: INK, width: 28 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: INK },
  askBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  art: { width: 220, height: 160 },
  askTitle: { marginTop: 18, fontSize: 26, fontWeight: '800', color: INK, textAlign: 'center' },
  askCopy: { marginTop: 8, fontSize: 15, lineHeight: 22, fontWeight: '500', color: MUTED, textAlign: 'center' },
  askActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 24 },
  outline: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  outlineLabel: { color: ORANGE, fontSize: 15, fontWeight: '800' },
  solidHalf: { flex: 1, height: 52, borderRadius: 16, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  solid: { height: 54, borderRadius: 16, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  solidLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  search: { marginHorizontal: 16, marginTop: 8, height: 48, borderRadius: 16, backgroundColor: FIELD, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  searchLive: { marginHorizontal: 16, marginTop: 8, height: 48, borderRadius: 16, backgroundColor: FIELD, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  searchIcon: { color: ORANGE, fontSize: 18, fontWeight: '700' },
  searchPlaceholder: { color: '#9AA0A6', fontSize: 15, fontWeight: '500' },
  searchInput: { flex: 1, fontSize: 15, color: INK, paddingVertical: 0 },
  clear: { color: MUTED, fontSize: 16, fontWeight: '700' },
  mapPane: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  banner: { backgroundColor: ORANGE, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  bannerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  bannerCopy: { color: '#FFFFFF', fontWeight: '500', fontSize: 12, marginTop: 2, textAlign: 'center' },
  mapArt: { width: 180, height: 130, marginTop: 18 },
  current: { marginTop: 16, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: ORANGE, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  currentWide: { marginHorizontal: 16, marginTop: 16, marginBottom: 12, height: 48, borderRadius: 16, borderWidth: 1.5, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  currentLabel: { color: ORANGE, fontWeight: '800', fontSize: 15 },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 24, borderTopWidth: 1, borderColor: '#F2F4F7' },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: INK, textAlign: 'center' },
  sheetCopy: { marginTop: 4, fontSize: 13, color: MUTED, textAlign: 'center' },
  disabledBtn: { marginTop: 16, height: 52, borderRadius: 16, backgroundColor: '#E8EAEE', alignItems: 'center', justifyContent: 'center' },
  disabledLabel: { color: '#98A2B3', fontSize: 16, fontWeight: '800' },
  searchBody: { flex: 1, paddingHorizontal: 16, paddingTop: 18 },
  suggestTitle: { fontSize: 16, fontWeight: '800', color: INK },
  empty: { marginTop: 12, fontSize: 14, lineHeight: 20, color: MUTED, fontWeight: '500' },
  formScroll: { paddingBottom: 24 },
  formTitle: { marginTop: 18, marginHorizontal: 16, fontSize: 20, fontWeight: '800', color: INK },
  fieldLabel: { marginTop: 14, marginHorizontal: 16, marginBottom: 6, fontSize: 14, fontWeight: '800', color: INK },
  fieldBox: { marginHorizontal: 16, height: 52, borderRadius: 16, backgroundColor: FIELD, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  fieldInput: { fontSize: 15, color: INK, paddingVertical: 0 },
  field: { marginHorizontal: 16, height: 52, borderRadius: 16, backgroundColor: FIELD, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldValue: { fontSize: 15, fontWeight: '600', color: INK },
  fieldPlaceholder: { fontSize: 15, color: '#9AA0A6' },
  fieldBad: { borderWidth: 1.5, borderColor: '#D92D20' },
  caret: { color: MUTED, fontSize: 14 },
  split: { flexDirection: 'row', gap: 10 },
  error: { marginTop: 6, marginHorizontal: 16, color: '#D92D20', fontSize: 12, fontWeight: '600' },
  note: { marginTop: 14, marginHorizontal: 16, color: MUTED, fontSize: 13, lineHeight: 18, fontWeight: '500' },
  menu: { marginHorizontal: 16, marginTop: 8, borderRadius: 14, borderWidth: 1, borderColor: '#E8EAED', backgroundColor: '#FFFFFF' },
  menuItem: { paddingHorizontal: 14, paddingVertical: 12 },
  footer: { paddingHorizontal: 16, paddingBottom: 16 },
});
