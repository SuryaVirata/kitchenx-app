import { createElement, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ORANGE = '#FF4F18';
const INK = '#17171A';
const MUTED = '#667085';
const PAGE = '#F4F5F7';
const GREEN = '#16A34A';
const RED = '#E11D48';

const LOGO_ASPECT = 3171 / 369;

type Tab = 'home' | 'orders' | 'inventory' | 'finance' | 'more';

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'orders', label: 'Orders' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'finance', label: 'Finance' },
  { id: 'more', label: 'More' },
];

function svgUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function SvgIcon({ svg, size }: { svg: string; size: number }) {
  const uri = svgUri(svg);
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

const AVATAR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#F3C7A6"/><path d="M8 58c2-16 10-24 24-24s22 8 24 24" fill="#1E293B"/><path d="M18 58c1.2-8 6-13 14-13s12.8 5 14 13" fill="#F8FAFC"/><circle cx="32" cy="26" r="11" fill="#E8B48A"/><path d="M18 28c1.2-12 7-18 14-18s13 6 14 18c-3-4-8-6-14-6s-11 2-14 6z" fill="#1E293B"/><path d="M24 25.5c.4 1.2 1.6 2 2.6 1.6M37.4 27.1c1-.4 2.2-.4 2.6-1.6" stroke="#1E293B" stroke-width="1.2" stroke-linecap="round"/><path d="M28.5 31.5c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" stroke="#C4846A" stroke-width="1.1" stroke-linecap="round"/></svg>';

const BELL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2v1.15"/><path d="M6.4 16.4h11.2"/><path d="M7.3 16.4V10a4.7 4.7 0 0 1 9.4 0v6.4"/><path d="M10.1 17.7a1.9 1.9 0 0 0 3.8 0"/><circle cx="17.35" cy="5.15" r="2.7" fill="#E11D48" stroke="#fff" stroke-width="1.1"/><text x="17.35" y="6.25" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="3.2" font-weight="700" fill="#fff" stroke="none">2</text></svg>';

function icon(kind: string, color: string) {
  const common = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
  if (kind === 'home') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="M4.2 10.6 12 4.2l7.8 6.4V20a1.4 1.4 0 0 1-1.4 1.4h-4.2v-6.2H9.8v6.2H5.6A1.4 1.4 0 0 1 4.2 20V10.6z"/></svg>`;
  }
  if (kind === 'orders') {
    return `<svg ${common}><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 3.5h6v2.2H9z"/><path d="M9 11h6M9 14.5h4"/></svg>`;
  }
  if (kind === 'inventory') {
    return `<svg ${common}><path d="M4 8.2 12 4.2l8 4v9.6l-8 4-8-4V8.2z"/><path d="M12 8.2v9.6M4 8.2l8 4 8-4"/></svg>`;
  }
  if (kind === 'finance') {
    return `<svg ${common}><path d="M4 18.5V6M4 18.5h16"/><path d="M7.5 15.2v-3.2M12 15.2V8.2M16.5 15.2v-5"/></svg>`;
  }
  if (kind === 'box') {
    return `<svg ${common}><path d="M4.5 8 12 4.4 19.5 8v8.2L12 19.8 4.5 16.2V8z"/><path d="M12 8v8M4.5 8 12 11.6 19.5 8"/></svg>`;
  }
  if (kind === 'users') {
    return `<svg ${common}><circle cx="9" cy="9" r="2.4"/><circle cx="16" cy="10" r="2"/><path d="M4.8 17.4c.6-2.4 2.4-3.6 4.2-3.6s3.6 1.2 4.2 3.6M13.2 13.8c1.4 0 2.8.8 3.4 2.6"/></svg>`;
  }
  if (kind === 'bag') {
    return `<svg ${common}><path d="M6.2 8.2h11.6l-.8 10.2a1.6 1.6 0 0 1-1.6 1.5H8.6a1.6 1.6 0 0 1-1.6-1.5L6.2 8.2z"/><path d="M9 8.2V6.8a3 3 0 0 1 6 0v1.4"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7"><rect x="3.6" y="3.6" width="6.6" height="6.6" rx="1.6"/><rect x="13.8" y="3.6" width="6.6" height="6.6" rx="1.6"/><rect x="3.6" y="13.8" width="6.6" height="6.6" rx="1.6"/><rect x="13.8" y="13.8" width="6.6" height="6.6" rx="1.6"/></svg>`;
}

const ACTIONS = [
  { label: 'New Order', kind: 'bag' },
  { label: 'Add Product', kind: 'box' },
  { label: 'Manage Users', kind: 'users' },
  { label: 'Reports', kind: 'finance' },
];

const ORDERS = [
  { id: '#KX00124', name: 'Restaurant ABC', amount: '₹2,450', status: 'Processing', tone: 'peach' as const },
  { id: '#KX00123', name: 'Hotel Paradise', amount: '₹5,680', status: 'Shipped', tone: 'blue' as const },
  { id: '#KX00122', name: 'Café Delight', amount: '₹1,230', status: 'Delivered', tone: 'green' as const },
];

function StatCard({
  label,
  value,
  delta,
  up,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  tone: 'green' | 'peach';
}) {
  return (
    <View style={[styles.stat, tone === 'green' ? styles.statGreen : styles.statPeach]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, value.length > 6 && styles.statValueCompact, tone === 'peach' && styles.statValuePeach]}>
        {value}
      </Text>
      <Text style={[styles.statDelta, up ? styles.deltaUp : styles.deltaDown]}>
        {up ? '↑' : '↓'} {delta}
      </Text>
    </View>
  );
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <View style={styles.root}>
      <View style={styles.logoRow}>
        <Image
          source={require('../../../assets/kitchenx-logo-trimmed.png')}
          resizeMode="contain"
          style={styles.logo}
          accessibilityLabel="KITCHEN X"
        />
      </View>

      {tab === 'home' ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.greet}>
            <SvgIcon svg={AVATAR} size={46} />
            <View style={styles.greetText}>
              <Text style={styles.greetTitle}>Good morning Admin</Text>
              <Text style={styles.greetDate}>Tue, 20 May 2025</Text>
            </View>
            <SvgIcon svg={BELL} size={26} />
          </View>

          <View style={styles.stats}>
            <StatCard label="Total Orders" value="128" delta="12%" up tone="green" />
            <StatCard label="Pending Orders" value="24" delta="8%" up={false} tone="peach" />
            <StatCard label="Total Spend" value="₹1,24,500" delta="15%" up tone="green" />
          </View>

          <Text style={styles.section}>Quick Actions</Text>
          <View style={styles.actions}>
            {ACTIONS.map((action) => (
              <View key={action.label} style={styles.action}>
                <View style={styles.actionIcon}>
                  <SvgIcon svg={icon(action.kind, ORANGE)} size={22} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.section}>Recent Orders</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.orderCard}>
            {ORDERS.map((order, index) => (
              <View key={order.id} style={[styles.orderRow, index < ORDERS.length - 1 && styles.orderLine]}>
                <Text style={styles.orderCode}>{order.id}</Text>
                <Text style={styles.orderName} numberOfLines={1}>
                  {order.name}
                </Text>
                <Text style={styles.orderAmount}>{order.amount}</Text>
                <View
                  style={[
                    styles.chip,
                    order.tone === 'peach' && styles.chipPeach,
                    order.tone === 'blue' && styles.chipBlue,
                    order.tone === 'green' && styles.chipGreen,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      order.tone === 'peach' && styles.chipTextPeach,
                      order.tone === 'blue' && styles.chipTextBlue,
                      order.tone === 'green' && styles.chipTextGreen,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>{TABS.find((item) => item.id === tab)?.label}</Text>
        </View>
      )}

      <View style={styles.tabBar}>
        {TABS.map((item) => {
          const active = item.id === tab;
          const color = active ? ORANGE : '#98A2B3';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tab}
              onPress={() => setTab(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
            >
              <SvgIcon svg={icon(item.id, color)} size={24} />
              <Text style={[styles.tabLabel, active && styles.tabLabelOn]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE,
  },
  logoRow: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 132,
    height: 132 / LOGO_ASPECT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetText: {
    flex: 1,
  },
  greetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: INK,
  },
  greetDate: {
    marginTop: 2,
    fontSize: 13,
    color: MUTED,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  stat: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minHeight: 104,
  },
  statGreen: {
    backgroundColor: '#E7F8EE',
  },
  statPeach: {
    backgroundColor: '#FFF1EC',
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: '600',
  },
  statValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: GREEN,
    letterSpacing: -0.3,
  },
  statValueCompact: {
    fontSize: 14,
  },
  statValuePeach: {
    color: ORANGE,
  },
  statDelta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  deltaUp: {
    color: GREEN,
  },
  deltaDown: {
    color: RED,
  },
  section: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '800',
    color: INK,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    marginTop: 6,
    color: ORANGE,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  action: {
    width: '23%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: INK,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  orderLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8EAED',
  },
  orderCode: {
    fontSize: 12,
    fontWeight: '800',
    color: INK,
  },
  orderName: {
    flex: 1,
    fontSize: 12,
    color: MUTED,
    fontWeight: '500',
  },
  orderAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: INK,
  },
  chip: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipPeach: { backgroundColor: '#FFF1EC' },
  chipBlue: { backgroundColor: '#E8F0FE' },
  chipGreen: { backgroundColor: '#E7F8EE' },
  chipText: { fontSize: 11, fontWeight: '700' },
  chipTextPeach: { color: ORANGE },
  chipTextBlue: { color: '#3B6FD8' },
  chipTextGreen: { color: GREEN },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: INK,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EAED',
    paddingTop: 8,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#98A2B3',
  },
  tabLabelOn: {
    color: ORANGE,
  },
});
