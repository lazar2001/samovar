"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { DEFAULT_CONFIG, sanitizeItem, type CartItem, type Config } from "@/lib/data";

const STORAGE_KEY = "sv-upit";

interface Store {
  cfg: Config;
  setCfg: (next: Config | ((c: Config) => Config)) => void;
  cart: CartItem[];
  addToCart: (c: Config) => void;
  changeQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore mora biti unutar <StoreProvider>");
  return ctx;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(raw)) {
        setCart(
          raw.flatMap((r) => {
            const c = sanitizeItem(r);
            return c ? [{ ...c, id: typeof r.id === "string" ? r.id : newId() }] : [];
          }),
        );
      }
    } catch {
      /* prazna korpa */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* skladište nedostupno */
    }
  }, [cart, loaded]);

  const addToCart = useCallback((c: Config) => {
    setCart((prev) => [...prev, { ...c, id: newId() }]);
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 3800);
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.min(20, Math.max(1, it.qty + delta)) } : it)));
  }, []);

  const removeItem = useCallback((id: string) => setCart((prev) => prev.filter((it) => it.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <StoreContext.Provider value={{ cfg, setCfg, cart, addToCart, changeQty, removeItem, clearCart, cartCount }}>
      {children}
      <div className="toast" role="status" aria-live="polite" hidden={!toast}>
        Dodato u upit. <a href="#upit">Pogledaj upit</a>
      </div>
    </StoreContext.Provider>
  );
}

export function CartButton() {
  const { cartCount } = useStore();
  return (
    <a className="btn sm cartbtn" href="#upit">
      Vaš upit <span className="n">{cartCount}</span>
    </a>
  );
}
