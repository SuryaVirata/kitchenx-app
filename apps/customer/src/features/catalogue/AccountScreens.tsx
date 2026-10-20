import { createElement, useMemo, useState, type ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#6B7280';
const LINE = '#EEF0F3';
const CANVAS = '#F5F6F8';

type Page = 'home' | 'profile' | 'outlets' | 'orders' | 'spend' | 'statement' | 'help' | 'wallet' | 'payments' | 'notifications';

type Outlet = { id: string; name: string; area: string; distance: string };

const STARTER_OUTLETS: Outlet[] = [
  { id: 'madhapur', name: 'Madhapur', area: 'Madhapur, Hyderabad', distance: '1.2 km away' },
  { id: 'jubilee', name: 'Jubilee Hills', area: 'Jubilee Hills, Hyderabad', distance: '4.8 km away' },
  { id: 'gachibowli', name: 'Gachibowli', area: 'Gachibowli, Hyderabad', distance: '7.2 km away' },
];

const ORDERS = [
  { id: 'KXOD2501001', date: '17 Oct 2026', amount: '₹1,248', status: 'Delivered' },
  { id: 'KXOD2500998', date: '15 Oct 2026', amount: '₹2,430', status: 'On the way' },
  { id: 'KXOD2500995', date: '14 Oct 2026', amount: '₹3,210', status: 'Delivered' },
  { id: 'KXOD2500992', date: '12 Oct 2026', amount: '₹620', status: 'Cancelled' },
  { id: 'KXOD2500991', date: '10 Oct 2026', amount: '₹1,980', status: 'Delivered' },
] as const;

const SPEND = [
  { name: 'Fresh Vegetables', amount: '₹28,450', share: '22%', image: require('../../../assets/shop/tomato.png') },
  { name: 'Meat, Chicken & Seafood', amount: '₹24,320', share: '19%', image: require('../../../assets/shop/chicken.png') },
  { name: 'Dairy & Eggs', amount: '₹18,650', share: '15%', image: require('../../../assets/shop/eggs.png') },
  { name: 'Oils, Masala & Spices', amount: '₹16,220', share: '13%', image: require('../../../assets/shop/oil.png') },
  { name: 'Atta, Rice & Pulses', amount: '₹14,980', share: '12%', image: require('../../../assets/shop/rice.png') },
];

const MONTH_BARS = [
  { label: '1-7', value: 32 },
  { label: '8-14', value: 50 },
  { label: '15-21', value: 64 },
  { label: '22-30', value: 56 },
];

const WEEK_BARS = [
  { label: 'Mon', value: 18 },
  { label: 'Tue', value: 28 },
  { label: 'Wed', value: 22 },
  { label: 'Thu', value: 36 },
];

function glyph(body: string, color = '#6B7280') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const PIN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF4F18" d="M12 2.2a6.8 6.8 0 0 0-6.8 6.8c0 5 6.8 12.8 6.8 12.8s6.8-7.8 6.8-12.8A6.8 6.8 0 0 0 12 2.2Zm0 9.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z"/></svg>';
const CART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="20.2" r="1.35" fill="#141517" stroke="none"/><circle cx="18" cy="20.2" r="1.35" fill="#141517" stroke="none"/><path d="M2.4 3.2h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.45h8.7a1.8 1.8 0 0 0 1.75-1.4l1.5-6.8H5.6"/></svg>';

const ICONS = {
  orders: glyph('<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  spend: glyph('<path d="M5 19V10M10 19V6M15 19v-7M20 19V8"/>'),
  statement: glyph('<path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14 3.8V9h5"/>'),
  help: glyph('<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14"/><path d="M12 17h.01"/>'),
  wallet: glyph('<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17"/><circle cx="16.5" cy="14" r="1" fill="#6B7280" stroke="none"/>'),
  card: glyph('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>'),
  profile: glyph('<circle cx="12" cy="8" r="3"/><path d="M6 19c.8-3 2.8-4.5 6-4.5s5.2 1.5 6 4.5"/>'),
  outlets: glyph('<path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-6h6v6"/>'),
  business: glyph('<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-5h6v5M4 20h16"/>'),
  veg: glyph('<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.3 2.3 4.7-5"/>', '#16A34A'),
  bell: glyph('<path d="M6.5 16.5h11"/><path d="M7.2 16.5V10a4.8 4.8 0 0 1 9.6 0v6.5"/><path d="M10 17.6a2 2 0 0 0 4 0"/>'),
  pin: glyph('<path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z"/><circle cx="12" cy="11" r="2"/>', ORANGE),
  pencil: glyph('<path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13 7 4 4"/>', ORANGE),
  camera: glyph('<path d="M4 8h3l1.5-2h7L17 8h3v10H4V8Z"/><circle cx="12" cy="13" r="3"/>', '#FFFFFF'),
  phone: glyph('<path d="M7 3.5h3l1.2 3-2 1.2a12 12 0 0 0 5.1 5.1l1.2-2 3 1.2v3A2 2 0 0 1 16.4 17 14.5 14.5 0 0 1 7 7.6 2 2 0 0 1 7 3.5Z"/>', ORANGE),
  chat: glyph('<path d="M5 16.5 3.5 20 8 17.5h8A3.5 3.5 0 0 0 19.5 14V7.5A3.5 3.5 0 0 0 16 4H8A3.5 3.5 0 0 0 4.5 7.5V14A2.5 2.5 0 0 0 5 16.5Z"/>', ORANGE),
  calendar: glyph('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 3.5v3M16 3.5v3M4 9h16"/>'),
  store: glyph('<path d="M4 10h16v9H4Z"/><path d="M3 10 5 5h14l2 5"/><path d="M10 19v-5h4v5"/>'),
};

function Icon({ svg, size = 20 }: { svg: string; size?: number }) {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (Platform.OS === 'web') {
    return createElement('img', {
      src: uri,
      alt: '',
      width: size,
      height: size,
      draggable: false,
      style: { width: size, height: size, display: 'block', pointerEvents: 'none', userSelect: 'none' },
    });
  }
  return <Image source={{ uri }} style={{ width: size, height: size }} />;
}

function statusTone(status: string) {
  if (status === 'Cancelled') return { bg: '#FDECEC', fg: '#E11D48' };
  if (status === 'On the way') return { bg: '#FFF1E8', fg: ORANGE };
  return { bg: '#E8F8EF', fg: '#16A34A' };
}

export function AccountFlow({
  city,
  cartCount,
  onDeliver,
  onCart,
  onHome,
  onRegister,
  footer,
}: {
  city: string;
  cartCount: number;
  onDeliver?: () => void;
  onCart: () => void;
  onHome: () => void;
  onRegister?: () => void;
  footer: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState<Page>('home');
  const [outlets, setOutlets] = useState<Outlet[]>(STARTER_OUTLETS);
  const [outletId, setOutletId] = useState(STARTER_OUTLETS[0].id);
  const [switching, setSwitching] = useState(false);
  const [veg, setVeg] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Prasad Madhapur',
    email: 'prasad@kitchenx.com',
    phone: '+91 98765 43210',
    business: 'Madhapur Restaurant',
    type: 'Restaurant',
    gst: '24AAAGM0289C1ZP',
    fssai: '',
    address: 'Madhapur, Hyderabad, Telangana - 500081',
  });
  const outlet = outlets.find((item) => item.id === outletId) ?? outlets[0];
  const frame = width > 600 ? { width: 480, alignSelf: 'center' as const } : null;

  return (
    <View style={[styles.screen, Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : null, frame]}>
      <View style={[styles.brandBar, { paddingTop: Platform.OS === 'web' ? 12 : 46 }]}>
        <Pressable onPress={onHome} accessibilityRole="button" accessibilityLabel="KitchenX home">
          <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.brandLogo} resizeMode="contain" />
        </Pressable>
        <Pressable onPress={onDeliver} accessibilityRole="button" accessibilityLabel={`Deliver to ${city}`} style={styles.brandLoc}>
          <Icon svg={PIN} size={16} />
          <View style={styles.brandLocCopy}>
            <Text style={styles.brandLocLabel}>Deliver to</Text>
            <Text style={styles.brandLocCity} numberOfLines={1}>{city} ▾</Text>
          </View>
        </Pressable>
        <Pressable onPress={onCart} accessibilityRole="button" accessibilityLabel="Cart" style={styles.cartBtn}>
          <Icon svg={CART} size={24} />
          {cartCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
      {page === 'home' ? (
        <AccountHome
          name={profile.name}
          outlet={outlet}
          veg={veg}
          onVeg={() => setVeg((current) => !current)}
          onOpen={setPage}
          onSwitch={() => setSwitching(true)}
          onRegister={onRegister}
        />
      ) : null}
      {page === 'profile' ? <ProfilePage profile={profile} onChange={setProfile} onBack={() => setPage('home')} /> : null}
      {page === 'outlets' ? (
        <OutletsPage
          outlets={outlets}
          outletId={outletId}
          onChange={setOutlets}
          onSelect={setOutletId}
          onBack={() => setPage('home')}
        />
      ) : null}
      {page === 'orders' ? <OrdersPage onBack={() => setPage('home')} /> : null}
      {page === 'spend' ? <SpendPage onBack={() => setPage('home')} /> : null}
      {page === 'statement' ? <StatementPage onBack={() => setPage('home')} /> : null}
      {page === 'help' ? <HelpPage onBack={() => setPage('home')} /> : null}
      {page === 'wallet' ? <WalletPage onBack={() => setPage('home')} /> : null}
      {page === 'payments' ? <PaymentsPage onBack={() => setPage('home')} /> : null}
      {page === 'notifications' ? <NotificationsPage onBack={() => setPage('home')} /> : null}
      {footer}
      {switching && outlet ? (
        <SwitchSheet
          outlets={outlets}
          outletId={outlet.id}
          onClose={() => setSwitching(false)}
          onSwitch={(id) => {
            setOutletId(id);
            setSwitching(false);
          }}
        />
      ) : null}
    </View>
  );
}

function AccountHome({
  name,
  outlet,
  veg,
  onVeg,
  onOpen,
  onSwitch,
  onRegister,
}: {
  name: string;
  outlet: Outlet;
  veg: boolean;
  onVeg: () => void;
  onOpen: (page: Page) => void;
  onSwitch: () => void;
  onRegister?: () => void;
}) {
  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}><Text style={styles.avatarText}>PM</Text></View>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileRole}>Restaurant Owner</Text>
            </View>
          </View>
          <View style={styles.profileRule} />
          <View style={styles.outletRow}>
            <Icon svg={ICONS.pin} size={18} />
            <View style={styles.outletCopy}>
              <Text style={styles.outletName}>{outlet.name} Outlet</Text>
              <Text style={styles.outletMeta}>{outlet.distance}</Text>
            </View>
            <Pressable style={styles.switchBtn} onPress={onSwitch} accessibilityRole="button" accessibilityLabel="Switch outlet">
              <Text style={styles.switchText}>Switch</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ORDERS & STATEMENTS</Text>
        <View style={styles.card}>
          <Row icon={ICONS.orders} label="Your orders" onPress={() => onOpen('orders')} />
          <Row icon={ICONS.spend} label="Food cost summary" onPress={() => onOpen('spend')} />
          <Row icon={ICONS.statement} label="Account statement" onPress={() => onOpen('statement')} />
          <Row icon={ICONS.help} label="Need help" onPress={() => onOpen('help')} last />
        </View>

        <Text style={styles.sectionLabel}>WALLET & PAYMENT</Text>
        <View style={styles.card}>
          <Row icon={ICONS.wallet} label="KitchenX wallet" trailing={<View style={styles.moneyPill}><Text style={styles.moneyText}>₹300</Text></View>} onPress={() => onOpen('wallet')} />
          <Row icon={ICONS.card} label="Manage payment options" onPress={() => onOpen('payments')} last />
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
        <View style={styles.card}>
          <Row icon={ICONS.profile} label="Profile settings" onPress={() => onOpen('profile')} />
          <Row icon={ICONS.outlets} label="Manage outlets" onPress={() => onOpen('outlets')} />
          <Row icon={ICONS.business} label="Register as business" badge="NEW" onPress={onRegister} />
          <View style={styles.row}>
            <Icon svg={ICONS.veg} size={22} />
            <Text style={styles.rowLabel}>Veg mode</Text>
            <Toggle on={veg} onPress={onVeg} label="Veg mode" />
          </View>
          <Row icon={ICONS.bell} label="Notification preferences" onPress={() => onOpen('notifications')} last />
        </View>
      </ScrollView>
    </>
  );
}

function Row({
  icon,
  label,
  onPress,
  last,
  badge,
  trailing,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  last?: boolean;
  badge?: string;
  trailing?: ReactNode;
}) {
  return (
    <Pressable style={[styles.row, !last && styles.rowLine]} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Icon svg={icon} size={22} />
      <Text style={styles.rowLabel}>{label}</Text>
      {badge ? <View style={styles.newBadge}><Text style={styles.newText}>{badge}</Text></View> : null}
      {trailing}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function Toggle({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: on }} style={[styles.track, on && styles.trackOn]}>
      <View style={[styles.knob, on && styles.knobOn]} />
    </Pressable>
  );
}

function Subhead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.nav}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.backHit}>
        <Text style={styles.back}>‹</Text>
      </Pressable>
      <Text style={styles.navTitle}>{title}</Text>
      <View style={styles.backHit} />
    </View>
  );
}

function ProfilePage({
  profile,
  onChange,
  onBack,
}: {
  profile: { name: string; email: string; phone: string; business: string; type: string; gst: string; fssai: string; address: string };
  onChange: (next: typeof profile) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState<string | null>(null);
  const [typesOpen, setTypesOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (key: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      <Subhead title="Profile settings" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <View style={styles.avatarLg}><Text style={styles.avatarTextLg}>PM</Text></View>
          <View style={styles.camera}><Icon svg={ICONS.camera} size={14} /></View>
        </View>
        <Field label="Full name" value={draft.name} editing={editing === 'name'} onEdit={() => setEditing('name')} onChange={(value) => set('name', value)} />
        <Field label="Email address" value={draft.email} editing={editing === 'email'} onEdit={() => setEditing('email')} onChange={(value) => set('email', value)} />
        <Field label="Phone number" value={draft.phone} editing={editing === 'phone'} onEdit={() => setEditing('phone')} onChange={(value) => set('phone', value)} />
        <Text style={styles.blockTitle}>Business details</Text>
        <Field label="Business name" value={draft.business} editing={editing === 'business'} onEdit={() => setEditing('business')} onChange={(value) => set('business', value)} />
        <Pressable style={styles.field} onPress={() => setTypesOpen((current) => !current)} accessibilityRole="button" accessibilityLabel="Business type">
          <View style={styles.fieldCopy}>
            <Text style={styles.fieldLabel}>Business type</Text>
            <Text style={styles.fieldValue}>{draft.type}</Text>
          </View>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        {typesOpen ? (
          <View style={styles.card}>
            {['Restaurant', 'Cloud kitchen', 'Cafe', 'Hotel'].map((type, index, list) => (
              <Pressable key={type} style={[styles.row, index < list.length - 1 && styles.rowLine]} onPress={() => { set('type', type); setTypesOpen(false); }} accessibilityRole="button">
                <Text style={[styles.rowLabel, type === draft.type && styles.rowOn]}>{type}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={styles.field}>
          <View style={styles.fieldCopy}>
            <Text style={styles.fieldLabel}>GST registration</Text>
            <View style={styles.inlineStatus}>
              <View style={styles.okDot} />
              <Text style={styles.okText}>Registered</Text>
            </View>
            {editing === 'gst' ? (
              <TextInput value={draft.gst} onChangeText={(value) => set('gst', value)} style={styles.fieldInput} />
            ) : (
              <Text style={styles.fieldValue}>{draft.gst}</Text>
            )}
          </View>
          <Pressable onPress={() => setEditing('gst')} accessibilityRole="button" accessibilityLabel="Edit GST"><Text style={styles.edit}>Edit</Text></Pressable>
        </View>
        <View style={styles.field}>
          <View style={styles.fieldCopy}>
            <Text style={styles.fieldLabel}>FSSAI details</Text>
            {draft.fssai ? <Text style={styles.fieldValue}>{draft.fssai}</Text> : (
              <View style={styles.inlineStatus}>
                <View style={styles.warnDot} />
                <Text style={styles.warnText}>Not provided</Text>
              </View>
            )}
            {editing === 'fssai' ? <TextInput value={draft.fssai} onChangeText={(value) => set('fssai', value)} placeholder="FSSAI number" placeholderTextColor="#9CA3AF" style={styles.fieldInput} /> : null}
          </View>
          <Pressable onPress={() => setEditing('fssai')} accessibilityRole="button" accessibilityLabel={draft.fssai ? 'Edit FSSAI' : 'Add FSSAI'}>
            <Text style={styles.edit}>{draft.fssai ? 'Edit' : 'Add'}</Text>
          </Pressable>
        </View>
        <Field label="Address" value={draft.address} editing={editing === 'address'} onEdit={() => setEditing('address')} onChange={(value) => set('address', value)} />
        <Pressable
          style={styles.save}
          onPress={() => {
            onChange(draft);
            setEditing(null);
            setSaved(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
        >
          <Text style={styles.saveText}>{saved ? 'Saved' : 'Save changes'}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function Field({ label, value, editing, onEdit, onChange }: { label: string; value: string; editing: boolean; onEdit: () => void; onChange: (value: string) => void }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editing ? <TextInput value={value} onChangeText={onChange} style={styles.fieldInput} /> : <Text style={styles.fieldValue}>{value}</Text>}
      </View>
      <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel={`Edit ${label}`}><Text style={styles.edit}>Edit</Text></Pressable>
    </View>
  );
}

function OutletsPage({
  outlets,
  outletId,
  onChange,
  onSelect,
  onBack,
}: {
  outlets: Outlet[];
  outletId: string;
  onChange: (next: Outlet[]) => void;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', area: '' });
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <>
      <Subhead title="Manage outlets" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {outlets.map((item) => (
          <View key={item.id} style={styles.outletCard}>
            <View style={styles.outletIcon}><Icon svg={ICONS.outlets} size={18} /></View>
            <View style={styles.outletCopy}>
              {editing === item.id ? (
                <>
                  <TextInput value={item.name} onChangeText={(name) => onChange(outlets.map((row) => (row.id === item.id ? { ...row, name } : row)))} style={styles.fieldInput} />
                  <TextInput value={item.area} onChangeText={(area) => onChange(outlets.map((row) => (row.id === item.id ? { ...row, area } : row)))} style={styles.fieldInput} />
                </>
              ) : (
                <>
                  <View style={styles.nameLine}>
                    <Text style={styles.outletName}>{item.name}</Text>
                    {item.id === outletId ? <View style={styles.defaultPill}><Text style={styles.defaultText}>Default</Text></View> : null}
                  </View>
                  <Text style={styles.outletArea}>{item.area}</Text>
                  <View style={styles.distanceLine}>
                    <Icon svg={ICONS.pin} size={14} />
                    <Text style={styles.outletMeta}>{item.distance}</Text>
                  </View>
                </>
              )}
            </View>
            <Pressable onPress={() => setEditing(editing === item.id ? null : item.id)} accessibilityRole="button" accessibilityLabel={`Edit ${item.name}`}>
              <Icon svg={ICONS.pencil} size={18} />
            </Pressable>
          </View>
        ))}
        {adding ? (
          <View style={styles.field}>
            <View style={styles.fieldCopy}>
              <TextInput value={draft.name} onChangeText={(name) => setDraft((current) => ({ ...current, name }))} placeholder="Outlet name" placeholderTextColor="#9CA3AF" style={styles.fieldInput} />
              <TextInput value={draft.area} onChangeText={(area) => setDraft((current) => ({ ...current, area }))} placeholder="Area, city" placeholderTextColor="#9CA3AF" style={styles.fieldInput} />
            </View>
          </View>
        ) : null}
        <Pressable
          style={styles.outlineBtn}
          onPress={() => {
            if (!adding) {
              setAdding(true);
              return;
            }
            const name = draft.name.trim();
            if (!name) return;
            const id = name.toLowerCase().replace(/\s+/g, '-');
            onChange([...outlets, { id, name, area: draft.area.trim() || name, distance: 'New outlet' }]);
            onSelect(id);
            setDraft({ name: '', area: '' });
            setAdding(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new outlet"
        >
          <Text style={styles.outlineText}>{adding ? 'Save outlet' : '+  Add new outlet'}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function SwitchSheet({
  outlets,
  outletId,
  onClose,
  onSwitch,
}: {
  outlets: Outlet[];
  outletId: string;
  onClose: () => void;
  onSwitch: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(outletId);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return outlets.filter((item) => !q || item.name.toLowerCase().includes(q) || item.area.toLowerCase().includes(q));
  }, [outlets, query]);

  return (
    <View style={styles.sheetWrap}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close switch outlet" />
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle}>Switch outlet</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close"><Text style={styles.sheetClose}>×</Text></Pressable>
        </View>
        <View style={styles.search}>
          <Text style={styles.searchMark}>⌕</Text>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search outlet name or area..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>
        {shown.map((item) => (
          <Pressable key={item.id} style={styles.radioRow} onPress={() => setPicked(item.id)} accessibilityRole="radio" accessibilityState={{ selected: picked === item.id }}>
            <View style={styles.radioCopy}>
              <Text style={styles.outletName}>{item.name}</Text>
              <Text style={styles.outletArea}>{item.area}</Text>
              <Text style={styles.outletMeta}>{item.distance}</Text>
            </View>
            <View style={[styles.radio, picked === item.id && styles.radioOn]}>{picked === item.id ? <View style={styles.radioDot} /> : null}</View>
          </Pressable>
        ))}
        <Pressable style={styles.save} onPress={() => onSwitch(picked)} accessibilityRole="button" accessibilityLabel="Switch outlet">
          <Text style={styles.saveText}>Switch outlet</Text>
        </Pressable>
      </View>
    </View>
  );
}

function OrdersPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Subhead title="Your orders" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {ORDERS.map((order) => <OrderCard key={order.id} order={order} />)}
      </ScrollView>
    </>
  );
}

function OrderCard({ order }: { order: (typeof ORDERS)[number] }) {
  const tone = statusTone(order.status);
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderCopy}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderId}>#{order.id}</Text>
        <Text style={styles.orderAmount}>{order.amount}</Text>
      </View>
      <View style={[styles.status, { backgroundColor: tone.bg }]}><Text style={[styles.statusText, { color: tone.fg }]}>{order.status}</Text></View>
    </View>
  );
}

function SpendPage({ onBack }: { onBack: () => void }) {
  const [range, setRange] = useState<'Week' | 'Month'>('Month');
  const bars = range === 'Month' ? MONTH_BARS : WEEK_BARS;
  return (
    <>
      <Subhead title="Food cost summary" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.segment}>
          {(['Week', 'Month'] as const).map((item) => (
            <Pressable key={item} style={[styles.segmentItem, range === item && styles.segmentOn]} onPress={() => setRange(item)} accessibilityRole="button" accessibilityState={{ selected: range === item }}>
              <Text style={[styles.segmentText, range === item && styles.segmentTextOn]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <FilterRow />
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total food cost</Text>
          <View style={styles.totalLine}>
            <Text style={styles.totalValue}>{range === 'Month' ? '₹1,28,450' : '₹32,180'}</Text>
            <View style={styles.delta}><Text style={styles.deltaText}>↓ 12%</Text></View>
          </View>
          <Text style={styles.totalHint}>vs previous {range === 'Month' ? 'month' : 'week'}</Text>
          <View style={styles.chart}>
            <View style={styles.axis}>
              {['75k', '50k', '25k', '0'].map((label) => <Text key={label} style={styles.axisText}>{label}</Text>)}
            </View>
            <View style={styles.bars}>
              {bars.map((bar, index) => (
                <View key={bar.label} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.bar, { height: `${bar.value}%` }, index === 0 && styles.barSoft]} />
                  </View>
                  <Text style={styles.barLabel}>{bar.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.blockTitle}>Top categories by spend</Text>
        <View style={styles.card}>
          {SPEND.map((item, index) => (
            <View key={item.name} style={[styles.spendRow, index < SPEND.length - 1 && styles.rowLine]}>
              <Image source={item.image} style={styles.spendImage} resizeMode="contain" />
              <Text style={styles.rowLabel}>{item.name}</Text>
              <View style={styles.spendMeta}>
                <Text style={styles.spendAmount}>{item.amount}</Text>
                <Text style={styles.spendShare}>{item.share}</Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable style={styles.linkBtn} accessibilityRole="button" accessibilityLabel="View detailed report">
          <Text style={styles.edit}>View detailed report</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function StatementPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'Orders' | 'Wallet'>('Orders');
  return (
    <>
      <Subhead title="Account statement" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.segment}>
          {(['Orders', 'Wallet'] as const).map((item) => (
            <Pressable key={item} style={[styles.segmentItem, tab === item && styles.segmentOn]} onPress={() => setTab(item)} accessibilityRole="button" accessibilityState={{ selected: tab === item }}>
              <Text style={[styles.segmentText, tab === item && styles.segmentTextOn]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <FilterRow />
        {tab === 'Orders' ? (
          <>
            <View style={styles.stats}>
              <Stat label="Total orders" value="48" />
              <Stat label="Total spend" value="₹1,28,450" />
              <Stat label="Average order value" value="₹2,676" />
            </View>
            {ORDERS.map((order) => <OrderCard key={order.id} order={order} />)}
          </>
        ) : (
          <WalletList />
        )}
        <HelpCard />
      </ScrollView>
    </>
  );
}

function FilterRow() {
  return (
    <View style={styles.filterRow}>
      <View style={styles.filter}>
        <Icon svg={ICONS.calendar} size={16} />
        <Text style={styles.filterText} numberOfLines={1}>September 2026</Text>
        <Text style={styles.chevron}>▾</Text>
      </View>
      <View style={styles.filter}>
        <Icon svg={ICONS.store} size={16} />
        <Text style={styles.filterText} numberOfLines={1}>All outlets</Text>
        <Text style={styles.chevron}>▾</Text>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function HelpPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Subhead title="Need help" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.helpLead}>Questions about an order, a payment, or your outlet? The KitchenX team can help.</Text>
        <HelpCard />
      </ScrollView>
    </>
  );
}

function HelpCard() {
  const [note, setNote] = useState('');
  return (
    <View style={styles.helpCard}>
      <View style={styles.helpHead}>
        <Icon svg={ICONS.help} size={22} />
        <View style={styles.helpCopy}>
          <Text style={styles.helpTitle}>Still need help?</Text>
          <Text style={styles.helpSub}>Our team is here for you</Text>
        </View>
      </View>
      <View style={styles.helpActions}>
        <Pressable style={styles.helpBtn} onPress={() => setNote('We will call you on +91 98765 43210')} accessibilityRole="button" accessibilityLabel="Call us">
          <Icon svg={ICONS.phone} size={16} />
          <Text style={styles.helpBtnText}>Call us</Text>
        </Pressable>
        <Pressable style={styles.helpBtn} onPress={() => setNote('Chat opened with KitchenX support')} accessibilityRole="button" accessibilityLabel="Chat with us">
          <Icon svg={ICONS.chat} size={16} />
          <Text style={styles.helpBtnText}>Chat with us</Text>
        </Pressable>
      </View>
      {note ? <Text style={styles.helpNote}>{note}</Text> : null}
    </View>
  );
}

function WalletPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Subhead title="KitchenX wallet" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Available balance</Text>
          <Text style={styles.totalValue}>₹300</Text>
        </View>
        <WalletList />
      </ScrollView>
    </>
  );
}

function WalletList() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.fieldCopy}>
          <Text style={styles.rowLabel}>Welcome credit</Text>
          <Text style={styles.outletMeta}>1 Sep 2026</Text>
        </View>
        <Text style={styles.credit}>+ ₹300</Text>
      </View>
    </View>
  );
}

function PaymentsPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Subhead title="Payment options" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowLine]}>
            <Icon svg={ICONS.wallet} size={22} />
            <View style={styles.fieldCopy}>
              <Text style={styles.rowLabel}>UPI</Text>
              <Text style={styles.outletMeta}>prasad@upi</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon svg={ICONS.card} size={22} />
            <View style={styles.fieldCopy}>
              <Text style={styles.rowLabel}>Card</Text>
              <Text style={styles.outletMeta}>•••• 4242</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function NotificationsPage({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({ orders: true, offers: true, wallet: false });
  const flip = (key: keyof typeof prefs) => setPrefs((current) => ({ ...current, [key]: !current[key] }));
  return (
    <>
      <Subhead title="Notification preferences" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {([
            ['orders', 'Order updates'],
            ['offers', 'Offers and deals'],
            ['wallet', 'Wallet alerts'],
          ] as const).map(([key, label], index, list) => (
            <View key={key} style={[styles.row, index < list.length - 1 && styles.rowLine]}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Toggle on={prefs[key]} onPress={() => flip(key)} label={label} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CANVAS },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  brandBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8, gap: 10, backgroundColor: '#FFFFFF' },
  brandLogo: { width: 104, height: 20 },
  brandLoc: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  brandLocCopy: { flexShrink: 1, minWidth: 0 },
  brandLocLabel: { fontSize: 10, lineHeight: 12, color: MUTED, fontWeight: '500' },
  brandLocCity: { fontSize: 12, lineHeight: 15, fontWeight: '700', color: INK },
  cartBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -6, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(20, 21, 23, 0.06)' } as object,
      default: { shadowColor: '#141517', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
    }),
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFE8DF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: ORANGE, fontWeight: '800', fontSize: 16 },
  profileCopy: { flex: 1 },
  profileName: { color: INK, fontSize: 16, fontWeight: '800' },
  profileRole: { marginTop: 2, color: MUTED, fontSize: 13 },
  profileRule: { height: 1, backgroundColor: LINE, marginVertical: 12 },
  outletRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  outletCopy: { flex: 1 },
  outletName: { color: INK, fontSize: 14, fontWeight: '800' },
  outletMeta: { marginTop: 2, color: MUTED, fontSize: 12 },
  outletArea: { marginTop: 2, color: MUTED, fontSize: 12 },
  switchBtn: { borderWidth: 1, borderColor: ORANGE, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  switchText: { color: ORANGE, fontWeight: '700', fontSize: 13 },
  sectionLabel: { marginTop: 18, marginBottom: 8, marginHorizontal: 16, color: '#98A2B3', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  card: { marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: LINE },
  rowLabel: { flex: 1, color: INK, fontSize: 15, fontWeight: '700' },
  rowOn: { color: ORANGE },
  chevron: { color: '#98A2B3', fontSize: 18, fontWeight: '600' },
  newBadge: { backgroundColor: '#E11D48', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  newText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  moneyPill: { backgroundColor: '#E7F8EE', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  moneyText: { color: '#16A34A', fontSize: 12, fontWeight: '800' },
  track: { width: 44, height: 26, borderRadius: 13, backgroundColor: '#E5E7EB', padding: 3, flexDirection: 'row', alignItems: 'center' },
  trackOn: { backgroundColor: ORANGE },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  knobOn: { marginLeft: 'auto' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 4, paddingBottom: 8, backgroundColor: '#FFFFFF' },
  backHit: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 32, lineHeight: 32, color: INK },
  navTitle: { fontSize: 18, fontWeight: '800', color: INK },
  avatarWrap: { alignSelf: 'center', marginTop: 8, marginBottom: 16 },
  avatarLg: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFE8DF', alignItems: 'center', justifyContent: 'center' },
  avatarTextLg: { color: ORANGE, fontWeight: '800', fontSize: 28 },
  camera: { position: 'absolute', right: 0, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  blockTitle: { marginTop: 16, marginBottom: 8, marginHorizontal: 16, color: INK, fontSize: 16, fontWeight: '800' },
  field: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldCopy: { flex: 1 },
  fieldLabel: { color: MUTED, fontSize: 12 },
  fieldValue: { marginTop: 2, color: INK, fontSize: 15, fontWeight: '700' },
  fieldInput: { marginTop: 4, color: INK, fontSize: 15, fontWeight: '700', paddingVertical: 2 },
  edit: { color: ORANGE, fontWeight: '800', fontSize: 14 },
  inlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  okDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A34A' },
  okText: { color: '#16A34A', fontWeight: '700', fontSize: 13 },
  warnDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E11D48' },
  warnText: { color: '#E11D48', fontWeight: '700', fontSize: 13 },
  save: { marginHorizontal: 16, marginTop: 8, backgroundColor: ORANGE, borderRadius: 24, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  outletCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  outletIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F4F5F7', alignItems: 'center', justifyContent: 'center' },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  defaultPill: { backgroundColor: '#E7F8EE', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { color: '#16A34A', fontSize: 11, fontWeight: '800' },
  distanceLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  outlineBtn: { marginHorizontal: 16, marginTop: 6, borderWidth: 1.5, borderColor: ORANGE, borderRadius: 24, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  outlineText: { color: ORANGE, fontWeight: '800', fontSize: 15 },
  sheetWrap: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', zIndex: 20 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20, 21, 23, 0.35)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 24 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sheetTitle: { color: INK, fontSize: 18, fontWeight: '800' },
  sheetClose: { color: MUTED, fontSize: 28, lineHeight: 28, width: 32, textAlign: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F5F7', borderRadius: 12, paddingHorizontal: 12, marginBottom: 8 },
  searchMark: { color: MUTED, fontSize: 18 },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: INK, fontSize: 14 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: LINE },
  radioCopy: { flex: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D0D5DD' },
  radioOn: { borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ORANGE },
  orderCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center' },
  orderCopy: { flex: 1 },
  orderDate: { color: MUTED, fontSize: 12 },
  orderId: { marginTop: 2, color: INK, fontSize: 13, fontWeight: '700' },
  orderAmount: { marginTop: 4, color: INK, fontSize: 16, fontWeight: '800' },
  status: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '800' },
  segment: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#ECEEF2', borderRadius: 12, flexDirection: 'row', padding: 4 },
  segmentItem: { flex: 1, minHeight: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: INK },
  segmentText: { color: MUTED, fontWeight: '700' },
  segmentTextOn: { color: '#FFFFFF' },
  filterRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 12 },
  filter: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, minHeight: 42, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterText: { flex: 1, color: INK, fontWeight: '700', fontSize: 13 },
  totalCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 },
  totalLabel: { color: MUTED, fontSize: 13 },
  totalLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  totalValue: { color: INK, fontSize: 28, fontWeight: '800' },
  delta: { backgroundColor: '#E7F8EE', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  deltaText: { color: '#16A34A', fontSize: 12, fontWeight: '800' },
  totalHint: { color: MUTED, fontSize: 12, marginTop: 2 },
  chart: { flexDirection: 'row', marginTop: 16, height: 150 },
  axis: { width: 32, justifyContent: 'space-between', paddingBottom: 18 },
  axisText: { color: '#98A2B3', fontSize: 10 },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { width: '70%', height: 120, justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: ORANGE, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barSoft: { backgroundColor: '#FFC7B3' },
  barLabel: { marginTop: 6, color: MUTED, fontSize: 11 },
  spendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  spendImage: { width: 36, height: 36 },
  spendMeta: { alignItems: 'flex-end' },
  spendAmount: { color: INK, fontWeight: '800', fontSize: 13 },
  spendShare: { color: MUTED, fontSize: 12 },
  linkBtn: { alignItems: 'center', paddingVertical: 14 },
  stats: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 14, flexDirection: 'row', paddingVertical: 12 },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statLabel: { color: MUTED, fontSize: 11, textAlign: 'center' },
  statValue: { marginTop: 4, color: INK, fontWeight: '800', fontSize: 14, textAlign: 'center' },
  helpLead: { marginHorizontal: 16, marginBottom: 12, color: MUTED, fontSize: 14, lineHeight: 20 },
  helpCard: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  helpHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  helpCopy: { flex: 1 },
  helpTitle: { color: INK, fontWeight: '800', fontSize: 15 },
  helpSub: { marginTop: 2, color: MUTED, fontSize: 12 },
  helpActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  helpBtn: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: '#FFD7C8', backgroundColor: '#FFF6F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  helpBtnText: { color: ORANGE, fontWeight: '800' },
  helpNote: { marginTop: 10, color: INK, fontSize: 13 },
  credit: { color: '#16A34A', fontWeight: '800' },
});
