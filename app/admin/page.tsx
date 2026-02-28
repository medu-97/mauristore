'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminCommandCenter() {
  const [stores, setStores] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    const { data } = await supabase.from('stores').select('*');
    if (data) setStores(data);
    setLoading(false);
  }

  async function toggleRentStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase.from('stores').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchStores();
  }

  return (
    <main className="min-h-screen p-4 md:p-10 bg-[#1a1108] text-[#f5e6c8]">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-[#c8972a] pb-6">
          <h1 className="text-4xl font-bold font-serif tracking-tighter">TOUETOU <span className="text-[#c8972a]">HQ</span></h1>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest opacity-60">System Status</p>
            <p className="text-green-400 font-mono text-sm">● CLOUD_CONNECTED</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Section */}
          <section className="lg:col-span-1 bg-[#3d2008] p-6 rounded-3xl border border-[#c8972a]/30 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-[#c8972a]">✚</span> New Property
            </h2>
            <form className="space-y-4">
              <input placeholder="Store ID (slug)" className="w-full bg-[#1a1108] border-none p-4 rounded-2xl focus:ring-2 ring-[#c8972a]" />
              <input placeholder="Business Name" className="w-full bg-[#1a1108] border-none p-4 rounded-2xl focus:ring-2 ring-[#c8972a]" />
              <button className="w-full bg-[#c8972a] text-[#1a1108] font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">
                GENERATE STOREFRONT
              </button>
            </form>
          </section>

          {/* Management Section */}
          <section className="lg:col-span-2 space-y-4">
             <h2 className="text-xl font-bold mb-6 text-[#c8972a]">Active Rentals</h2>
             {stores.map(store => (
               <div key={store.id} className="bg-[#fdf6e8]/5 p-5 rounded-2xl flex justify-between items-center border border-white/5 hover:border-[#c8972a]/50 transition-colors">
                 <div>
                   <h3 className="font-bold text-lg">{store.name}</h3>
                   <p className="text-xs opacity-50">/{store.id}</p>
                 </div>
                 <div className="flex gap-4 items-center">
                   <div className="text-right px-4 border-r border-white/10">
                      <p className="text-[10px] uppercase opacity-50">Monthly Rent</p>
                      <p className="font-bold">500 MRU</p>
                   </div>
                   <button 
                    onClick={() => toggleRentStatus(store.id, store.is_active)}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${store.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                     {store.is_active ? 'ACTIVE' : 'SUSPENDED'}
                   </button>
                 </div>
               </div>
             ))}
          </section>
        </div>
      </div>
    </main>
  );
}