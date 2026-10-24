import { createElement, ReactNode, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
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
const FIELD = colors.field;
const WHITE = colors.white;
const MUTED = '#6B7280';
const LINE = '#E4E6EB';
const ERROR = '#D92D20';
const SELECTED = '#FFF1EC';
const PLACEHOLDER = '#9AA0A6';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Business = {
  id: string;
  label: string;
  caption: string;
  setupTitle: string;
  setupBody: string;
  kitHeading: string;
  image: ImageSourcePropType;
  wide?: ImageSourcePropType;
};

type Kit = {
  id: string;
  name: string;
  cardTitle: string;
  line: string;
  cardLine: string;
  featured: boolean;
  image: ImageSourcePropType;
};

type MenuCategory = {
  id: string;
  label: string;
  tint: string;
  image: ImageSourcePropType;
};

const BUSINESSES: Business[] = [
  {
    id: 'restaurant',
    label: 'Restaurant',
    caption: 'Full kitchen setup',
    setupTitle: 'Complete Restaurant Setup',
    setupBody: 'End-to-end ingredients and essentials to start and run your restaurant.',
    kitHeading: 'Popular Kits for Restaurants',
    image: require('../../../assets/starter-kit/business/restaurant.png'),
    wide: require('../../../assets/Pouplar_StarkerKit_Banner_Restaurants_webp.webp'),
  },
  {
    id: 'cloud-kitchen',
    label: 'Cloud Kitchen',
    caption: 'Quick essentials',
    setupTitle: 'Complete Cloud Kitchen Setup',
    setupBody: 'End-to-end ingredients and essentials to start and run your cloud kitchen.',
    kitHeading: 'Popular Kits for Cloud Kitchens',
    image: require('../../../assets/starter-kit/business/cloud-kitchen.png'),
  },
  {
    id: 'cafe',
    label: 'Café',
    caption: 'Beverage & snacks',
    setupTitle: 'Complete Cafe Setup',
    setupBody: 'End-to-end ingredients and essentials to start and run your cafe.',
    kitHeading: 'Popular Kits for Cafes',
    image: require('../../../assets/starter-kit/business/cafe.png'),
  },
  {
    id: 'bakery',
    label: 'Bakery',
    caption: 'Baking essentials',
    setupTitle: 'Complete Bakery Setup',
    setupBody: 'End-to-end ingredients and essentials to start and run your bakery.',
    kitHeading: 'Popular Kits for Bakeries',
    image: require('../../../assets/starter-kit/business/bakery.png'),
  },
  {
    id: 'hotel',
    label: 'Hotel',
    caption: 'Bulk supplies',
    setupTitle: 'Complete Hotel Setup',
    setupBody: 'End-to-end ingredients and essentials to start and run your hotel kitchen.',
    kitHeading: 'Popular Kits for Hotels',
    image: require('../../../assets/starter-kit/business/hotel.png'),
  },
];

const KITS: Kit[] = [
  {
    id: 'south-indian',
    name: 'South Indian Breakfast Kit',
    cardTitle: 'South Indian Breakfast Kit',
    line: 'Idli, Dosa, Vada essentials',
    cardLine: 'Rice, Dal, Spices, Chutney & more',
    featured: true,
    image: require('../../../assets/starter-kit/kits/south-indian.png'),
  },
  {
    id: 'biryani',
    name: 'Biryani Kit',
    cardTitle: 'Biryani Essentials Kit',
    line: 'Rice, Spices, Oils, Masalas & more',
    cardLine: 'Rice, Spices, Oils, Masalas & more',
    featured: true,
    image: require('../../../assets/starter-kit/kits/biryani.png'),
  },
  {
    id: 'north-indian',
    name: 'North Indian Kit',
    cardTitle: 'North Indian Kit',
    line: 'Flours, Spices, Paneer, Sauces & more',
    cardLine: 'Flours, Spices, Paneer, Sauces & more',
    featured: false,
    image: require('../../../assets/starter-kit/kits/north-indian.png'),
  },
  {
    id: 'chinese',
    name: 'Chinese Kit',
    cardTitle: 'Chinese Kit',
    line: 'Sauces, Noodles, Oils & more',
    cardLine: 'Sauces, Noodles, Oils & more',
    featured: false,
    image: require('../../../assets/starter-kit/kits/chinese.png'),
  },
  {
    id: 'burger',
    name: 'Burger & Sandwich Kit',
    cardTitle: 'Burger & Sandwich Kit',
    line: 'Buns, Sauces, Cheese & more',
    cardLine: 'Buns, Sauces, Cheese & more',
    featured: true,
    image: require('../../../assets/starter-kit/kits/burger.png'),
  },
  {
    id: 'pizza',
    name: 'Pizza Kit',
    cardTitle: 'Pizza Kit',
    line: 'Cheese, Flour, Sauces & more',
    cardLine: 'Cheese, Flour, Sauces & more',
    featured: false,
    image: require('../../../assets/starter-kit/kits/pizza.png'),
  },
];

const HEROES = [
  {
    id: 'sooner',
    lead: 'Start serving',
    accent: 'sooner',
    sub: 'Curated ingredients for your kitchen',
    image: require('../../../assets/StarterKit_Banners/hero-1.webp'),
  },
  {
    id: 'pantry',
    lead: 'Stock the',
    accent: 'pantry',
    sub: 'Rice, oils and spices',
    image: require('../../../assets/StarterKit_Banners/hero-2.webp'),
  },
  {
    id: 'bake',
    lead: 'Bake from',
    accent: 'day one',
    sub: 'Bread, dairy and baking essentials',
    image: require('../../../assets/StarterKit_Banners/hero-3.webp'),
  },
  {
    id: 'fresh',
    lead: 'Fresh for',
    accent: 'the pass',
    sub: 'Vegetables and staples, ready to prep',
    image: require('../../../assets/StarterKit_Banners/hero-4.webp'),
  },
];

const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'rice', label: 'Rice & Pulses', tint: '#FFF3E0', image: require('../../../assets/Category_PNGs/18_rice_rice_products.png') },
  { id: 'oils', label: 'Oils & Spices', tint: '#FFF9C4', image: require('../../../assets/Category_PNGs/13_edible_oils.png') },
  { id: 'vegetables', label: 'Fresh Produce', tint: '#E8F5E9', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png') },
  { id: 'butter', label: 'Dairy & Cheese', tint: '#E1F5FE', image: require('../../../assets/Category_PNGs/06_butter_cheese_more.png') },
  { id: 'chicken', label: 'Chicken & Eggs', tint: '#FFEBEE', image: require('../../../assets/Category_PNGs/08_chicken_eggs.png') },
  { id: 'sauces', label: 'Sauces', tint: '#FFF3E0', image: require('../../../assets/Category_PNGs/09_sauces_seasoning.png') },
  { id: 'drinks', label: 'Beverages', tint: '#EDE7F6', image: require('../../../assets/Category_PNGs/14_beverages_mixers.png') },
  { id: 'spices', label: 'Masala & Sugar', tint: '#FFF8E1', image: require('../../../assets/Category_PNGs/07_masala_salt_sugar.png') },
  { id: 'frozen', label: 'Frozen Food', tint: '#E0F7FA', image: require('../../../assets/Category_PNGs/12_frozen_instant_food.png') },
  { id: 'canned', label: 'Packaged Foods', tint: '#FCE4EC', image: require('../../../assets/Category_PNGs/10_canned_imported_items.png') },
  { id: 'dairy', label: 'Fresh Dairy', tint: '#E3F2FD', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png') },
  { id: 'packaging', label: 'Packaging', tint: '#F4F5F7', image: require('../../../assets/Category_PNGs/04_packaging_material.png') },
];

const ORDER_OPTIONS = ['Under 50', '50 – 100', '100 – 250', '250 – 500', '500+'];
const BUDGET_OPTIONS = ['Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,50,000', 'Above ₹2,50,000'];
const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'All day'];
const FOOD_OPTIONS = ['Vegetarian', 'Non-vegetarian', 'Both'];
const STEPS = ['Business Details', 'Menu Details', 'Review & Submit'] as const;

const FEATURES = [
  { label: 'Wide product range', icon: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>' },
  { label: 'Trusted brands', icon: '<path d="M12 3.5 19 6.2v5.4c0 4.2-3 6.8-7 8.4-4-1.6-7-4.2-7-8.4V6.2L12 3.5Z"/><path d="M8.8 12.1 11 14.2 15.3 9.6"/>' },
  { label: 'Bulk pricing', icon: '<path d="M12.2 4.5h6.3v6.3L11 18.3 5.7 13l6.5-8.5Z"/><circle cx="16.2" cy="7.8" r="1"/>' },
  { label: 'Expert support', icon: '<path d="M4.5 13V12a7.5 7.5 0 0 1 15 0v1"/><rect x="3.5" y="13" width="4" height="6" rx="1.4"/><rect x="16.5" y="13" width="4" height="6" rx="1.4"/>' },
];

const NEXT_STEPS = [
  { icon: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3.5v3M16 3.5v3M4 9h16"/>', text: 'Our expert will call you within 24 hours to discuss your requirements.' },
  { icon: '<rect x="6" y="4.5" width="12" height="15.5" rx="2"/><path d="M9 4.2h6v2.4H9zM8.5 11h7M8.5 14h5"/>', text: "We'll prepare a customized starter kit and share the best pricing." },
  { icon: '<path d="M3.5 8 12 4.5 20.5 8 12 11.5 3.5 8Z"/><path d="M3.5 8v8L12 19.5 20.5 16V8"/><path d="M12 11.5V19.5"/>', text: 'Once confirmed, you can place your order directly from the app.' },
];

export type StarterDraft = {
  businessName: string;
  businessType: string;
  location: string;
  cuisine: string;
  menuItems: string;
  dailyOrders: string;
  budget: string;
  notes: string;
  kitIds: string[];
  mealTime: string;
  foodType: string;
  brands: string;
  menuNotes: string;
};

export type StarterRequest = StarterDraft & {
  id: string;
  submittedLabel: string;
};

type ScreenName = 'home' | 'business' | 'kits' | 'kit' | 'request' | 'received' | 'requests';

function glyph(body: string, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const PIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${ORANGE}" d="M12 2.2a6.8 6.8 0 0 0-6.8 6.8c0 5 6.8 12.8 6.8 12.8s6.8-7.8 6.8-12.8A6.8 6.8 0 0 0 12 2.2Zm0 9.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z"/></svg>`;
const CART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="20.2" r="1.35" fill="${INK}" stroke="none"/><circle cx="18" cy="20.2" r="1.35" fill="${INK}" stroke="none"/><path d="M2.4 3.2h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.45h8.7a1.8 1.8 0 0 0 1.75-1.4l1.5-6.8H5.6"/></svg>`;

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

function businessById(id: string): Business {
  const found = BUSINESSES.find((item) => item.id === id) ?? BUSINESSES[0];
  if (!found) throw new Error('No starter kit business types');
  return found;
}

function kitById(id: string): Kit {
  const found = KITS.find((item) => item.id === id) ?? KITS[0];
  if (!found) throw new Error('No starter kits');
  return found;
}

function blankDraft(city: string, businessId: string, kitId: string | null): StarterDraft {
  return {
    businessName: '',
    businessType: businessById(businessId).label,
    location: city,
    cuisine: '',
    menuItems: '',
    dailyOrders: '',
    budget: '',
    notes: '',
    kitIds: kitId ? [kitId] : [],
    mealTime: '',
    foodType: '',
    brands: '',
    menuNotes: '',
  };
}

function formatSubmitted(date: Date) {
  const hours24 = date.getHours();
  const hours = hours24 % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes} ${suffix}`;
}

function shown(value: string) {
  const text = value.trim();
  return text || '—';
}

export function StarterKitFlow({
  city,
  cartCount,
  requests,
  onSubmit,
  onDeliver,
  onCart,
  onShop,
  onOpenCategory,
  footer,
}: {
  city: string;
  cartCount: number;
  requests: StarterRequest[];
  onSubmit: (request: StarterRequest) => void;
  onDeliver?: () => void;
  onCart: () => void;
  onShop: () => void;
  onOpenCategory: (id: string) => void;
  footer: ReactNode;
}) {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [businessId, setBusinessId] = useState('restaurant');
  const [kitId, setKitId] = useState<string | null>(null);
  const [kitFrom, setKitFrom] = useState<'home' | 'business' | 'kits'>('home');
  const [requestFrom, setRequestFrom] = useState<ScreenName>('home');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<StarterDraft>(() => blankDraft(city, 'restaurant', null));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openField, setOpenField] = useState<string | null>(null);
  const [receivedId, setReceivedId] = useState<string | null>(null);
  const [fromList, setFromList] = useState(false);
  const [copied, setCopied] = useState(false);
  const [latest, setLatest] = useState<StarterRequest | null>(null);

  const openBusiness = (id: string) => {
    setBusinessId(id);
    setScreen('business');
  };
  const openKit = (id: string, from: 'home' | 'business' | 'kits', fromBusiness?: string) => {
    setKitFrom(from);
    setKitId(id);
    setBusinessId(fromBusiness ?? 'restaurant');
    setScreen('kit');
  };
  const openRequest = (from: ScreenName, forBusiness: string, forKit: string | null) => {
    setRequestFrom(from);
    setBusinessId(forBusiness);
    setKitId(forKit);
    setDraft(blankDraft(city, forBusiness, forKit));
    setErrors({});
    setOpenField(null);
    setStep(1);
    setScreen('request');
  };
  const patch = (partial: Partial<StarterDraft>) => {
    setDraft((current) => ({ ...current, ...partial }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(partial).forEach((key) => {
        delete next[key];
      });
      return next;
    });
  };

  const submit = () => {
    const request: StarterRequest = {
      ...draft,
      id: `KXSKT${2501000 + requests.length + 1}`,
      submittedLabel: formatSubmitted(new Date()),
    };
    onSubmit(request);
    setLatest(request);
    setReceivedId(request.id);
    setFromList(false);
    setCopied(false);
    setScreen('received');
  };

  const received = requests.find((item) => item.id === receivedId) ?? (latest?.id === receivedId ? latest : null);

  if (screen === 'business') {
    return (
      <BusinessScreen
        business={businessById(businessId)}
        onBack={() => setScreen('home')}
        onOpenKit={(id) => openKit(id, 'business', businessId)}
        onRequest={() => openRequest('business', businessId, null)}
        footer={footer}
      />
    );
  }
  if (screen === 'kits') {
    return (
      <KitListScreen
        onBack={() => setScreen('home')}
        onOpenKit={(id) => openKit(id, 'kits')}
        onRequest={() => openRequest('kits', 'restaurant', null)}
        footer={footer}
      />
    );
  }
  if (screen === 'kit' && kitId) {
    return (
      <KitDetailScreen
        kit={kitById(kitId)}
        onBack={() => setScreen(kitFrom)}
        onRequest={() => openRequest('kit', businessId, kitId)}
      />
    );
  }
  if (screen === 'request') {
    return (
      <RequestScreen
        step={step}
        draft={draft}
        errors={errors}
        openField={openField}
        onOpenField={setOpenField}
        onChange={patch}
        onBack={() => {
          setOpenField(null);
          if (step === 1) setScreen(requestFrom);
          else setStep((current) => (current === 3 ? 2 : 1));
        }}
        onNext={() => {
          if (step === 1) {
            const next: Record<string, string> = {};
            if (!draft.businessName.trim()) next.businessName = 'Enter the business name';
            if (!draft.location.trim()) next.location = 'Enter the location';
            if (!draft.cuisine.trim()) next.cuisine = 'Enter the cuisine type';
            if (!draft.dailyOrders) next.dailyOrders = 'Select the expected daily orders';
            setErrors(next);
            if (Object.keys(next).length) return;
            setOpenField(null);
            setStep(2);
            return;
          }
          if (step === 2) {
            const next: Record<string, string> = {};
            if (!draft.mealTime) next.mealTime = 'Select the busiest meal';
            if (!draft.foodType) next.foodType = 'Select the food type';
            setErrors(next);
            if (Object.keys(next).length) return;
            setOpenField(null);
            setStep(3);
            return;
          }
          submit();
        }}
      />
    );
  }
  if (screen === 'received' && received) {
    return (
      <ReceivedScreen
        request={received}
        copied={copied}
        onCopy={async () => {
          const text = `#${received.id}`;
          try {
            if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
              await navigator.clipboard.writeText(text);
            }
          } catch {
            // The id stays on screen either way.
          }
          setCopied(true);
        }}
        onBack={fromList ? () => setScreen('requests') : undefined}
        onHome={() => setScreen('home')}
        onRequests={() => setScreen('requests')}
      />
    );
  }
  if (screen === 'requests') {
    return (
      <RequestsScreen
        requests={requests}
        onBack={() => setScreen('home')}
        onOpen={(id) => {
          setReceivedId(id);
          setFromList(true);
          setCopied(false);
          setScreen('received');
        }}
        onRequest={() => openRequest('requests', 'restaurant', null)}
      />
    );
  }

  return (
    <HomeScreen
      city={city}
      cartCount={cartCount}
      onDeliver={onDeliver}
      onCart={onCart}
      onShop={onShop}
      onExplore={() => setScreen('kits')}
      onBusiness={openBusiness}
      onSeeAll={() => setScreen('kits')}
      onOpenKit={(id) => openKit(id, 'home')}
      onOpenCategory={onOpenCategory}
      onRequests={requests.length ? () => setScreen('requests') : undefined}
      requestCount={requests.length}
      footer={footer}
    />
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.screen, width > 600 ? styles.tablet : null, Platform.OS === 'web' ? styles.webFrame : null]}>
      {children}
    </View>
  );
}

function BrandBar({
  city,
  cartCount,
  onDeliver,
  onCart,
  onShop,
}: {
  city: string;
  cartCount: number;
  onDeliver?: () => void;
  onCart: () => void;
  onShop: () => void;
}) {
  return (
    <View style={[styles.brand, { paddingTop: Platform.OS === 'web' ? 12 : 46 }]}>
      <Pressable onPress={onShop} accessibilityRole="button" accessibilityLabel="KitchenX home">
        <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.logo} resizeMode="contain" />
      </Pressable>
      <Pressable onPress={onDeliver} accessibilityRole="button" accessibilityLabel={`Deliver to ${city}`} style={styles.loc}>
        <Icon svg={PIN} size={16} />
        <View style={styles.locCopy}>
          <Text style={styles.locLabel}>Deliver to</Text>
          <Text style={styles.locCity} numberOfLines={1}>{city} ▾</Text>
        </View>
      </Pressable>
      <Pressable onPress={onCart} accessibilityRole="button" accessibilityLabel="Cart" style={styles.cartBtn}>
        <Icon svg={CART} size={24} />
        {cartCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

function NavBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={[styles.nav, { paddingTop: Platform.OS === 'web' ? 8 : 42 }]}>
      {onBack ? (
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.navBtn}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.navBtn} />
      )}
      <Text style={styles.navTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.navBtn} />
    </View>
  );
}

function Primary({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.primary} testID={testID}>
      <Icon svg={glyph('<rect x="6" y="4.5" width="12" height="15.5" rx="2"/><path d="M9 4.2h6v2.4H9z"/>', WHITE)} size={18} />
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

function HomeScreen({
  city,
  cartCount,
  onDeliver,
  onCart,
  onShop,
  onExplore,
  onBusiness,
  onSeeAll,
  onOpenKit,
  onOpenCategory,
  onRequests,
  requestCount,
  footer,
}: {
  city: string;
  cartCount: number;
  onDeliver?: () => void;
  onCart: () => void;
  onShop: () => void;
  onExplore: () => void;
  onBusiness: (id: string) => void;
  onSeeAll: () => void;
  onOpenKit: (id: string) => void;
  onOpenCategory: (id: string) => void;
  onRequests?: () => void;
  requestCount: number;
  footer: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const bannerWidth = Math.min(width, 480) - 32;
  const heroHeight = Math.round(bannerWidth * (compact ? 0.54 : 0.4));
  const featured = KITS.filter((item) => item.featured);
  return (
    <Frame>
      <BrandBar city={city} cartCount={cartCount} onDeliver={onDeliver} onCart={onCart} onShop={onShop} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Starter Kit</Text>
        <Text style={styles.pageSub}>Ready-to-use food essentials for your menu</Text>
        {requestCount > 0 && onRequests ? (
          <Pressable onPress={onRequests} accessibilityRole="button" accessibilityLabel="View my requests" style={styles.requestLink}>
            <Text style={styles.viewKit}>View my requests</Text>
          </Pressable>
        ) : null}
        <HeroCarousel width={bannerWidth} height={heroHeight} onExplore={onExplore} />
        <Text style={styles.sectionTitle}>Choose your business type</Text>
        <Text style={styles.sectionSub}>Pick a starter kit tailored for your needs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {BUSINESSES.map((item) => (
            <Pressable key={item.id} style={[styles.typeItem, compact && styles.typeItemCompact]} onPress={() => onBusiness(item.id)} accessibilityRole="button" accessibilityLabel={item.label} testID={`starter-business-${item.id}`}>
              <View style={[styles.typePhoto, item.id === 'restaurant' && styles.typePhotoOn]}>
                <Image source={item.image} style={styles.typeImage} resizeMode="cover" />
              </View>
              <Text style={[styles.typeLabel, compact && styles.typeLabelCompact]} numberOfLines={2}>{item.label}</Text>
              <Text style={[styles.typeCaption, compact && styles.typeCaptionCompact]} numberOfLines={2}>{item.caption}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Popular Starter Kits</Text>
          <Pressable onPress={onSeeAll} accessibilityRole="button" accessibilityLabel="See all popular starter kits">
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.cardRow}>
          {featured.map((item) => (
            <View key={item.id} style={styles.kitCard}>
              <View style={styles.kitCardPhoto}>
                <Image source={item.image} style={styles.kitCardImage} resizeMode="cover" />
              </View>
              <Text style={styles.kitCardTitle} numberOfLines={2}>{item.cardTitle}</Text>
              <Text style={styles.kitCardLine} numberOfLines={2}>{item.cardLine}</Text>
              <Pressable onPress={() => onOpenKit(item.id)} accessibilityRole="button" accessibilityLabel={`View ${item.cardTitle}`}>
                <Text style={styles.viewKit}>View kit ›</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Build your menu</Text>
        <Text style={styles.sectionSub}>Explore essential ingredients by category</Text>
        <View style={styles.menuGrid}>
          {MENU_CATEGORIES.map((item) => (
            <Pressable key={item.id} style={styles.menuCell} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
              <View style={[styles.menuPhoto, { backgroundColor: item.tint }]}>
                <Image source={item.image} style={styles.menuImage} resizeMode="contain" />
              </View>
              <Text style={styles.menuLabel} numberOfLines={2}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {footer}
    </Frame>
  );
}

function HeroCarousel({ width, height, onExplore }: { width: number; height: number; onExplore: () => void }) {
  const index = useRef(0);
  const paused = useRef(false);
  const touch = useRef({ x: 0, moved: false });
  const [active, setActive] = useState(0);
  const show = (next: number) => {
    const safe = (next + HEROES.length) % HEROES.length;
    index.current = safe;
    setActive(safe);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (paused.current) return;
      show(index.current + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const slide = HEROES[active];
  if (!slide) return null;
  return (
    <View>
      <View
        style={[styles.hero, { width, height }]}
        onTouchStart={(event) => {
          paused.current = true;
          touch.current = { x: event.nativeEvent.pageX, moved: false };
        }}
        onTouchMove={(event) => {
          if (Math.abs(event.nativeEvent.pageX - touch.current.x) > 12) touch.current.moved = true;
        }}
        onTouchEnd={(event) => {
          const delta = event.nativeEvent.pageX - touch.current.x;
          if (delta <= -36) show(index.current + 1);
          else if (delta >= 36) show(index.current - 1);
          else if (!touch.current.moved) onExplore();
          paused.current = false;
        }}
        accessibilityRole="button"
        accessibilityLabel={`${slide.lead} ${slide.accent}. Explore kits`}
      >
        <Image source={slide.image} style={styles.heroImageLeft} resizeMode="cover" />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>
            {slide.lead} <Text style={styles.heroAccent}>{slide.accent}</Text>
          </Text>
          <Text style={styles.heroSub}>{slide.sub}</Text>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>Explore kits ›</Text>
          </View>
        </View>
      </View>
      <View style={styles.dots}>
        {HEROES.map((item, dot) => (
          <Pressable key={item.id} onPress={() => show(dot)} accessibilityRole="button" accessibilityLabel={`Banner ${dot + 1}`}>
            <View style={[styles.dot, dot === active && styles.dotOn]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function BusinessScreen({
  business,
  onBack,
  onOpenKit,
  onRequest,
  footer,
}: {
  business: Business;
  onBack: () => void;
  onOpenKit: (id: string) => void;
  onRequest: () => void;
  footer: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const bannerWidth = Math.min(width, 480) - 32;
  const heroHeight = Math.round(bannerWidth * (compact ? 0.66 : 0.46));
  return (
    <Frame>
      <NavBar title={`${business.label} Starter Kit`} onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.blockScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, styles.heroInset, { height: heroHeight }]}>
          {business.wide ? (
            <Image source={business.wide} style={styles.heroImageLeft} resizeMode="cover" />
          ) : (
            <Image source={business.image} style={styles.heroCutout} resizeMode="contain" />
          )}
          <View style={[styles.heroCopy, styles.setupCopy, compact && styles.setupCopyCompact]}>
            <Text style={[styles.setupTitle, business.wide ? styles.setupTitleOnPhoto : null, compact && styles.setupTitleCompact]}>{business.setupTitle}</Text>
            <Text style={[styles.setupBody, business.wide ? styles.setupBodyOnPhoto : null]}>{business.setupBody}</Text>
          </View>
        </View>
        <View style={styles.features}>
          {FEATURES.map((item) => (
            <View key={item.label} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Icon svg={glyph(item.icon, ORANGE)} size={18} />
              </View>
              <Text style={styles.featureLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.sectionTitle, styles.sectionPad]}>{business.kitHeading}</Text>
        {KITS.filter((item) => item.id !== 'pizza').map((item) => (
          <KitRow key={item.id} kit={item} onPress={() => onOpenKit(item.id)} />
        ))}
      </ScrollView>
      <View style={styles.dock}>
        <Primary label="Request Custom Starter Kit" onPress={onRequest} testID="starter-request" />
        <Text style={styles.hint}>Can't find what you need? Tell us your menu and we'll suggest the right kit for you.</Text>
      </View>
      {footer}
    </Frame>
  );
}

function KitListScreen({
  onBack,
  onOpenKit,
  onRequest,
  footer,
}: {
  onBack: () => void;
  onOpenKit: (id: string) => void;
  onRequest: () => void;
  footer: ReactNode;
}) {
  return (
    <Frame>
      <NavBar title="Popular Starter Kits" onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.blockScroll} showsVerticalScrollIndicator={false}>
        {KITS.map((item) => (
          <KitRow key={item.id} kit={item} onPress={() => onOpenKit(item.id)} />
        ))}
      </ScrollView>
      <View style={styles.dock}>
        <Primary label="Request Custom Starter Kit" onPress={onRequest} testID="starter-request-all" />
      </View>
      {footer}
    </Frame>
  );
}

function KitRow({ kit, onPress }: { kit: Kit; onPress: () => void }) {
  return (
    <Pressable style={styles.kitRow} onPress={onPress} accessibilityRole="button" accessibilityLabel={kit.name}>
      <View style={styles.kitThumb}>
        <Image source={kit.image} style={styles.kitThumbImage} resizeMode="cover" />
      </View>
      <View style={styles.kitRowBody}>
        <Text style={styles.kitRowTitle}>{kit.name}</Text>
        <Text style={styles.kitRowLine}>{kit.line}</Text>
      </View>
      <Text style={styles.rowChevron}>›</Text>
    </Pressable>
  );
}

function KitDetailScreen({ kit, onBack, onRequest }: { kit: Kit; onBack: () => void; onRequest: () => void }) {
  return (
    <Frame>
      <NavBar title={kit.name} onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.detailPhoto}>
          <Image source={kit.image} style={styles.detailImage} resizeMode="contain" />
        </View>
        <Text style={styles.detailTitle}>{kit.name}</Text>
        <Text style={styles.detailLine}>{kit.line}</Text>
        <Text style={styles.detailBody}>A ready set of ingredients for this menu. Tell us your kitchen and we will suggest quantities for the way you serve.</Text>
      </ScrollView>
      <View style={styles.dock}>
        <Primary label="Request Custom Starter Kit" onPress={onRequest} testID="starter-request-kit" />
      </View>
    </Frame>
  );
}

function RequestScreen({
  step,
  draft,
  errors,
  openField,
  onOpenField,
  onChange,
  onBack,
  onNext,
}: {
  step: 1 | 2 | 3;
  draft: StarterDraft;
  errors: Record<string, string>;
  openField: string | null;
  onOpenField: (field: string | null) => void;
  onChange: (partial: Partial<StarterDraft>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);
  const nextLabel = step === 1 ? 'Next: Menu Details →' : step === 2 ? 'Next: Review →' : 'Submit request';
  return (
    <Frame>
      <NavBar title="Request Custom Starter Kit" onBack={onBack} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Stepper step={step} />
          {step === 1 ? (
            <>
              <Text style={styles.formHead}>Business Information</Text>
              <Text style={styles.formSub}>Tell us about your restaurant</Text>
              <Field label="Business name" required value={draft.businessName} placeholder="Enter restaurant name" error={errors.businessName} onChangeText={(businessName) => onChange({ businessName })} autoCapitalize="words" />
              <SelectField
                label="Business type"
                required
                value={draft.businessType}
                placeholder="Select type"
                options={BUSINESSES.map((item) => item.label)}
                open={openField === 'businessType'}
                onToggle={() => onOpenField(openField === 'businessType' ? null : 'businessType')}
                onPick={(businessType) => {
                  onChange({ businessType });
                  onOpenField(null);
                }}
              />
              <Field label="Location" required value={draft.location} placeholder="Enter city" error={errors.location} onChangeText={(location) => onChange({ location })} autoCapitalize="words" />
              <Text style={styles.formHead}>Cuisine & Menu Requirements</Text>
              <Text style={styles.formSub}>What type of food do you plan to serve?</Text>
              <Field label="Cuisine type" required value={draft.cuisine} placeholder="e.g. South Indian, North Indian, Chinese..." error={errors.cuisine} onChangeText={(cuisine) => onChange({ cuisine })} autoCapitalize="words" />
              <Field label="Menu items" value={draft.menuItems} placeholder="e.g. Idli, Dosa, Biryani, Parotta..." onChangeText={(menuItems) => onChange({ menuItems })} autoCapitalize="sentences" />
              <SelectField
                label="Expected daily orders / servings"
                required
                value={draft.dailyOrders}
                placeholder="Select range"
                options={ORDER_OPTIONS}
                open={openField === 'dailyOrders'}
                error={errors.dailyOrders}
                onToggle={() => onOpenField(openField === 'dailyOrders' ? null : 'dailyOrders')}
                onPick={(dailyOrders) => {
                  onChange({ dailyOrders });
                  onOpenField(null);
                }}
              />
              <Text style={styles.formHead}>Budget & Additional Details</Text>
              <SelectField
                label="Estimated monthly budget"
                value={draft.budget}
                placeholder="Select range"
                options={BUDGET_OPTIONS}
                open={openField === 'budget'}
                onToggle={() => onOpenField(openField === 'budget' ? null : 'budget')}
                onPick={(budget) => {
                  onChange({ budget });
                  onOpenField(null);
                }}
              />
              <Field label="Additional requirements" value={draft.notes} placeholder="Any specific ingredients, brands or equipment?" onChangeText={(notes) => onChange({ notes })} autoCapitalize="sentences" />
            </>
          ) : null}
          {step === 2 ? (
            <>
              <Text style={styles.formHead}>Menu Details</Text>
              <Text style={styles.formSub}>Tell us how you plan to serve</Text>
              <Text style={styles.fieldLabel}>Kits you want <Text style={styles.optional}>(optional)</Text></Text>
              <View style={styles.chips}>
                {KITS.map((item) => {
                  const on = draft.kitIds.includes(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() => {
                        const kitIds = on ? draft.kitIds.filter((id) => id !== item.id) : [...draft.kitIds, item.id];
                        onChange({ kitIds });
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <SelectField
                label="Busiest meal"
                required
                value={draft.mealTime}
                placeholder="Select meal"
                options={MEAL_OPTIONS}
                open={openField === 'mealTime'}
                error={errors.mealTime}
                onToggle={() => onOpenField(openField === 'mealTime' ? null : 'mealTime')}
                onPick={(mealTime) => {
                  onChange({ mealTime });
                  onOpenField(null);
                }}
              />
              <SelectField
                label="Food type"
                required
                value={draft.foodType}
                placeholder="Select type"
                options={FOOD_OPTIONS}
                open={openField === 'foodType'}
                error={errors.foodType}
                onToggle={() => onOpenField(openField === 'foodType' ? null : 'foodType')}
                onPick={(foodType) => {
                  onChange({ foodType });
                  onOpenField(null);
                }}
              />
              <Field label="Brands you prefer" value={draft.brands} placeholder="e.g. a flour, oil or dairy brand" onChangeText={(brands) => onChange({ brands })} autoCapitalize="words" />
              <Field label="Notes for the menu" value={draft.menuNotes} placeholder="Spice level, dietary needs, or how you plate" onChangeText={(menuNotes) => onChange({ menuNotes })} multiline autoCapitalize="sentences" />
            </>
          ) : null}
          {step === 3 ? (
            <>
              <Text style={styles.formHead}>Review & Submit</Text>
              <Text style={styles.formSub}>Check the details before you send this request</Text>
              <View style={styles.reviewCard}>
                <ReviewRow label="Business name" value={shown(draft.businessName)} />
                <ReviewRow label="Business type" value={shown(draft.businessType)} />
                <ReviewRow label="Location" value={shown(draft.location)} />
                <ReviewRow label="Cuisine" value={shown(draft.cuisine)} />
                <ReviewRow label="Menu items" value={shown(draft.menuItems)} />
                <ReviewRow label="Daily orders" value={shown(draft.dailyOrders)} />
                <ReviewRow label="Monthly budget" value={shown(draft.budget)} />
                <ReviewRow label="Requirements" value={shown(draft.notes)} />
                <ReviewRow label="Kits" value={shown(draft.kitIds.map((id) => kitById(id).name).join(', '))} />
                <ReviewRow label="Busiest meal" value={shown(draft.mealTime)} />
                <ReviewRow label="Food type" value={shown(draft.foodType)} />
                <ReviewRow label="Brands" value={shown(draft.brands)} />
                <ReviewRow label="Menu notes" value={shown(draft.menuNotes)} />
              </View>
            </>
          ) : null}
        </ScrollView>
        <View style={styles.dock}>
          <Pressable onPress={onNext} accessibilityRole="button" accessibilityLabel={nextLabel} style={styles.primary} testID="starter-next">
            <Text style={styles.primaryText}>{nextLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Frame>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.stepper}>
      {STEPS.map((label, index) => {
        const number = index + 1;
        const on = number === step;
        const done = number < step;
        return (
          <View key={label} style={styles.step}>
            <View style={styles.stepTrack}>
              <View style={[styles.stepLine, index === 0 && styles.stepLineHidden, (on || done) && styles.stepLineOn]} />
              <View style={[styles.stepDot, (on || done) && styles.stepDotOn]}>
                <Text style={[styles.stepNum, (on || done) && styles.stepNumOn]}>{done ? '✓' : number}</Text>
              </View>
              <View style={[styles.stepLine, index === STEPS.length - 1 && styles.stepLineHidden, done && styles.stepLineOn]} />
            </View>
            <Text style={[styles.stepLabel, on && styles.stepLabelOn]} numberOfLines={2}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function Field({
  label,
  required,
  value,
  placeholder,
  error,
  onChangeText,
  multiline,
  autoCapitalize,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  error?: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>
        {label} {required ? <Text style={styles.star}>*</Text> : <Text style={styles.optional}>(optional)</Text>}
      </Text>
      <View style={[styles.field, multiline && styles.fieldTall, error ? styles.fieldError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={autoCapitalize === 'sentences'}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputTall]}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function SelectField({
  label,
  required,
  value,
  placeholder,
  options,
  open,
  error,
  onToggle,
  onPick,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  options: string[];
  open: boolean;
  error?: string;
  onToggle: () => void;
  onPick: (value: string) => void;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>
        {label} {required ? <Text style={styles.star}>*</Text> : <Text style={styles.optional}>(optional)</Text>}
      </Text>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: open }} style={[styles.field, styles.select, error ? styles.fieldError : null]}>
        <Text style={[styles.selectValue, !value && styles.selectPlaceholder]} numberOfLines={1}>{value || placeholder}</Text>
        <Text style={styles.selectChevron}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.options}>
          {options.map((option) => {
            const on = option === value;
            return (
              <Pressable key={option} onPress={() => onPick(option)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.option, on && styles.optionOn]}>
                <Text style={[styles.optionText, on && styles.optionTextOn]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

function ReceivedScreen({
  request,
  copied,
  onCopy,
  onBack,
  onHome,
  onRequests,
}: {
  request: StarterRequest;
  copied: boolean;
  onCopy: () => void;
  onBack?: () => void;
  onHome: () => void;
  onRequests: () => void;
}) {
  return (
    <Frame>
      {onBack ? <NavBar title="Request received" onBack={onBack} /> : <View style={{ height: Platform.OS === 'web' ? 12 : 46 }} />}
      <ScrollView style={styles.flex} contentContainerStyle={styles.successScroll} showsVerticalScrollIndicator={false}>
        <Image source={require('../../../assets/starter-kit/request-received.png')} style={styles.successArt} resizeMode="contain" />
        <Text style={styles.successTitle}>Your Starter Kit Request Has Been Received!</Text>
        <Text style={styles.successBody}>Thank you for showing interest. Our kitchen experts will review your requirements and get in touch with you soon.</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Request ID</Text>
            <View style={styles.summaryId}>
              <Text style={styles.summaryValue}>#{request.id}</Text>
              <Pressable onPress={onCopy} accessibilityRole="button" accessibilityLabel="Copy request id" style={styles.copyBtn}>
                <Icon svg={glyph('<rect x="8" y="8" width="10" height="11" rx="1.5"/><path d="M6 15.5V6.2A1.2 1.2 0 0 1 7.2 5H15"/>', MUTED)} size={16} />
              </Pressable>
            </View>
          </View>
          {copied ? <Text style={styles.copied}>Copied</Text> : null}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Business Type</Text>
            <Text style={styles.summaryValue}>{request.businessType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location</Text>
            <Text style={styles.summaryValue}>{request.location}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Submitted On</Text>
            <Text style={styles.summaryValue}>{request.submittedLabel}</Text>
          </View>
        </View>
        <Text style={styles.nextHead}>What’s next?</Text>
        {NEXT_STEPS.map((item) => (
          <View key={item.text} style={styles.nextRow}>
            <View style={styles.nextIcon}>
              <Icon svg={glyph(item.icon, ORANGE)} size={18} />
            </View>
            <Text style={styles.nextText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dock}>
        <Pressable onPress={onHome} accessibilityRole="button" accessibilityLabel="Back to Starter Kit" style={styles.primary}>
          <Text style={styles.primaryText}>Back to Starter Kit</Text>
        </Pressable>
        <Pressable onPress={onRequests} accessibilityRole="button" accessibilityLabel="View My Requests" style={styles.outline}>
          <Text style={styles.outlineText}>View My Requests</Text>
        </Pressable>
      </View>
    </Frame>
  );
}

function RequestsScreen({
  requests,
  onBack,
  onOpen,
  onRequest,
}: {
  requests: StarterRequest[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onRequest: () => void;
}) {
  return (
    <Frame>
      <NavBar title="My Requests" onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.blockScroll} showsVerticalScrollIndicator={false}>
        {requests.map((item) => (
          <Pressable key={item.id} style={styles.requestCard} onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={`Request ${item.id}`}>
            <View style={styles.requestTop}>
              <Text style={styles.requestId}>#{item.id}</Text>
              <Text style={styles.rowChevron}>›</Text>
            </View>
            <Text style={styles.requestMeta}>{item.businessType} · {item.location}</Text>
            <Text style={styles.requestWhen}>{item.submittedLabel}</Text>
          </Pressable>
        ))}
        {!requests.length ? <Text style={styles.empty}>You have not sent a starter kit request yet.</Text> : null}
      </ScrollView>
      <View style={styles.dock}>
        <Primary label="Request Custom Starter Kit" onPress={onRequest} testID="starter-request-list" />
      </View>
    </Frame>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  tablet: { width: 480, alignSelf: 'center' },
  webFrame: { height: '100%', overflow: 'hidden' },
  flex: { flex: 1, minHeight: 0 },
  brand: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  logo: { width: 104, height: 20 },
  loc: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  locCopy: { flexShrink: 1, minWidth: 0 },
  locLabel: { fontSize: 10, lineHeight: 12, color: MUTED },
  locCity: { fontSize: 12, lineHeight: 15, fontWeight: '700', color: INK },
  cartBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: WHITE, fontSize: 10, fontWeight: '700' },
  nav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 6 },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 32, lineHeight: 34, color: INK, fontWeight: '400' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: INK },
  homeScroll: { paddingBottom: 24 },
  pageTitle: { fontSize: 24, lineHeight: 28, fontWeight: '800', color: INK, paddingHorizontal: 16, marginTop: 2 },
  pageSub: { fontSize: 13, lineHeight: 18, color: MUTED, paddingHorizontal: 16, marginTop: 2, marginBottom: 2 },
  requestLink: { alignSelf: 'flex-start', paddingHorizontal: 16, marginBottom: 8 },
  hero: { alignSelf: 'center', borderRadius: 18, overflow: 'hidden', backgroundColor: FIELD },
  heroInset: { alignSelf: 'stretch', marginHorizontal: 16 },
  heroImage: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' },
  heroImageLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' ? ({ objectFit: 'cover', objectPosition: 'left center' } as object) : null),
  },
  heroCutout: { position: 'absolute', right: 8, top: '8%', width: '42%', height: '84%' },
  heroCopy: { flex: 1, justifyContent: 'center', width: '48%', paddingLeft: 16, paddingRight: 8, pointerEvents: 'none' },
  heroTitle: { fontSize: 20, lineHeight: 24, fontWeight: '800', color: INK },
  heroAccent: { color: ORANGE, fontWeight: '800' },
  heroSub: { marginTop: 6, fontSize: 12, lineHeight: 16, color: MUTED },
  heroPill: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: ORANGE, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  heroPillText: { color: WHITE, fontSize: 13, lineHeight: 16, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB' },
  dotOn: { width: 16, backgroundColor: ORANGE },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: '800', color: INK, paddingHorizontal: 16, marginTop: 6 },
  sectionSub: { fontSize: 13, lineHeight: 18, color: MUTED, paddingHorizontal: 16, marginTop: 2 },
  sectionPad: { paddingHorizontal: 16 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16 },
  seeAll: { color: ORANGE, fontWeight: '700', fontSize: 14, marginTop: 6 },
  typeRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, gap: 12 },
  typeItem: { width: 84, alignItems: 'center' },
  typeItemCompact: { width: 72 },
  typePhoto: { width: 64, height: 64, borderRadius: 16, overflow: 'hidden', backgroundColor: FIELD, borderWidth: 1, borderColor: LINE },
  typePhotoOn: { borderWidth: 1.5, borderColor: ORANGE },
  typeImage: { width: '100%', height: '100%' },
  typeLabel: { marginTop: 6, fontSize: 12, lineHeight: 15, fontWeight: '700', color: INK, textAlign: 'center' },
  typeLabelCompact: { fontSize: 10, lineHeight: 12 },
  typeCaption: { marginTop: 1, fontSize: 10, lineHeight: 13, color: MUTED, textAlign: 'center' },
  typeCaptionCompact: { fontSize: 9, lineHeight: 11 },
  cardRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  kitCard: { flex: 1, minWidth: 0, backgroundColor: WHITE, borderRadius: 16, borderWidth: 1, borderColor: LINE, padding: 8 },
  kitCardPhoto: { width: '100%', aspectRatio: 1.12, borderRadius: 12, backgroundColor: FIELD, overflow: 'hidden' },
  kitCardImage: { width: '100%', height: '100%' },
  kitCardTitle: { marginTop: 6, fontSize: 12, lineHeight: 15, fontWeight: '800', color: INK },
  kitCardLine: { marginTop: 2, fontSize: 11, lineHeight: 14, color: MUTED },
  viewKit: { marginTop: 4, fontSize: 12, fontWeight: '700', color: ORANGE },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 6 },
  menuCell: { width: '25%', alignItems: 'center', paddingHorizontal: 4, marginBottom: 12 },
  menuPhoto: { width: '100%', maxWidth: 76, aspectRatio: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  menuImage: { width: '84%', height: '84%' },
  menuLabel: { marginTop: 6, fontSize: 11, lineHeight: 14, fontWeight: '600', color: INK, textAlign: 'center' },
  blockScroll: { paddingBottom: 16 },
  features: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10 },
  feature: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  featureIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: SELECTED, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { marginTop: 4, fontSize: 11, lineHeight: 13, fontWeight: '600', color: INK, textAlign: 'center' },
  setupCopy: { flex: 0, flexGrow: 0, width: '42%', alignSelf: 'flex-start', justifyContent: 'flex-start', paddingTop: 14, paddingRight: 0 },
  setupCopyCompact: { width: '52%' },
  setupTitle: { fontSize: 20, lineHeight: 24, fontWeight: '800', color: INK },
  setupTitleCompact: { fontSize: 16, lineHeight: 19 },
  setupTitleOnPhoto: { color: WHITE },
  setupBody: { marginTop: 6, fontSize: 12, lineHeight: 16, color: MUTED },
  setupBodyOnPhoto: { color: WHITE },
  kitRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 6, padding: 6, borderRadius: 14, borderWidth: 1, borderColor: LINE, backgroundColor: WHITE, gap: 8 },
  kitThumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: FIELD, overflow: 'hidden' },
  kitThumbImage: { width: '100%', height: '100%' },
  kitRowBody: { flex: 1, minWidth: 0 },
  kitRowTitle: { fontSize: 14, lineHeight: 18, fontWeight: '800', color: INK },
  kitRowLine: { marginTop: 1, fontSize: 11, lineHeight: 14, color: MUTED },
  rowChevron: { fontSize: 22, lineHeight: 24, color: MUTED, fontWeight: '400' },
  detailScroll: { padding: 16, paddingBottom: 24 },
  detailPhoto: { height: 240, borderRadius: 18, backgroundColor: FIELD, alignItems: 'center', justifyContent: 'center' },
  detailImage: { width: '78%', height: '78%' },
  detailTitle: { marginTop: 16, fontSize: 22, lineHeight: 28, fontWeight: '800', color: INK },
  detailLine: { marginTop: 6, fontSize: 14, lineHeight: 20, color: MUTED },
  detailBody: { marginTop: 10, fontSize: 14, lineHeight: 21, color: INK },
  dock: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6, backgroundColor: WHITE, gap: 6 },
  primary: { height: 54, borderRadius: 16, backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: WHITE, fontSize: 16, fontWeight: '700' },
  outline: { height: 54, borderRadius: 16, backgroundColor: WHITE, borderWidth: 1.5, borderColor: LINE, alignItems: 'center', justifyContent: 'center' },
  outlineText: { color: INK, fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 12, lineHeight: 16, color: MUTED, textAlign: 'center' },
  formScroll: { paddingHorizontal: 16, paddingBottom: 28 },
  formHead: { marginTop: 8, fontSize: 16, lineHeight: 20, fontWeight: '800', color: INK },
  formSub: { marginTop: 1, marginBottom: 2, fontSize: 13, lineHeight: 16, color: MUTED },
  fieldBlock: { marginTop: 6 },
  fieldLabel: { fontSize: 12, lineHeight: 15, fontWeight: '600', color: INK, marginBottom: 3 },
  star: { color: ORANGE, fontWeight: '700' },
  optional: { color: MUTED, fontWeight: '400' },
  field: { minHeight: 42, borderRadius: 16, backgroundColor: FIELD, paddingHorizontal: 14, justifyContent: 'center' },
  fieldTall: { minHeight: 96, paddingVertical: 10 },
  fieldError: { borderWidth: 1.5, borderColor: ERROR },
  input: { fontSize: 15, color: INK, padding: 0, margin: 0 },
  inputTall: { minHeight: 72, textAlignVertical: 'top' },
  select: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectValue: { flex: 1, fontSize: 15, color: INK },
  selectPlaceholder: { color: PLACEHOLDER },
  selectChevron: { fontSize: 14, color: MUTED },
  options: { marginTop: 6, borderRadius: 16, borderWidth: 1, borderColor: LINE, overflow: 'hidden', backgroundColor: WHITE },
  option: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  optionOn: { backgroundColor: SELECTED, borderWidth: 1.5, borderColor: ORANGE },
  optionText: { fontSize: 14, color: INK },
  optionTextOn: { fontWeight: '700', color: ORANGE },
  error: { marginTop: 4, fontSize: 12, color: ERROR },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 16, backgroundColor: FIELD, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { backgroundColor: SELECTED, borderWidth: 1.5, borderColor: ORANGE },
  chipText: { fontSize: 13, color: INK },
  chipTextOn: { fontWeight: '700', color: ORANGE },
  stepper: { flexDirection: 'row', marginTop: 4, marginBottom: 2 },
  step: { flex: 1, alignItems: 'center' },
  stepTrack: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB' },
  stepLineOn: { backgroundColor: ORANGE },
  stepLineHidden: { backgroundColor: 'transparent' },
  stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  stepDotOn: { backgroundColor: ORANGE },
  stepNum: { fontSize: 12, fontWeight: '700', color: MUTED },
  stepNumOn: { color: WHITE },
  stepLabel: { marginTop: 6, fontSize: 10, lineHeight: 13, textAlign: 'center', color: MUTED, paddingHorizontal: 2 },
  stepLabelOn: { color: ORANGE, fontWeight: '700' },
  reviewCard: { marginTop: 8, borderRadius: 16, borderWidth: 1, borderColor: LINE, paddingHorizontal: 14, paddingVertical: 4 },
  reviewRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  reviewLabel: { fontSize: 12, color: MUTED },
  reviewValue: { marginTop: 2, fontSize: 15, lineHeight: 20, fontWeight: '700', color: INK },
  successScroll: { paddingHorizontal: 20, paddingBottom: 16, alignItems: 'center' },
  successArt: { width: 220, height: 190, marginTop: 8 },
  successTitle: { marginTop: 8, fontSize: 22, lineHeight: 28, fontWeight: '800', color: INK, textAlign: 'center' },
  successBody: { marginTop: 8, fontSize: 14, lineHeight: 20, color: MUTED, textAlign: 'center' },
  summary: { alignSelf: 'stretch', marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: LINE, paddingHorizontal: 14, paddingVertical: 6 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 10 },
  summaryLabel: { fontSize: 13, color: MUTED },
  summaryValue: { flexShrink: 1, fontSize: 14, fontWeight: '700', color: INK, textAlign: 'right' },
  summaryId: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  copyBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  copied: { alignSelf: 'flex-end', fontSize: 12, color: ORANGE, marginTop: -4 },
  nextHead: { alignSelf: 'stretch', marginTop: 18, fontSize: 18, fontWeight: '800', color: INK },
  nextRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  nextIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: SELECTED, alignItems: 'center', justifyContent: 'center' },
  nextText: { flex: 1, fontSize: 14, lineHeight: 20, color: INK },
  requestCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, borderWidth: 1, borderColor: LINE, padding: 14 },
  requestTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  requestId: { fontSize: 16, fontWeight: '800', color: INK },
  requestMeta: { marginTop: 4, fontSize: 14, color: INK },
  requestWhen: { marginTop: 2, fontSize: 12, color: MUTED },
  empty: { marginTop: 28, paddingHorizontal: 24, textAlign: 'center', fontSize: 14, lineHeight: 20, color: MUTED },
});
