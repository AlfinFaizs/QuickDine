// src/features/menu/menu-data.ts
// Tipe data dan dataset master menu resto mendukung multiple galeri foto hidangan

export type MenuCategory =
  | "Semua"
  | "Makanan Utama"
  | "Sate & Panggang"
  | "Minuman"
  | "Camilan";

export interface MenuVariantOption {
  name: string;
  extraPrice: number;
}

export interface MenuVariantGroup {
  id: string;
  name: string; // e.g. "Level Pedas", "Pilihan Suhu", "Tambahan Topping"
  type: "single" | "multiple";
  required: boolean;
  options: MenuVariantOption[];
}

export interface DashboardMenuItem {
  id: string;
  name: string;
  category: "Makanan Utama" | "Sate & Panggang" | "Minuman" | "Camilan";
  price: number;
  prepTimeMinutes: number;
  description: string;
  imageUrl: string; // Foto cover utama
  imageUrls: string[]; // Galeri multi-foto (1-5 foto)
  isAvailable: boolean; // Out-of-stock toggle state
  variants: MenuVariantGroup[];
}

export const INITIAL_MENU_ITEMS: DashboardMenuItem[] = [
  {
    id: "menu-1",
    name: "Sate Ayam Madura (10 Tusuk)",
    category: "Sate & Panggang",
    price: 45000,
    prepTimeMinutes: 15,
    description: "Daging ayam pilihan dengan bumbu kacang lembut gurih dan kecap manis khas.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [
      {
        id: "v-pedas",
        name: "Level Pedas",
        type: "single",
        required: true,
        options: [
          { name: "Tidak Pedas", extraPrice: 0 },
          { name: "Sedang (Cabai 2)", extraPrice: 0 },
          { name: "Pedas (Cabai 5)", extraPrice: 0 },
        ],
      },
      {
        id: "v-topping",
        name: "Tambahan Karbo",
        type: "single",
        required: false,
        options: [
          { name: "Lontong", extraPrice: 6000 },
          { name: "Nasi Putih", extraPrice: 7000 },
        ],
      },
    ],
  },
  {
    id: "menu-2",
    name: "Sate Kambing Campur Lemak",
    category: "Sate & Panggang",
    price: 65000,
    prepTimeMinutes: 18,
    description: "Daging kambing muda empuk tanpa aroma prengus dengan cocolan bumbu kecap bawang tomat.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [
      {
        id: "v-bumbu",
        name: "Pilihan Bumbu",
        type: "single",
        required: true,
        options: [
          { name: "Bumbu Kecap Pedas", extraPrice: 0 },
          { name: "Bumbu Kacang Gurih", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu-3",
    name: "Nasi Goreng Spesial Babat",
    category: "Makanan Utama",
    price: 55000,
    prepTimeMinutes: 12,
    description: "Nasi goreng bumbu rempah tradisional dengan potongan babat sapi empuk dan telur mata sapi.",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [
      {
        id: "v-telur",
        name: "Kematangan Telur",
        type: "single",
        required: true,
        options: [
          { name: "Setengah Matang", extraPrice: 0 },
          { name: "Matang Sempurna", extraPrice: 0 },
        ],
      },
      {
        id: "v-extra",
        name: "Ekstra Topping",
        type: "multiple",
        required: false,
        options: [
          { name: "Acar & Kerupuk Ekstra", extraPrice: 3000 },
          { name: "Telur Dadar Ekstra", extraPrice: 8000 },
        ],
      },
    ],
  },
  {
    id: "menu-4",
    name: "Tahu Telur Bumbu Petis",
    category: "Makanan Utama",
    price: 38000,
    prepTimeMinutes: 10,
    description: "Dadar tahu telur renyah disiram saus petis udang gurih manis dan taburan tauge kacang.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: false,
    variants: [
      {
        id: "v-pedas",
        name: "Level Cabai Petis",
        type: "single",
        required: true,
        options: [
          { name: "Tidak Pedas", extraPrice: 0 },
          { name: "Pedas Sedang", extraPrice: 0 },
          { name: "Sangat Pedas", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu-5",
    name: "Es Cendol Durian Segar",
    category: "Minuman",
    price: 28000,
    prepTimeMinutes: 5,
    description: "Cendol tepung beras kenyal dengan santan segar, gula aren organik, dan daging buah durian asli.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [
      {
        id: "v-gula",
        name: "Tingkat Kemanisan Gula Aren",
        type: "single",
        required: true,
        options: [
          { name: "Normal Sweet", extraPrice: 0 },
          { name: "Less Sweet (50%)", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu-6",
    name: "Es Teh Manis Melati",
    category: "Minuman",
    price: 10000,
    prepTimeMinutes: 3,
    description: "Seduhan teh melati wangi dengan es batu kristal dan gula cair tebu murni.",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [
      {
        id: "v-suhu",
        name: "Penyajian",
        type: "single",
        required: true,
        options: [
          { name: "Dingin (Es Kristal)", extraPrice: 0 },
          { name: "Hangat", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu-7",
    name: "Bakwan Jagung Renyah (3 Pcs)",
    category: "Camilan",
    price: 22000,
    prepTimeMinutes: 8,
    description: "Bakwan jagung manis renyah dengan bumbu bawang putih dan cabai rawit hijau utuh.",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    ],
    isAvailable: true,
    variants: [],
  },
];
