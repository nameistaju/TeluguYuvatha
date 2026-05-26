import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color?: string;
  sku?: string;
}

export interface AppliedCoupon {
  code: string;
  label?: string;
  discount: number;
}

interface CartState {
  items: CartItem[];
  coupon?: AppliedCoupon;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  payableTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(
          (i) => i.productId === item.productId && i.size === item.size && (i.color ?? "") === (item.color ?? "")
        );
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      applyCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: undefined }),
      clearCart: () => set({ items: [], coupon: undefined }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      payableTotal: () => Math.max(0, get().totalPrice() - (get().coupon?.discount ?? 0)),
    }),
    {
      name: 'ty-cart-storage',
    }
  )
);
