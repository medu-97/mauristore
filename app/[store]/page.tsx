import { db } from "@/app/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ShoppingCart, Store } from "lucide-react";

export default async function StorePage({ params }: { params: { store: string } }) {
  const storeId = params.store;

  const q = query(collection(db, "stores"), where("slug", "==", storeId));
  const querySnapshot = await getDocs(q);
  const storeData = querySnapshot.docs[0]?.data();

  if (!storeData) {
    return (
      <div className="min-h-screen bg-[#f5e6c8] flex flex-col items-center justify-center text-[#3d2008]">
        <Store size={64} className="mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Store not found</h2>
        <p className="opacity-70">المتجر غير موجود</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5e6c8] text-[#3d2008] font-sans">
      <header className="p-10 text-center border-b border-[#c8972a]/30 bg-[#fdf6e8]/50 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide uppercase">
          {storeData.name}
        </h1>
        <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
          {storeData.description}
        </p>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {storeData.products?.map((product: any, index: number) => (
            <div key={index} className="bg-[#fdf6e8] rounded-2xl overflow-hidden shadow-lg border border-[#c8972a]/20 hover:shadow-xl transition-shadow duration-300">
              <div className="h-56 bg-white flex items-center justify-center overflow-hidden relative group">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-[#c8972a]/40">No Image</div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold leading-tight">{product.name}</h3>
                  <span className="text-[#c8972a] font-extrabold text-lg whitespace-nowrap ml-4">
                    {product.price} MRU
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-[#c8972a] to-[#a67c22] text-[#1a1108] py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-md">
                  <ShoppingCart size={20} />
                  <span>Buy / اشتري</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
