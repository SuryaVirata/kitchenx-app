import { createElement, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';
import { AuthHeader } from '../auth/AuthScreens';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#667085';
const FIELD = colors.field;

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

type Place = {
  id: string;
  name: string;
  area: string;
  line: string;
  street: string;
  city: string;
  state: string;
  pin: string;
};

const PLACES: Place[] = [
  {
    id: 'ambedkar-nagar',
    name: 'Ambedkar Nagar',
    area: 'Ramaraju Peta, Tadepalligudem, Andhra Pradesh',
    line: 'Ramaraju Peta, Tadepalligudem, Andhra Pradesh, India',
    street: 'Ramaraju Peta',
    city: 'Tadepalligudem',
    state: 'Andhra Pradesh',
    pin: '534101',
  },
  {
    id: 'tadepalligudem',
    name: 'Tadepalligudem',
    area: 'West Godavari, Andhra Pradesh',
    line: 'West Godavari, Andhra Pradesh, India',
    street: 'West Godavari',
    city: 'Tadepalligudem',
    state: 'Andhra Pradesh',
    pin: '534101',
  },
  {
    id: 'main-road',
    name: 'Main Road',
    area: 'Near Ambedkar Nagar, Tadepalligudem',
    line: 'Near Ambedkar Nagar, Tadepalligudem, Andhra Pradesh, India',
    street: 'Main Road',
    city: 'Tadepalligudem',
    state: 'Andhra Pradesh',
    pin: '534101',
  },
  {
    id: 'banjara-hills',
    name: 'Banjara Hills',
    area: 'Road No 12, Hyderabad, Telangana',
    line: 'Road No 12, Banjara Hills, Hyderabad, Telangana, India',
    street: 'Road No 12',
    city: 'Hyderabad',
    state: 'Telangana',
    pin: '500034',
  },
  {
    id: 'hitech-city',
    name: 'Hitech City',
    area: 'Madhapur, Hyderabad, Telangana',
    line: 'Madhapur, Hitech City, Hyderabad, Telangana, India',
    street: 'Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pin: '500081',
  },
];

function SearchMark() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.2"/><path d="M16.2 16.2 20.2 20.2"/></svg>`;
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (Platform.OS === 'web') {
    return createElement('img', {
      src: uri,
      width: 18,
      height: 18,
      alt: '',
      style: { width: 18, height: 18, display: 'block' },
    });
  }
  return <Image source={{ uri }} style={{ width: 18, height: 18 }} accessibilityLabel="Search" />;
}

function selectedPlace(id: string): Place {
  const found = PLACES.find((place) => place.id === id);
  if (found) return found;
  const first = PLACES[0];
  if (!first) throw new Error('Location list is empty');
  return first;
}

function matchingPlaces(query: string): Place[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return PLACES;
  return PLACES.filter((place) => `${place.name} ${place.area} ${place.line}`.toLowerCase().includes(needle));
}

export function DeliveryLocationFlow({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: (city: string) => void;
}) {
  const [step, setStep] = useState<Step>('ask');
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY);
  const [tried, setTried] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [searchFrom, setSearchFrom] = useState<Step>('map');
  const searchFromRef = useRef<Step>('map');
  const [placeId, setPlaceId] = useState(selectedPlace('ambedkar-nagar').id);
  const [canConfirm, setCanConfirm] = useState(false);
  const place = selectedPlace(placeId);

  const fillFromPlace = (next: Place) => {
    setPlaceId(next.id);
    setDraft((current) => ({
      ...current,
      street: next.street,
      city: next.city,
      state: next.state,
      pin: next.pin,
    }));
  };

  const locate = async () => {
    setCanConfirm(true);
    setLocating(true);
    try {
      await readDeviceLocation();
    } catch {
      // The phone did not share a point. The place on screen can still be confirmed.
    } finally {
      setLocating(false);
    }
  };

  const useHyderabad = () => {
    fillFromPlace(selectedPlace('banjara-hills'));
    setStep('manual');
  };

  const openSearch = (from: Step) => {
    searchFromRef.current = from;
    setSearchFrom(from);
    setStep('search');
  };

  const pickPlace = (next: Place) => {
    const fromForm = searchFromRef.current === 'manual';
    if (fromForm) fillFromPlace(next);
    else setPlaceId(next.id);
    setQuery('');
    setStep(fromForm ? 'manual' : 'map');
  };

  if (step === 'search') {
    return (
      <SearchScreen
        query={query}
        onQuery={setQuery}
        onBack={() => setStep(searchFrom)}
        onPick={pickPlace}
        onUseCurrent={() => {
          void locate();
          setStep('map');
        }}
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
        onSearch={() => openSearch('manual')}
        onUseCurrent={useHyderabad}
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
        place={place}
        canConfirm={canConfirm}
        onBack={() => setStep('ask')}
        onSearch={() => openSearch('map')}
        onUseCurrent={locate}
        onConfirm={() => onSave(place.city)}
        locating={locating}
      />
    );
  }

  return (
    <View style={styles.root}>
      <AuthHeader onBack={onBack} />
      <View style={styles.askBody}>
        <Image source={require('../../../assets/location-pin-map.png')} resizeMode="contain" style={styles.art} accessibilityLabel="Map pin" />
        <Text style={styles.askTitle}>Allow location access</Text>
        <Text style={styles.askCopy}>Use your location to find delivery availability near you.</Text>
      </View>
      <View style={styles.askActions}>
        <Pressable style={styles.outline} onPress={() => setStep('manual')} accessibilityRole="button">
          <Text style={styles.outlineLabel}>Add address</Text>
        </Pressable>
        <Pressable style={styles.solidHalf} onPress={() => setStep('map')} accessibilityRole="button">
          <Text style={styles.solidLabel}>Allow location</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MapScreen({
  place,
  canConfirm,
  onBack,
  onSearch,
  onUseCurrent,
  onConfirm,
  locating,
}: {
  place: Place;
  canConfirm: boolean;
  onBack: () => void;
  onSearch: () => void;
  onUseCurrent: () => void;
  onConfirm: () => void;
  locating: boolean;
}) {
  return (
    <View style={styles.root}>
      <Header title="Delivery Location" onBack={onBack} />
      <Pressable style={styles.search} onPress={onSearch} accessibilityRole="button" accessibilityLabel="Search for area, street name">
        <SearchMark />
        <Text style={styles.searchPlaceholder}>Search for area, street name</Text>
      </Pressable>
      <View style={styles.mapPane}>
        <MapGround />
        <View style={styles.mapCenter} pointerEvents="none">
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>We don't deliver to this area yet</Text>
            <Text style={styles.bannerCopy}>Move pin to adjust exact location</Text>
          </View>
          <View style={styles.bannerTip} />
          <View style={styles.pin}>
            <View style={styles.pinHead}>
              <View style={styles.pinDot} />
            </View>
            <View style={styles.pinTail} />
          </View>
        </View>
        <Pressable style={styles.current} onPress={onUseCurrent} accessibilityRole="button">
          {locating ? <ActivityIndicator color={ORANGE} /> : <Text style={styles.currentLabel}>⌖  Use current location</Text>}
        </Pressable>
      </View>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{place.name}</Text>
        <Text style={styles.sheetCopy}>{place.line}</Text>
        <Pressable
          style={canConfirm ? styles.solid : styles.disabledBtn}
          onPress={canConfirm ? onConfirm : undefined}
          disabled={!canConfirm}
          accessibilityRole="button"
          accessibilityLabel="Confirm location"
          accessibilityState={{ disabled: !canConfirm }}
        >
          <Text style={canConfirm ? styles.solidLabel : styles.disabledLabel}>Confirm location</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MapGround() {
  return (
    <View style={styles.mapGround} pointerEvents="none">
      <View style={[styles.road, { top: '22%' }]} />
      <View style={[styles.road, { top: '48%', height: 16 }]} />
      <View style={[styles.road, { top: '74%', width: '70%', left: '15%' }]} />
      <View style={[styles.roadV, { left: '28%' }]} />
      <View style={[styles.roadV, { left: '62%', width: 14 }]} />
      <View style={styles.river} />
    </View>
  );
}

function SearchScreen({
  query,
  onQuery,
  onBack,
  onPick,
  onUseCurrent,
  locating,
}: {
  query: string;
  onQuery: (value: string) => void;
  onBack: () => void;
  onPick: (place: Place) => void;
  onUseCurrent: () => void;
  locating: boolean;
}) {
  const places = matchingPlaces(query);
  return (
    <View style={styles.root}>
      <Header title="Delivery Location" onBack={onBack} />
      <View style={styles.searchLive}>
        <SearchMark />
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
      <ScrollView style={styles.searchBody} keyboardShouldPersistTaps="handled">
        <Text style={styles.suggestTitle}>Suggested locations</Text>
        {places.length === 0 ? <Text style={styles.empty}>No matching places.</Text> : null}
        {places.map((item, index) => (
          <Pressable
            key={item.id}
            style={[styles.suggestRow, index === 0 ? styles.suggestOn : null]}
            onPress={() => onPick(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.area}`}
          >
            <Text style={styles.suggestPin}>📍</Text>
            <View style={styles.suggestCopy}>
              <Text style={styles.suggestName}>{item.name}</Text>
              <Text style={styles.suggestArea}>{item.area}</Text>
            </View>
            <Text style={styles.suggestGo}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
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
          <SearchMark />
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
      { enableHighAccuracy: false, timeout: 4000 },
    );
  });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white, width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 18, paddingHorizontal: 16, paddingBottom: 8 },
  back: { fontSize: 32, lineHeight: 34, fontWeight: '300', color: INK, width: 28 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: INK },
  askBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  art: { width: 268, height: 178 },
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
  searchPlaceholder: { color: '#9AA0A6', fontSize: 15, fontWeight: '500' },
  searchInput: { flex: 1, fontSize: 15, color: INK, paddingVertical: 0 },
  clear: { color: MUTED, fontSize: 16, fontWeight: '700' },
  mapPane: { flex: 1, marginTop: 8, overflow: 'hidden', justifyContent: 'flex-end' },
  mapGround: { ...StyleSheet.absoluteFill, backgroundColor: '#E7EFE4' },
  road: { position: 'absolute', left: 0, right: 0, height: 10, backgroundColor: '#F7F4EE' },
  roadV: { position: 'absolute', top: 0, bottom: 0, width: 10, backgroundColor: '#F7F4EE' },
  river: { position: 'absolute', top: -40, bottom: -40, right: '18%', width: 28, backgroundColor: '#C5D7E8', transform: [{ rotate: '18deg' }] },
  mapCenter: { position: 'absolute', top: '18%', left: 0, right: 0, alignItems: 'center' },
  banner: { backgroundColor: ORANGE, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', maxWidth: 280 },
  bannerTitle: { color: colors.white, fontWeight: '800', fontSize: 14, textAlign: 'center' },
  bannerCopy: { color: colors.white, fontWeight: '500', fontSize: 12, marginTop: 2, textAlign: 'center' },
  bannerTip: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: ORANGE, marginBottom: 6 },
  pin: { alignItems: 'center' },
  pinHead: { width: 28, height: 28, borderRadius: 14, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  pinDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  pinTail: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: INK, marginTop: -2 },
  current: { alignSelf: 'center', marginBottom: 18, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: ORANGE, backgroundColor: colors.white, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  currentWide: { marginHorizontal: 16, marginTop: 16, marginBottom: 12, height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: ORANGE, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  currentLabel: { color: ORANGE, fontWeight: '800', fontSize: 15 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 16 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: INK, textAlign: 'center' },
  sheetCopy: { marginTop: 6, fontSize: 14, lineHeight: 20, color: MUTED, textAlign: 'center' },
  disabledBtn: { marginTop: 16, height: 52, borderRadius: 16, backgroundColor: '#E8EAEE', alignItems: 'center', justifyContent: 'center' },
  disabledLabel: { color: '#98A2B3', fontSize: 16, fontWeight: '800' },
  searchBody: { flex: 1, paddingHorizontal: 16, paddingTop: 18 },
  suggestTitle: { fontSize: 16, fontWeight: '800', color: INK, marginBottom: 12 },
  suggestRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 16 },
  suggestOn: { backgroundColor: '#FFF1EC' },
  suggestPin: { fontSize: 18 },
  suggestCopy: { flex: 1 },
  suggestName: { fontSize: 16, fontWeight: '800', color: INK },
  suggestArea: { marginTop: 2, fontSize: 13, lineHeight: 18, color: MUTED, fontWeight: '500' },
  suggestGo: { fontSize: 22, color: '#98A2B3', fontWeight: '400' },
  empty: { marginTop: 4, fontSize: 14, lineHeight: 20, color: MUTED, fontWeight: '500' },
  formScroll: { paddingBottom: 24 },
  formTitle: { marginTop: 18, marginHorizontal: 16, fontSize: 20, fontWeight: '800', color: INK },
  fieldLabel: { marginTop: 14, marginHorizontal: 16, marginBottom: 10, fontSize: 14, fontWeight: '800', color: INK },
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
