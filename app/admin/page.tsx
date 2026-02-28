import { db } from "@/app/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ShoppingCart } from "lucide-react"; // Stable icons

export default async function StorePage({ params }: { params: { store: string } }) {
  const storeId = params.store;

  // 1. Fetch Store Data from Firebase Firestore
  const q = query(collection(db, "stores"), where("slug", "==", storeId));
  const querySnapshot = await getDocs(q);
  const storeData = querySnapshot.docs[0]?.data();

  if (!storeData) {
    return <div className="p-10 text-center">Store not found / المتجر غير موجود</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5e6c8] text-[#3d2008]">
      {/* 2. Luxury Header */}
      <header className="p-8 text-center border-b border-[#c8972a]/20">
        <h1 className="text-4xl font-bold uppercase tracking-widest">{storeData.name}</h1>
        <p className="mt-2 opacity-70 italic">{storeData.description}</p>
      </header>

      {/* 3. Product Grid */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* We assume products are a sub-collection or array in Firestore */}
        {storeData.products?.map((product: any) => (
          <div key={product.id} className="bg-[#fdf6e8] rounded-xl overflow-hidden shadow-lg border border-[#c8972a]/10">
            <div className="h-48 bg-gray-200">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <span className="text-[#c8972a] font-bold">{product.price} MRU</span>
              </div>
              
              {/* 4. The Gold Purchase Button */}
              <button className="w-full bg-gradient-to-b from-[#c8972a] to-[#a67c22] text-[#1a1108] py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                <ShoppingCart size={20} />
                <span>Buy Now / اشتري الآن</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}