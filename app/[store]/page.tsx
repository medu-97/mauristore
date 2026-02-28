'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../supabase'; // This is the bridge we built!
export default function PremiumStore() {
  const pathname = usePathname(); 
  const storeId = pathname.replace('/', '').toLowerCase(); 

  // New variables to hold our cloud data
  const [merchantData, setMerchantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  // The Engine: Fetch data from Supabase when the page loads
  useEffect(() => {
    async function fetchStore() {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single(); // Tells it to just grab the one specific store

      if (data) {
        setMerchantData(data);
      }
      setIsLoading(false); // Turn off the loading screen
    }

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  // SCREEN 1: The Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <p className="text-gray-500 font-medium animate-pulse">Chargement de la boutique...</p>
      </main>
    );
  }

  // SCREEN 2: The 404 Error (If they type a wrong link)
  if (!merchantData) {
    return (
      <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <p className="text-gray-500 font-medium">Boutique introuvable.</p>
      </main>
    );
  }

  // SCREEN 3: The Live Store!
  const { name, whatsapp, description, catalog } = merchantData;

  const addToCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = catalog.reduce((total: number, product: any) => total + (product.price * (cart[product.id] || 0)), 0);

  const checkout = () => {
    let message = `مرحباً ${name}! | Bonjour ${name}!\nJe voudrais commander : / أود طلب:\n\n`;
    catalog.forEach((product: any) => {
      if (cart[product.id]) {
        message += `▪ ${cart[product.id]}x ${product.name} - ${product.price * cart[product.id]} MRU\n`;
      }
    });
    message += `\n*Total: ${cartTotal} MRU*\n\nMerci!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F] pb-32" dir="auto">
      
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50 pt-12 pb-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-1">{name}</h1>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="space-y-4">
          {catalog.map((product: any) => (
            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex gap-4 transition-transform active:scale-[0.98]">
              
              <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
                {product.image ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">Image</span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h2 className="text-[17px] font-semibold leading-tight mb-1">{product.name}</h2>
                  <p className="text-[13px] text-gray-500 line-clamp-2">{product.desc}</p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[15px] font-bold text-gray-900">{product.price} MRU</span>
                  <button 
                    onClick={() => addToCart(product.id)}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold py-1.5 px-4 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <span>Ajouter</span>
                    {cart[product.id] ? <span className="bg-white/20 px-1.5 rounded-full text-[10px] ml-1">{cart[product.id]}</span> : ''}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center justify-center gap-2 text-[#86868B] text-[11px] font-medium hover:text-gray-800 transition-colors">
            <span>Powered by Touetou market</span>
          </a>
        </div>
      </div>

      {cartItemsCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-20">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl p-4 flex justify-between items-center">
            <div className="pl-2">
              <p className="text-[11px] font-medium text-gray-500 mb-0.5">Total</p>
              <p className="text-xl font-bold tracking-tight">{cartTotal} MRU</p>
            </div>
            <button 
              onClick={checkout}
              className="bg-[#1D1D1F] hover:bg-black text-white text-[15px] font-semibold py-3 px-6 rounded-full shadow-md transition-transform active:scale-95"
            >
              Commander via WhatsApp
            </button>
          </div>
        </div>
      )}
    </main>
  );
}