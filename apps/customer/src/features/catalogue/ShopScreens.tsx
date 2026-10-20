import { createElement, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { AccountFlow } from './AccountScreens';
import { colors } from '../../theme/theme';
import { Text, TextInput } from '../../ui/Text';
import { useSplashReady } from '../../shell/SplashReady';

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
  compareAt?: number;
  minutes?: number;
  image: number;
  category: 'vegetables' | 'fruits' | 'leafy';
  fresh?: boolean;
};

const PRODUCTS: Product[] = [
  { id: 'tomato', name: 'Tomato (Desi)', unit: '1 kg', price: 40, compareAt: 48, minutes: 8, image: require('../../../assets/shop/tomato.png'), category: 'vegetables', fresh: true },
  { id: 'onion', name: 'Onion (Indian)', unit: '1 kg', price: 32, compareAt: 38, minutes: 8, image: require('../../../assets/shop/onion.png'), category: 'vegetables' },
  { id: 'potato', name: 'Potato', unit: '1 kg', price: 28, compareAt: 34, minutes: 8, image: require('../../../assets/shop/potato.png'), category: 'vegetables' },
  { id: 'carrot', name: 'Carrot', unit: '1 kg', price: 36, compareAt: 42, minutes: 8, image: require('../../../assets/shop/carrot.png'), category: 'vegetables' },
  { id: 'cucumber', name: 'Cucumber', unit: '1 kg', price: 30, compareAt: 36, minutes: 8, image: require('../../../assets/shop/cucumber.png'), category: 'vegetables' },
  { id: 'capsicum', name: 'Capsicum (Green)', unit: '500 g', price: 48, compareAt: 56, minutes: 8, image: require('../../../assets/shop/capsicum.png'), category: 'vegetables' },
  { id: 'cabbage', name: 'Cabbage', unit: '1 kg', price: 24, compareAt: 28, minutes: 8, image: require('../../../assets/shop/cabbage.png'), category: 'vegetables' },
  { id: 'cauli', name: 'Cauliflower', unit: '1 kg', price: 42, compareAt: 48, minutes: 8, image: require('../../../assets/shop/cauli.png'), category: 'vegetables' },
  { id: 'chilli', name: 'Green Chilli (Mirapakaya)', unit: '250 g', price: 22, compareAt: 26, minutes: 8, image: require('../../../assets/shop/chilli.png'), category: 'vegetables' },
  { id: 'garlic', name: 'Garlic', unit: '250 g', price: 35, compareAt: 42, minutes: 8, image: require('../../../assets/shop/garlic.png'), category: 'vegetables' },
  { id: 'lemon', name: 'Lemon', unit: '500 g', price: 30, compareAt: 36, minutes: 8, image: require('../../../assets/shop/lemon.png'), category: 'fruits', fresh: true },
  { id: 'spinach', name: 'Spinach', unit: '1 bunch', price: 18, compareAt: 22, minutes: 8, image: require('../../../assets/shop/spinach.png'), category: 'leafy', fresh: true },
  { id: 'broccoli', name: 'Broccoli', unit: '1 kg', price: 60, compareAt: 72, minutes: 8, image: require('../../../assets/shop/broccoli.png'), category: 'leafy' },
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
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.4"/><path d="M15.4 15.4 20.6 20.6"/></svg>';
const BELL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2v1.15"/><path d="M6.4 16.4h11.2"/><path d="M7.3 16.4V10a4.7 4.7 0 0 1 9.4 0v6.4"/><path d="M10.1 17.7a1.9 1.9 0 0 0 3.8 0"/><circle cx="17.35" cy="5.15" r="2.55" fill="#FF4F18" stroke="#fff" stroke-width="1.15"/><text x="17.35" y="6.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="3.15" font-weight="700" fill="#fff" stroke="none">1</text></svg>';
const BAG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF4F18" d="M7.1 8.2h9.8l-.75 10.1a1.6 1.6 0 0 1-1.6 1.45H9.45a1.6 1.6 0 0 1-1.6-1.45L7.1 8.2Z"/><path fill="none" stroke="#FF4F18" stroke-width="1.7" stroke-linecap="round" d="M9.3 8.2V6.7a2.7 2.7 0 0 1 5.4 0v1.5"/></svg>';
const MENU =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const CART_LINE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#141517" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="20.2" r="1.35" fill="#141517" stroke="none"/><circle cx="18" cy="20.2" r="1.35" fill="#141517" stroke="none"/><path d="M2.4 3.2h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.45h8.7a1.8 1.8 0 0 0 1.75-1.4l1.5-6.8H5.6"/></svg>';
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

const FAST_BANNER = require('../../../assets/Fast Delivery Asserts/Fresh Essentials, Delivered Fast.png');

const HERO_BANNERS = [
  { id: 'produce', title: 'Fresh Fruits & Vegetables', category: 'vegetables', image: require('../../../assets/banners/Fresh Fruits and Vegetables Banner.png') },
  { id: 'essentials', title: 'Daily Essentials', category: 'rice', image: require('../../../assets/banners/Daily Essentials Grocery Banner.png') },
  { id: 'dairy', title: 'Fresh Dairy', category: 'dairy', image: require('../../../assets/banners/Fresh Dairy Banner with Cheese and Milk.png') },
  { id: 'protein', title: 'Meat, Poultry & Seafood', category: 'chicken', image: require('../../../assets/banners/Fresh Meat Poultry and Seafood.png') },
  { id: 'snacks', title: 'Snacks & Beverages', category: 'drinks', image: require('../../../assets/banners/Snacks and Beverages Banner.png') },
  { id: 'household', title: 'Household & Personal Care', category: 'household', image: require('../../../assets/banners/Household and Personal Care Banner.png') },
] as const;

const HOME_CATEGORIES = [
  { id: 'vegetables', label: 'Fruits & Vegetables', tint: '#E8F5E9', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png') },
  { id: 'dairy', label: 'Fresh Dairy', tint: '#E3F2FD', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png') },
  { id: 'rice', label: 'Atta, Rice & Pulses', tint: '#FFF3E0', image: require('../../../assets/Category_PNGs/18_rice_rice_products.png') },
  { id: 'oils', label: 'Oils, Masala & Spices', tint: '#FFF9C4', image: require('../../../assets/Category_PNGs/13_edible_oils.png') },
  { id: 'canned', label: 'Packaged Foods', tint: '#FCE4EC', image: require('../../../assets/Category_PNGs/10_canned_imported_items.png') },
  { id: 'drinks', label: 'Beverages', tint: '#EDE7F6', image: require('../../../assets/Category_PNGs/14_beverages_mixers.png') },
  { id: 'packaging', label: 'Packaging', tint: '#F4F5F7', image: require('../../../assets/Category_PNGs/04_packaging_material.png') },
  { id: 'butter', label: 'Butter & Cheese', tint: '#E1F5FE', image: require('../../../assets/Category_PNGs/06_butter_cheese_more.png') },
  { id: 'chicken', label: 'Chicken & Eggs', tint: '#FFEBEE', image: require('../../../assets/Category_PNGs/08_chicken_eggs.png') },
  { id: 'spices', label: 'Masala & Sugar', tint: '#FFF9C4', image: require('../../../assets/Category_PNGs/07_masala_salt_sugar.png') },
  { id: 'sauces', label: 'Sauces', tint: '#FFF3E0', image: require('../../../assets/Category_PNGs/09_sauces_seasoning.png') },
  { id: 'frozen', label: 'Frozen Food', tint: '#E0F7FA', image: require('../../../assets/Category_PNGs/12_frozen_instant_food.png') },
] as const;

const EXPLORE_CATEGORIES = [
  { id: 'vegetables', label: 'Fruits & Vegetables', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png') },
  { id: 'fruits', label: 'Fresh Fruits', image: require('../../../assets/shop/cat-lemon.png') },
  { id: 'dairy', label: 'Dairy & Eggs', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png') },
  { id: 'rice', label: 'Atta, Rice & Pulses', image: require('../../../assets/Category_PNGs/18_rice_rice_products.png') },
  { id: 'oils', label: 'Oils, Masala & Spices', image: require('../../../assets/Category_PNGs/13_edible_oils.png') },
  { id: 'canned', label: 'Packaged Foods', image: require('../../../assets/Category_PNGs/10_canned_imported_items.png') },
  { id: 'drinks', label: 'Beverages', image: require('../../../assets/Category_PNGs/14_beverages_mixers.png') },
  { id: 'chicken', label: 'Meat, Chicken & Seafood', image: require('../../../assets/Category_PNGs/08_chicken_eggs.png') },
] as const;

const EXPLORE_OFFERS = [
  { id: 'produce', off: 'Upto 25% OFF', title: 'Fresh Vegetables', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png'), category: 'vegetables' },
  { id: 'dairy', off: 'Upto 30% OFF', title: 'Dairy & Milk', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png'), category: 'dairy' },
] as const;

const EXPLORE_OFFER_CATS = [
  { id: 'rice', off: 'Upto 30% OFF', label: 'Atta, Rice & Pulses', image: require('../../../assets/Category_PNGs/18_rice_rice_products.png') },
  { id: 'oils', off: 'Upto 25% OFF', label: 'Oils, Masala & Spices', image: require('../../../assets/Category_PNGs/13_edible_oils.png') },
  { id: 'canned', off: 'Upto 20% OFF', label: 'Packaged Foods', image: require('../../../assets/Category_PNGs/10_canned_imported_items.png') },
] as const;

const EXPLORE_BRANDS = [
  { id: 'amul', name: 'Amul', size: 18, italic: true, count: '20+ products', line: 'Goodness for every kitchen', color: '#E10600', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png'), category: 'dairy' },
  { id: 'aashirvaad', name: 'Aashirvaad', size: 9, italic: false, count: '15+ products', line: 'Everyday atta', color: '#E87722', image: require('../../../assets/Category_PNGs/16_flours.png'), category: 'rice' },
  { id: 'fortune', name: 'fortune', size: 15, italic: false, count: '18+ products', line: 'Pure & healthy', color: '#D0121A', image: require('../../../assets/Category_PNGs/13_edible_oils.png'), category: 'oils' },
  { id: 'tata', name: 'Tata', size: 16, italic: false, count: '22+ products', line: 'Tea & staples', color: '#1F4ED8', image: require('../../../assets/explore/brand-tea.jpg'), category: 'drinks' },
  { id: 'nestle', name: 'Nestlé', size: 14, italic: false, count: '25+ products', line: 'Everyday essentials', color: '#C8102E', image: require('../../../assets/explore/brand-milk.jpg'), category: 'dairy' },
  { id: 'sunfeast', name: 'Sunfeast', size: 11, italic: false, count: '18+ products', line: 'Biscuits & snacks', color: '#E87722', image: require('../../../assets/explore/brand-biscuit.jpg'), category: 'canned' },
  { id: 'britannia', name: 'BRITANNIA', size: 8, italic: false, count: '20+ products', line: 'Trusted taste', color: '#123A8C', image: require('../../../assets/Category_PNGs/11_bakery_chocolates.png'), category: 'canned' },
  { id: 'cocacola', name: 'Coca-Cola', size: 11, italic: true, count: '12+ products', line: 'Chilled drinks', color: '#E10600', image: require('../../../assets/Category_PNGs/14_beverages_mixers.png'), category: 'drinks' },
] as const;

const FEATURED_BRANDS = ['fortune', 'nestle', 'britannia'] as const;

const EXPLORE_CUISINES = [
  { id: 'vegetables', label: 'South Indian', image: require('../../../assets/explore/cuisine-south.jpg') },
  { id: 'rice', label: 'North Indian', image: require('../../../assets/explore/cuisine-north.jpg') },
  { id: 'canned', label: 'Chinese', image: require('../../../assets/explore/cuisine-chinese.jpg') },
  { id: 'oils', label: 'Continental', image: require('../../../assets/explore/cuisine-continental.jpg') },
] as const;

const RECOMMENDED_IDS = ['tomato', 'potato', 'onion', 'carrot'] as const;

function glyph(body: string, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const CALENDAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2.2" y="4.4" width="15.6" height="15" rx="2.8" fill="#FF4F18"/><rect x="4" y="8" width="12" height="9.4" rx="1.3" fill="#FFFFFF"/><rect x="6" y="2.4" width="1.8" height="3.6" rx="0.9" fill="#FF4F18"/><rect x="12.2" y="2.4" width="1.8" height="3.6" rx="0.9" fill="#FF4F18"/><path d="M6.2 10.6h7.6M6.2 13.2h7.6M6.2 15.6h4.8" stroke="#FFC7B8" stroke-width="1.15" stroke-linecap="round"/><circle cx="17.7" cy="16.6" r="4.5" fill="#FF4F18"/><circle cx="17.7" cy="16.6" r="3.15" fill="#FFFFFF"/><path d="M17.7 14.8v1.9l1.25.75" fill="none" stroke="#FF4F18" stroke-width="1.25" stroke-linecap="round"/></svg>`;
const SCAN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8.2 3.2H4.6A1.4 1.4 0 0 0 3.2 4.6v3.6"/><path d="M15.8 3.2h3.6a1.4 1.4 0 0 1 1.4 1.4v3.6"/><path d="M8.2 20.8H4.6a1.4 1.4 0 0 1-1.4-1.4v-3.6"/><path d="M15.8 20.8h3.6a1.4 1.4 0 0 0 1.4-1.4v-3.6"/><rect x="7.4" y="7.4" width="3.6" height="3.6" rx="0.4" fill="#FF4F18" stroke="none"/><rect x="12.2" y="7.4" width="3.6" height="3.6" rx="0.4" fill="#FF4F18" stroke="none"/><rect x="7.4" y="12.2" width="3.6" height="3.6" rx="0.4" fill="#FF4F18" stroke="none"/><rect x="12.2" y="12.2" width="1.5" height="1.5" fill="#FF4F18" stroke="none"/><rect x="14.4" y="12.2" width="1.5" height="1.5" fill="#FF4F18" stroke="none"/><rect x="12.2" y="14.4" width="1.5" height="1.5" fill="#FF4F18" stroke="none"/><rect x="14.4" y="14.4" width="1.5" height="1.5" fill="#FF4F18" stroke="none"/></svg>`;

type ShopTab = 'home' | 'explore' | 'lists' | 'orders' | 'account';

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
  const alias: Record<string, string> = { butter: 'dairy', sauces: 'spices' };
  const category = alias[filter] ?? filter;
  if (category === 'all') return PRODUCTS;
  if (category === 'fresh') return PRODUCTS.filter((item) => item.fresh);
  return PRODUCTS.filter((item) => item.category === category);
}

function tabSvg(name: 'home' | 'explore' | 'orders' | 'lists' | 'account', active: boolean) {
  const color = active ? colors.orange : '#9CA3AF';
  const fill = active ? colors.orange : 'none';
  const common = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  if (name === 'home') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"><path d="M3.6 11.2 12 4.2l8.4 7V20a1.2 1.2 0 0 1-1.2 1.2h-4.6v-6.2H9.4v6.2H4.8A1.2 1.2 0 0 1 3.6 20v-8.8Z"/></svg>`;
  }
  if (name === 'explore') {
    return `<svg ${common}><rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.8"/><rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.8"/><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.8"/><rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.8"/></svg>`;
  }
  if (name === 'orders') {
    return `<svg ${common}><path d="M3.6 8.2 12 4.4l8.4 3.8L12 12 3.6 8.2Z"/><path d="M3.6 8.2V16l8.4 3.8L20.4 16V8.2"/><path d="M12 12v7.8"/></svg>`;
  }
  if (name === 'lists') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="4.7" rx="1.55" ry="1.05"/><path d="M12 5.75v1.2"/><path d="M4.7 16.2c.35-4.35 3.45-7.15 7.3-7.15s6.95 2.8 7.3 7.15"/><path d="M3.2 16.2h17.6"/><path d="M4.6 18.7h14.8"/></svg>`;
  }
  return `<svg ${common}><circle cx="12" cy="8" r="3.2" fill="${fill}"/><path d="M5.6 19.6c.8-3.2 3.1-4.8 6.4-4.8s5.6 1.6 6.4 4.8"/></svg>`;
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
  const [screen, setScreen] = useState<'home' | 'explore' | 'category' | 'product' | 'cart' | 'list' | 'orders' | 'account' | 'alerts'>('home');
  const [tab, setTab] = useState<ShopTab>('home');
  const [productId, setProductId] = useState('tomato');
  const [backTo, setBackTo] = useState<'home' | 'category' | 'list' | 'explore'>('home');
  const [filter, setFilter] = useState('vegetables');
  const [browse, setBrowse] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'standard' | 'express'>('standard');
  const [menu, setMenu] = useState(false);
  const [cartBack, setCartBack] = useState<'home' | 'category' | 'explore' | 'account'>('home');

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

  const openProduct = (id: string, from: 'home' | 'category' | 'list' | 'explore') => {
    setProductId(id);
    setBackTo(from);
    setScreen('product');
  };
  const openCategory = (id: string) => {
    setFilter(id);
    setBrowse(false);
    setTab((current) => (current === 'explore' ? 'explore' : 'home'));
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
    if (next === 'explore') {
      setBrowse(false);
      setScreen('explore');
    }
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
          if (tab === 'explore') {
            setScreen('explore');
            return;
          }
          setTab('home');
          setScreen('home');
        }}
        onOpenCart={() => {
          setCartBack('category');
          setScreen('cart');
        }}
        onOpen={(id) => openProduct(id, 'category')}
        onAdd={(id) => add(id, 1)}
        onSetQty={setQty}
        city={city}
        mode={mode}
        onMode={setMode}
        onDeliver={onDeliver}
        cart={cart}
        saved={saved}
        onToggleSaved={toggleSaved}
        tab={tab}
        onTab={goTab}
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
        onBack={() => setScreen(cartBack)}
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
      <AccountFlow
        city={city}
        cartCount={cartCount}
        onDeliver={onDeliver}
        onCart={() => {
          setCartBack('account');
          setScreen('cart');
        }}
        onHome={() => {
          setTab('home');
          setScreen('home');
        }}
        onRegister={onSetup}
        footer={<TabBar tab={tab} onTab={goTab} />}
      />
    );
  }
  if (screen === 'explore') {
    return (
      <ExploreScreen
        city={city}
        cart={cart}
        cartCount={cartCount}
        onDeliver={onDeliver}
        onCart={() => {
          setCartBack('explore');
          setScreen('cart');
        }}
        onHome={() => {
          setTab('home');
          setScreen('home');
        }}
        onOpenCategory={openCategory}
        onSeeAll={() => {
          setBrowse(true);
          setScreen('category');
        }}
        onOpenProduct={(id) => openProduct(id, 'explore')}
        onAdd={(id) => add(id, 1)}
        onSetQty={setQty}
        tab={tab}
        onTab={goTab}
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
        onCart={() => {
          setCartBack('home');
          setScreen('cart');
        }}
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
              ['Starter', 'lists'],
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

function HeroCarousel({ width, onOpen, mode }: { width: number; onOpen: (id: string) => void; mode: 'standard' | 'express' }) {
  const height = Math.round(width * (768 / 2048));
  const index = useRef(0);
  const paused = useRef(false);
  const loaded = useRef<boolean[]>(HERO_BANNERS.map(() => false));
  const [active, setActive] = useState(0);
  const [under, setUnder] = useState(0);
  const splashReady = useSplashReady();
  const touch = useRef({ x: 0, y: 0, moved: false });

  const show = (next: number) => {
    const safe = (next + HERO_BANNERS.length) % HERO_BANNERS.length;
    if (safe === index.current) return;
    if (!loaded.current[safe]) return;
    setUnder(index.current);
    index.current = safe;
    setActive(safe);
  };

  useEffect(() => {
    if (!splashReady || mode !== 'standard') return undefined;
    const timer = setInterval(() => {
      if (paused.current) return;
      show((index.current + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [splashReady, mode]);

  if (mode === 'express') {
    return (
      <Pressable
        style={[styles.promoClip, { height, backgroundColor: 'transparent' }]}
        onPress={() => onOpen('all')}
        accessibilityRole="button"
        accessibilityLabel="Shop kitchen essentials delivered fast"
      >
        <Image source={FAST_BANNER} style={{ width: '100%', height }} resizeMode="contain" fadeDuration={0} />
        <View style={[styles.shopNow, { pointerEvents: 'none' }]}>
          <Text style={styles.shopNowText}>Shop now  ›</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View>
      <View
        style={[styles.promoClip, { height }]}
        onTouchStart={(event) => {
          paused.current = true;
          touch.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY, moved: false };
        }}
        onTouchMove={(event) => {
          const dx = Math.abs(event.nativeEvent.pageX - touch.current.x);
          const dy = Math.abs(event.nativeEvent.pageY - touch.current.y);
          if (dx > 12 || dy > 12) touch.current.moved = true;
        }}
        onTouchEnd={(event) => {
          const delta = event.nativeEvent.pageX - touch.current.x;
          if (delta <= -36) show(index.current + 1);
          else if (delta >= 36) show(index.current - 1);
          else if (!touch.current.moved) onOpen(HERO_BANNERS[index.current].category);
          paused.current = false;
        }}
        accessibilityRole="button"
        accessibilityLabel={`Shop ${HERO_BANNERS[active].title}`}
      >
        {HERO_BANNERS.map((item, itemIndex) => {
          const visible = itemIndex === active || itemIndex === under;
          return (
            <View key={item.id} style={[styles.promoSlide, { opacity: visible ? 1 : 0, zIndex: itemIndex === active ? 2 : 1 }]}>
              <Image
                source={item.image}
                style={{ width: '100%', height }}
                resizeMode="cover"
                fadeDuration={0}
                onLoad={() => {
                  loaded.current[itemIndex] = true;
                }}
              />
            </View>
          );
        })}
        <View style={[styles.shopNow, { pointerEvents: 'none' }]}>
          <Text style={styles.shopNowText}>Shop now  ›</Text>
        </View>
      </View>
      <View style={styles.dots}>
        {HERO_BANNERS.map((item, dot) => (
          <View key={item.id} style={[styles.dot, dot === active && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

function ModeSwitch({
  mode,
  onMode,
  names,
  segmentGap = 0,
}: {
  mode: 'standard' | 'express';
  onMode: (mode: 'standard' | 'express') => void;
  names?: [string, string];
  segmentGap?: number;
}) {
  const slide = useRef(new Animated.Value(mode === 'express' ? 1 : 0)).current;
  const [track, setTrack] = useState(0);
  useEffect(() => {
    Animated.timing(slide, {
      toValue: mode === 'express' ? 1 : 0,
      duration: 280,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [mode, slide]);
  const inner = Math.max(track - 8, 0);
  const pill = Math.max((inner - segmentGap) / 2, 0);
  const travel = slide.interpolate({ inputRange: [0, 1], outputRange: [0, pill + segmentGap] });
  const options = [
    { id: 'standard' as const, label: names?.[0] ?? 'On time', icon: (color: string) => glyph('<circle cx="12" cy="12" r="7.2"/><path d="M12 8.2V12l2.6 1.6"/>', color) },
    { id: 'express' as const, label: names?.[1] ?? 'Minutes', icon: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M13 2 4.5 13.2h6.2L10 22l9.5-12.2h-6.2L13 2z"/></svg>` },
  ];
  return (
    <View style={[styles.mode, segmentGap > 0 ? { gap: segmentGap } : null]} onLayout={(event) => setTrack(event.nativeEvent.layout.width)}>
      {pill > 0 ? (
        <Animated.View pointerEvents="none" style={[styles.modePill, { width: pill, transform: [{ translateX: travel }] }]} />
      ) : null}
      {options.map((item) => {
        const on = mode === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onMode(item.id)}
            style={styles.modeBtn}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={item.label}
          >
            <Icon svg={item.icon(on ? '#FFFFFF' : INK)} size={20} />
            <Text style={[styles.modeText, on && styles.modeTextOn]}>{item.label}</Text>
          </Pressable>
        );
      })}
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
  const frame = width > 600 ? 480 : width;
  const q = query.trim().toLowerCase();
  const results = q
    ? PRODUCTS.filter((item) => item.name.toLowerCase().includes(q) || item.category.includes(q) || item.unit.toLowerCase().includes(q))
    : [];
  const focusSearch = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const node = document.querySelector('[data-testid="home-search"]') as { focus?: () => void } | null;
      node?.focus?.();
    }
  };
  return (
    <View style={[styles.screen, width > 600 ? { width: 480, alignSelf: 'center' } : null, Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : null]}>
      <View style={[styles.homeTop, { paddingTop: Platform.OS === 'web' ? 18 : 50 }]}>
        <TouchableOpacity onPress={onDeliver} accessibilityRole="button" accessibilityLabel="Delivery tomorrow" style={styles.deliver}>
          <Icon svg={CALENDAR} size={30} />
          <Text style={styles.deliveryTitle}>Delivery tomorrow</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Cart" onPress={onCart} style={styles.cartBtn}>
          <Icon svg={CART_LINE} size={22} />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.homeScrollView} contentContainerStyle={styles.homeScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ModeSwitch mode={mode} onMode={onMode} />
        <View style={styles.search}>
          <Icon svg={SEARCH} size={22} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Search 'CTC & Loose Tea'"
            placeholderTextColor="#9AA0A6"
            style={styles.searchInput}
            testID="home-search"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Pressable onPress={focusSearch} accessibilityRole="button" accessibilityLabel="Scan or search by image">
            <Icon svg={SCAN} size={24} />
          </Pressable>
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
            <View style={styles.heroWrap}>
              <HeroCarousel width={frame - 32} onOpen={onOpenCategory} mode={mode} />
            </View>
            <Text style={styles.catHead}>Shop by category</Text>
            <View style={styles.catGrid}>
              {HOME_CATEGORIES.map((item) => (
                <View key={item.id} style={styles.catCell}>
                  <Pressable style={styles.catTile} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
                    <View style={[styles.catPhoto, { backgroundColor: item.tint }]}>
                      <Image source={item.image} style={styles.catPhotoImage} resizeMode="contain" />
                    </View>
                    <View style={styles.catFoot}>
                      <Text style={styles.catFootLabel} numberOfLines={2}>{item.label}</Text>
                      <Text style={styles.catChevron}>›</Text>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <TabBar tab={tab} onTab={onTab} />
    </View>
  );
}

function SectionHead({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll} accessibilityRole="button" accessibilityLabel={`See all ${title}`}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function discountOf(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

function ExploreScreen({
  city,
  cart,
  cartCount,
  onDeliver,
  onCart,
  onHome,
  onOpenCategory,
  onSeeAll,
  onOpenProduct,
  onAdd,
  onSetQty,
  tab,
  onTab,
}: {
  city: string;
  cart: Record<string, number>;
  cartCount: number;
  onDeliver?: () => void;
  onCart: () => void;
  onHome: () => void;
  onOpenCategory: (id: string) => void;
  onSeeAll: () => void;
  onOpenProduct: (id: string) => void;
  onAdd: (id: string) => void;
  onSetQty: (id: string, qty: number) => void;
  tab: ShopTab;
  onTab: (tab: ShopTab) => void;
}) {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = q
    ? PRODUCTS.filter((item) => item.name.toLowerCase().includes(q) || item.category.includes(q) || item.unit.toLowerCase().includes(q))
    : [];
  const featured = EXPLORE_BRANDS[0];
  const recommended = RECOMMENDED_IDS.map((id) => PRODUCTS.find((item) => item.id === id)).filter((item): item is Product => Boolean(item));
  return (
    <View style={[styles.screen, Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : null, width > 600 ? { width: 480, alignSelf: 'center' } : null]}>
      <View style={[styles.shopHead, { paddingTop: Platform.OS === 'web' ? 12 : 46 }]}>
        <View style={styles.shopBrand}>
          <TouchableOpacity onPress={onHome} accessibilityRole="button" accessibilityLabel="KitchenX home">
            <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.shopLogo} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeliver} accessibilityRole="button" accessibilityLabel={`Deliver to ${city}`} style={styles.shopLoc}>
            <Icon svg={PIN} size={16} />
            <View style={styles.shopLocCopy}>
              <Text style={styles.shopLocLabel}>Deliver to</Text>
              <Text style={styles.shopLocCity} numberOfLines={1}>{city} ▾</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCart} accessibilityRole="button" accessibilityLabel="Cart" style={styles.cartBtn}>
            <Icon svg={CART_LINE} size={24} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={[styles.search, styles.listSearch]}>
          <Icon svg={SEARCH} size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products, brands, categories..."
            placeholderTextColor="#9AA0A6"
            style={styles.searchInput}
            testID="explore-search"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => {
              if (Platform.OS === 'web' && typeof document !== 'undefined') {
                const node = document.querySelector('[data-testid="explore-search"]') as { focus?: () => void } | null;
                node?.focus?.();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Scan or search by image"
          >
            <Icon svg={SCAN} size={22} />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.homeScrollView} contentContainerStyle={styles.homeScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
            <Text style={styles.exploreTitle}>Explore</Text>
            <Text style={styles.exploreSub}>Discover top categories, offers and more</Text>
            <Pressable
              style={styles.exploreHeroCard}
              onPress={() => onOpenCategory('rice')}
              accessibilityRole="button"
              accessibilityLabel="Up to 40% off daily essentials"
            >
              <View style={styles.exploreHeroCopy}>
                <Text style={styles.exploreHeroOff}>Upto 40% OFF</Text>
                <Text style={styles.exploreHeroName}>Daily Essentials</Text>
                <Text style={styles.exploreHeroLine}>Fresh produce, dairy, staples & more</Text>
                <View style={styles.exploreHeroBtn}>
                  <Text style={styles.shopNowText}>Shop now  ›</Text>
                </View>
              </View>
              <View style={styles.exploreHeroArt}>
                <Image source={require('../../../assets/Category_PNGs/13_edible_oils.png')} style={styles.exploreHeroOil} resizeMode="contain" />
                <Image source={require('../../../assets/Category_PNGs/05_fresh_dairy.png')} style={styles.exploreHeroDairy} resizeMode="contain" />
                <Image source={require('../../../assets/Category_PNGs/03_fruits_vegetables.png')} style={styles.exploreHeroVeg} resizeMode="contain" />
              </View>
            </Pressable>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotOn]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <SectionHead title="Shop by category" onSeeAll={onSeeAll} />
            <View style={styles.exploreCatGrid}>
              {EXPLORE_CATEGORIES.map((item) => (
                <Pressable key={item.id} style={styles.exploreCatCell} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
                  <View style={styles.exploreCatPhoto}>
                    <Image source={item.image} style={styles.exploreCatImage} resizeMode="cover" />
                  </View>
                  <Text style={styles.exploreCatLabel} numberOfLines={2}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <SectionHead title="Top Offers" />
            <View style={styles.exploreSplit}>
              {EXPLORE_OFFERS.map((item, index) => (
                <View key={item.id} style={styles.exploreSplitCard}>
                  <Pressable style={styles.exploreSplitFace} onPress={() => onOpenCategory(item.category)} accessibilityRole="button" accessibilityLabel={`${item.off} ${item.title}`}>
                    <Image source={item.image} style={styles.exploreSplitImage} resizeMode="cover" />
                    <View style={styles.exploreShade}>
                      <Text style={styles.exploreShadeOff}>{item.off}</Text>
                      <Text style={styles.exploreShadeTitle} numberOfLines={2}>{item.title}</Text>
                    </View>
                    <View style={styles.exploreIndex}><Text style={styles.exploreIndexText}>{index + 1}</Text></View>
                  </Pressable>
                </View>
              ))}
            </View>
            <SectionHead title="Offers by category" onSeeAll={onSeeAll} />
            <View style={styles.exploreOfferRow}>
              {EXPLORE_OFFER_CATS.map((item) => (
                <View key={item.id} style={styles.exploreOfferCell}>
                  <Pressable style={styles.exploreOfferFace} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={`${item.off} ${item.label}`}>
                    <Image source={item.image} style={styles.exploreOfferImage} resizeMode="cover" />
                    <View style={styles.exploreShade}>
                      <Text style={styles.exploreShadeOff}>{item.off}</Text>
                      <Text style={styles.exploreShadeTitle} numberOfLines={2}>{item.label}</Text>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
            <SectionHead title="Shop by brands" onSeeAll={() => onOpenCategory('dairy')} />
            <View style={styles.exploreCatGrid}>
              {EXPLORE_BRANDS.map((item) => (
                <Pressable key={item.id} style={styles.exploreBrandCell} onPress={() => onOpenCategory(item.category)} accessibilityRole="button" accessibilityLabel={item.name}>
                  <View style={styles.exploreBrandMark}>
                    <Text style={[styles.exploreBrandWord, { color: item.color, fontSize: item.size, fontStyle: item.italic ? 'italic' : 'normal' }]} numberOfLines={1} adjustsFontSizeToFit>{item.name}</Text>
                  </View>
                  <Text style={styles.exploreBrandCount} numberOfLines={1}>{item.count}</Text>
                </Pressable>
              ))}
            </View>
            <SectionHead title="Featured brands" />
            <Pressable style={styles.exploreFeatured} onPress={() => onOpenCategory(featured.category)} accessibilityRole="button" accessibilityLabel={featured.name}>
              <View style={styles.exploreFeaturedCopy}>
                <Text style={styles.exploreFeaturedName}>{featured.name}</Text>
                <Text style={styles.exploreFeaturedLine}>{featured.line}</Text>
              </View>
              <Image source={featured.image} style={styles.exploreFeaturedPhoto} resizeMode="contain" />
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exploreHScroll}>
              {FEATURED_BRANDS.map((id) => EXPLORE_BRANDS.find((item) => item.id === id)).filter((item): item is (typeof EXPLORE_BRANDS)[number] => Boolean(item)).map((item) => (
                <Pressable key={item.id} style={styles.exploreBrandCard} onPress={() => onOpenCategory(item.category)} accessibilityRole="button" accessibilityLabel={item.name}>
                  <Image source={item.image} style={styles.exploreBrandCardPhoto} resizeMode="contain" />
                  <Text style={[styles.exploreBrandWord, styles.exploreBrandCardWord, { color: item.color }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.exploreBrandCount} numberOfLines={1}>{item.line}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <SectionHead title="Shop by cuisine" onSeeAll={() => onOpenCategory('vegetables')} />
            <View style={styles.exploreOfferRow}>
              {EXPLORE_CUISINES.map((item) => (
                <Pressable key={item.label} style={styles.exploreCuisineCell} onPress={() => onOpenCategory(item.id)} accessibilityRole="button" accessibilityLabel={item.label}>
                  <Image source={item.image} style={styles.exploreCuisineImage} resizeMode="cover" />
                  <Text style={styles.exploreCatLabel} numberOfLines={2}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <SectionHead title="Recommended for you" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exploreHScroll}>
              {recommended.map((item) => {
                const off = discountOf(item.price, item.compareAt);
                return (
                  <View key={item.id} style={styles.exploreProduct}>
                    <Pressable onPress={() => onOpenProduct(item.id)} accessibilityRole="button" accessibilityLabel={item.name}>
                      <View style={styles.exploreProductPhoto}>
                        {off ? (
                          <View style={styles.offBadge}>
                            <Text style={styles.offBadgeText}>{off}% OFF</Text>
                          </View>
                        ) : null}
                        <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                      </View>
                      <View style={styles.productBody}>
                        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.productUnit}>{item.unit}</Text>
                        <View style={styles.priceLine}>
                          <Text style={styles.productPrice}>₹{item.price}</Text>
                          {item.compareAt ? <Text style={styles.compareAt}>₹{item.compareAt}</Text> : null}
                        </View>
                      </View>
                    </Pressable>
                    <View style={styles.exploreProductAdd}>
                      <AddControl
                        qty={cart[item.id] ?? 0}
                        onInc={() => ((cart[item.id] ?? 0) > 0 ? onSetQty(item.id, (cart[item.id] ?? 0) + 1) : onAdd(item.id))}
                        onDec={() => onSetQty(item.id, (cart[item.id] ?? 0) - 1)}
                        label={item.name}
                      />
                    </View>
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

function AddControl({ qty, onInc, onDec, label }: { qty: number; onInc: () => void; onDec: () => void; label: string }) {
  if (qty <= 0) {
    return (
      <TouchableOpacity style={styles.addBtn} onPress={onInc} accessibilityRole="button" accessibilityLabel={`Add ${label}`}>
        <Text style={styles.addBtnText}>ADD</Text>
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

const LISTING_RAIL = [
  { id: 'all', label: 'All', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png') },
  { id: 'vegetables', label: 'Fresh Vegetables', image: require('../../../assets/Category_PNGs/03_fruits_vegetables.png') },
  { id: 'fruits', label: 'Fresh Fruits', image: require('../../../assets/shop/cat-lemon.png') },
  { id: 'leafy', label: 'Leafy Greens', image: require('../../../assets/shop/cat-spinach.png') },
  { id: 'dairy', label: 'Fresh Dairy', image: require('../../../assets/Category_PNGs/05_fresh_dairy.png') },
  { id: 'rice', label: 'Atta, Rice & Pulses', image: require('../../../assets/Category_PNGs/18_rice_rice_products.png') },
  { id: 'oils', label: 'Oils, Masala & Spices', image: require('../../../assets/Category_PNGs/13_edible_oils.png') },
  { id: 'canned', label: 'Packaged Foods', image: require('../../../assets/Category_PNGs/10_canned_imported_items.png') },
  { id: 'drinks', label: 'Beverages', image: require('../../../assets/Category_PNGs/14_beverages_mixers.png') },
  { id: 'chicken', label: 'Meat & Seafood', image: require('../../../assets/Category_PNGs/08_chicken_eggs.png') },
  { id: 'packaging', label: 'Packaging', image: require('../../../assets/Category_PNGs/04_packaging_material.png') },
  { id: 'butter', label: 'Butter & Cheese', image: require('../../../assets/Category_PNGs/06_butter_cheese_more.png') },
  { id: 'spices', label: 'Masala & Sugar', image: require('../../../assets/Category_PNGs/07_masala_salt_sugar.png') },
  { id: 'sauces', label: 'Sauces', image: require('../../../assets/Category_PNGs/09_sauces_seasoning.png') },
  { id: 'frozen', label: 'Frozen Food', image: require('../../../assets/Category_PNGs/12_frozen_instant_food.png') },
] as const;

const SEARCH_HINT: Record<string, string> = {
  all: 'Search products...',
  vegetables: 'Search vegetables, leafy greens...',
  fruits: 'Search fruits...',
  leafy: 'Search leafy greens...',
  dairy: 'Search milk, paneer, cheese...',
  butter: 'Search milk, paneer, cheese...',
  rice: 'Search atta, rice, pulses...',
  oils: 'Search oils, masala, spices...',
  spices: 'Search oils, masala, spices...',
  sauces: 'Search sauces...',
  canned: 'Search packaged foods...',
  drinks: 'Search beverages...',
  chicken: 'Search meat and seafood...',
};

const ALL_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF4F18" stroke-width="1.8"><rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8"/></svg>';
const SORT_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h9M4 12h6M4 17h4"/><path d="M17 5v14M17 5l-2.2 2.2M17 5l2.2 2.2M17 19l-2.2-2.2M17 19l2.2-2.2"/></svg>';

function savingPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

function listingTitle(id: string) {
  return LISTING_RAIL.find((item) => item.id === id)?.label ?? 'Category';
}

function ListingScreen({
  filter,
  onFilter,
  city,
  mode,
  onMode,
  onDeliver,
  cart,
  cartCount,
  saved,
  onToggleSaved,
  onOpenCart,
  onOpen,
  onAdd,
  onSetQty,
  tab,
  onTab,
  onHome,
}: {
  filter: string;
  onFilter: (id: string) => void;
  city: string;
  mode: 'standard' | 'express';
  onMode: (mode: 'standard' | 'express') => void;
  onDeliver?: () => void;
  cart: Record<string, number>;
  cartCount: number;
  saved: Record<string, boolean>;
  onToggleSaved: (id: string) => void;
  onOpenCart: () => void;
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
  onSetQty: (id: string, qty: number) => void;
  tab: ShopTab;
  onTab: (tab: ShopTab) => void;
  onHome: () => void;
}) {
  const { width } = useWindowDimensions();
  const rail = useRef<ScrollView>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'featured' | 'low' | 'high' | 'name'>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const items = productsFor(filter)
    .filter((item) => !q || item.name.toLowerCase().includes(q) || item.unit.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  const title = listingTitle(filter);
  useEffect(() => {
    const index = LISTING_RAIL.findIndex((item) => item.id === filter);
    if (index >= 0) rail.current?.scrollTo({ y: Math.max(0, index * 98 - 24), animated: true });
  }, [filter]);
  return (
    <View style={[styles.screen, Platform.OS === 'web' ? { height: '100%', overflow: 'hidden' } : null, width > 600 ? { width: 480, alignSelf: 'center' } : null]}>
      <View style={[styles.shopHead, { paddingTop: Platform.OS === 'web' ? 12 : 46 }]}>
        <View style={styles.shopBrand}>
          <TouchableOpacity onPress={onHome} accessibilityRole="button" accessibilityLabel="KitchenX home">
            <Image source={require('../../../assets/kitchenx-logo-trimmed.png')} style={styles.shopLogo} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeliver} accessibilityRole="button" accessibilityLabel={`Deliver to ${city}`} style={styles.shopLoc}>
            <Icon svg={PIN} size={16} />
            <View style={styles.shopLocCopy}>
              <Text style={styles.shopLocLabel}>Deliver to</Text>
              <Text style={styles.shopLocCity} numberOfLines={1}>{city} ▾</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenCart} accessibilityRole="button" accessibilityLabel="Cart" style={styles.cartBtn}>
            <Icon svg={CART_LINE} size={24} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99' : cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={[styles.search, styles.listSearch]}>
          <Icon svg={SEARCH} size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={SEARCH_HINT[filter] ?? 'Search products...'}
            placeholderTextColor="#9AA0A6"
            style={styles.searchInput}
            testID="list-search"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => {
              if (Platform.OS === 'web' && typeof document !== 'undefined') {
                const node = document.querySelector('[data-testid="list-search"]') as { focus?: () => void } | null;
                node?.focus?.();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Scan or search by image"
          >
            <Icon svg={SCAN} size={22} />
          </Pressable>
        </View>
      </View>
      <View style={styles.shopBody}>
        <ScrollView ref={rail} style={styles.rail} contentContainerStyle={styles.railContent} showsVerticalScrollIndicator={false}>
          {LISTING_RAIL.map((item) => {
            const on = filter === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setQuery('');
                  onFilter(item.id);
                }}
                style={[styles.railItem, on && styles.railItemOn]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={item.label}
              >
                <View style={[styles.railIcon, on && styles.railIconOn]}>
                  {item.id === 'all' ? <Icon svg={ALL_ICON} size={26} /> : <Image source={item.image} style={styles.railPhoto} resizeMode="contain" />}
                </View>
                <Text style={[styles.railLabel, on && styles.railLabelOn]} numberOfLines={2}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.shopList}>
          <View style={styles.listHead}>
            <View style={styles.listHeadCopy}>
              <Text style={styles.listTitle}>{title}</Text>
              <Text style={styles.listCount}>{items.length} {items.length === 1 ? 'product' : 'products'}</Text>
            </View>
            <Pressable onPress={() => setSortOpen((open) => !open)} style={styles.sortBtn} accessibilityRole="button" accessibilityLabel="Sort products">
              <Icon svg={SORT_ICON} size={16} />
              <Text style={styles.sortText}>Sort</Text>
            </Pressable>
          </View>
          {sortOpen ? (
            <View style={styles.sortMenu}>
              {([
                ['featured', 'Catalogue order'],
                ['low', 'Price: low to high'],
                ['high', 'Price: high to low'],
                ['name', 'Name'],
              ] as const).map(([id, label]) => (
                <Pressable
                  key={id}
                  onPress={() => {
                    setSort(id);
                    setSortOpen(false);
                  }}
                  style={styles.sortOption}
                  accessibilityRole="button"
                  accessibilityState={{ selected: sort === id }}
                >
                  <Text style={[styles.sortOptionText, sort === id && styles.sortOptionOn]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <ScrollView style={styles.shopListScroll} contentContainerStyle={styles.shopListContent} showsVerticalScrollIndicator={false}>
          <View style={styles.productGrid}>
            {items.map((item) => {
              const qty = cart[item.id] ?? 0;
              const off = savingPercent(item.price, item.compareAt);
              return (
                <View key={item.id} style={styles.gridCell}>
                  <View style={styles.productCard}>
                    <View style={styles.productPhoto}>
                      <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={item.name} style={styles.productHit}>
                        <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                      </Pressable>
                      {off > 0 ? (
                        <View style={styles.offBadge}>
                          <Text style={styles.offBadgeText}>{off}% OFF</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.productBody}>
                      {item.minutes ? (
                        <View style={styles.minuteRow}>
                          <Icon svg={glyph('<circle cx="12" cy="12" r="7"/><path d="M12 8.5V12l2.4 1.5"/>', MUTED)} size={12} />
                          <Text style={styles.minuteText}>{item.minutes} MINS</Text>
                        </View>
                      ) : null}
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productUnit}>{item.unit}</Text>
                      <View style={styles.priceLine}>
                        <Text style={styles.productPrice}>₹{item.price}</Text>
                        {item.compareAt ? <Text style={styles.compareAt}>₹{item.compareAt}</Text> : null}
                      </View>
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          onPress={() => onToggleSaved(item.id)}
                          accessibilityRole="button"
                          accessibilityLabel={saved[item.id] ? `Remove ${item.name} from list` : `Save ${item.name}`}
                          style={styles.cardHeart}
                        >
                          <Icon svg={saved[item.id] ? HEART_ON : HEART} size={20} />
                        </TouchableOpacity>
                        <View style={styles.cardAdd}>
                          <AddControl label={item.name} qty={qty} onDec={() => onSetQty(item.id, qty - 1)} onInc={() => onAdd(item.id)} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          {!items.length ? <Text style={styles.emptyCopy}>No priced products are in this category yet.</Text> : null}
          </ScrollView>
        </View>
      </View>
      <TabBar tab={tab} onTab={onTab} />
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
  onSetQty,
  city,
  mode,
  onMode,
  onDeliver,
  cart,
  saved,
  onToggleSaved,
  tab,
  onTab,
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
  onSetQty: (id: string, qty: number) => void;
  city: string;
  mode: 'standard' | 'express';
  onMode: (mode: 'standard' | 'express') => void;
  onDeliver?: () => void;
  cart: Record<string, number>;
  saved: Record<string, boolean>;
  onToggleSaved: (id: string) => void;
  tab: ShopTab;
  onTab: (tab: ShopTab) => void;
}) {
  if (!browse) {
    return (
      <ListingScreen
        filter={filter}
        onFilter={onFilter}
        city={city}
        mode={mode}
        onMode={onMode}
        onDeliver={onDeliver}
        cart={cart}
        cartCount={cartCount}
        saved={saved}
        onToggleSaved={onToggleSaved}
        onOpenCart={onOpenCart}
        onOpen={onOpen}
        onAdd={onAdd}
        onSetQty={onSetQty}
        tab={tab}
        onTab={onTab}
        onHome={onBack}
      />
    );
  }
  const items = productsFor(filter);
  const chips = ['all', 'vegetables', 'fruits', 'leafy', 'fresh'];
  const known = CATEGORIES.find((item) => item.id === filter);
  const title = browse
    ? 'Categories'
    : filter === 'all'
      ? 'All products'
      : filter === 'fresh'
        ? 'Fresh picks'
        : filter === 'household'
          ? 'Household & Personal Care'
          : filter === 'packaging'
            ? 'Packaging'
            : filter === 'butter'
              ? 'Butter & Cheese'
              : filter === 'sauces'
                ? 'Sauces'
                : filter === 'canned'
                  ? 'Canned & Imported'
                  : filter === 'frozen'
                    ? 'Frozen Food'
                    : (known?.label ?? 'Category');
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
      <TabBar tab={tab} onTab={onTab} />
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
        <Text style={styles.navTitle}>Starter</Text>
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
  const items: Array<{ id: ShopTab; label: string; icon: 'home' | 'explore' | 'lists' | 'orders' | 'account' }> = [
    { id: 'home', label: 'Shop', icon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'lists', label: 'Starter', icon: 'lists' },
    { id: 'orders', label: 'Orders', icon: 'orders' },
    { id: 'account', label: 'Account', icon: 'account' },
  ];
  return (
    <View style={[styles.tabs, { paddingBottom: Platform.OS === 'web' ? 10 : 22 }]}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} style={styles.tab} onPress={() => onTab(item.id)} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{ selected: tab === item.id }}>
          <Icon svg={tabSvg(item.icon, tab === item.id)} size={26} />
          <Text style={[styles.tabLabel, tab === item.id && styles.tabOn]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  homeScroll: { paddingBottom: 16 },
  homeScrollView: { flex: 1 },
  homeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
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
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E6E8EC',
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
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
    marginTop: 14,
    marginHorizontal: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E6EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
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
    marginTop: 6,
    marginHorizontal: 16,
    height: 54,
    borderRadius: 27,
    backgroundColor: FIELD,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
  },
  modePill: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 20,
    backgroundColor: INK,
  },
  modeBtn: { flex: 1, zIndex: 1, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  modeText: { fontSize: 14, fontWeight: '700', color: INK },
  modeTextOn: { color: '#FFFFFF' },
  deliveryTitle: { fontSize: 20, fontWeight: '800', color: INK },
  cartBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: { marginHorizontal: 16, marginTop: 16 },
  promoClip: { borderRadius: 18, overflow: 'hidden', backgroundColor: '#1F8F45', position: 'relative' },
  promoSlide: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...(Platform.OS === 'web' ? ({ transition: 'opacity 700ms ease-in-out' } as object) : {}),
  },
  promoImage: { width: '100%', height: 196 },
  shopNow: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    zIndex: 3,
    backgroundColor: '#141517',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shopNowText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  catHead: { fontSize: 22, fontWeight: '800', color: INK, paddingHorizontal: 16, marginTop: 18, marginBottom: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 11 },
  catCell: { width: '33.33%', maxWidth: '33.33%', paddingHorizontal: 5, paddingBottom: 10 },
  catTile: { width: '100%', borderWidth: 1, borderColor: '#E6E8EC', borderRadius: 16, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  catPhoto: { height: 92, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  catPhotoImage: { width: '100%', height: '100%', transform: [{ scale: 1.16 }] },
  catFoot: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 8, gap: 4, minHeight: 46 },
  catFootLabel: { flex: 1, fontSize: 13, lineHeight: 16, fontWeight: '700', color: INK },
  catChevron: { color: '#98A2B3', fontSize: 18, lineHeight: 18 },
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
  shopHead: { paddingHorizontal: 0, backgroundColor: '#FFFFFF' },
  shopBrand: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  shopLogo: { width: 104, height: 20 },
  shopLoc: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  shopLocCopy: { flexShrink: 1, minWidth: 0 },
  shopLocLabel: { fontSize: 10, lineHeight: 12, color: MUTED, fontWeight: '500' },
  shopLocCity: { fontSize: 12, lineHeight: 15, fontWeight: '700', color: INK },
  listSearch: { marginTop: 10 },
  shopBody: { flex: 1, flexDirection: 'row', minHeight: 0 },
  rail: { width: 88, maxWidth: 88, flexGrow: 0, flexShrink: 0, overflow: 'hidden', backgroundColor: '#FAFBFC', borderRightWidth: 1, borderRightColor: '#F0F1F3' },
  railContent: { paddingVertical: 6, paddingBottom: 16 },
  railItem: { width: 88, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  railItemOn: { borderLeftColor: ORANGE },
  railIcon: { width: 56, height: 56, borderRadius: 14, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  railIconOn: { borderColor: ORANGE, borderWidth: 1.5 },
  railPhoto: { width: 48, height: 48 },
  railLabel: { width: 76, marginTop: 6, fontSize: 11, lineHeight: 13, fontWeight: '600', color: '#667085', textAlign: 'center' },
  railLabelOn: { color: ORANGE, fontWeight: '800' },
  shopList: { flex: 1, minWidth: 0 },
  shopListScroll: { flex: 1 },
  shopListContent: { paddingHorizontal: 6, paddingBottom: 16 },
  listHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4 },
  listHeadCopy: { flex: 1, minWidth: 0 },
  listTitle: { fontSize: 18, fontWeight: '800', color: INK },
  listCount: { marginTop: 2, fontSize: 12, color: MUTED },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4, paddingVertical: 6 },
  sortText: { color: '#667085', fontWeight: '700', fontSize: 13 },
  sortMenu: { borderWidth: 1, borderColor: '#EFEFF2', borderRadius: 12, marginBottom: 8, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  sortOption: { paddingHorizontal: 12, paddingVertical: 10 },
  sortOptionText: { color: INK, fontSize: 13, fontWeight: '600' },
  sortOptionOn: { color: ORANGE, fontWeight: '800' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridCell: { width: '50%', padding: 6 },
  productCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)' } as object,
      default: { shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
    }),
  },
  productPhoto: { width: '100%', height: 96, position: 'relative', backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productHit: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  productImage: { width: '92%', height: '92%' },
  offBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: ORANGE, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  offBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  minuteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  minuteText: { color: MUTED, fontSize: 11, fontWeight: '700' },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 8 },
  productBody: { flex: 1, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  cardHeart: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' },
  cardAdd: { flex: 1 },
  productName: { fontSize: 13, lineHeight: 16, fontWeight: '800', color: INK, minHeight: 32 },
  productUnit: { marginTop: 2, fontSize: 11, color: MUTED },
  productPrice: { color: INK, fontWeight: '800', fontSize: 15 },
  compareAt: { color: '#98A2B3', fontSize: 12, fontWeight: '600', textDecorationLine: 'line-through' },
  exploreTitle: { fontSize: 22, fontWeight: '800', color: INK, paddingHorizontal: 16, marginTop: 14 },
  exploreSub: { fontSize: 13, color: MUTED, paddingHorizontal: 16, marginTop: 2, marginBottom: 12 },
  exploreHeroCard: { marginHorizontal: 16, borderRadius: 18, backgroundColor: '#FFF1E4', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', minHeight: 156 },
  exploreHeroCopy: { flex: 1, paddingLeft: 16, paddingVertical: 14, paddingRight: 4, zIndex: 1 },
  exploreHeroOff: { color: ORANGE, fontSize: 20, lineHeight: 24, fontWeight: '800' },
  exploreHeroName: { marginTop: 2, color: INK, fontSize: 17, lineHeight: 21, fontWeight: '800' },
  exploreHeroLine: { marginTop: 4, color: MUTED, fontSize: 11, lineHeight: 14, fontWeight: '600' },
  exploreHeroBtn: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: '#141517', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7 },
  exploreHeroArt: { width: 156, height: 156, position: 'relative' },
  exploreHeroOil: { position: 'absolute', right: -8, top: 6, width: 72, height: 120 },
  exploreHeroDairy: { position: 'absolute', right: 28, bottom: 4, width: 86, height: 96 },
  exploreHeroVeg: { position: 'absolute', left: -4, bottom: 0, width: 108, height: 108 },
  exploreCatGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  exploreCatCell: { width: '25%', maxWidth: '25%', paddingHorizontal: 4, paddingBottom: 12, alignItems: 'center' },
  exploreCatPhoto: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#F4F5F7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  exploreCatImage: { width: 72, height: 72 },
  exploreCatLabel: { marginTop: 6, fontSize: 11, lineHeight: 14, fontWeight: '700', color: INK, textAlign: 'center' },
  exploreSplit: { flexDirection: 'row', paddingHorizontal: 11 },
  exploreSplitCard: { width: '50%', paddingHorizontal: 5 },
  exploreSplitFace: { height: 148, borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#F7F4F0' },
  exploreSplitImage: { width: '100%', height: '100%' },
  exploreOfferRow: { flexDirection: 'row', paddingHorizontal: 11 },
  exploreOfferCell: { width: '33.33%', maxWidth: '33.33%', paddingHorizontal: 5, marginBottom: 8 },
  exploreOfferFace: { height: 118, borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: '#F7F4F0' },
  exploreOfferImage: { width: '100%', height: '100%' },
  exploreShade: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: 'rgba(20, 21, 23, 0.45)', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  exploreShadeOff: { color: '#FFFFFF', fontSize: 11, lineHeight: 14, fontWeight: '800' },
  exploreShadeTitle: { color: '#FFFFFF', fontSize: 11, lineHeight: 14, fontWeight: '700' },
  exploreIndex: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  exploreIndexText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  exploreBrandCell: { width: '25%', maxWidth: '25%', paddingHorizontal: 4, paddingBottom: 12, alignItems: 'center' },
  exploreBrandMark: { width: '100%', height: 64, borderRadius: 12, borderWidth: 1, borderColor: '#E6E8EC', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  exploreBrandWord: { fontSize: 10, lineHeight: 13, fontWeight: '800', textAlign: 'center' },
  exploreBrandCount: { marginTop: 4, fontSize: 10, lineHeight: 13, color: MUTED, textAlign: 'center' },
  exploreFeatured: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, backgroundColor: '#9B1B30', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', minHeight: 96 },
  exploreFeaturedCopy: { flex: 1, paddingVertical: 16, paddingLeft: 16, paddingRight: 8 },
  exploreFeaturedName: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  exploreFeaturedLine: { marginTop: 4, color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  exploreFeaturedPhoto: { width: 132, height: 96 },
  exploreHScroll: { paddingHorizontal: 16, paddingBottom: 8 },
  exploreBrandCard: { width: 148, marginRight: 10, borderWidth: 1, borderColor: '#E6E8EC', borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFFFFF', paddingBottom: 8 },
  exploreBrandCardPhoto: { width: '100%', height: 84, backgroundColor: '#F7F4F0' },
  exploreBrandCardWord: { marginTop: 8, paddingHorizontal: 8 },
  exploreCuisineCell: { width: '25%', maxWidth: '25%', paddingHorizontal: 5, alignItems: 'center' },
  exploreCuisineImage: { width: '100%', height: 78, borderRadius: 16 },
  exploreProduct: { width: 148, marginRight: 10, borderRadius: 12, backgroundColor: '#FFFFFF', overflow: 'hidden', borderWidth: 1, borderColor: '#E6E8EC' },
  exploreProductAdd: { paddingHorizontal: 10, paddingBottom: 10 },
  exploreProductPhoto: { width: '100%', height: 96, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bannerList: { paddingTop: 8 },
  promoBanner: { width: '100%', aspectRatio: 724 / 272, marginBottom: 12, borderRadius: 16 },
  menuScrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(17, 17, 20, 0.28)', zIndex: 20 },
  menuSheet: { width: 240, backgroundColor: '#FFFFFF', paddingTop: 18, paddingBottom: 12, height: '100%', zIndex: 2 },
  menuTitle: { fontSize: 18, fontWeight: '800', color: INK, paddingHorizontal: 16, marginBottom: 8 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
  menuLabel: { fontSize: 16, fontWeight: '600', color: INK },
});
