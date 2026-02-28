'use client';
import { useState } from 'react';

// ==========================================
// ⚙️ MERCHANT SETTINGS (Admin Control Panel)
// Change this block for every new client you onboard!
// ==========================================
const MERCHANT = {
  name: "Boutique de Khadija | متجر خديجة", 
  whatsapp: "22200000000", // The client's WhatsApp number
  description: "Vêtements traditionnels et modernes | ملابس تقليدية وعصرية" 
};

const CATALOG = [
  { 
    id: 1, 
    name: "Mélhfa en Soie | ملحفة حرير", 
    price: 1500, 
    desc: "Haute qualité, couleurs vibrantes. | جودة عالية، ألوان زاهية." 
  },
  { 
    id: 2, 
    name: "Parfum Local (Bakhour) | بخور محلي", 
    price: 400, 
    desc: "Parfum traditionnel Mauritanien. | عطر تقليدي موريتاني أصيل." 
  }
];
// ==========================================

export default function Home() {
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = CATALOG.reduce((total, product) => {
    return total + (product.price * (cart[product.id] || 0));
  }, 0);

  // The Bilingual WhatsApp Engine
  const checkout = () => {
    let message = `مرحباً ${MERCHANT.name}! | Bonjour ${MERCHANT.name}!\nJe voudrais commander : / أود طلب:\n\n`;
    
    CATALOG.forEach(product => {
      if (cart[product.id]) {
        message += `▪ ${cart[product.id]}x ${product.name} - ${product.price * cart[product.id]} MRU\n`;
      }
    });

    message += `\n*Total / المجموع: ${cartTotal} MRU*\n\nMerci! / شكراً!`;
    window.open(`https://wa.me/${MERCHANT.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    // 'dir="auto"' automatically handles Arabic Right-to-Left formatting!
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-sans pb-32" dir="auto">
      <div className="max-w-md mx-auto">
        
        {/* Store Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{MERCHANT.name}</h1>
          <p className="text-gray-500 mt-2">{MERCHANT.description}</p>
        </div>

        {/* The Product Catalog */}
        <div className="space-y-6">
          {CATALOG.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-5">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                <span className="text-lg font-bold text-blue-600 whitespace-nowrap">{product.price} MRU</span>
              </div>
              <p className="text-gray-600 text-sm mb-5">{product.desc}</p>
              
              <button 
                onClick={() => addToCart(product.id)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <span>أضف إلى السلة</span>
                <span className="text-blue-300">|</span>
                <span>Ajouter</span>
                {cart[product.id] ? <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs ml-2">{cart[product.id]}</span> : ''}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* The Floating Checkout Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Total / المجموع</p>
              <p className="text-2xl font-black text-gray-900">{cartTotal} MRU</p>
            </div>
            <button 
              onClick={checkout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex flex-col items-center leading-tight shadow-md"
            >
              <span className="text-sm">Commander</span>
              <span className="text-xs font-medium opacity-90">الطلب عبر واتساب</span>
            </button>
          </div>
        </div>
      )}
      {/* The Viral Loop: Powered By Watermark */}
      <div className="mt-12 mb-24 text-center">
        <a 
          href="#" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full text-xs font-semibold transition-colors shadow-inner"
        >
          <span>⚡</span>
          <span>Powered by Touetou - Créez votre boutique gratuite</span>
        </a>
      </div>
    </main>
  );
}