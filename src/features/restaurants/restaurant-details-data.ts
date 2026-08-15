export interface MenuItemOption {
  name: string;
  extraPrice: number;
}

export interface MenuItemOptionGroup {
  groupName: string;
  required: boolean;
  options: MenuItemOption[];
}

export interface MenuItemDetail {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  optionGroups?: MenuItemOptionGroup[];
}

export interface TableItemDetail {
  id: string;
  number: string;
  capacity: number;
  status: "vacant" | "locked" | "occupied" | "reserved";
  lockedMinutesLeft?: number;
}

export interface FullRestaurantDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  area: string;
  address: string;
  prepTime: string;
  priceRange: string;
  bannerUrl: string;
  description: string;
  whatsapp: string;
  tables: TableItemDetail[];
  categories: string[];
  menus: MenuItemDetail[];
}

const COMMON_DRINK_OPTIONS: MenuItemOptionGroup[] = [
  {
    groupName: "Suhu Minuman",
    required: true,
    options: [
      { name: "Dingin (Iced)", extraPrice: 0 },
      { name: "Panas (Hot)", extraPrice: 0 },
    ],
  },
  {
    groupName: "Level Gula",
    required: false,
    options: [
      { name: "Normal Sugar (100%)", extraPrice: 0 },
      { name: "Less Sugar (50%)", extraPrice: 0 },
      { name: "No Sugar (0%)", extraPrice: 0 },
    ],
  },
  {
    groupName: "Extra Topping",
    required: false,
    options: [
      { name: "Grass Jelly", extraPrice: 4000 },
      { name: "Boba Brown Sugar", extraPrice: 5000 },
      { name: "Extra Espresso Shot", extraPrice: 6000 },
    ],
  },
];

const COMMON_FOOD_OPTIONS: MenuItemOptionGroup[] = [
  {
    groupName: "Tingkat Kepedasan",
    required: true,
    options: [
      { name: "Tidak Pedas (Level 0)", extraPrice: 0 },
      { name: "Sedang (Level 1)", extraPrice: 0 },
      { name: "Pedas Mantap (Level 2)", extraPrice: 0 },
      { name: "Ekstra Pedas (Level 3)", extraPrice: 2000 },
    ],
  },
  {
    groupName: "Pilihan Nasi / Karbo",
    required: false,
    options: [
      { name: "Nasi Putih Pulen", extraPrice: 0 },
      { name: "Nasi Uduk Gurih", extraPrice: 4000 },
      { name: "French Fries", extraPrice: 8000 },
    ],
  },
];

export const RESTAURANT_DETAILS: Record<string, FullRestaurantDetail> = {
  "kopi-kenangan-senopati": {
    id: "resto-1",
    name: "Kopi Kenangan Senopati",
    slug: "kopi-kenangan-senopati",
    category: "Coffee & Cafe",
    rating: 4.8,
    reviewsCount: 142,
    distanceKm: 0.8,
    area: "Senopati, Jaksel",
    address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan",
    prepTime: "10-15 mnt",
    priceRange: "Rp25k - Rp50k",
    bannerUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    description: "Kafe kopi artisan dengan suasana modern di kawasan Senopati. Menyajikan racikan kopi lokal premium dan hidangan ringan.",
    whatsapp: "081288991001",
    tables: [
      { id: "t1", number: "01", capacity: 2, status: "vacant" },
      { id: "t2", number: "02", capacity: 4, status: "vacant" },
      { id: "t3", number: "03", capacity: 2, status: "locked", lockedMinutesLeft: 7 },
      { id: "t4", number: "04", capacity: 4, status: "vacant" },
      { id: "t5", number: "05", capacity: 6, status: "occupied" },
      { id: "t6", number: "06", capacity: 2, status: "vacant" },
      { id: "t7", number: "07", capacity: 4, status: "vacant" },
      { id: "t8", number: "08", capacity: 6, status: "reserved" },
    ],
    categories: ["Semua", "Kopi Signature", "Non-Kopi", "Roti & Toast", "Camilan"],
    menus: [
      {
        id: "m1",
        category: "Kopi Signature",
        name: "Kopi Kenangan Mantan",
        price: 19000,
        description: "Espresso premium berpadu susu segar dan gula aren asli Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
        optionGroups: COMMON_DRINK_OPTIONS,
      },
      {
        id: "m2",
        category: "Kopi Signature",
        name: "Avocado Coffee Float",
        price: 28000,
        description: "Jus alpukat kental dengan single shot espresso dan es krim vanilla lembut.",
        imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
        optionGroups: COMMON_DRINK_OPTIONS,
      },
      {
        id: "m3",
        category: "Non-Kopi",
        name: "Matcha Latte Kyoto",
        price: 24000,
        description: "Bubuk matcha asli Jepang dengan susu creamy dan sedikit pemanis alami.",
        imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80",
        optionGroups: COMMON_DRINK_OPTIONS,
      },
      {
        id: "m4",
        category: "Roti & Toast",
        name: "Smoked Beef & Cheese Toast",
        price: 29000,
        description: "Roti brioche renyah dengan isian daging asap premium, melted cheddar, dan saus mayo.",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
      },
      {
        id: "m5",
        category: "Camilan",
        name: "Truffle Fries with Aioli",
        price: 32000,
        description: "Kentang goreng renyah beraroma minyak truffle putih disajikan dengan saus garlic aioli.",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  "bakmi-gm-gi": {
    id: "resto-2",
    name: "Bakmi GM Grand Indonesia",
    slug: "bakmi-gm-gi",
    category: "Asian & Noodle",
    rating: 4.9,
    reviewsCount: 380,
    distanceKm: 1.5,
    area: "Thamrin, Jakpus",
    address: "Mall Grand Indonesia West Mall Lt. LG, Jl. M.H. Thamrin No. 1",
    prepTime: "12-18 mnt",
    priceRange: "Rp35k - Rp75k",
    bannerUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    description: "Legenda mi Indonesia dengan tekstur mi kenyal pipih khas dan pangsit goreng saus manis gurih legendaris.",
    whatsapp: "081288991002",
    tables: [
      { id: "t1", number: "01", capacity: 4, status: "vacant" },
      { id: "t2", number: "02", capacity: 2, status: "vacant" },
      { id: "t3", number: "03", capacity: 4, status: "occupied" },
      { id: "t4", number: "04", capacity: 6, status: "vacant" },
      { id: "t5", number: "05", capacity: 4, status: "locked", lockedMinutesLeft: 4 },
      { id: "t6", number: "06", capacity: 2, status: "occupied" },
    ],
    categories: ["Semua", "Bakmi Favorit", "Nasi & Rice Bowl", "Gorengan", "Minuman"],
    menus: [
      {
        id: "bgm1",
        category: "Bakmi Favorit",
        name: "Bakmi Spesial GM Pangsit Rebus",
        price: 39000,
        description: "Mi kenyal dengan topping ayam jamur gurih khas GM dan 2 pcs pangsit rebus lembut.",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "bgm2",
        category: "Gorengan",
        name: "Pangsit Goreng Isi 5 pcs",
        price: 24000,
        description: "Pangsit goreng renyah keemasan legendaris disajikan dengan saus merah asam manis gurih.",
        imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
      },
      {
        id: "bgm3",
        category: "Bakmi Favorit",
        name: "Bakmi Ayam Lada Hitam",
        price: 44000,
        description: "Mi kenyal disiram tumisan daging ayam empuk dengan saus lada hitam pedas gurih aromatik.",
        imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80",
        isSpicy: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "bgm4",
        category: "Minuman",
        name: "Es Teh Manis GM Jumbo",
        price: 12000,
        description: "Teh melati wangi khas disajikan dingin segar porsi besar.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
        optionGroups: COMMON_DRINK_OPTIONS,
      },
    ],
  },
  "holycow-senopati": {
    id: "resto-3",
    name: "Holycow! Steakhouse Senopati",
    slug: "holycow-senopati",
    category: "Steak & Grill",
    rating: 4.7,
    reviewsCount: 215,
    distanceKm: 1.2,
    area: "Senopati, Jaksel",
    address: "Jl. Ciranjang No. 6, Senopati, Kebayoran Baru, Jakarta Selatan",
    prepTime: "18-25 mnt",
    priceRange: "Rp95k - Rp250k",
    bannerUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    description: "Steakhouse wagyu legendaris dengan saus racikan khas, daging empuk juicy, dan kentang goreng renyah.",
    whatsapp: "081288991003",
    tables: [
      { id: "t1", number: "01", capacity: 4, status: "occupied" },
      { id: "t2", number: "02", capacity: 4, status: "occupied" },
      { id: "t3", number: "03", capacity: 6, status: "occupied" },
      { id: "t4", number: "04", capacity: 2, status: "occupied" },
    ],
    categories: ["Semua", "Prime Steak", "Wagyu Selection", "Sides & Drinks"],
    menus: [
      {
        id: "hc1",
        category: "Wagyu Selection",
        name: "Wagyu Rib Eye MB5 200g",
        price: 165000,
        description: "Daging rib eye wagyu marbling 5 dengan tingkat kematangan juicy, disajikan dengan buncis & kentang.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
      },
      {
        id: "hc2",
        category: "Prime Steak",
        name: "Prime Sirloin Steak 200g",
        price: 115000,
        description: "Potongan sirloin Australia empuk dengan aroma panggangan arang yang harum.",
        imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
      },
    ],
  },
  "pagi-sore-kemang": {
    id: "resto-4",
    name: "Pagi Sore Padang Premium Kemang",
    slug: "pagi-sore-kemang",
    category: "Family Resto",
    rating: 4.9,
    reviewsCount: 520,
    distanceKm: 2.3,
    area: "Kemang, Jaksel",
    address: "Jl. Kemang Raya No. 12A, Bangka, Mampang Prapatan, Jakarta Selatan",
    prepTime: "5-10 mnt",
    priceRange: "Rp50k - Rp150k",
    bannerUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    description: "Restoran Minang premium dengan bumbu rempah otentik khas Palembang & Bukittinggi. Ayam pop legendaris dan rendang lembut.",
    whatsapp: "081288991004",
    tables: [
      { id: "t1", number: "01", capacity: 4, status: "vacant" },
      { id: "t2", number: "02", capacity: 6, status: "vacant" },
      { id: "t3", number: "03", capacity: 8, status: "vacant" },
      { id: "t4", number: "04", capacity: 4, status: "vacant" },
      { id: "t5", number: "05", capacity: 4, status: "occupied" },
      { id: "t6", number: "06", capacity: 6, status: "vacant" },
    ],
    categories: ["Semua", "Lauk Utama", "Sayur & Sambal", "Minuman Tradisional"],
    menus: [
      {
        id: "ps1",
        category: "Lauk Utama",
        name: "Ayam Pop Gurih Spesial",
        price: 28000,
        description: "Ayam kampung muda empuk dimasak air kelapa disajikan dengan sambal tomat merah hangat.",
        imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
      },
      {
        id: "ps2",
        category: "Lauk Utama",
        name: "Rendang Daging Sapi Pagi Sore",
        price: 33000,
        description: "Potongan daging sapi empuk dimasak perlahan dengan santan kental dan rempah hitam harum.",
        imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
        isSpicy: true,
      },
      {
        id: "ps3",
        category: "Sayur & Sambal",
        name: "Gulai Daun Singkong & Sambal Ijo",
        price: 18000,
        description: "Pucuk daun singkong muda dalam kuah gulai santan gurih dilengkapi sambal cabai hijau teri.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
};

// Fallback generator for other restaurants
export function getRestaurantDetail(slug: string): FullRestaurantDetail {
  if (RESTAURANT_DETAILS[slug]) {
    return RESTAURANT_DETAILS[slug];
  }

  // Default fallback object
  const formattedName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: `resto-${slug}`,
    name: formattedName,
    slug: slug,
    category: "Restoran & Kafe",
    rating: 4.8,
    reviewsCount: 150,
    distanceKm: 1.8,
    area: "Jakarta Selatan",
    address: `Jl. Utama Kuliner No. 88, ${formattedName}, Jakarta`,
    prepTime: "15-20 mnt",
    priceRange: "Rp40k - Rp120k",
    bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    description: `Nikmati hidangan lezat dan tempat santap nyaman di ${formattedName}. Reservasi meja live tanpa antre.`,
    whatsapp: "081299001122",
    tables: [
      { id: "t1", number: "01", capacity: 2, status: "vacant" },
      { id: "t2", number: "02", capacity: 4, status: "vacant" },
      { id: "t3", number: "03", capacity: 4, status: "vacant" },
      { id: "t4", number: "04", capacity: 6, status: "occupied" },
      { id: "t5", number: "05", capacity: 2, status: "locked", lockedMinutesLeft: 5 },
      { id: "t6", number: "06", capacity: 4, status: "vacant" },
    ],
    categories: ["Semua", "Menu Utama", "Camilan", "Minuman"],
    menus: [
      {
        id: "def1",
        category: "Menu Utama",
        name: `Special Dish of ${formattedName}`,
        price: 45000,
        description: "Hidangan signature lezat dengan bumbu racikan rahasia koki profesional.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        isPopular: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "def2",
        category: "Minuman",
        name: "Fresh Signature Drink",
        price: 22000,
        description: "Minuman segar dingin pendamping santap makan nikmat.",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
        optionGroups: COMMON_DRINK_OPTIONS,
      },
    ],
  };
}
