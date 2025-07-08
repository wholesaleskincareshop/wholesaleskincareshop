import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      addToCart: (id: string) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          } else {
            return { cart: [...state.cart, { id, quantity: 1 }] };
          }
        }),
      removeFromCart: (id: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }), // Clear all items from the cart
      toggleCart: (isOpen?: boolean) =>
        set((state) => ({
          cartOpen: isOpen !== undefined ? isOpen : !state.cartOpen,
        })),
    }),
    { name: "cart-storage" }
  )
);

export const useCartCount = () =>
  useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

export default useCartStore;
