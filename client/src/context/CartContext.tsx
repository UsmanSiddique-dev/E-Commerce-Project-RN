import {
  createContext,
  ReactNode,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product, WishlistContextType } from "../../constants/types";
import { dummyCart } from "@/assets/assets";
export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, SetIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const fetchcart = async () => {
    SetIsLoading(true);
    const serverCart = dummyCart;
    const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
      id: item.product_id,
      productId: item.product_id,
      product: item.product,
      quantity: item.quantity,
      size: item?.size || "M",
      price: item.price,
    }));
    setCartItems(mappedItems);
    setCartTotal(serverCart.totalAmount);
    SetIsLoading(false);
  };
  const addToCart = async (product: Product, size: string) => {};
  const removeFromCart = async (Productid: string, size: string) => {};
  const updateQuantity = async (
    productid: string,
    quantity: number,
    size: string = "M",
  ) => {};
  const clearCart = async () => {};
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    fetchcart();
  }, []);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("Cart Context must be used within a Wishlist Provider");
  }
  return context;
}
