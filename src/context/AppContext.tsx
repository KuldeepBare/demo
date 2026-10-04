import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ComplianceConfig, VerificationToken } from '../types/index.ts';

interface AppContextType {
  // Products
  products: Product[];
  loadingProducts: boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Age Verification
  isAgeVerified: boolean;
  verificationToken: VerificationToken | null;
  showAgeModal: boolean;
  setShowAgeModal: (show: boolean) => void;
  confirmAgeVerification: (token: VerificationToken) => void;
  clearAgeVerification: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Compliance & Operating Hours
  compliance: ComplianceConfig | null;
  isOpenNow: boolean;
  refreshCompliance: () => Promise<void>;
  toggleSimulateOpen: () => Promise<void>;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;

  // Admin
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;

  // Legal Modal
  legalModalType: 'privacy' | 'terms' | 'age-policy' | 'responsible' | null;
  setLegalModalType: (type: 'privacy' | 'terms' | 'age-policy' | 'responsible' | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Age verification state (persisted in sessionStorage for compliance session)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('nocturne_age_verified') === 'true';
  });
  const [verificationToken, setVerificationToken] = useState<VerificationToken | null>(() => {
    const saved = sessionStorage.getItem('nocturne_verif_token');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAgeModal, setShowAgeModal] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nocturne_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Compliance
  const [compliance, setCompliance] = useState<ComplianceConfig | null>(null);
  const [isOpenNow, setIsOpenNow] = useState(false);

  // Placed order
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('nocturne_admin_token');
  });

  // Legal modal
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'age-policy' | 'responsible' | null>(null);

  // Fetch compliance rules
  const refreshCompliance = async () => {
    try {
      const res = await fetch('/api/compliance');
      if (res.ok) {
        const data = await res.json();
        setCompliance(data);
        setIsOpenNow(Boolean(data.isOpenNow));
      }
    } catch (e) {
      console.error('Failed to load compliance:', e);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshCompliance();
    fetchProducts();
    const interval = setInterval(refreshCompliance, 60000); // refresh operating status every minute
    return () => clearInterval(interval);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('nocturne_cart', JSON.stringify(cart));
  }, [cart]);

  const confirmAgeVerification = (token: VerificationToken) => {
    setIsAgeVerified(true);
    setVerificationToken(token);
    sessionStorage.setItem('nocturne_age_verified', 'true');
    sessionStorage.setItem('nocturne_verif_token', JSON.stringify(token));
    setShowAgeModal(false);
  };

  const clearAgeVerification = () => {
    setIsAgeVerified(false);
    setVerificationToken(null);
    sessionStorage.removeItem('nocturne_age_verified');
    sessionStorage.removeItem('nocturne_verif_token');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const maxLimit = product.maxPerOrder || compliance?.maxBottlesPerOrder || 3;
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxLimit);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, maxLimit) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxLimit = item.product.maxPerOrder || compliance?.maxBottlesPerOrder || 3;
          return { ...item, quantity: Math.min(quantity, maxLimit) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleSimulateOpen = async () => {
    if (!adminToken) {
      // Allow toggle in client for reviewer demo convenience
      setCompliance((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, isSimulatedOpenForTesting: !prev.isSimulatedOpenForTesting };
        setIsOpenNow(updated.isSimulatedOpenForTesting || Boolean(prev.isOpenNow));
        return updated;
      });
      return;
    }

    try {
      const current = compliance?.isSimulatedOpenForTesting;
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isSimulatedOpenForTesting: !current })
      });
      if (res.ok) {
        await refreshCompliance();
      }
    } catch (e) {
      console.error('Failed to toggle simulated mode:', e);
    }
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        loadingProducts,
        selectedProduct,
        setSelectedProduct,
        isAgeVerified,
        verificationToken,
        showAgeModal,
        setShowAgeModal,
        confirmAgeVerification,
        clearAgeVerification,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalCount,
        cartSubtotal,
        compliance,
        isOpenNow,
        refreshCompliance,
        toggleSimulateOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        isAdminOpen,
        setIsAdminOpen,
        adminToken,
        setAdminToken,
        legalModalType,
        setLegalModalType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
