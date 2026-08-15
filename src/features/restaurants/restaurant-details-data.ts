// src/features/restaurants/restaurant-details-data.ts
// Dataset detail restoran, kategori, opsi varian, dan galeri multi-foto hidangan

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
  imageUrls?: string[]; // Galeri multi-foto hidangan
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
];

const COMMON_FOOD_OPTIONS: MenuItemOptionGroup[] = [
  {
    groupName: "Tingkat Kepedasan",
    required: true,
    options: [
      { name: "Tidak Pedas (Level 0)", extraPrice: 0 },
      { name: "Sedang (Level 1)", extraPrice: 0 },
      { name: "Pedas Mantap (Level 2)", extraPrice: 0 },
    ],
  },
  {
    groupName: "Pilihan Karbo",
    required: false,
    options: [
      { name: "Lontong Daun", extraPrice: 6000 },
      { name: "Nasi Putih Pulen", extraPrice: 7000 },
    ],
  },
];

export const RESTAURANT_DETAILS: Record<string, FullRestaurantDetail> = {
  "sate-khas-senayan-pakubuwono": {
    id: "resto-sks",
    name: "Sate Khas Senayan Pakubuwono",
    slug: "sate-khas-senayan-pakubuwono",
    category: "Indonesian Satay",
    rating: 4.9,
    reviewsCount: 320,
    distanceKm: 0.5,
    area: "Kebayoran Baru, Jaksel",
    address: "Jl. Pakubuwono VI No. 10, Kebayoran Baru, Jakarta Selatan",
    prepTime: "10-15 mnt",
    priceRange: "Rp35k - Rp90k",
    bannerUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    description: "Pelopor sate premium Indonesia dengan bumbu kacang lembut gurih dan kecap manis warisan nusantara.",
    whatsapp: "081234567890",
    tables: [
      { id: "t1", number: "01", capacity: 4, status: "vacant" },
      { id: "t2", number: "02", capacity: 2, status: "vacant" },
      { id: "t3", number: "03", capacity: 4, status: "occupied" },
      { id: "t4", number: "04", capacity: 6, status: "vacant" },
      { id: "t5", number: "05", capacity: 4, status: "locked", lockedMinutesLeft: 6 },
      { id: "t6", number: "06", capacity: 2, status: "vacant" },
      { id: "t7", number: "07", capacity: 8, status: "vacant" },
      { id: "t8", number: "08", capacity: 4, status: "vacant" },
    ],
    categories: ["Semua", "Sate & Panggang", "Makanan Utama", "Minuman", "Camilan"],
    menus: [
      {
        id: "sks-1",
        category: "Sate & Panggang",
        name: "Sate Ayam Madura (10 Tusuk)",
        price: 45000,
        description: "Daging ayam pilihan dengan bumbu kacang lembut gurih dan kecap manis khas.",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80",
        ],
        isPopular: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "sks-2",
        category: "Sate & Panggang",
        name: "Sate Kambing Campur Lemak",
        price: 65000,
        description: "Daging kambing muda empuk tanpa aroma prengus dengan cocolan bumbu kecap bawang tomat.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        ],
        isPopular: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "sks-3",
        category: "Makanan Utama",
        name: "Nasi Goreng Spesial Babat",
        price: 55000,
        description: "Nasi goreng bumbu rempah tradisional dengan potongan babat sapi empuk dan telur mata sapi.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        ],
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "sks-4",
        category: "Minuman",
        name: "Es Cendol Durian Segar",
        price: 28000,
        description: "Cendol tepung beras kenyal dengan santan segar, gula aren organik, dan daging buah durian asli.",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80",
        ],
        optionGroups: COMMON_DRINK_OPTIONS,
      },
    ],
  },
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
    description: "Kafe kopi artisan dengan suasana modern di kawasan Senopati.",
    whatsapp: "081288991001",
    tables: [
      { id: "t1", number: "01", capacity: 2, status: "vacant" },
      { id: "t2", number: "02", capacity: 4, status: "vacant" },
      { id: "t3", number: "03", capacity: 2, status: "locked", lockedMinutesLeft: 7 },
      { id: "t4", number: "04", capacity: 4, status: "vacant" },
    ],
    categories: ["Semua", "Kopi Signature", "Non-Kopi", "Roti & Toast", "Camilan"],
    menus: [
      {
        id: "m1",
        category: "Kopi Signature",
        name: "Kopi Kenangan Mantan",
        price: 19000,
        description: "Espresso premium berpadu susu segar dan gula aren asli Indonesia.",
        imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",
        ],
        isPopular: true,
        optionGroups: COMMON_DRINK_OPTIONS,
      },
      {
        id: "m2",
        category: "Roti & Toast",
        name: "Smoked Beef & Cheese Toast",
        price: 29000,
        description: "Roti brioche renyah dengan isian daging asap premium dan keju cheddar.",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        ],
        isPopular: true,
      },
    ],
  },
};

// Fallback generator for other restaurants
export function getRestaurantDetail(slug: string): FullRestaurantDetail {
  if (RESTAURANT_DETAILS[slug]) {
    return RESTAURANT_DETAILS[slug];
  }

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
    area: "Jakarta",
    address: `Jl. Utama Kuliner No. 88, ${formattedName}`,
    prepTime: "15-20 mnt",
    priceRange: "Rp40k - Rp120k",
    bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    description: `Nikmati hidangan lezat dan tempat santap nyaman di ${formattedName}.`,
    whatsapp: "081299001122",
    tables: [
      { id: "t1", number: "01", capacity: 2, status: "vacant" },
      { id: "t2", number: "02", capacity: 4, status: "vacant" },
      { id: "t3", number: "03", capacity: 4, status: "vacant" },
      { id: "t4", number: "04", capacity: 6, status: "occupied" },
    ],
    categories: ["Semua", "Menu Utama", "Minuman"],
    menus: [
      {
        id: "def1",
        category: "Menu Utama",
        name: `Signature Dish ${formattedName}`,
        price: 45000,
        description: "Hidangan lezat dengan bumbu racikan rahasia koki profesional.",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        ],
        isPopular: true,
        optionGroups: COMMON_FOOD_OPTIONS,
      },
      {
        id: "def2",
        category: "Minuman",
        name: "Minuman Segar Pilihan",
        price: 18000,
        description: "Minuman dingin segar pendamping santap makan nikmat.",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
        ],
        optionGroups: COMMON_DRINK_OPTIONS,
      },
    ],
  };
}
