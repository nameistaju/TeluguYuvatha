import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface WishlistState {
  productIds: string[];
  hydrated: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string, token?: string) => Promise<void>;
  syncFromServer: (token: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      hydrated: false,
      has: (productId) => get().productIds.includes(productId),
      toggle: async (productId, token) => {
        const exists = get().productIds.includes(productId);
        set({ productIds: exists ? get().productIds.filter((id) => id !== productId) : [...get().productIds, productId] });
        if (!token) return;
        if (exists) await api.delete(`/wishlist/items/${productId}`, { token });
        else await api.post(`/wishlist/items/${productId}`, {}, { token });
      },
      syncFromServer: async (token) => {
        const localIds = get().productIds;
        const remote = await api.get<{ productIds: string[] }>("/wishlist", { token });
        const merged = Array.from(new Set([...(remote.productIds ?? []), ...localIds]));
        for (const id of merged) {
          if (!remote.productIds?.includes(id)) await api.post(`/wishlist/items/${id}`, {}, { token });
        }
        set({ productIds: merged, hydrated: true });
      }
    }),
    {
      name: "ty-wishlist-storage"
    }
  )
);
