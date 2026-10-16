import { createElement, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#6B7280';
const LINE = '#F0F1F3';
const FIELD = colors.field;

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: number;
  category: 'vegetables' | 'fruits' | 'leafy';
  fresh?: boolean;
};

const PRODUCTS: Product[] = [
  { id: 'tomato', name: 'Tomato', unit: '1 kg', price: 40, image: require('../../../assets/shop/tomato.png'), category: 'vegetables', fresh: true },

  { id: 'onion', name: 'Onion', unit: '1 kg', price: 32, image: require('../../../assets/shop/onion.png'), category: 'vegetables' },
  { id: 'potato', name: 'Potato', unit: '1 kg', price: 28, image: require('../../../assets/shop/potato.png'), category: 'vegetables' },
  { id: 'carrot', name: 'Carrot', unit: '1 kg', price: 36, image: require('../../../assets/shop/carrot.png'), category: 'vegetables' },
  { id: 'cucumber', name: 'Cucumber', unit: '1 kg', price: 30, image: require('../../../assets/shop/cucumber.png'), category: 'vegetables' },
  { id: 'capsicum', name: 'Capsicum', unit: '1 kg', price: 48, image: require('../../../assets/shop/capsicum.png'), category: 'vegetables' },
  { id: 'cabbage', name: 'Cabbage', unit: '1 kg', price: 24, image: require('../../../assets/shop/cabbage.png'), category: 'vegetables' },
  { id: 'cauli', name: 'Cauliflower', unit: '1 kg', price: 42, image: require('../../../assets/shop/cauli.png'), category: 'vegetables' },
  { id: 'chilli', name: 'Green Chilli', unit: '250 g', price: 22, image: require('../../../assets/shop/chilli.png'), category: 'vegetables' },
  { id: 'garlic', name: 'Garlic', unit: '250 g', price: 35, image: require('../../../assets/shop/garlic.png'), category: 'vegetables' },
  { id: 'lemon', name: 'Lemon', unit: '500 g', price: 30, image: require('../../../assets/shop/lemon.png'), category: 'fruits', fresh: true },
  { id: 'spinach', name: 'Spinach', unit: '1 bunch', price: 18, image: require('../../../assets/shop/spinach.png'), category: 'leafy', fresh: true },
  { id: 'broccoli', name: 'Broccoli', unit: '1 kg', price: 60, image: require('../../../assets/shop/broccoli.png'), category: 'leafy' },
];

const CATEGORIES = [
  { id: 'vegetables', label: 'Vegetables', image: require('../../../assets/shop/cat-tomato.png') },
  { id: 'fruits', label: 'Fruits', image: require('../../../assets/shop/cat-lemon.png') },
  { id: 'chillies', label: 'Chillies', image: require('../../../assets/shop/cat-chilli.png') },
  { id: 'leafy', label: 'Leafy Greens', image: require('../../../assets/shop/cat-cabbage.png') },
  { id: 'onion', label: 'Onion', image: require('../../../assets/shop/cat-onion.png') },
  { id: 'potato', label: 'Potato', image: require('../../../assets/shop/cat-potato.png') },
  { id: 'dairy', label: 'Dairy', image: require('../../../assets/shop/cat-butter.png') },
  { id: 'eggs', label: 'Eggs', image: require('../../../assets/shop/cat-eggs.png'), fill: true },
  { id: 'chicken', label: 'Chicken', image: require('../../../assets/shop/cat-chicken.png') },
  { id: 'rice', label: 'Rice', image: require('../../../assets/shop/cat-rice.png') },
  { id: 'atta', label: 'Atta & Flour', image: require('../../../assets/shop/cat-atta.png') },
  { id: 'pulses', label: 'Pulses', image: require('../../../assets/shop/cat-dal.png') },
  { id: 'oils', label: 'Oils', image: require('../../../assets/shop/cat-oil.png') },
  { id: 'spices', label: 'Spices', image: require('../../../assets/shop/cat-garlic.png') },
  { id: 'bakery', label: 'Bakery', image: require('../../../assets/shop/cat-bread.png'), fill: true },
  { id: 'drinks', label: 'Beverages', image: require('../../../assets/shop/cat-tea.png') },
  { id: 'nuts', label: 'Nuts', image: require('../../../assets/shop/cat-almond.png') },
];

const PIN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF4F18" d="M12 2.2a6.8 6.8 0 0 0-6.8 6.8c0 5 6.8 12.8 6.8 12.8s6.8-7.8 6.8-12.8A6.8 6.8 0 0 0 12 2.2Zm0 9.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z"/></svg>';
const SEARCH =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1A1A1E" stroke-width="2" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.1"/><path d="M15.6 15.6 20.4 20.4"/></svg>';
const BELL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2v1.15"/><path d="M6.4 16.4h11.2"/><path d="M7.3 16.4V10a4.7 4.7 0 0 1 9.4 0v6.4"/><path d="M10.1 17.7a1.9 1.9 0 0 0 3.8 0"/><circle cx="17.35" cy="5.15" r="2.55" fill="#FF4F18" stroke="#fff" stroke-width="1.15"/><text x="17.35" y="6.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="3.15" font-weight="700" fill="#fff" stroke="none">1</text></svg>';
const BAG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF4F18" d="M7.1 8.2h9.8l-.75 10.1a1.6 1.6 0 0 1-1.6 1.45H9.45a1.6 1.6 0 0 1-1.6-1.45L7.1 8.2Z"/><path fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" d="M9.3 8.2V6.7a2.7 2.7 0 0 1 5.4 0v1.5"/></svg>';
const MENU =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const CART_LINE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 7.2h12.2l-.9 11.2a1.4 1.4 0 0 1-1.4 1.3H8.5a1.4 1.4 0 0 1-1.4-1.3L6.2 7.2Z"/><path d="M9 7.2V5.8a3 3 0 0 1 6 0v1.4"/></svg>';
const CART_ORANGE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 7.2h12.2l-.9 11.2a1.4 1.4 0 0 1-1.4 1.3H8.5a1.4 1.4 0 0 1-1.4-1.3L6.2 7.2Z"/><path d="M9 7.2V5.8a3 3 0 0 1 6 0v1.4"/></svg>';
const BELL_LINE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 16.2h11.6l-1.1-2V10a4.7 4.7 0 0 0-9.4 0v4.2l-1.1 2Z"/><path d="M10 16.6a2 2 0 0 0 4 0"/></svg>';
const LEAF =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19s1.2-7.2 8.2-11.2C18 4.6 19.5 4.2 19.5 4.2S19 8.4 16 12c-2.6 3.1-7.2 5.2-11 7Z"/><path d="M9 14.5c1.6-1.2 3.4-2.6 5.2-4.6"/></svg>';
const TAG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.2 4.5h6.3v6.3L11 18.3 5.7 13l6.5-8.5Z"/><circle cx="16.2" cy="7.8" r="1"/></svg>';
const TRUCK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5h11v8h-11Z"/><path d="M14.5 10.5h3.2L20.5 14v1.5h-6"/><circle cx="7.2" cy="17.2" r="1.4"/><circle cx="17.2" cy="17.2" r="1.4"/></svg>';

const PROMO_BANNERS = [
  { id: 'produce', title: 'Fresh Fruits & Vegetables', image: require('../../../assets/shop/banners/01_fresh_fruits_vegetables.png'), category: 'vegetables' },
  { id: 'essentials', title: 'Daily Essentials', image: require('../../../assets/shop/banners/02_daily_essentials.png'), category: 'rice' },
  { id: 'dairy', title: 'Fresh Dairy', image: require('../../../assets/shop/banners/03_fresh_dairy.png'), category: 'dairy' },
  { id: 'protein', title: 'Meat, Poultry & Seafood', image: require('../../../assets/shop/banners/04_meat_poultry_seafood.png'), category: 'chicken' },
  { id: 'snacks', title: 'Snacks & Beverages', image: require('../../../assets/shop/banners/05_snacks_beverages.png'), category: 'drinks' },
  { id: 'household', title: 'Household & Personal Care', image: require('../../../assets/shop/banners/06_household_personal_care.png'), category: 'household' },
] as const;

const STARTERS = [
  { id: 'vegetables', name: 'Vegetables', image: require('../../../assets/shop/cat-tomato.png') },
  { id: 'fruits', name: 'Fruits', image: require('../../../assets/shop/cat-lemon.png') },
  { id: 'leafy', name: 'Leafy Greens', image: require('../../../assets/shop/cat-spinach.png') },
  { id: 'fresh', name: 'Fresh picks', image: require('../../../assets/shop/cat-capsicum.png') },
] as const;

type ShopTab = 'home' | 'lists' | 'orders' | 'account';

function bannerFor(category: string) {
  if (['vegetables', 'fruits', 'leafy', 'chillies', 'fresh', 'onion', 'potato'].includes(category)) return PROMO_BANNERS[0];
  if (['rice', 'atta', 'pulses', 'oils', 'spices'].includes(category)) return PROMO_BANNERS[1];
  if (category === 'dairy' || category === 'eggs') return PROMO_BANNERS[2];
  if (category === 'chicken') return PROMO_BANNERS[3];
  if (category === 'drinks' || category === 'nuts') return PROMO_BANNERS[4];
  if (category === 'household') return PROMO_BANNERS[5];
  return null;
}

function productsFor(filter: string) {
  if (filter === 'all') return PRODUCTS;
  if (filter === 'fresh') return PRODUCTS.filter((item) => item.fresh);
  return PRODUCTS.filter((item) => item.category === filter);
}

function tabSvg(name: 'home' | 'categories' | 'orders' | 'lists' | 'account', active: boolean) {
  const color = active ? colors.orange : '#9CA3AF';
  const fill = active ? colors.orange : 'none';
  const common = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
  if (name === 'home') {
    return `<svg ${common}><path d="M4.2 11.2 12 4.6l7.8 6.6V20a1 1 0 0 1-1 1h-4.6v-5.6H9.8V21H5.2a1 1 0 0 1-1-1v-8.8Z" fill="${fill}"/></svg>`;
  }
  if (name === 'categories') {
    return `<svg ${common}><rect x="3.5" y="3.5" width="6.8" height="6.8" rx="1.9"/><rect x="13.7" y="3.5" width="6.8" height="6.8" rx="1.9"/><rect x="3.5" y="13.7" width="6.8" height="6.8" rx="1.9"/><rect x="13.7" y="13.7" width="6.8" height="6.8" rx="1.9"/></svg>`;
  }
  if (name === 'orders') {
    return `<svg ${common}><path d="M6.2 8.2h11.6l-.9 10.2a1.4 1.4 0 0 1-1.4 1.3H8.5a1.4 1.4 0 0 1-1.4-1.3L6.2 8.2Z" fill="${fill}"/><path d="M9 8.2V6.6a3 3 0 0 1 6 0v1.6"/></svg>`;
  }
  if (name === 'lists') {
    return `<svg ${common}><path d="M12 19.2s-6.2-3.9-6.2-8A3.5 3.5 0 0 1 12 8.3a3.5 3.5 0 0 1 6.2 2.9c0 4.1-6.2 8-6.2 8Z" fill="${active ? color : 'none'}"/></svg>`;
  }
  return `<svg ${common}><circle cx="12" cy="8" r="3.1" fill="${fill}"/><path d="M6.2 19.4c.7-3 2.9-4.6 5.8-4.6s5.1 1.6 5.8 4.6"/></svg>`;
}
const HEART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19.2s-6.2-3.9-6.2-8A3.5 3.5 0 0 1 12 8.3a3.5 3.5 0 0 1 6.2 2.9c0 4.1-6.2 8-6.2 8Z"/></svg>';
const HEART_ON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF4F18" stroke="#FF4F18" stroke-width="1.8" stroke-linejoin="round"><path d="M12 19.2s-6.2-3.9-6.2-8A3.5 3.5 0 0 1 12 8.3a3.5 3.5 0 0 1 6.2 2.9c0 4.1-6.2 8-6.2 8Z"/></svg>';
const TRASH =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"><path d="M5 7h14M9 7V5h6v2M8 7l1 12h6l1-12"/></svg>';
const NOTE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h6"/></svg>';

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

if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('kx-photo')) {
  const style = document.createElement('style');
  style.id = 'kx-photo';
  style.textContent = 'img{-webkit-user-drag:none;user-select:none;}';
  document.head.appendChild(style);
}

function productById(id: string) {
  return PRODUCTS.find((item) => item.id === id);
}

export function ShopFlow({
  city = 'Hyderabad',
  onDeliver,
  onSetup,
  onEditDetails,
  onEditOutlet,
}: {
  city?: string;
  onDeliver?: () => void;
  onSetup?: () => void;
  onEditDetails?: () => void;
  onEditOutlet?: () => void;
}) {
  const [screen, setScreen] = useState<'home' | 'category' | 'product' | 'cart' | 'list' | 'orders' | 'account' | 'alerts'>('home');
  const [tab, setTab] = useState<ShopTab>('home');
  const [productId, setProductId] = useState('tomato');
  const [backTo, setBackTo] = useState<'home' | 'category' | 'list'>('home');
  const [filter, setFilter] = useState('vegetables');
  const [browse, setBrowse] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'standard' | 'express'>('standard');
  const [menu, setMenu] = useState(false);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const add = (id: string, qty = 1) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + qty }));
  const setQty = (id: string, qty: number) =>
    setCart((current) => {
      const next = { ...current };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  const toggleSaved = (id: string) => setSaved((current) => ({ ...current, [id]: !current[id] }));

  const openProduct = (id: string, from: 'home' | 'category' | 'list') => {
    setProductId(id);
    setBackTo(from);
    setScreen('product');
  };
  const openCategory = (id: string) => {
    setFilter(id);
    setBrowse(false);
    setTab('home');
    setScreen('category');
  };
  const openBrowse = () => {
    setBrowse(true);
    setScreen('category');
  };
  const goTab = (next: ShopTab) => {
    setTab(next);
    setMenu(false);
    if (next === 'home') setScreen('home');
    if (next === 'lists') setScreen('list');
    if (next === 'orders') setScreen('orders');
    if (next === 'account') setScreen('account');
  };

  if (screen === 'category') {
    return (
      <CategoryScreen
        filter={filter}
        browse={browse}
        onFilter={setFilter}
        onBrowse={openCategory}
        cartCount={cartCount}
        onBack={() => {
          setTab('home');
          setScreen('home');
        }}
        onOpenCart={() => setScreen('cart')}
        onOpen={(id) => openProduct(id, 'category')}
        onAdd={(id) => add(id, 1)}
      />
    );
  }
  if (screen === 'product') {
    const product = productById(productId);
    if (!product) return null;
    return (
      <ProductScreen
        product={product}
        saved={Boolean(saved[productId])}
        onToggleSaved={() => toggleSaved(productId)}
        onBack={() => setScreen(backTo)}
        onAdd={(qty) => {
          add(productId, qty);
          setScreen('cart');
        }}
      />
    );
  }
  if (screen === 'cart') {
    return (
      <CartScreen
        cart={cart}
        note={note}
        onNote={setNote}
        onBack={() => setScreen('home')}
        onQty={setQty}
      />
    );
  }
  if (screen === 'list') {
    return (
      <ListScreen
        saved={saved}
        tab={tab}
        onTab={goTab}
        onOpen={(id) => openProduct(id, 'list')}
        onToggle={toggleSaved}
      />
    );
  }
  if (screen === 'orders') {
    return (
      <InfoScreen
        title="Orders"
        body="Orders will show here once order history is connected."
        tab={tab}
        onTab={goTab}
      />
    );
  }
  if (screen === 'account') {
    return (
      <InfoScreen
        title="Account"
        body="Account details are not connected yet."
        tab={tab}
        onTab={goTab}
        links={[
          onSetup ? { label: 'Restaurant setup', onPress: onSetup } : null,
          onEditDetails ? { label: 'Edit details', onPress: onEditDetails } : null,
          onEditOutlet ? { label: 'Edit outlet details', onPress: onEditOutlet } : null,
        ].filter((item): item is { label: string; onPress: () => void } => Boolean(item))}
      />
    );
  }
  if (screen === 'alerts') {
    return (
      <InfoScreen
        title="Notifications"
        body="Notifications are not connected yet."
        tab={tab}
        onTab={goTab}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <HomeScreen
        city={city}
        query={query}
        mode={mode}
        cart={cart}
        saved={saved}
        tab={tab}
        cartCount={cartCount}
        onQuery={setQuery}
        onMode={setMode}
        onDeliver={onDeliver}
        onMenu={() => setMenu(true)}
        onAlerts={() => setScreen('alerts')}
        onCart={() => setScreen('cart')}
        onOpenCategory={openCategory}
        onBrowse={openBrowse}
        onOpenProduct={(id) => openProduct(id, 'home')}
        onAdd={(id) => add(id, 1)}
        onSetQty={setQty}
        onToggleSaved={toggleSaved}
        onTab={goTab}
      />
      {menu ? (
        <View style={styles.menuScrim}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenu(false)} accessibilityLabel="Close menu" />
          <View style={styles.menuSheet}>
            <Text style={styles.menuTitle}>Menu</Text>
            {([
              ['Shop', 'home'],
              ['My list', 'lists'],
              ['Orders', 'orders'],
              ['Account', 'account'],
            ] as const).map(([label, id]) => (
              <Pressable key={id} style={styles.menuItem} onPress={() => goTab(id)} accessibilityRole="button">
                <Text style={styles.menuLabel}>{label}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenu(false);
                onDeliver?.();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.menuLabel}>Delivery location</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function HomeScreen({
  city,
  query,
  mode,
  cart,
  saved,
  tab,
  cartCount,
  onQuery,
  onMode,
  onDeliver,
  onMenu,
  onAlerts,
  onCart,
  onOpenCategory,
  onBrowse,
  onOpenProduct,
  onAdd,
  onSetQty,
  onToggleSaved,
  onTab,
}: {
  city: string;
  query: string;
  mode: 'standard' | 'express';
  cart: Record<string, number>;
  saved: Record<string, boolean>;
  tab: ShopTab;
  cartCount: number;
  onQuery: (value: string) => void;
  onMode: (mode: 'standard' | 'express') => void;
  onDeliver?: () => void;
  onMenu: () => void;
  onAlerts: () => void;
  onCart: () => void;
  onOpenCategory: (id: string) => void;
  onBrowse: () => void;
  onOpenProduct: (id: string) => void;
  onAdd: (id: string) => void;
  onSetQty: (id: string, qty: number) => void;
  onToggleSaved: (id: string) => void;
  onTab: (tab: ShopTab) => void;
}) {
  const { width } = useWindowDimensions();
  const tile = Math.floor((width - 32 - 30) / 4);
  const q = query.trim().toLowerCase();
  const results = q
    ? PRODUCTS.filter((item) => item.name.toLowerCase().includes(q) || item.category.includes(q) || item.unit.toLowerCase().includes(q))
    : [];
  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 10 : 46 }]}>
        <TouchableOpacity onPress={onMenu} accessibilityRole="button" accessibilityLabel="Menu" style={styles.iconBtn}>
          <Icon svg={MENU} size={22} />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/kitchenx-logo-trimmed.png')}
          resizeMode="contain"
          accessibilityLabel="KITCHEN X"
          style={styles.headerLogo}
        />
        <View style={styles.homeActions}>
          <TouchableOpacity accessibilityLabel="Wishlist" onPress={() => onTab('lists')} style={styles.iconBtn}>
            <Icon svg={HEART} size={22} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Cart" onPress={onCart} style={styles.iconBtn}>
            <Icon svg={CART_LINE} size={22} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Notifications" onPress={onAlerts} style={styles.iconBtn}>
            <Icon svg={BELL_LINE} size={22} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.homeScrollView} contentContainerStyle={styles.homeScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.address} onPress={onDeliver} accessibilityRole="button" accessibilityLabel="Delivery location">
          <Icon svg={PIN} size={18} />
          <View style={styles.addressCopy}>
            <Text style={styles.deliverLabel}>Deliver to</Text>
            <Text style={styles.deliverPlace} numberOfLines={1}>Main Kitchen, {city}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.search}>
          <Icon svg={SEARCH} size={18} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Search products, categories, brands..."
            placeholderTextColor="#9AA0A6"
            style={styles.searchInput}
            testID="home-search"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query ? (
            <Pressable onPress={() => onQuery('')} accessibilityRole="button" accessibilityLabel="Clear search">
              <Text style={styles.clearMark}>×</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.mode}>
          {(['standard', 'express'] as const).map((id) => {
            const on = mode === id;
            return (
              <Pressable
                key={id}
                onPress={() => onMode(id)}
                style={[styles.modeBtn, on && styles.modeOn]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={id === 'standard' ? 'Standard' : 'Express'}
              >
                <Text style={[styles.modeText, on && styles.modeTextOn]}>{id === 'standard' ? 'Standard' : 'Express'}</Text>
              </Pressable>
            );
          })}
        </View>
        {q ? (
          <View style={styles.results}>
            <Text style={styles.sectionTitle}>{results.length ? 'Results' : 'No matching products'}</Text>
            {results.map((item) => (
              <Pressable key={item.id} style={styles.row} onPress={() => onOpenProduct(item.id)}>
                <Image source={item.image} style={styles.rowImage} resizeMode="contain" />
                <View style={styles.rowBody}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowUnit}>{item.unit}</Text>
                  <Text style={styles.rowPrice}>₹{item.price}</Text>
                </View>
              </Pressable>
            ))}
            {!results.length ? <Text style={styles.emptyCopy}>Nothing in the catalogue matches “{query.trim()}”.</Text> : null}
          </View>
        ) : (
          <>
            <View style={styles.heroBanner}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroTitle}>Fresh & Organic{'\n'}for your business</Text>
                <Text style={styles.heroSub}>Farm fresh produce at great prices</Text>
                <TouchableOpacity style={styles.heroBtn} onPress={() => onOpenCategory('vegetables')} accessibilityRole="button" accessibilityLabel="Shop Now">
                  <Text style={styles.heroBtnText}>Shop Now  →</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.heroPhotos, width < 370 ? { width: 104 } : null]}>
                <Image source={require('../../../assets/shop/capsicum.png')} style={styles.heroPhoto} resizeMode="contain" />
                <Image source={require('../../../assets/shop/tomato.png')} style={[styles.heroPhoto, styles.heroPhotoMid]} resizeMode="contain" />
                <Image source={require('../../../assets/shop/carrot.png')} style={styles.heroPhoto} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.benefits}>
              {([
                [LEAF, 'Fresh Supplies'],
                [TAG, 'Competitive Prices'],
                [TRUCK, 'Reliable Delivery'],
              ] as const).map(([icon, label]) => (
                <View key={label} style={styles.benefit}>
                  <Icon svg={icon} size={16} />
                  <Text style={styles.benefitText} numberOfLines={2}>{label}</Text>
                </View>
              ))}
            </View>
            <SectionHead title="Starter Menu" onSeeAll={onBrowse} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {STARTERS.map((item) => (
                <Pressable key={item.id} style={[styles.starterCard, { width: tile }]} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.name}>
                  <View style={[styles.starterImage, { width: tile - 12, height: 52 }]}>
                    <Image source={item.image} style={styles.starterPhoto} resizeMode="contain" />
                  </View>
                  <Text style={styles.starterName} numberOfLines={2}>{item.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <SectionHead title="Shop by category" onSeeAll={onBrowse} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {CATEGORIES.map((item) => (
                <Pressable key={item.id} style={[styles.starterCard, { width: tile }]} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
                  <View style={[styles.starterImage, { width: tile - 12, height: 52 }]}>
                    <Image source={item.image} style={item.fill ? styles.catImageFill : styles.starterPhoto} resizeMode={item.fill ? 'cover' : 'contain'} />
                  </View>
                  <Text style={styles.starterName} numberOfLines={2}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <SectionHead title="Your Menu Add-ons" onSeeAll={() => onOpenCategory('all')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {PRODUCTS.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <View key={item.id} style={styles.addonCard}>
                    <Pressable onPress={() => onOpenProduct(item.id)} accessibilityRole="button" accessibilityLabel={item.name}>
                      <View style={styles.addonImage}>
                        <Image source={item.image} style={styles.addonPhoto} resizeMode="contain" />
                        <Pressable
                          style={styles.addonHeart}
                          onPress={() => onToggleSaved(item.id)}
                          accessibilityRole="button"
                          accessibilityLabel={saved[item.id] ? `Remove ${item.name} from list` : `Save ${item.name}`}
                        >
                          <Icon svg={saved[item.id] ? HEART_ON : HEART} size={18} />
                        </Pressable>
                      </View>
                      <Text style={styles.addonName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.addonUnit}>{item.unit}</Text>
                      <Text style={styles.addonPrice}>₹{item.price}</Text>
                    </Pressable>
                    <AddControl
                      qty={qty}
                      onInc={() => (qty ? onSetQty(item.id, qty + 1) : onAdd(item.id))}
                      onDec={() => onSetQty(item.id, qty - 1)}
                      label={item.name}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
      </ScrollView>
      <TabBar tab={tab} onTab={onTab} />
    </View>
  );
}

function SectionHead({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll} accessibilityRole="button" accessibilityLabel={`See all ${title}`}>
        <Text style={styles.seeAll}>See all →</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddControl({ qty, onInc, onDec, label }: { qty: number; onInc: () => void; onDec: () => void; label: string }) {
  if (qty <= 0) {
    return (
      <TouchableOpacity style={styles.addBtn} onPress={onInc} accessibilityRole="button" accessibilityLabel={`Add ${label}`}>
        <Icon svg={CART_ORANGE} size={14} />
        <Text style={styles.addBtnText}>Add</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.qtyBtn}>
      <TouchableOpacity onPress={onDec} accessibilityRole="button" accessibilityLabel={`Decrease ${label}`}><Text style={styles.qtyMark}>−</Text></TouchableOpacity>
      <Text style={styles.qtyVal}>{qty}</Text>
      <TouchableOpacity onPress={onInc} accessibilityRole="button" accessibilityLabel={`Increase ${label}`}><Text style={styles.qtyMark}>+</Text></TouchableOpacity>
    </View>
  );
}

function CategoryScreen({
  filter,
  browse,
  onFilter,
  onBrowse,
  cartCount,
  onBack,
  onOpenCart,
  onOpen,
  onAdd,
}: {
  filter: string;
  browse: boolean;
  onFilter: (filter: string) => void;
  onBrowse: (id: string) => void;
  cartCount: number;
  onBack: () => void;
  onOpenCart: () => void;
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const items = productsFor(filter);
  const chips = ['all', 'vegetables', 'fruits', 'leafy', 'fresh'];
  const known = CATEGORIES.find((item) => item.id === filter);
  const title = browse ? 'Categories' : filter === 'all' ? 'All products' : filter === 'fresh' ? 'Fresh picks' : filter === 'household' ? 'Household & Personal Care' : (known?.label ?? 'Category');
  const banner = browse ? null : bannerFor(filter);
  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back"><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.navRight}>
          <TouchableOpacity onPress={onOpenCart} accessibilityLabel="Cart" style={styles.bagBtn}>
            <Icon svg={BAG} size={24} />
            {cartCount > 0 ? <View style={styles.bagBadge}><Text style={styles.bagBadgeText}>{cartCount}</Text></View> : null}
          </TouchableOpacity>
        </View>
      </View>
      {browse ? null : (
        <View style={styles.chips}>
          {chips.map((chip) => {
            const on = filter === chip;
            const label = chip === 'all' ? 'All' : chip === 'fresh' ? 'Fresh' : chip === 'leafy' ? 'Leafy' : chip === 'fruits' ? 'Fruits' : 'Vegetables';
            return (
              <Pressable key={chip} onPress={() => onFilter(chip)} style={[styles.chip, on && styles.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {browse ? (
          <View style={styles.bannerList}>
            {PROMO_BANNERS.map((item) => (
              <Pressable key={item.id} onPress={() => onBrowse(item.category)} accessibilityRole="button" accessibilityLabel={item.title}>
                <Image source={item.image} style={styles.promoBanner} resizeMode="contain" />
              </Pressable>
            ))}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>All categories</Text>
            <View style={styles.grid}>
              {CATEGORIES.map((item) => (
                <Pressable key={item.id} style={styles.catCard} onPress={() => onBrowse(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
                  <View style={styles.catImageWrap}>
                    <Image source={item.image} style={item.fill ? styles.catImageFill : styles.catImage} resizeMode={item.fill ? 'cover' : 'contain'} />
                  </View>
                  <Text style={styles.catLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <>
            {banner ? (
              <View style={styles.bannerList}>
                <Image source={banner.image} style={styles.promoBanner} resizeMode="contain" accessibilityLabel={banner.title} />
              </View>
            ) : null}
            {items.map((item) => (
              <Pressable key={item.id} style={styles.row} onPress={() => onOpen(item.id)}>
                <Image source={item.image} style={styles.rowImage} resizeMode="contain" />
                <View style={styles.rowBody}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowUnit}>{item.unit}</Text>
                  <Text style={styles.rowPrice}>₹{item.price}</Text>
                </View>
                <TouchableOpacity style={styles.plus} onPress={() => onAdd(item.id)} accessibilityLabel={`Add ${item.name}`}>
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
              </Pressable>
            ))}
            {!items.length ? <Text style={styles.emptyCopy}>No priced products are in this category yet.</Text> : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ProductScreen({
  product,
  saved,
  onToggleSaved,
  onBack,
  onAdd,
}: {
  product: Product;
  saved: boolean;
  onToggleSaved: () => void;
  onBack: () => void;
  onAdd: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back"><Text style={styles.back}>‹</Text></TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onToggleSaved}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from favourites' : 'Save'}
          accessibilityState={{ selected: saved }}
          style={styles.heartBtn}
        >
          <Icon svg={saved ? HEART_ON : HEART} size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.heroCard}>
          <Image source={product.image} style={styles.hero} resizeMode="contain" />
        </View>
        <View style={styles.pad}>
          <View style={styles.nameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.fresh ? <Text style={styles.fresh}>Fresh</Text> : null}
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.bigPrice}>₹{product.price} <Text style={styles.per}>/ {product.unit}</Text></Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setQty((value) => Math.max(1, value - 1))}><Text style={styles.step}>−</Text></TouchableOpacity>
              <Text style={styles.stepQty}>{qty}</Text>
              <TouchableOpacity style={styles.stepOn} onPress={() => setQty((value) => value + 1)}><Text style={styles.stepOnText}>+</Text></TouchableOpacity>
            </View>
          </View>
          <Text style={styles.detailTitle}>Product details</Text>
          <Text style={styles.detailCopy}>Farm fresh {product.name.toLowerCase()} sourced directly from trusted growers. Ideal for everyday kitchen use.</Text>
          {['Fresh and high quality', 'Consistent supply', 'Best for restaurants and bulk orders'].map((line) => (
            <Text key={line} style={styles.bullet}>✓  {line}</Text>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.checkout} onPress={() => onAdd(qty)} accessibilityRole="button" accessibilityLabel="Add to cart">
        <Text style={styles.checkoutText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartScreen({
  cart,
  note,
  onNote,
  onBack,
  onQty,
}: {
  cart: Record<string, number>;
  note: string;
  onNote: (value: string) => void;
  onBack: () => void;
  onQty: (id: string, qty: number) => void;
}) {
  const lines = PRODUCTS.filter((item) => cart[item.id]);
  const qtyOf = (id: string) => cart[id] ?? 0;
  const subtotal = lines.reduce((sum, item) => sum + item.price * qtyOf(item.id), 0);
  const delivery = lines.length ? 30 : 0;
  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back"><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.navTitle}>My Cart ({lines.reduce((sum, item) => sum + qtyOf(item.id), 0)})</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {lines.map((item) => (
          <View key={item.id} style={styles.row}>
            <Image source={item.image} style={styles.rowImage} resizeMode="contain" />
            <View style={styles.rowBody}>
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowUnit}>{item.unit}</Text>
              <Text style={styles.rowPrice}>₹{item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => onQty(item.id, 0)} accessibilityLabel={`Remove ${item.name}`}><Icon svg={TRASH} size={18} /></TouchableOpacity>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => onQty(item.id, qtyOf(item.id) - 1)}><Text style={styles.step}>−</Text></TouchableOpacity>
              <Text style={styles.stepQty}>{qtyOf(item.id)}</Text>
              <TouchableOpacity onPress={() => onQty(item.id, qtyOf(item.id) + 1)}><Text style={styles.step}>+</Text></TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.note}>
          <Icon svg={NOTE} size={16} />
          <TextInput value={note} onChangeText={onNote} placeholder="Add a note (optional)" placeholderTextColor="#9CA3AF" style={styles.noteInput} />
        </View>
        <View style={styles.totals}>
          <Total label="Subtotal" value={`₹${subtotal}`} />
          <Total label="Delivery Fee" value={`₹${delivery}`} />
          <Total label="Total" value={`₹${subtotal + delivery}`} strong />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.checkout} accessibilityRole="button" accessibilityLabel="Proceed to Checkout">
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

function Total({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, strong && styles.totalStrong]}>{label}</Text>
      <Text style={[styles.totalValue, strong && styles.totalStrong]}>{value}</Text>
    </View>
  );
}

function ListScreen({
  saved,
  tab,
  onTab,
  onOpen,
  onToggle,
}: {
  saved: Record<string, boolean>;
  tab: ShopTab;
  onTab: (tab: ShopTab) => void;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const items = PRODUCTS.filter((item) => saved[item.id]);
  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <Text style={styles.navTitle}>My list</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}>
        {items.map((item) => (
          <Pressable key={item.id} style={styles.row} onPress={() => onOpen(item.id)}>
            <Image source={item.image} style={styles.rowImage} resizeMode="contain" />
            <View style={styles.rowBody}>
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowUnit}>{item.unit}</Text>
              <Text style={styles.rowPrice}>₹{item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => onToggle(item.id)} accessibilityLabel={`Remove ${item.name}`}>
              <Icon svg={HEART_ON} size={22} />
            </TouchableOpacity>
          </Pressable>
        ))}
        {!items.length ? <Text style={styles.emptyCopy}>Save a product with the heart to keep it here.</Text> : null}
      </ScrollView>
      <TabBar tab={tab} onTab={onTab} />
    </View>
  );
}

function InfoScreen({
  title,
  body,
  tab,
  onTab,
  onBack,
  links,
}: {
  title: string;
  body: string;
  tab: ShopTab;
  onTab: (tab: ShopTab) => void;
  onBack?: () => void;
  links?: { label: string; onPress: () => void }[];
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} accessibilityLabel="Back"><Text style={styles.back}>‹</Text></TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}
        <Text style={styles.navTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.infoBody}>
        <Text style={styles.emptyCopy}>{body}</Text>
        {links?.map((link) => (
          <TouchableOpacity key={link.label} onPress={link.onPress} accessibilityRole="button" style={styles.accountLink}>
            <Text style={styles.accountLinkLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TabBar tab={tab} onTab={onTab} />
    </View>
  );
}

function TabBar({ tab, onTab }: { tab: ShopTab; onTab: (tab: ShopTab) => void }) {
  const items: Array<{ id: ShopTab; label: string; icon: 'home' | 'lists' | 'orders' | 'account' }> = [
    { id: 'home', label: 'Shop', icon: 'home' },
    { id: 'lists', label: 'My list', icon: 'lists' },
    { id: 'orders', label: 'Orders', icon: 'orders' },
    { id: 'account', label: 'Account', icon: 'account' },
  ];
  return (
    <View style={[styles.tabs, { paddingBottom: Platform.OS === 'web' ? 10 : 22 }]}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} style={styles.tab} onPress={() => onTab(item.id)} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{ selected: tab === item.id }}>
          <Icon svg={tabSvg(item.icon, tab === item.id)} size={22} />
          <Text style={[styles.tabLabel, tab === item.id && styles.tabOn]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  homeScroll: { paddingBottom: 20 },
  homeScrollView: { flex: 1 },
  homeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LINE,
  },
  deliver: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliverLabel: { fontSize: 11, color: MUTED },
  deliverPlace: { fontSize: 14, fontWeight: '700', color: INK },
  homeActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  banner: { marginHorizontal: 16, marginTop: 14, borderRadius: 22, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB' },
  dotOn: { width: 16, height: 6, borderRadius: 3, backgroundColor: ORANGE },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 10, marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: INK },
  seeAll: { color: ORANGE, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  catCard: { width: '33.33%', alignItems: 'center', marginBottom: 14 },
  catImageWrap: { width: 92, height: 92, borderRadius: 18, backgroundColor: FIELD, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  catImage: { width: 78, height: 78 },
  catImageFill: { width: '100%', height: '100%' },
  catLabel: { marginTop: 8, fontSize: 12, fontWeight: '600', color: INK, textAlign: 'center', paddingHorizontal: 4 },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: LINE, paddingTop: 10, paddingBottom: 12, backgroundColor: '#FFFFFF' },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '600', color: MUTED },
  tabOn: { color: ORANGE, fontWeight: '700' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  back: { fontSize: 32, lineHeight: 32, color: INK, width: 28 },
  navTitle: { fontSize: 18, fontWeight: '800', color: INK },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartMark: { color: ORANGE, fontWeight: '800' },
  chips: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, gap: 8 },
  chip: { paddingHorizontal: 4, paddingVertical: 6, borderRadius: 16 },
  chipOn: { backgroundColor: ORANGE, paddingHorizontal: 14 },
  chipText: { color: MUTED, fontWeight: '600', fontSize: 14 },
  chipTextOn: { color: '#FFFFFF' },
  bagBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  bagBadge: { position: 'absolute', top: -2, right: -4, minWidth: 14, height: 14, borderRadius: 7, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  bagBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: LINE },
  rowImage: { width: 64, height: 64 },
  rowBody: { flex: 1 },
  rowName: { fontSize: 16, fontWeight: '700', color: INK },
  rowUnit: { fontSize: 12, color: MUTED },
  rowPrice: { marginTop: 4, color: ORANGE, fontWeight: '800' },
  plus: { width: 32, height: 32, borderRadius: 10, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  plusText: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: -2 },
  heartBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  heroCard: { marginHorizontal: 16, marginTop: 8, height: 280, borderRadius: 22, backgroundColor: FIELD, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  hero: { width: 230, height: 230 },
  pad: { paddingHorizontal: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productName: { fontSize: 28, fontWeight: '800', color: INK },
  fresh: { backgroundColor: '#E7F8EE', color: '#1F9D55', fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  bigPrice: { fontSize: 22, fontWeight: '800', color: ORANGE },
  per: { fontSize: 14, color: MUTED, fontWeight: '500' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  step: { fontSize: 20, color: INK, paddingHorizontal: 6 },
  stepQty: { fontWeight: '700', color: INK },
  stepOn: { width: 28, height: 28, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  stepOnText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  detailTitle: { marginTop: 18, fontSize: 16, fontWeight: '800', color: INK },
  detailCopy: { marginTop: 6, color: MUTED, lineHeight: 20 },
  bullet: { marginTop: 8, color: '#1F9D55', fontWeight: '600' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, backgroundColor: FIELD, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  noteInput: { flex: 1, color: INK, ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as object) : {}) },
  totals: { paddingHorizontal: 18, paddingTop: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { color: MUTED },
  totalValue: { color: INK, fontWeight: '600' },
  totalStrong: { color: INK, fontWeight: '800', fontSize: 16 },
  checkout: { marginHorizontal: 16, marginBottom: 16, height: 52, borderRadius: 26, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  checkoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  headerLogo: { width: 118, height: 18, marginLeft: 4 },
  address: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, paddingHorizontal: 16 },
  addressCopy: { flex: 1 },
  search: {
    marginTop: 8,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 12,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: INK,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as object) : {}),
  },
  clearMark: { fontSize: 22, color: MUTED, lineHeight: 22 },
  mode: {
    marginTop: 12,
    marginHorizontal: 16,
    height: 38,
    borderRadius: 21,
    backgroundColor: FIELD,
    flexDirection: 'row',
    padding: 3,
  },
  modeBtn: { flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modeOn: { backgroundColor: '#1B2430' },
  modeText: { fontSize: 14, fontWeight: '700', color: INK },
  modeTextOn: { color: '#FFFFFF' },
  heroBanner: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#1E9A43',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: 16,
    paddingVertical: 8,
  },
  heroCopy: { flex: 1, paddingRight: 4 },
  heroTitle: { color: '#FFFFFF', fontSize: 18, lineHeight: 22, fontWeight: '800' },
  heroSub: { marginTop: 6, color: '#E9FFF0', fontSize: 12, lineHeight: 16, fontWeight: '500' },
  heroBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#172033',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  heroPhotos: { width: 118, height: 92, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  heroPhoto: { width: 52, height: 52 },
  heroPhotoMid: { marginHorizontal: -14, marginBottom: 14, width: 60, height: 60 },
  benefits: { flexDirection: 'row', marginTop: 8, paddingHorizontal: 12 },
  benefit: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 2 },
  benefitText: { flexShrink: 1, fontSize: 11, lineHeight: 14, fontWeight: '600', color: INK },
  hRow: { paddingHorizontal: 16, gap: 10 },
  starterCard: { alignItems: 'center' },
  starterImage: { borderRadius: 16, backgroundColor: FIELD, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  starterPhoto: { width: '78%', height: '78%' },
  starterName: { marginTop: 4, fontSize: 11, lineHeight: 13, fontWeight: '700', color: INK, textAlign: 'center' },
  addonCard: {
    width: 136,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEF1',
    backgroundColor: '#FFFFFF',
    padding: 8,
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(23, 23, 26, 0.05)' } as object,
      default: { shadowColor: '#141517', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
    }),
  },
  addonImage: { height: 72, borderRadius: 12, backgroundColor: FIELD, alignItems: 'center', justifyContent: 'center' },
  addonPhoto: { width: 64, height: 64 },
  addonHeart: { position: 'absolute', top: 6, right: 6 },
  addonName: { marginTop: 6, fontSize: 13, lineHeight: 16, fontWeight: '800', color: INK, minHeight: 32 },
  addonUnit: { marginTop: 1, fontSize: 11, color: MUTED },
  addonPrice: { marginTop: 2, marginBottom: 6, color: ORANGE, fontWeight: '800', fontSize: 14 },
  addBtn: {
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addBtnText: { color: ORANGE, fontWeight: '800', fontSize: 13 },
  qtyBtn: {
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  qtyMark: { color: ORANGE, fontSize: 18, fontWeight: '700', width: 22, textAlign: 'center' },
  qtyVal: { color: INK, fontWeight: '800' },
  results: { paddingTop: 16 },
  emptyCopy: { marginHorizontal: 16, marginTop: 16, color: MUTED, fontSize: 14, lineHeight: 20 },
  accountLink: { marginHorizontal: 16, marginTop: 18 },
  accountLinkLabel: { color: ORANGE, fontSize: 16, fontWeight: '800' },
  infoBody: { flex: 1, paddingTop: 8 },
  bannerList: { paddingTop: 8 },
  promoBanner: { width: '100%', aspectRatio: 724 / 272, marginBottom: 12, borderRadius: 16 },
  menuScrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(17, 17, 20, 0.28)', zIndex: 20 },
  menuSheet: { width: 240, backgroundColor: '#FFFFFF', paddingTop: 18, paddingBottom: 12, height: '100%', zIndex: 2 },
  menuTitle: { fontSize: 18, fontWeight: '800', color: INK, paddingHorizontal: 16, marginBottom: 8 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
  menuLabel: { fontSize: 16, fontWeight: '600', color: INK },
});
