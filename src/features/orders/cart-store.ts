import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SelectedVariant {
  groupName: string;
  optionName: string;
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string;
  menuId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  selectedVariants: SelectedVariant[];
  notes?: string;
}

export interface SelectedTable {
  id: string;
  number: string;
  capacity: number;
}

interface CartState {
  restaurantSlug: string | null;
  restaurantName: string | null;
  selectedTable: SelectedTable | null;
  items: CartItem[];

  // Actions
  setRestaurant: (slug: string, name: string) => void;
  selectTable: (table: SelectedTable | null) => void;
  addItem: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      restaurantName: null,
      selectedTable: null,
      items: [],

      setRestaurant: (slug, name) => {
        const currentSlug = get().restaurantSlug;
        if (currentSlug && currentSlug !== slug) {
          // If switching to a different restaurant, reset cart
          set({
            restaurantSlug: slug,
            restaurantName: name,
            selectedTable: null,
            items: [],
          });
        } else {
          set({ restaurantSlug: slug, restaurantName: name });
        }
      },

      selectTable: (table) => {
        set({ selectedTable: table });
      },

      addItem: (item) => {
        const cartItemId = `${item.menuId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        set((state) => ({
          items: [...state.items, { ...item, cartItemId }],
        }));
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({
          restaurantSlug: null,
          restaurantName: null,
          selectedTable: null,
          items: [],
        });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.unitPrice * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "quickdine-cart-storage",
    }
  )
);
