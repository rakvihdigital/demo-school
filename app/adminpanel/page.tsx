'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Interfaces for E-Commerce Data
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  rating: number;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  icon: string;
  status: 'Active' | 'Inactive';
}

interface SubCategoryItem {
  id: string;
  name: string;
  parentCategory: string;
  itemCount: number;
  status: 'Active' | 'Inactive';
}

interface SubSubCategoryItem {
  id: string;
  name: string;
  parentSubCategory: string;
  parentCategory: string;
  itemCount: number;
  status: 'Active' | 'Inactive';
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minPurchase: number;
  validTill: string;
  usageCount: number;
  status: 'Active' | 'Expired';
}

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  itemsCount: number;
  items?: { name: string; sku: string; qty: number; price: number }[];
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface PosCartItem {
  product: Product;
  quantity: number;
}

interface PosTransaction {
  id: string;
  receiptNo: string;
  date: string;
  cashier: string;
  customer: string;
  itemsCount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  items: { name: string; qty: number; price: number }[];
}

interface EcommerceVideo {
  id: string;
  title: string;
  productName: string;
  duration: string;
  views: number;
  thumbnail: string;
  videoUrl: string;
  dateAdded: string;
}

export default function EcommerceAdminPanel() {
  const router = useRouter();

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab and Dropdown States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-product' | 'product-list' | 'category' | 'sub-category' | 'sub-sub-category' | 'coupons' | 'orders' | 'pos-terminal' | 'pos-history' | 'videos' | 'reports'>('dashboard');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p-1',
      name: 'Wireless Noise-Cancelling Headphones Pro',
      sku: 'WNC-HP-01',
      barcode: '8901234567890',
      category: 'Electronics',
      subCategory: 'Audio & Sound',
      price: 14999,
      stock: 45,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      rating: 4.8,
    },
    {
      id: 'p-2',
      name: 'Ultra Slim Smartwatch Series 7',
      sku: 'SMRT-WT-07',
      barcode: '8909876543211',
      category: 'Wearables',
      subCategory: 'Smartwatches',
      price: 21999,
      stock: 8,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      rating: 4.6,
    },
    {
      id: 'p-3',
      name: 'Ergonomic Mechanical Keyboard RGB',
      sku: 'MEC-KB-99',
      barcode: '8904561237894',
      category: 'Computing',
      subCategory: 'Keyboards & Mice',
      price: 7499,
      stock: 62,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      rating: 4.9,
    },
    {
      id: 'p-4',
      name: 'Minimalist Matte Leather Backpack',
      sku: 'LTHR-BP-04',
      barcode: '8907894561230',
      category: 'Fashion & Bags',
      subCategory: 'Backpacks',
      price: 4999,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
      rating: 4.5,
    },
  ]);

  // Product Modals & Forms
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Barcode Modals
  const [isGenerateBarcodeModalOpen, setIsGenerateBarcodeModalOpen] = useState(false);
  const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);
  const [barcodeGenStatus, setBarcodeGenStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [barcodePrintStatus, setBarcodePrintStatus] = useState<'idle' | 'printing' | 'success'>('idle');
  const [activeBarcodeProduct, setActiveBarcodeProduct] = useState<Product | null>(null);

  const [isMultiProductModalOpen, setIsMultiProductModalOpen] = useState(false);
  const [multiProductInput, setMultiProductInput] = useState('');

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdSubCategory, setNewProdSubCategory] = useState('Audio & Sound');
  const [newProdSubSubCategory, setNewProdSubSubCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Categories Hierarchy State
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'c-1', name: 'Electronics', slug: 'electronics', itemCount: 124, icon: '⚡', status: 'Active' },
    { id: 'c-2', name: 'Wearables', slug: 'wearables', itemCount: 48, icon: '⌚', status: 'Active' },
    { id: 'c-3', name: 'Computing', slug: 'computing', itemCount: 86, icon: '💻', status: 'Active' },
    { id: 'c-4', name: 'Fashion & Bags', slug: 'fashion-bags', itemCount: 210, icon: '👜', status: 'Active' },
    { id: 'c-5', name: 'Home & Kitchen', slug: 'home-kitchen', itemCount: 95, icon: '☕', status: 'Inactive' },
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');

  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([
    { id: 'sc-1', name: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 42, status: 'Active' },
    { id: 'sc-2', name: 'Smartphones', parentCategory: 'Electronics', itemCount: 60, status: 'Active' },
    { id: 'sc-3', name: 'Smartwatches', parentCategory: 'Wearables', itemCount: 28, status: 'Active' },
    { id: 'sc-4', name: 'Fitness Bands', parentCategory: 'Wearables', itemCount: 20, status: 'Active' },
    { id: 'sc-5', name: 'Keyboards & Mice', parentCategory: 'Computing', itemCount: 35, status: 'Active' },
    { id: 'sc-6', name: 'Backpacks', parentCategory: 'Fashion & Bags', itemCount: 85, status: 'Active' },
  ]);
  const [newSubCatName, setNewSubCatName] = useState('');
  const [newSubCatParent, setNewSubCatParent] = useState('Electronics');

  const [subSubCategories, setSubSubCategories] = useState<SubSubCategoryItem[]>([
    { id: 'ssc-1', name: 'Over-Ear Headphones', parentSubCategory: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 18, status: 'Active' },
    { id: 'ssc-2', name: 'In-Ear TWS Earbuds', parentSubCategory: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 24, status: 'Active' },
    { id: 'ssc-3', name: 'Mechanical RGB Keyboards', parentSubCategory: 'Keyboards & Mice', parentCategory: 'Computing', itemCount: 15, status: 'Active' },
    { id: 'ssc-4', name: 'Waterproof Laptop Backpacks', parentSubCategory: 'Backpacks', parentCategory: 'Fashion & Bags', itemCount: 32, status: 'Active' },
  ]);
  const [newSubSubCatName, setNewSubSubCatName] = useState('');
  const [newSubSubCatSubParent, setNewSubSubCatSubParent] = useState('Audio & Sound');
  const [newSubSubCatParent, setNewSubSubCatParent] = useState('Electronics');

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 'cp-1', code: 'MEGAFEST20', discountType: 'Percentage', discountValue: 20, minPurchase: 1999, validTill: '2026-09-30', usageCount: 142, status: 'Active' },
    { id: 'cp-2', code: 'WELCOME500', discountType: 'Fixed', discountValue: 500, minPurchase: 2500, validTill: '2026-12-31', usageCount: 389, status: 'Active' },
    { id: 'cp-3', code: 'EARLYBIRD', discountType: 'Percentage', discountValue: 15, minPurchase: 999, validTill: '2026-08-15', usageCount: 65, status: 'Expired' },
  ]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponMin, setNewCouponMin] = useState('1000');
  const [newCouponDate, setNewCouponDate] = useState('2026-10-31');

  // Orders State
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ord-101', orderNumber: 'ORD-98214', customerName: 'Aarav Mehta', email: 'aarav.m@example.com', date: '2026-08-26', total: 14999, itemsCount: 1, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }], paymentMethod: 'UPI', paymentStatus: 'Paid', orderStatus: 'Processing' },
    { id: 'ord-102', orderNumber: 'ORD-98213', customerName: 'Priya Sundaram', email: 'priya.s@example.com', date: '2026-08-25', total: 29498, itemsCount: 2, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }, { name: 'Logitech MX Master 3', sku: 'LGT-MX3', qty: 1, price: 14499 }], paymentMethod: 'Credit Card', paymentStatus: 'Paid', orderStatus: 'Shipped' },
    { id: 'ord-103', orderNumber: 'ORD-98212', customerName: 'Vikram Joshi', email: 'v.joshi@example.com', date: '2026-08-25', total: 4999, itemsCount: 1, items: [{ name: 'Minimalist Matte Leather Backpack', sku: 'LTHR-BP-04', qty: 1, price: 4999 }], paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Processing' },
    { id: 'ord-104', orderNumber: 'ORD-98211', customerName: 'Ananya Roy', email: 'ananya.roy@example.com', date: '2026-08-24', total: 21999, itemsCount: 1, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }, { name: 'Logitech MX Master 3', sku: 'LGT-MX3', qty: 1, price: 7000 }], paymentMethod: 'Net Banking', paymentStatus: 'Paid', orderStatus: 'Delivered' },
  ]);
  const [selectedOrderForView, setSelectedOrderForView] = useState<OrderItem | null>(null);

  // POS State
  const [posCart, setPosCart] = useState<PosCartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 1 },
  ]);
  const [posSearchTerm, setPosSearchTerm] = useState('');
  const [posCustomerName, setPosCustomerName] = useState('Walk-in Customer');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [posReceiptModal, setPosReceiptModal] = useState<PosTransaction | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeTx, setExchangeTx] = useState<PosTransaction | null>(null);
  const [posManualTotal, setPosManualTotal] = useState<string>('');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerFormName, setNewCustomerFormName] = useState('');

  const [posHistory, setPosHistory] = useState<PosTransaction[]>([
    {
      id: 'tx-1',
      receiptNo: 'REC-2026-8091',
      date: '2026-08-26 03:45 PM',
      cashier: 'John Cashier (Reg #01)',
      customer: 'Siddharth Rao',
      itemsCount: 2,
      total: 22498,
      paymentMethod: 'UPI',
      items: [
        { name: 'Wireless Headphones Pro', qty: 1, price: 14999 },
        { name: 'Ergonomic Keyboard RGB', qty: 1, price: 7499 },
      ],
    },
    {
      id: 'tx-2',
      receiptNo: 'REC-2026-8090',
      date: '2026-08-26 01:15 PM',
      cashier: 'Sarah Jenkins (Reg #02)',
      customer: 'Walk-in Customer',
      itemsCount: 1,
      total: 21999,
      paymentMethod: 'Card',
      items: [
        { name: 'Ultra Slim Smartwatch Series 7', qty: 1, price: 21999 },
      ],
    },
    {
      id: 'tx-3',
      receiptNo: 'REC-2026-8089',
      date: '2026-08-25 06:20 PM',
      cashier: 'John Cashier (Reg #01)',
      customer: 'Rahul Nair',
      itemsCount: 1,
      total: 4999,
      paymentMethod: 'Cash',
      items: [
        { name: 'Minimalist Matte Leather Backpack', qty: 1, price: 4999 },
      ],
    },
  ]);

  // Videos State
  const [videos, setVideos] = useState<EcommerceVideo[]>([
    {
      id: 'vid-1',
      title: 'Unboxing & Sound Test: Wireless Headphones Pro',
      productName: 'Wireless Noise-Cancelling Headphones Pro',
      duration: '01:45',
      views: 12450,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-20',
    },
    {
      id: 'vid-2',
      title: 'Water Resistance & Fitness Tracking Test',
      productName: 'Ultra Slim Smartwatch Series 7',
      duration: '00:58',
      views: 8930,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-18',
    },
    {
      id: 'vid-3',
      title: 'Mechanical Switch Sound Profile & Typing ASMR',
      productName: 'Ergonomic Mechanical Keyboard RGB',
      duration: '02:15',
      views: 24100,
      thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-10',
    },
  ]);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidProduct, setNewVidProduct] = useState('Wireless Noise-Cancelling Headphones Pro');
  const [newVidDuration, setNewVidDuration] = useState('01:30');
  const [newVidThumbnail, setNewVidThumbnail] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400');

  // Helper Functions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const prod: Product = {
      id: `p-${Date.now()}`,
      name: newProdName,
      sku: newProdSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: newProdBarcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: newProdCategory,
      subCategory: newProdSubCategory,
      subSubCategory: newProdSubSubCategory,
      price: parseFloat(newProdPrice),
      stock: parseInt(newProdStock) || 10,
      status: parseInt(newProdStock) > 10 ? 'In Stock' : parseInt(newProdStock) > 0 ? 'Low Stock' : 'Out of Stock',
      image: newProdImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400',
      rating: 5.0,
    };
    setProducts([prod, ...products]);
    setNewProdName('');
    setNewProdSku('');
    setNewProdBarcode('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdImage('');
    setActiveTab('product-list');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleTriggerScanner = (product?: Product) => {
    setIsScannerModalOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedProduct(product || products[0]);
    }, 1500);
  };

  const handleBulkAddSubmit = () => {
    if (!multiProductInput.trim()) return;
    const lines = multiProductInput.split('\n');
    const newItems: Product[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        newItems.push({
          id: `p-bulk-${Date.now()}-${idx}`,
          name: parts[0].trim(),
          sku: parts[1]?.trim() || `BULK-${idx + 100}`,
          barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          category: parts[2]?.trim() || 'Electronics',
          subCategory: 'General',
          price: parseFloat(parts[3]?.trim()) || 999,
          stock: parseInt(parts[4]?.trim()) || 25,
          status: 'In Stock',
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400',
          rating: 4.5,
        });
      }
    });
    if (newItems.length > 0) {
      setProducts([...newItems, ...products]);
      setMultiProductInput('');
      setIsMultiProductModalOpen(false);
    }
  };

  const handleSaveProductEdit = () => {
    if (!currentEditProduct) return;
    setProducts(products.map((p) => (p.id === currentEditProduct.id ? currentEditProduct : p)));
    setIsEditProductModalOpen(false);
    setCurrentEditProduct(null);
  };

  // POS Helper Functions
  const addToPosCart = (product: Product) => {
    const existing = posCart.find((item) => item.product.id === product.id);
    if (existing) {
      setPosCart(
        posCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setPosCart([...posCart, { product, quantity: 1 }]);
    }
  };

  const updatePosQty = (productId: string, delta: number) => {
    setPosCart(
      posCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[]
    );
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const posTax = Math.round(posSubtotal * 0.18);
  const posCalculatedTotal = posSubtotal + posTax;
  const posTotal = posManualTotal !== '' ? parseFloat(posManualTotal) || 0 : posCalculatedTotal;

  const handleCompletePosOrder = () => {
    if (posCart.length === 0) return;
    const newTx: PosTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      cashier: 'Admin POS Terminal #01',
      customer: posCustomerName,
      itemsCount: posCart.reduce((acc, cur) => acc + cur.quantity, 0),
      total: posTotal,
      paymentMethod: posPaymentMethod,
      items: posCart.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
      })),
    };
    setPosHistory([newTx, ...posHistory]);
    setPosReceiptModal(newTx);
    setPosCart([]);
  };

  // Login handler
  const handleLogin = () => {
    if (loginEmail === 'shop@admin.com' && loginPassword === 'shop123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 antialiased"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20 mb-5">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Demo Hub</h1>
            <p className="text-[13px] text-[#86868b] font-semibold mt-1">E-Commerce Admin Control Suite</p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#e5e5ea] rounded-[32px] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1d1d1f] mb-6">Sign in to Admin Panel</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="shop@admin.com"
                  className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold placeholder:text-[#c7c7cc]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••"
                  className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold placeholder:text-[#c7c7cc]"
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-[13px] font-bold bg-red-50 px-4 py-2.5 rounded-xl">{loginError}</p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[14px] rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>

            {/* Credentials Hint */}
            <div
              onClick={() => {
                setLoginEmail('shop@admin.com');
                setLoginPassword('shop123');
                setLoginError('');
              }}
              className="mt-6 p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-transparent hover:border-[#ea580c]/30 rounded-2xl cursor-pointer transition-all group"
            >
              <p className="text-[11px] font-extrabold text-[#86868b] group-hover:text-[#ea580c] uppercase tracking-wider mb-2 transition-colors">Demo Credentials</p>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#6e6e73]">Email: <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c]">shop@admin.com</span></p>
                <p className="text-[13px] font-semibold text-[#6e6e73]">Password: <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c]">shop123</span></p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-[13px] font-bold text-[#86868b] hover:text-[#ea580c] transition-colors"
            >
              ← Back to Portal Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex antialiased selection:bg-orange-100 selection:text-[#ea580c]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation - Clean Inline, No Section Titles */}
      <aside className={`w-[280px] min-w-[280px] bg-white border-r border-[#e5e5ea] flex flex-col justify-between h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-transform duration-300 ${isMobileSidebarOpen ? 'fixed top-0 bottom-0 left-0 translate-x-0' : 'fixed top-0 bottom-0 left-0 -translate-x-full md:translate-x-0 md:sticky md:top-0'
        }`}>
        <div className="space-y-2 overflow-y-auto px-4 pt-8 pb-4 custom-scrollbar">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center pb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20 mb-3 transform hover:scale-105 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#1d1d1f]">Commerce Hub</h2>
            <p className="text-[10px] text-[#86868b] mt-0.5 font-extrabold uppercase tracking-[0.2em]">
              Admin Control Suite
            </p>
          </div>

          <nav className="space-y-1 text-[14px]">
            {/* Dashboard */}
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all duration-300 flex justify-between items-center ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg></span>
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Products Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg></span>
                  <span>Products</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isProductsDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  <button
                    onClick={() => { setActiveTab('add-product'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === 'add-product'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></span>
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('product-list'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center justify-between ${activeTab === 'product-list'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg></span>
                      <span>Product List</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'product-list' ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{products.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg></span>
                  <span>Categories</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isCategoriesDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  {[
                    { id: 'category', label: 'Category', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
                    { id: 'sub-category', label: 'Sub Category', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /><path d="M2 10h20" /></svg> },
                    { id: 'sub-sub-category', label: 'Sub Sub Categories', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setIsMobileSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                        : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                        }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center opacity-70">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Coupons */}
            <button
              onClick={() => { setActiveTab('coupons'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'coupons'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg></span>
                <span>Coupons</span>
              </div>
              {activeTab === 'coupons' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg></span>
                <span>Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#fff2e8] text-[#ea580c]'}`}>{orders.length}</span>
            </button>

            {/* POS Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsPosDropdownOpen(!isPosDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg></span>
                  <span>POS Terminal</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isPosDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isPosDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  <button
                    onClick={() => { setActiveTab('pos-terminal'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === 'pos-terminal'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg></span>
                    <span>Live Register</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('pos-history'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center justify-between ${activeTab === 'pos-history'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></span>
                      <span>POS History</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'pos-history' ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{posHistory.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Videos */}
            <button
              onClick={() => { setActiveTab('videos'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'videos'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg></span>
                <span>Videos & Reels</span>
              </div>
              {activeTab === 'videos' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'reports'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg></span>
                <span>Reports</span>
              </div>
              {activeTab === 'reports' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Exit */}
        <div className="p-4 border-t border-[#e5e5ea] bg-white">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full py-3 px-4 bg-white hover:bg-[#fff2e8] text-[#ea580c] font-bold rounded-full text-[13px] transition-all text-center border border-[#e5e5ea] hover:border-[#ea580c] flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Log Out Securely</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 pt-16 md:pt-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="fixed top-4 left-4 z-20 md:hidden w-10 h-10 bg-white border border-[#e5e5ea] rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileSidebarOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Header Breadcrumb */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5e5ea]">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-1">
                <span>E-Commerce</span>
                <span>/</span>
                <span className="text-[#ea580c] capitalize">{activeTab.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1d1d1f] capitalize">
                {activeTab === 'dashboard'
                  ? 'Commerce Overview'
                  : activeTab === 'pos-terminal'
                    ? 'POS Cash Register'
                    : activeTab === 'reports'
                      ? 'Reports & Analytics'
                      : activeTab.replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white border border-[#e5e5ea] text-[#1d1d1f] rounded-full text-[13px] font-bold shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Store Live
              </span>
              {/* Only show Quick Scan for Products and POS */}
              {(activeTab === 'product-list' || activeTab === 'pos-terminal') && (
                <button
                  onClick={() => handleTriggerScanner()}
                  className="px-5 py-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-[13px] rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg></span>
                  <span>Quick Scan</span>
                </button>
              )}
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 1. DASHBOARD TAB */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: '₹4,82,450', sub: '+18.4% this month', color: 'text-[#10b981]', icon: '💰' },
                  { label: 'Active Orders', value: orders.length.toString(), sub: '4 require dispatch', color: 'text-[#ea580c]', icon: '📦' },
                  { label: 'Total Products', value: products.length.toString(), sub: 'Across 5 categories', color: 'text-[#1d1d1f]', icon: '🏷️' },
                  { label: 'Low Stock Alerts', value: products.filter(p => p.stock < 10).length.toString(), sub: 'Restock recommended', color: 'text-[#ef4444]', icon: '⚠️' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e5e5ea] p-7 rounded-[32px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider">{stat.label}</p>
                      <span className="text-xl p-2 bg-[#f5f5f7] rounded-xl">{stat.icon}</span>
                    </div>
                    <p className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                    <p className="text-[12px] text-[#6e6e73] font-semibold mt-2">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-white border border-[#e5e5ea] rounded-[36px] p-8 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-[#ea580c] text-[13px] font-bold hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-[#ea580c] text-[13px]">{ord.orderNumber}</span>
                            <span className="text-[#86868b]">•</span>
                            <span className="font-bold text-[#1d1d1f] text-[14px]">{ord.customerName}</span>
                          </div>
                          <p className="text-[12px] text-[#6e6e73] font-semibold mt-1">
                            {ord.itemsCount} item(s) via {ord.paymentMethod}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-[#1d1d1f] text-[15px]">₹{ord.total.toLocaleString()}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Catalog Actions */}
                <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 space-y-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-4">Quick Operations</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('add-product')}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">➕</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Add Single Product
                            </span>
                            <span className="text-[11px] text-[#86868b]">New inventory item form</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('product-list');
                          setIsMultiProductModalOpen(true);
                        }}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📑</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Bulk Multi-Product Add
                            </span>
                            <span className="text-[11px] text-[#86868b]">Import multiple items</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('pos-terminal')}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🖥️</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Open POS Terminal
                            </span>
                            <span className="text-[11px] text-[#86868b]">In-store checkout & receipt</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50/60 border border-orange-200/60 rounded-2xl text-center">
                    <p className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">Coupon Discount Active</p>
                    <p className="text-[13px] font-black text-[#1d1d1f] mt-0.5">MEGAFEST20 (20% OFF)</p>
                  </div>
                </div>
              </div>

              {/* Sales Performance Chart */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Sales Performance</h3>
                    <p className="text-[13px] text-[#86868b] font-semibold mt-1">Revenue over the last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-extrabold text-[#ea580c] uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black text-[#1d1d1f]">₹4,82,450</p>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-2 px-2 mt-4">
                  {[45, 60, 35, 80, 50, 95, 75].map((h, i) => (
                    <div key={i} className="w-full bg-[#f5f5f7] rounded-t-xl relative group h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#ea580c] to-[#f97316] rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[11px] font-extrabold text-[#86868b] uppercase tracking-wider px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ADD PRODUCT TAB */}
          {/* ========================================================================= */}
          {activeTab === 'add-product' && (
            <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 md:p-10 shadow-sm w-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e5e5ea]">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">Add New Product</h3>
                  <p className="text-[14px] text-[#6e6e73] font-medium mt-1">
                    Fill in the details below to publish an item to the e-commerce inventory.
                  </p>
                </div>
                <button
                  onClick={() => setIsMultiProductModalOpen(true)}
                  className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] rounded-full text-[12px] font-extrabold border border-[#e5e5ea] transition-all"
                >
                  ⚡ Bulk Add Multiple
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Wireless Noise-Cancelling Headphones"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2 flex justify-between">
                      <span>SKU Code</span>
                      <button
                        type="button"
                        onClick={() => setNewProdSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`)}
                        className="text-[#ea580c] hover:underline font-bold text-[11px]"
                      >
                        Auto-Generate
                      </button>
                    </label>
                    <input
                      type="text"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      placeholder="e.g. WNC-HP-01"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transitioion-all font-semibold font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Category *
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Sub Category
                    </label>
                    <select
                      value={newProdSubCategory}
                      onChange={(e) => setNewProdSubCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      {subCategories
                        .filter((sc) => sc.parentCategory === newProdCategory)
                        .map((sc) => (
                          <option key={sc.id} value={sc.name}>
                            {sc.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Sub-Sub-Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Sub Sub Category
                    </label>
                    <select
                      value={newProdSubSubCategory}
                      onChange={(e) => setNewProdSubSubCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      <option value="">None</option>
                      {subSubCategories
                        .filter((ssc) => ssc.parentSubCategory === newProdSubCategory)
                        .map((ssc) => (
                          <option key={ssc.id} value={ssc.name}>
                            {ssc.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 14999"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] 
