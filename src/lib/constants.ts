export const SITE_NAME = "DAWDI CAFE";
export const SITE_TAGLINE = "Coffee for the Road";
export const SITE_DESCRIPTION = "Premium coffee, crêpes, snacks and quality drinks in Morocco. Fresh, fast, and friendly service.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dawdicafe.com";
export const PHONE = "+212 656480972";
export const EMAIL = "contact@dawdicafe.com";
export const ADDRESS = "Morocco";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/z2hZuQ2UtCsZoZDGA";
export const INSTAGRAM_URL = "https://www.instagram.com/cafe_dawdi/";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const WORKING_HOURS = {
  weekdays: "8:00 AM - 11:00 PM",
  weekends: "9:00 AM - 12:00 AM",
};

export const FEATURES = [
  {
    title: "Premium Coffee",
    description: "Expertly sourced and roasted beans for the perfect cup",
    icon: "Coffee",
  },
  {
    title: "Fresh Drinks",
    description: "Refreshing juices, smoothies, and milkshakes made to order",
    icon: "CupSoda",
  },
  {
    title: "Delicious Crêpes",
    description: "Sweet and savory crêpes crafted with premium ingredients",
    icon: "ChefHat",
  },
  {
    title: "Fast Service",
    description: "Quick and efficient service without compromising quality",
    icon: "Zap",
  },
  {
    title: "Take Away",
    description: "Enjoy our products anywhere with convenient takeaway options",
    icon: "ShoppingBag",
  },
  {
    title: "Comfortable Place",
    description: "Cozy atmosphere perfect for work, meetups, or relaxation",
    icon: "Sofa",
  },
  {
    title: "Free WiFi",
    description: "Stay connected with complimentary high-speed internet",
    icon: "Wifi",
  },
];

export const MENU_CATEGORIES = [
  {
    name: "Espresso",
    items: [
      { name: "Espresso", description: "Rich and bold single shot", price: "15 MAD" },
      { name: "Double Espresso", description: "Double shot for extra kick", price: "20 MAD" },
      { name: "Espresso Macchiato", description: "Espresso with a dash of milk", price: "18 MAD" },
      { name: "Ristretto", description: "Shorter, sweeter espresso extraction", price: "16 MAD" },
    ],
  },
  {
    name: "Cappuccino",
    items: [
      { name: "Classic Cappuccino", description: "Equal parts espresso, milk, foam", price: "25 MAD" },
      { name: "Iced Cappuccino", description: "Chilled cappuccino for hot days", price: "28 MAD" },
      { name: "Caramel Cappuccino", description: "With caramel drizzle", price: "30 MAD" },
      { name: "Vanilla Cappuccino", description: "Infused with vanilla", price: "30 MAD" },
    ],
  },
  {
    name: "Latte",
    items: [
      { name: "Café Latte", description: "Smooth espresso with steamed milk", price: "25 MAD" },
      { name: "Vanilla Latte", description: "With vanilla syrup", price: "30 MAD" },
      { name: "Caramel Latte", description: "With caramel syrup", price: "30 MAD" },
      { name: "Hazelnut Latte", description: "With hazelnut syrup", price: "30 MAD" },
      { name: "Iced Latte", description: "Cold latte refreshment", price: "28 MAD" },
    ],
  },
  {
    name: "American Coffee",
    items: [
      { name: "Americano", description: "Espresso diluted with hot water", price: "20 MAD" },
      { name: "Long Black", description: "Similar to Americano, stronger", price: "22 MAD" },
      { name: "Iced Americano", description: "Chilled American coffee", price: "24 MAD" },
      { name: "Filter Coffee", description: "Slow-drip brewed coffee", price: "22 MAD" },
    ],
  },
  {
    name: "Tea",
    items: [
      { name: "Moroccan Mint Tea", description: "Traditional green tea with mint", price: "15 MAD" },
      { name: "English Breakfast", description: "Classic black tea", price: "18 MAD" },
      { name: "Green Tea", description: "Pure and refreshing", price: "15 MAD" },
      { name: "Chai Latte", description: "Spiced tea with milk", price: "25 MAD" },
      { name: "Iced Tea", description: "Refreshing cold tea", price: "20 MAD" },
    ],
  },
  {
    name: "Fresh Juice",
    items: [
      { name: "Orange Juice", description: "Freshly squeezed oranges", price: "22 MAD" },
      { name: "Lemon Mint", description: "Refreshing lemon with mint", price: "20 MAD" },
      { name: "Mixed Fruit", description: "Seasonal fruit blend", price: "28 MAD" },
      { name: "Watermelon Juice", description: "Fresh watermelon juice", price: "22 MAD" },
      { name: "Avocado Smoothie", description: "Creamy avocado drink", price: "30 MAD" },
    ],
  },
  {
    name: "Milkshake",
    items: [
      { name: "Chocolate Milkshake", description: "Rich chocolate delight", price: "32 MAD" },
      { name: "Vanilla Milkshake", description: "Classic vanilla shake", price: "30 MAD" },
      { name: "Strawberry Milkshake", description: "Fresh strawberry shake", price: "32 MAD" },
      { name: "Oreo Milkshake", description: "Cookies and cream", price: "35 MAD" },
    ],
  },
  {
    name: "Smoothies",
    items: [
      { name: "Tropical Smoothie", description: "Mango, pineapple, banana", price: "30 MAD" },
      { name: "Berry Blast", description: "Mixed berries smoothie", price: "32 MAD" },
      { name: "Green Detox", description: "Spinach, apple, ginger", price: "30 MAD" },
      { name: "Protein Smoothie", description: "Banana, protein, almond milk", price: "35 MAD" },
    ],
  },
  {
    name: "Crêpes",
    items: [
      { name: "Nutella Crêpe", description: "Classic Nutella filled crêpe", price: "35 MAD" },
      { name: "Banana Crêpe", description: "Fresh banana with chocolate", price: "38 MAD" },
      { name: "Oreo Crêpe", description: "Crushed Oreo with cream", price: "40 MAD" },
      { name: "Kinder Crêpe", description: "Kinder chocolate crêpe", price: "42 MAD" },
      { name: "Mixed Fruit Crêpe", description: "Seasonal fruits and cream", price: "40 MAD" },
      { name: "Salty Crêpe", description: "Cheese, egg, and herbs", price: "35 MAD" },
    ],
  },
  {
    name: "Pancakes",
    items: [
      { name: "Classic Pancakes", description: "Fluffy pancakes with syrup", price: "35 MAD" },
      { name: "Chocolate Pancakes", description: "With chocolate sauce", price: "40 MAD" },
      { name: "Fruit Pancakes", description: "Topped with fresh fruits", price: "42 MAD" },
      { name: "Nutella Pancakes", description: "Nutella filled pancakes", price: "45 MAD" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Cheesecake", description: "Creamy New York style", price: "35 MAD" },
      { name: "Chocolate Cake", description: "Rich chocolate layer cake", price: "32 MAD" },
      { name: "Tiramisu", description: "Classic Italian dessert", price: "38 MAD" },
      { name: "Baklava", description: "Traditional sweet pastry", price: "25 MAD" },
      { name: "Ice Cream", description: "Premium vanilla, chocolate, strawberry", price: "20 MAD" },
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Sara B.",
    avatar: "SB",
    rating: 5,
    text: "Best coffee in town! The Nutella crêpe is absolutely divine. The atmosphere is cozy and perfect for working.",
  },
  {
    name: "Ahmed M.",
    avatar: "AM",
    rating: 5,
    text: "Amazing service and quality. Their cappuccino is my morning ritual now. Highly recommended!",
  },
  {
    name: "Leila K.",
    avatar: "LK",
    rating: 5,
    text: "A hidden gem! The staff is incredibly friendly, and the crêpes are the best I've ever had outside of France.",
  },
  {
    name: "Youssef R.",
    avatar: "YR",
    rating: 4,
    text: "Great place to meet friends. The milkshakes are delicious and the free WiFi is a big plus.",
  },
  {
    name: "Fatima Z.",
    avatar: "FZ",
    rating: 5,
    text: "Love the modern vibe and the attention to detail. Every drink is made with care and passion.",
  },
  {
    name: "Omar H.",
    avatar: "OH",
    rating: 5,
    text: "The Oreo crêpe changed my life. No exaggeration. The place is always clean and welcoming.",
  },
];
