import { createElement, useMemo, useState, type ReactNode } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';

const ORANGE = colors.orange;
const INK = colors.ink;
const MUTED = '#6B7280';
const LINE = '#EEF0F3';
const CANVAS = '#F5F6F8';

const PIN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF4F18" d="M12 2.2a6.8 6.8 0 0 0-6.8 6.8c0 5 6.8 12.8 6.8 12.8s6.8-7.8 6.8-12.8A6.8 6.8 0 0 0 12 2.2Zm0 9.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z"/></svg>';
const CART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="20.2" r="1.35" fill="#141517" stroke="none"/><circle cx="18" cy="20.2" r="1.35" fill="#141517" stroke="none"/><path d="M2.4 3.2h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.45h8.7a1.8 1.8 0 0 0 1.75-1.4l1.5-6.8H5.6"/></svg>';
const CART_WHITE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="20.2" r="1.35" fill="#FFFFFF" stroke="none"/><circle cx="18" cy="20.2" r="1.35" fill="#FFFFFF" stroke="none"/><path d="M2.4 3.2h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.45h8.7a1.8 1.8 0 0 0 1.75-1.4l1.5-6.8H5.6"/></svg>';
const SEARCH =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.2"/><path d="m16 16 4 4"/></svg>';
const FILTER =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v18M16 3v18"/><circle cx="8" cy="9" r="2.2" fill="#fff"/><circle cx="16" cy="15" r="2.2" fill="#fff"/></svg>';
const HEADSET =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.8" stroke-linecap="round"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.2"/><rect x="17" y="13" width="4" height="6" rx="1.2"/></svg>';
const CARD_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>';
const PARTNER =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#FF4F18"/><circle cx="32" cy="28" r="11" fill="#F6C7A6"/><path d="M14 56c3-14 33-14 36 0" fill="#F6C7A6"/><path d="M16 24c2-12 30-12 32 0v5H16z" fill="#C2410C"/></svg>';

const img = {
  tomato: require('../../../assets/shop/tomato.png'),
  onion: require('../../../assets/shop/onion.png'),
  potato: require('../../../assets/shop/potato.png'),
  milk: require('../../../assets/shop/milk.png'),
  eggs: require('../../../assets/shop/eggs.png'),
  oil: require('../../../assets/shop/oil.png'),
  rice: require('../../../assets/shop/rice.png'),
  chicken: require('../../../assets/shop/chicken.png'),
  atta: require('../../../assets/shop/atta.png'),
  carrot: require('../../../assets/shop/carrot.png'),
  cucumber: require('../../../assets/shop/cucumber.png'),
  capsicum: require('../../../assets/shop/capsicum.png'),
  spinach: require('../../../assets/shop/spinach.png'),
  chilli: require('../../../assets/shop/chilli.png'),
  garlic: require('../../../assets/shop/garlic.png'),
} as const;

type Status = 'On the way' | 'Delivered' | 'Cancelled';
type Item = { name: string; unit: string; price: number; compareAt?: number; qty: number; image: number; productId?: string };
type Order = {
  id: string;
  status: Status;
  date: string;
  time: string;
  at: number;
  amount: number;
  items: Item[];
  deliveredAt?: string;
  cancelledAt?: string;
  reason?: string;
};

const line = (name: string, unit: string, price: number, image: number, productId?: string, compareAt?: number, qty = 1): Item => ({
  name, unit, price, image, productId, compareAt, qty,
});

const ORDERS: Order[] = [
  {
    id: 'KXOD2501001', status: 'Delivered', date: '17 Oct 2026', time: '12:30 PM', at: 202610171230, amount: 1248, deliveredAt: '17 Oct 2026, 01:05 PM',
    items: [
      line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato', 48),
      line('Onion (Indian)', '1 kg', 32, img.onion, 'onion', 38),
      line('Potato', '1 kg', 28, img.potato, 'potato', 34),
      line('Milk & Cheese Combo', '1 set', 280, img.milk, undefined, 320),
      line('Eggs', '1 tray', 90, img.eggs),
    ],
  },
  {
    id: 'KXOD2500998', status: 'On the way', date: '15 Oct 2026', time: '08:15 PM', at: 202610152015, amount: 2430,
    items: [
      line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato', 48),
      line('Onion (Indian)', '1 kg', 32, img.onion, 'onion', 38),
      line('Potato', '1 kg', 28, img.potato, 'potato', 34),
      line('Sunflower Oil', '1 L', 160, img.oil, undefined, 180),
      line('Atta (Whole Wheat)', '5 kg', 340, img.atta, undefined, 380),
      line('Milk & Cheese Combo', '1 set', 280, img.milk, undefined, 320),
      line('Basmati Rice', '5 kg', 640, img.rice, undefined, 720),
      line('Spinach', '1 bunch', 18, img.spinach, 'spinach', 22),
    ],
  },
  {
    id: 'KXOD2500995', status: 'Delivered', date: '14 Oct 2026', time: '02:10 PM', at: 202610141410, amount: 3210, deliveredAt: '14 Oct 2026, 03:40 PM',
    items: [
      line('Sunflower Oil', '1 L', 160, img.oil, undefined, 180),
      line('Basmati Rice', '5 kg', 640, img.rice, undefined, 720),
      line('Chicken Curry Cut', '1 kg', 220, img.chicken, undefined, 260),
      line('Atta (Whole Wheat)', '5 kg', 340, img.atta, undefined, 380),
      line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato', 48),
      line('Milk & Cheese Combo', '1 set', 280, img.milk, undefined, 320),
      line('Onion (Indian)', '1 kg', 32, img.onion, 'onion', 38),
      line('Potato', '1 kg', 28, img.potato, 'potato', 34),
      line('Carrot', '1 kg', 36, img.carrot, 'carrot', 42),
      line('Cucumber', '1 kg', 30, img.cucumber, 'cucumber', 36),
      line('Eggs', '1 tray', 90, img.eggs),
      line('Spinach', '1 bunch', 18, img.spinach, 'spinach', 22),
    ],
  },
  {
    id: 'KXOD2500992', status: 'Cancelled', date: '12 Oct 2026', time: '11:20 AM', at: 202610121120, amount: 620, cancelledAt: '12 Oct 2026, 11:35 AM', reason: 'Item availability changed',
    items: [
      line('Carrot', '1 kg', 36, img.carrot, 'carrot'),
      line('Cucumber', '1 kg', 30, img.cucumber, 'cucumber'),
      line('Capsicum (Green)', '500 g', 48, img.capsicum, 'capsicum'),
    ],
  },
  {
    id: 'KXOD2500988', status: 'Delivered', date: '10 Oct 2026', time: '04:35 PM', at: 202610101635, amount: 1980, deliveredAt: '10 Oct 2026, 05:20 PM',
    items: [
      line('Atta (Whole Wheat)', '5 kg', 340, img.atta, undefined, 380),
      line('Milk & Cheese Combo', '1 set', 280, img.milk),
      line('Spinach', '1 bunch', 18, img.spinach, 'spinach'),
      line('Chicken Curry Cut', '1 kg', 220, img.chicken),
      line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato'),
      line('Onion (Indian)', '1 kg', 32, img.onion, 'onion'),
      line('Potato', '1 kg', 28, img.potato, 'potato'),
      line('Sunflower Oil', '1 L', 160, img.oil),
      line('Basmati Rice', '5 kg', 640, img.rice),
      line('Eggs', '1 tray', 90, img.eggs),
    ],
  },
  {
    id: 'KXOD2500991', status: 'Delivered', date: '09 Oct 2026', time: '06:45 PM', at: 202610091845, amount: 1980, deliveredAt: '09 Oct 2026, 07:30 PM',
    items: [line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato'), line('Basmati Rice', '5 kg', 640, img.rice), line('Sunflower Oil', '1 L', 160, img.oil), line('Potato', '1 kg', 28, img.potato, 'potato'), line('Onion (Indian)', '1 kg', 32, img.onion, 'onion'), line('Carrot', '1 kg', 36, img.carrot, 'carrot'), line('Eggs', '1 tray', 90, img.eggs), line('Spinach', '1 bunch', 18, img.spinach, 'spinach'), line('Milk & Cheese Combo', '1 set', 280, img.milk)],
  },
  {
    id: 'KXOD2500980', status: 'On the way', date: '08 Oct 2026', time: '09:15 AM', at: 202610080915, amount: 1120,
    items: [line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato'), line('Spinach', '1 bunch', 18, img.spinach, 'spinach'), line('Milk & Cheese Combo', '1 set', 280, img.milk), line('Potato', '1 kg', 28, img.potato, 'potato'), line('Onion (Indian)', '1 kg', 32, img.onion, 'onion'), line('Carrot', '1 kg', 36, img.carrot, 'carrot')],
  },
  {
    id: 'KXOD2500975', status: 'Delivered', date: '06 Oct 2026', time: '01:10 PM', at: 202610061310, amount: 860, deliveredAt: '06 Oct 2026, 02:00 PM',
    items: [line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato'), line('Onion (Indian)', '1 kg', 32, img.onion, 'onion'), line('Potato', '1 kg', 28, img.potato, 'potato'), line('Carrot', '1 kg', 36, img.carrot, 'carrot')],
  },
  {
    id: 'KXOD2500970', status: 'Delivered', date: '04 Oct 2026', time: '07:40 PM', at: 202610041940, amount: 1540, deliveredAt: '04 Oct 2026, 08:25 PM',
    items: [line('Basmati Rice', '5 kg', 640, img.rice), line('Sunflower Oil', '1 L', 160, img.oil), line('Atta (Whole Wheat)', '5 kg', 340, img.atta), line('Eggs', '1 tray', 90, img.eggs)],
  },
  {
    id: 'KXOD2500966', status: 'Delivered', date: '02 Oct 2026', time: '11:05 AM', at: 202610021105, amount: 720, deliveredAt: '02 Oct 2026, 12:10 PM',
    items: [line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato'), line('Cucumber', '1 kg', 30, img.cucumber, 'cucumber'), line('Capsicum (Green)', '500 g', 48, img.capsicum, 'capsicum')],
  },
  {
    id: 'KXOD2500960', status: 'Delivered', date: '28 Sep 2026', time: '05:20 PM', at: 202609281720, amount: 2100, deliveredAt: '28 Sep 2026, 06:05 PM',
    items: [line('Chicken Curry Cut', '1 kg', 220, img.chicken), line('Basmati Rice', '5 kg', 640, img.rice), line('Sunflower Oil', '1 L', 160, img.oil), line('Onion (Indian)', '1 kg', 32, img.onion, 'onion'), line('Tomato (Desi)', '1 kg', 40, img.tomato, 'tomato')],
  },
  {
    id: 'KXOD2500962', status: 'Cancelled', date: '30 Sep 2026', time: '03:15 PM', at: 202609301515, amount: 480, cancelledAt: '30 Sep 2026, 03:40 PM', reason: 'Item availability changed',
    items: [line('Capsicum (Green)', '500 g', 48, img.capsicum, 'capsicum'), line('Carrot', '1 kg', 36, img.carrot, 'carrot')],
  },
];

const ADDRESS = 'Tadepalligudem, West Godavari, AP - 534101';
const TAGS = ['Great quality', 'On time delivery', 'Well packed', 'Value for money'];
const MAP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><rect width="640" height="300" fill="#E4EEF2"/><path d="M430 0c40 70 10 120-20 180s20 80 10 120" fill="none" stroke="#B9D4E4" stroke-width="34"/><g stroke="#F8FBFC" stroke-width="14" fill="none"><path d="M0 70h640M0 150h640M0 230h640M90 0v300M230 0v300M400 0v300M530 0v300"/></g><path d="M70 240 C 150 230 170 180 250 168 C 340 154 360 110 450 96 C 520 84 540 60 590 46" fill="none" stroke="#FF4F18" stroke-width="7" stroke-linecap="round"/><g transform="translate(62 228)"><circle r="18" fill="#FF4F18"/><path d="M-10 6h18l-3-8h-12z" fill="#fff"/><circle cy="-6" r="5" fill="#fff"/><path d="M-16 2h6M16 8h8" stroke="#fff" stroke-width="2"/></g><g transform="translate(575 28)"><path d="M-18 24h40v16h-40z" fill="#FF4F18"/><path d="M-24 24 L2 4 L28 24z" fill="#FF4F18"/><circle cy="34" r="8" fill="#FF4F18" opacity="0.25"/></g></svg>`;
const BAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 260"><ellipse cx="180" cy="150" rx="120" ry="96" fill="#FFF4EE"/><g fill="#FF8A3D"><rect x="46" y="46" width="10" height="18" rx="2" transform="rotate(-28 46 46)"/><rect x="292" y="58" width="10" height="18" rx="2" transform="rotate(24 292 58)"/><rect x="78" y="168" width="12" height="8" rx="2" transform="rotate(18 78 168)"/><rect x="286" y="150" width="14" height="8" rx="2" transform="rotate(-16 286 150)"/></g><g fill="#FFB088"><rect x="70" y="78" width="8" height="8" rx="1" transform="rotate(20 70 78)"/><rect x="300" y="96" width="8" height="8" rx="1"/></g><path d="M118 108h124l16 104H102z" fill="#FF4F18"/><path d="M146 108c0-24 68-24 68 0" fill="none" stroke="#FF4F18" stroke-width="10" stroke-linecap="round"/><path d="M158 158l16 16 32-36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

type Page = 'list' | 'detail' | 'items' | 'added' | 'rate';
type Filter = 'All' | 'On the way' | 'Delivered' | 'Cancelled';

function glyph(body: string, color = MUTED) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function Icon({ svg, size = 20 }: { svg: string; size?: number }) {
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (Platform.OS === 'web') {
    return createElement('img', { src: uri, alt: '', width: size, height: size, draggable: false, style: { width: size, height: size, display: 'block', pointerEvents: 'none' } });
  }
  return <Image source={{ uri }} style={{ width: size, height: size }} />;
}

function rupee(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function tone(status: Status) {
  if (status === 'Cancelled') return { bg: '#FDECEC', fg: '#E11D48', mark: '✕' };
  if (status === 'On the way') return { bg: '#FFF1E8', fg: ORANGE, mark: '🚚' };
  return { bg: '#E8F8EF', fg: '#16A34A', mark: '✓' };
}

export function OrdersFlow({
  city,
  cartCount,
  onDeliver,
  onCart,
  onHome,
  onAdd,
  footer,
}: {
  city: string;
  cartCount: number;
  onDeliver?: () => void;
  onCart: () => void;
  onHome: () => void;
  onAdd: (id: string, qty?: number) => void;
  footer: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState<Page>('list');
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [latest, setLatest] = useState(true);
  const [orderId, setOrderId] = useState(ORDERS[0].id);
  const [added, setAdded] = useState({ count: 0, id: '', from: 'list' as Page });
  const [help, setHelp] = useState('');
  const order = ORDERS.find((item) => item.id === orderId) ?? ORDERS[0];
  const frame = width > 600 ? { width: 480, alignSelf: 'center' as const } : null;

  const open = (id: string, next: Page) => {
    setOrderId(id);
    setHelp('');
    setPage(next);
  };
  const addLines = (lines: Item[], count: number) => {
    lines.forEach((item) => {
      if (item.productId) onAdd(item.productId, item.qty);
    });
    setAdded({ count, id: order.id, from: page });
    setPage('added');
  };

  return (
    <View style={[styles.screen, Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : null, frame]}>
      {page === 'list' ? (
        <OrderList
          city={city}
          cartCount={cartCount}
          onDeliver={onDeliver}
          onCart={onCart}
          onHome={onHome}
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          latest={latest}
          onSort={() => setLatest((current) => !current)}
          onOpen={(id) => open(id, 'detail')}
        />
      ) : null}
      {page === 'detail' ? (
        <OrderDetail
          order={order}
          help={help}
          onBack={() => setPage('list')}
          onItems={() => setPage('items')}
          onRate={() => setPage('rate')}
          onReorder={() => addLines(order.items, order.items.length)}
          onBuy={(item) => addLines([item], 1)}
          onHelp={() => setHelp('Our team is here for you. Call or chat and we will pick this up.')}
          onShop={onHome}
          onAddress={onDeliver}
        />
      ) : null}
      {page === 'items' ? (
        <ReorderPage order={order} onBack={() => setPage('detail')} onDetails={() => setPage('detail')} onReorder={(lines) => addLines(lines, lines.length)} onBuy={(item) => addLines([item], item.qty)} />
      ) : null}
      {page === 'rate' ? <RatePage order={order} onBack={() => setPage('detail')} onDone={() => setPage('detail')} /> : null}
      {page === 'added' ? (
        <AddedPage
          orderId={added.id}
          count={added.count}
          onClose={() => setPage(added.from === 'items' ? 'items' : 'detail')}
          onCart={onCart}
          onShop={onHome}
        />
      ) : null}
      {page === 'list' || page === 'items' ? footer : null}
    </View>
  );
}

function BrandBar({ city, cartCount, onDeliver, onCart, onHome }: { city: string; cartCount: number; onDeliver?: () => void; onCart: () => void; onHome: () => void }) {
  return (
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
        {cartCount > 0 ? <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount > 99 ? '99' : cartCount}</Text></View> : null}
      </Pressable>
    </View>
  );
}

function OrderList({
  city, cartCount, onDeliver, onCart, onHome, filter, onFilter, query, onQuery, latest, onSort, onOpen,
}: {
  city: string; cartCount: number; onDeliver?: () => void; onCart: () => void; onHome: () => void;
  filter: Filter; onFilter: (filter: Filter) => void; query: string; onQuery: (value: string) => void;
  latest: boolean; onSort: () => void; onOpen: (id: string) => void;
}) {
  const counts = {
    All: ORDERS.length,
    'On the way': ORDERS.filter((item) => item.status === 'On the way').length,
    Delivered: ORDERS.filter((item) => item.status === 'Delivered').length,
    Cancelled: ORDERS.filter((item) => item.status === 'Cancelled').length,
  };
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORDERS.filter((item) => (filter === 'All' || item.status === filter) && (!q || item.id.toLowerCase().includes(q) || item.items.some((lineItem) => lineItem.name.toLowerCase().includes(q))))
      .slice()
      .sort((a, b) => (latest ? b.at - a.at : a.at - b.at));
  }, [filter, query, latest]);

  return (
    <>
      <BrandBar city={city} cartCount={cartCount} onDeliver={onDeliver} onCart={onCart} onHome={onHome} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Your Orders</Text>
        <Text style={styles.pageSub}>Track, reorder or manage your orders</Text>
        <View style={styles.search}>
          <Icon svg={SEARCH} size={18} />
          <TextInput value={query} onChangeText={onQuery} placeholder="Search orders, products..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>
        <View style={styles.chips}>
          {(['All', 'On the way', 'Delivered', 'Cancelled'] as const).map((item) => (
            <Pressable key={item} style={[styles.chip, filter === item && styles.chipOn]} onPress={() => onFilter(item)} accessibilityRole="button" accessibilityState={{ selected: filter === item }}>
              <Text style={[styles.chipText, filter === item && styles.chipTextOn]} numberOfLines={1}>{item} ({counts[item]})</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.tools}>
          <Pressable style={styles.tool} onPress={onSort} accessibilityRole="button"><Text style={styles.toolText}>Sort by  ▾</Text></Pressable>
          <View style={styles.tool}><Text style={styles.toolText}>Date Range  ▾</Text></View>
          <View style={styles.filterBtn}><Icon svg={FILTER} size={16} /></View>
        </View>
        {shown.map((item) => <OrderCard key={item.id} order={item} onPress={() => onOpen(item.id)} />)}
        {!shown.length ? <Text style={styles.empty}>No orders match that search.</Text> : null}
      </ScrollView>
    </>
  );
}

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const paint = tone(order.status);
  const extra = Math.max(0, order.items.length - 4);
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Order ${order.id}`}>
      <View style={styles.cardTop}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <View style={[styles.badge, { backgroundColor: paint.bg }]}><Text style={[styles.badgeText, { color: paint.fg }]}>{paint.mark}  {order.status}</Text></View>
      </View>
      <Text style={styles.when}>{order.date}, {order.time}</Text>
      <View style={styles.cardBottom}>
        <View style={styles.thumbs}>
          {order.items.slice(0, 4).map((item, index) => <Image key={`${item.name}-${index}`} source={item.image} style={styles.thumb} resizeMode="cover" />)}
          {extra > 0 ? <View style={styles.more}><Text style={styles.moreText}>+{extra}</Text></View> : null}
        </View>
        <Text style={styles.count}>{order.items.length} items</Text>
        <Text style={styles.amount}>{rupee(order.amount)}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

function OrderDetail({
  order, help, onBack, onItems, onRate, onReorder, onBuy, onHelp, onShop, onAddress,
}: {
  order: Order; help: string; onBack: () => void; onItems: () => void; onRate: () => void; onReorder: () => void;
  onBuy: (item: Item) => void; onHelp: () => void; onShop: () => void; onAddress?: () => void;
}) {
  const paint = tone(order.status);
  return (
    <>
      <PageHead title="Order Details" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summary}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.when}>{order.date}, {order.time}</Text>
              <Text style={styles.amount}>{rupee(order.amount)} ({order.items.length} items)</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: paint.bg }]}><Text style={[styles.badgeText, { color: paint.fg }]}>{paint.mark}  {order.status}</Text></View>
          </View>
        </View>
        {order.status === 'On the way' ? <Tracking order={order} onItems={onItems} onHelp={onHelp} /> : null}
        {order.status === 'Delivered' ? <Delivered order={order} onItems={onItems} onBuy={onBuy} onRate={onRate} onReorder={onReorder} onHelp={onHelp} onAddress={onAddress} /> : null}
        {order.status === 'Cancelled' ? <Cancelled order={order} onHelp={onHelp} onShop={onShop} onBack={onBack} /> : null}
        {help ? <Text style={styles.helpNote}>{help}</Text> : null}
      </ScrollView>
    </>
  );
}

function Tracking({ order, onItems, onHelp }: { order: Order; onItems: () => void; onHelp: () => void }) {
  const steps = [
    { label: 'Confirmed', time: '08:20 PM', done: true, mark: '✓' },
    { label: 'Packed', time: '08:45 PM', done: true, mark: '✓' },
    { label: 'Out for delivery', time: '09:10 PM', done: true, mark: '🛵' },
    { label: 'Delivered', time: '', done: false, mark: '' },
  ];
  return (
    <>
      <View style={styles.track}>
        <View style={styles.trackLine} />
        {steps.map((step) => (
          <View key={step.label} style={styles.step}>
            <View style={[styles.stepDot, step.done && styles.stepDotOn, !step.done && styles.stepDotWait]}><Text style={[styles.stepMark, !step.done && styles.stepMarkWait]}>{step.mark || '▢'}</Text></View>
            <Text style={[styles.stepLabel, step.label === 'Out for delivery' && styles.stepLabelOn]} numberOfLines={2}>{step.label}</Text>
            <Text style={styles.stepTime}>{step.time}</Text>
          </View>
        ))}
      </View>
      <View style={styles.partner}>
        <Image source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PARTNER)}` }} style={styles.partnerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.partnerName}>Ramesh Kumar</Text>
          <Text style={styles.when}>Your delivery partner</Text>
        </View>
        <View style={styles.partnerBtn}><Text style={styles.partnerBtnText}>☎</Text></View>
        <View style={styles.partnerBtn}><Text style={styles.partnerBtnText}>💬</Text></View>
      </View>
      <View style={styles.mapWrap}>
        <Image source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(MAP)}` }} style={styles.map} resizeMode="cover" />
        <View style={styles.eta}><Text style={styles.etaLabel}>Arriving in</Text><Text style={styles.etaValue}>8 mins</Text></View>
      </View>
      <View style={styles.block}>
        <View style={styles.pinRow}><Text style={styles.pinMark}>📍</Text><Text style={styles.blockLabel}>Delivery Address</Text></View>
        <Text style={styles.blockValue}>{ADDRESS}</Text>
      </View>
      <View style={styles.block}>
        <View style={styles.cardTop}>
          <Text style={styles.blockLabel}>Items in this order ({order.items.length})</Text>
          <Pressable onPress={onItems} accessibilityRole="button"><Text style={styles.link}>View all  ›</Text></Pressable>
        </View>
        <View style={styles.thumbs}>
          {order.items.slice(0, 6).map((item, index) => <Image key={`${item.name}-${index}`} source={item.image} style={styles.thumbLg} resizeMode="cover" />)}
        </View>
      </View>
      <View style={[styles.fresh, styles.freshRow]}>
        <View style={styles.freshMark}><Text style={styles.freshMarkText}>✓</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.freshTitle}>Fresh products, on time</Text><Text style={styles.freshSub}>Sourced from trusted partners, delivered with care.</Text></View>
      </View>
      <Pressable style={[styles.outline, styles.rowBtn]} onPress={onHelp} accessibilityRole="button"><Icon svg={HEADSET} size={18} /><Text style={styles.outlineText}>Need help?</Text></Pressable>
      <Pressable style={styles.save} onPress={onItems} accessibilityRole="button"><Text style={styles.saveText}>View order items  ›</Text></Pressable>
    </>
  );
}

function Delivered({
  order, onItems, onBuy, onRate, onReorder, onHelp, onAddress,
}: {
  order: Order; onItems: () => void; onBuy: (item: Item) => void; onRate: () => void; onReorder: () => void; onHelp: () => void; onAddress?: () => void;
}) {
  const fee = 28;
  const itemTotal = order.amount - fee;
  return (
    <>
      <View style={[styles.fresh, styles.freshRow]}>
        <View style={styles.freshMark}><Text style={styles.freshMarkText}>✓</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.freshTitle}>Delivered on {order.deliveredAt}</Text>
          <Text style={styles.freshSub}>Your order has been delivered successfully.</Text>
        </View>
      </View>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        <Pressable onPress={onItems} accessibilityRole="button"><Text style={styles.link}>View all items  ›</Text></Pressable>
      </View>
      {order.items.slice(0, 3).map((item, index) => (
        <View key={`${item.name}-${index}`} style={styles.itemRow}>
          <Image source={item.image} style={styles.itemPhoto} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.when}>{item.unit}</Text>
            <Text style={styles.itemPrice}>{rupee(item.price)}</Text>
          </View>
          <Pressable style={styles.buy} onPress={() => onBuy(item)} accessibilityRole="button"><Text style={styles.buyText}>Buy again</Text></Pressable>
        </View>
      ))}
      <View style={styles.block}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.pinRow}><Text style={styles.pinMark}>📍</Text><Text style={styles.blockLabel}>Delivery Address</Text></View>
            <Text style={styles.blockValue}>{ADDRESS}</Text>
          </View>
          <Pressable onPress={onAddress} accessibilityRole="button"><Text style={styles.link}>Change</Text></Pressable>
        </View>
      </View>
      <View style={styles.pay}>
        <View style={[styles.pinRow, styles.payHead]}><Icon svg={CARD_ICON} size={18} /><Text style={[styles.payTitle, styles.payTitleInline]}>Payment Summary</Text></View>
        <PayRow label={`Item Total (${order.items.length} items)`} value={rupee(itemTotal || order.amount)} />
        <PayRow label="Delivery Fee" value={rupee(fee || 28)} info />
        <PayRow label="Total Paid" value={rupee(order.amount)} strong />
        <View style={styles.paid}><Text style={styles.freshTitle}>Paid via UPI</Text><Text style={styles.freshTitle}>{rupee(order.amount)}</Text></View>
      </View>
      <Pressable style={styles.helpRow} onPress={onHelp} accessibilityRole="button">
        <Icon svg={HEADSET} size={20} />
        <View style={{ flex: 1 }}><Text style={styles.itemName}>Need help?</Text><Text style={styles.when}>Get help with this order, delivery, returns or product issues.</Text></View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={[styles.outline, styles.action]} onPress={onHelp} accessibilityRole="button"><Text style={styles.outlineText}>Need Help</Text></Pressable>
        <Pressable style={[styles.save, styles.action]} onPress={onReorder} accessibilityRole="button"><Text style={styles.saveText}>Reorder All Items</Text></Pressable>
      </View>
      <Pressable onPress={onRate} accessibilityRole="button"><Text style={styles.linkCenter}>Rate this order</Text></Pressable>
    </>
  );
}

function Cancelled({ order, onHelp, onShop, onBack }: { order: Order; onHelp: () => void; onShop: () => void; onBack: () => void }) {
  return (
    <>
      <View style={styles.cancelBanner}>
        <View style={styles.cancelMark}><Text style={styles.cancelMarkText}>✕</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cancelTitle}>Order cancelled</Text>
          <Text style={styles.cancelSub}>This order was cancelled on {order.cancelledAt}.</Text>
        </View>
      </View>
      <Text style={styles.blockTitle}>Items ({order.items.length})</Text>
      <View style={styles.block}>
        {order.items.map((item, index) => (
          <View key={`${item.name}-${index}`} style={[styles.itemLine, index < order.items.length - 1 && styles.itemLineRule]}>
            <Image source={item.image} style={styles.itemPhoto} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.when}>{item.unit}</Text>
              <Text style={styles.itemPrice}>{rupee(item.price)}</Text>
            </View>
            <Text style={styles.when}>Qty: {item.qty}</Text>
          </View>
        ))}
      </View>
      <View style={styles.block}>
        <View style={styles.pinRow}><Text style={styles.pinMark}>📄</Text><Text style={styles.blockLabel}>Cancellation reason</Text></View>
        <Text style={styles.blockValue}>{order.reason}</Text>
      </View>
      <View style={styles.block}>
        <View style={styles.pinRow}><Text style={styles.pinMark}>💳</Text><Text style={styles.blockLabel}>Payment and refund details</Text></View>
        <Text style={styles.blockValue}>Since this order was cancelled, no amount has been charged. If any amount was paid, the refund will be processed as per our policy.</Text>
        <Text style={styles.link}>View cancellation policy  ›</Text>
      </View>
      <View style={styles.helpRow}>
        <Icon svg={HEADSET} size={20} />
        <View style={{ flex: 1 }}><Text style={styles.itemName}>Need help?</Text><Text style={styles.when}>If you have any questions about this order, our support team is here to help.</Text></View>
        <Pressable style={styles.buy} onPress={onHelp} accessibilityRole="button"><Text style={styles.buyText}>Contact support</Text></Pressable>
      </View>
      <Pressable style={styles.save} onPress={onShop} accessibilityRole="button"><Text style={styles.saveText}>Shop similar items</Text></Pressable>
      <Pressable style={styles.outline} onPress={onBack} accessibilityRole="button"><Text style={styles.outlineText}>Back to Orders</Text></Pressable>
    </>
  );
}

function ReorderPage({
  order, onBack, onDetails, onReorder, onBuy,
}: {
  order: Order; onBack: () => void; onDetails: () => void; onReorder: (items: Item[]) => void; onBuy: (item: Item) => void;
}) {
  const [qty, setQty] = useState<Record<number, number>>(() => Object.fromEntries(order.items.map((item, index) => [index, item.qty])));
  const [expanded, setExpanded] = useState(order.items.length <= 6);
  const visible = expanded ? order.items : order.items.slice(0, 6);
  const lines = order.items.map((item, index) => ({ ...item, qty: qty[index] ?? item.qty }));
  const paint = tone(order.status);
  return (
    <>
      <View style={styles.logoHead}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.backHit}><Text style={styles.back}>‹</Text></Pressable>
        <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.brandLogo} resizeMode="contain" />
        <View style={styles.backHit} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summary}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.when}>{order.date}, {order.time}</Text>
              <Text style={styles.amount}>{rupee(order.amount)} ({order.items.length} items)</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <View style={[styles.badge, { backgroundColor: paint.bg }]}><Text style={[styles.badgeText, { color: paint.fg }]}>{order.status}</Text></View>
              <Pressable style={styles.detailBtn} onPress={onDetails} accessibilityRole="button"><Text style={styles.detailBtnText}>View details  ›</Text></Pressable>
            </View>
          </View>
        </View>
        <Text style={styles.blockTitle}>Items from this order</Text>
        <Text style={styles.pageSub}>Add items again to your cart with one click</Text>
        {visible.map((item, index) => (
          <View key={`${item.name}-${index}`} style={[styles.itemRow, styles.itemRowTight]}>
            <Image source={item.image} style={[styles.itemPhoto, styles.itemPhotoSm]} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.when}>{item.unit}</Text>
              <Text style={styles.itemPrice}>{rupee(item.price)} {item.compareAt ? <Text style={styles.compare}> {rupee(item.compareAt)}</Text> : null}</Text>
            </View>
            <View style={styles.itemSide}>
              <Pressable style={styles.buy} onPress={() => onBuy({ ...item, qty: qty[index] ?? 1 })} accessibilityRole="button"><Text style={styles.buyText}>Buy again</Text></Pressable>
              <View style={styles.stepper}>
                <Pressable onPress={() => setQty((current) => ({ ...current, [index]: Math.max(1, (current[index] ?? 1) - 1) }))} accessibilityRole="button"><Text style={styles.qtyBtn}>−</Text></Pressable>
                <Text style={styles.stepVal}>{qty[index] ?? 1}</Text>
                <Pressable onPress={() => setQty((current) => ({ ...current, [index]: (current[index] ?? 1) + 1 }))} accessibilityRole="button"><Text style={styles.qtyBtn}>+</Text></Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {!expanded && order.items.length > 6 ? (
        <Pressable onPress={() => setExpanded(true)} accessibilityRole="button"><Text style={styles.linkCenter}>View all {order.items.length} items  ▾</Text></Pressable>
      ) : null}
      <Pressable style={styles.reorderBar} onPress={() => onReorder(lines)} accessibilityRole="button">
        <View style={styles.rowBtn}>
          <Icon svg={CART_WHITE} size={18} />
          <Text style={styles.saveText}>Reorder all {lines.length} items</Text>
        </View>
        <Text style={styles.saveText}>{rupee(order.amount)}</Text>
      </Pressable>
    </>
  );
}

function AddedPage({ orderId, count, onClose, onCart, onShop }: { orderId: string; count: number; onClose: () => void; onCart: () => void; onShop: () => void }) {
  return (
    <View style={styles.added}>
      <View style={styles.addedHead}>
        <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.brandLogo} resizeMode="contain" />
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}><Text style={styles.closeText}>×</Text></Pressable>
      </View>
      <Image source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(BAG)}` }} style={styles.bagArt} resizeMode="contain" />
      <Text style={styles.addedTitle}>Added to cart!</Text>
      <Text style={styles.addedSub}>{count} {count === 1 ? 'item' : 'items'} from your previous order{'\n'}have been added to your cart.</Text>
      <View style={styles.ref}>
        <Text style={styles.refIcon}>📄</Text>
        <View>
          <Text style={styles.when}>Order reference</Text>
          <Text style={styles.orderId}>#{orderId}</Text>
          <Text style={styles.when}>{count} items</Text>
        </View>
      </View>
      <Pressable style={styles.save} onPress={onCart} accessibilityRole="button"><Text style={styles.saveText}>View cart  ›</Text></Pressable>
      <Pressable style={styles.outline} onPress={onShop} accessibilityRole="button"><Text style={styles.outlineText}>Continue shopping</Text></Pressable>
    </View>
  );
}

function RatePage({ order, onBack, onDone }: { order: Order; onBack: () => void; onDone: () => void }) {
  const [score, setScore] = useState(4);
  const [tags, setTags] = useState<string[]>(['Great quality']);
  const [notes, setNotes] = useState('');
  const [contact, setContact] = useState(true);
  const [productScores, setProductScores] = useState<Record<number, number>>({ 0: 4, 1: 5, 2: 4 });
  const [sent, setSent] = useState(false);
  return (
    <>
      <View style={styles.logoHead}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.backHit}><Text style={styles.back}>‹</Text></Pressable>
        <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.brandLogo} resizeMode="contain" />
        <View style={styles.backHit} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Rate your order</Text>
        <Text style={styles.pageSub}>Tell us about your experience. Your feedback helps us serve you better.</Text>
        <View style={styles.summary}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.when}>{order.date}, {order.time}</Text>
              <Text style={styles.itemPrice}>{order.items.length} items   ·   {rupee(order.amount)}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#E8F8EF' }]}><Text style={[styles.badgeText, { color: '#16A34A' }]}>✓  Delivered</Text></View>
          </View>
        </View>
        <Text style={styles.blockTitle}>How was your overall experience?</Text>
        <View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setScore(value)} accessibilityRole="button"><Text style={[styles.star, value <= score && styles.starOn]}>★</Text></Pressable>)}</View>
        <View style={styles.tagRow}>
          {TAGS.map((tag) => {
            const on = tags.includes(tag);
            return (
              <Pressable key={tag} style={[styles.tag, on && styles.tagOn]} onPress={() => setTags((current) => (on ? current.filter((item) => item !== tag) : [...current, tag]))} accessibilityRole="button">
                <Text style={[styles.tagText, on && styles.tagTextOn]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Rate products</Text><Text style={styles.when}>{order.items.length} items</Text></View>
        {order.items.slice(0, 3).map((item, index) => (
          <View key={item.name} style={styles.itemRow}>
            <Image source={item.image} style={styles.itemPhoto} resizeMode="contain" />
            <View style={{ flex: 1 }}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.when}>{item.unit}</Text><Text style={styles.itemPrice}>{rupee(item.price)}</Text></View>
            <View style={styles.starsInline}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setProductScores((current) => ({ ...current, [index]: value }))} accessibilityRole="button"><Text style={[styles.starSm, value <= (productScores[index] ?? 0) && styles.starOn]}>★</Text></Pressable>)}</View>
          </View>
        ))}
        <Text style={styles.blockTitle}>Additional feedback (optional)</Text>
        <TextInput value={notes} onChangeText={(value) => setNotes(value.slice(0, 500))} multiline placeholder="Tell us about product quality, delivery experience, packaging or anything else..." placeholderTextColor="#9CA3AF" style={styles.feedback} />
        <Text style={styles.counter}>{notes.length}/500</Text>
        <Pressable style={styles.checkRow} onPress={() => setContact((current) => !current)} accessibilityRole="checkbox" accessibilityState={{ checked: contact }}>
          <View style={[styles.check, contact && styles.checkOn]}><Text style={styles.checkMark}>{contact ? '✓' : ''}</Text></View>
          <Text style={styles.checkText}>You can contact me for more feedback if needed.</Text>
        </Pressable>
        <Pressable style={styles.save} onPress={() => { setSent(true); setTimeout(onDone, 700); }} accessibilityRole="button"><Text style={styles.saveText}>{sent ? 'Thanks for the review' : 'Submit review'}</Text></Pressable>
      </ScrollView>
    </>
  );
}

function PageHead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={[styles.nav, { paddingTop: Platform.OS === 'web' ? 12 : 46 }]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.backHit}><Text style={styles.back}>‹</Text></Pressable>
      <Text style={styles.navTitle}>{title}</Text>
      <View style={styles.backHit} />
    </View>
  );
}

function PayRow({ label, value, strong, info }: { label: string; value: string; strong?: boolean; info?: boolean }) {
  return (
    <View style={styles.payRow}>
      <View style={styles.pinRow}>
        <Text style={strong ? styles.itemName : styles.when}>{label}</Text>
        {info ? <Text style={styles.infoDot}>i</Text> : null}
      </View>
      <Text style={strong ? styles.itemName : styles.when}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CANVAS },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  brandBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8, gap: 10, backgroundColor: '#FFFFFF' },
  brandLogo: { width: 104, height: 20 },
  brandLoc: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  brandLocCopy: { flexShrink: 1, minWidth: 0 },
  brandLocLabel: { fontSize: 10, lineHeight: 12, color: MUTED, fontWeight: '500' },
  brandLocCity: { fontSize: 12, lineHeight: 15, fontWeight: '700', color: INK },
  cartBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -6, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  pageTitle: { marginTop: 8, marginHorizontal: 16, color: INK, fontSize: 26, fontWeight: '800' },
  pageSub: { marginTop: 4, marginHorizontal: 16, marginBottom: 12, color: MUTED, fontSize: 13 },
  search: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 14, minHeight: 46, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E6E8EC' },
  searchInput: { flex: 1, color: INK, fontSize: 14, paddingVertical: 10 },
  chips: { flexDirection: 'row', paddingHorizontal: 16, gap: 4, paddingBottom: 12 },
  chip: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 8, paddingVertical: 7, borderWidth: 1, borderColor: '#E6E8EC' },
  chipOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  chipText: { color: INK, fontWeight: '700', fontSize: 12 },
  chipTextOn: { color: '#FFFFFF' },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12 },
  tool: { flexShrink: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8 },
  filterBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 'auto' },
  toolText: { color: INK, fontWeight: '700', fontSize: 11 },
  card: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  orderId: { color: INK, fontWeight: '800', fontSize: 15 },
  when: { marginTop: 2, color: MUTED, fontSize: 12 },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '800' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  thumbs: { flexDirection: 'row', flex: 1 },
  thumb: { width: 36, height: 36, borderRadius: 8, marginRight: 4, backgroundColor: '#F4F5F7' },
  thumbLg: { width: 48, height: 48, borderRadius: 10, marginRight: 8, backgroundColor: '#F4F5F7' },
  more: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F4F5F7', alignItems: 'center', justifyContent: 'center' },
  moreText: { color: MUTED, fontWeight: '800', fontSize: 12 },
  count: { color: MUTED, fontSize: 12 },
  amount: { color: INK, fontWeight: '800', fontSize: 16 },
  chevron: { color: '#98A2B3', fontSize: 20 },
  empty: { margin: 16, color: MUTED },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 8, backgroundColor: '#FFFFFF' },
  backHit: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 32, lineHeight: 32, color: INK },
  navTitle: { fontSize: 18, fontWeight: '800', color: INK },
  logoHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: Platform.OS === 'web' ? 12 : 46, paddingBottom: 8, backgroundColor: '#FFFFFF' },
  summary: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  track: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, flexDirection: 'row' },
  trackLine: { position: 'absolute', left: 36, right: 36, top: 28, height: 3, backgroundColor: '#FFD7C8' },
  step: { flex: 1, alignItems: 'center' },
  stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  stepDotOn: { backgroundColor: ORANGE },
  stepDotWait: { backgroundColor: '#E5E7EB' },
  stepMark: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  stepMarkWait: { color: '#9CA3AF' },
  stepLabel: { marginTop: 6, color: MUTED, fontSize: 11, textAlign: 'center', fontWeight: '700' },
  stepLabelOn: { color: ORANGE },
  stepTime: { color: MUTED, fontSize: 10, marginTop: 2 },
  partner: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  partnerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: ORANGE, overflow: 'hidden' },
  partnerInitial: { color: '#FFFFFF', fontWeight: '800' },
  partnerName: { color: INK, fontWeight: '800' },
  partnerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF1E8', alignItems: 'center', justifyContent: 'center' },
  partnerBtnText: { color: ORANGE },
  mapWrap: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, overflow: 'hidden', height: 170, backgroundColor: '#E7EEF2' },
  map: { width: '100%', height: 170 },
  eta: { position: 'absolute', right: 12, bottom: 12, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  etaLabel: { color: MUTED, fontSize: 11 },
  etaValue: { color: ORANGE, fontWeight: '800', fontSize: 16 },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pinMark: { fontSize: 14 },
  block: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  blockLabel: { color: MUTED, fontSize: 12 },
  blockValue: { marginTop: 4, color: INK, fontWeight: '700', lineHeight: 20 },
  blockTitle: { marginHorizontal: 16, marginTop: 8, marginBottom: 8, color: INK, fontSize: 16, fontWeight: '800' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 8, marginBottom: 8, gap: 8 },
  sectionTitle: { color: INK, fontSize: 16, fontWeight: '800' },
  link: { color: ORANGE, fontWeight: '800' },
  linkCenter: { color: ORANGE, fontWeight: '800', textAlign: 'center', marginVertical: 8 },
  detailBtn: { borderWidth: 1, borderColor: ORANGE, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  detailBtnText: { color: ORANGE, fontWeight: '800', fontSize: 12 },
  itemLine: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  itemLineRule: { borderBottomWidth: 1, borderBottomColor: LINE },
  infoDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#9CA3AF', color: '#9CA3AF', fontSize: 9, fontWeight: '800', textAlign: 'center', lineHeight: 12, overflow: 'hidden' },
  fresh: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#E8F8EF', borderRadius: 14, padding: 12 },
  freshRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  freshMark: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  freshMarkText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  freshTitle: { color: '#16A34A', fontWeight: '800' },
  freshSub: { marginTop: 2, color: '#16A34A', fontSize: 12 },
  rowBtn: { flexDirection: 'row', gap: 8 },
  outline: { marginHorizontal: 16, marginTop: 8, borderWidth: 1.5, borderColor: ORANGE, borderRadius: 24, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  outlineText: { color: ORANGE, fontWeight: '800', fontSize: 15 },
  save: { marginHorizontal: 16, marginTop: 8, backgroundColor: ORANGE, borderRadius: 24, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  helpNote: { marginHorizontal: 16, marginTop: 8, color: INK },
  rateLink: { marginTop: 6, color: ORANGE, fontWeight: '800', fontSize: 13 },
  itemRow: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemPhoto: { width: 56, height: 56 },
  itemName: { color: INK, fontWeight: '800' },
  itemPrice: { marginTop: 2, color: INK, fontWeight: '800' },
  compare: { color: '#98A2B3', fontWeight: '600', textDecorationLine: 'line-through' },
  buy: { borderWidth: 1, borderColor: ORANGE, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  buyText: { color: ORANGE, fontWeight: '800', fontSize: 12 },
  pay: { marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  payTitle: { color: INK, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  payTitleInline: { marginBottom: 0 },
  payHead: { marginBottom: 10 },
  itemRowTight: { paddingVertical: 6, marginBottom: 6 },
  itemPhotoSm: { width: 48, height: 48 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paid: { marginTop: 6, backgroundColor: '#E8F8EF', borderRadius: 10, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
  helpRow: { marginHorizontal: 16, marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, marginHorizontal: 16 },
  action: { flex: 1, marginHorizontal: 0, marginTop: 0 },
  cancelBanner: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FDECEC', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelMark: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E11D48', alignItems: 'center', justifyContent: 'center' },
  cancelMarkText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  cancelTitle: { color: '#E11D48', fontWeight: '800' },
  cancelSub: { marginTop: 4, color: '#E11D48', fontSize: 12 },
  itemSide: { alignItems: 'flex-end', gap: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E6E8EC', borderRadius: 14, paddingHorizontal: 4, backgroundColor: '#FFFFFF' },
  qtyBtn: { color: INK, fontSize: 16, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2 },
  stepVal: { minWidth: 18, textAlign: 'center', fontWeight: '800', color: INK },
  reorderBar: { marginHorizontal: 16, marginBottom: 10, backgroundColor: ORANGE, borderRadius: 24, minHeight: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  added: { flex: 1, backgroundColor: '#FFFFFF', paddingBottom: 24 },
  addedHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'web' ? 12 : 46 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F5F7', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 24, color: MUTED, lineHeight: 26 },
  bagArt: { width: 280, height: 210, alignSelf: 'center', marginTop: 8 },
  addedTitle: { marginTop: 24, textAlign: 'center', color: INK, fontSize: 28, fontWeight: '800' },
  addedSub: { marginTop: 8, textAlign: 'center', color: MUTED, fontSize: 15, lineHeight: 22 },
  ref: { marginHorizontal: 16, marginTop: 20, marginBottom: 12, backgroundColor: '#F5F6F8', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  refIcon: { fontSize: 28 },
  stars: { flexDirection: 'row', gap: 4, marginHorizontal: 16, marginBottom: 10 },
  starsInline: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 28, color: '#E5E7EB' },
  starSm: { fontSize: 16, color: '#E5E7EB' },
  starOn: { color: ORANGE },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginBottom: 8 },
  tag: { borderWidth: 1, borderColor: '#E6E8EC', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFFFFF' },
  tagOn: { borderColor: ORANGE, backgroundColor: '#FFF1E8' },
  tagText: { color: INK, fontSize: 12, fontWeight: '700' },
  tagTextOn: { color: ORANGE },
  feedback: { marginHorizontal: 16, minHeight: 90, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, color: INK, textAlignVertical: 'top' },
  counter: { alignSelf: 'flex-end', marginRight: 16, color: MUTED, fontSize: 11 },
  checkRow: { marginHorizontal: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: '#E6E8EC', alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkMark: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  checkText: { flex: 1, color: INK, fontSize: 13 },
});
