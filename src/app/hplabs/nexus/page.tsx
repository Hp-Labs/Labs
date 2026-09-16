"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Plus, Users, Clock, Shield, Star, ExternalLink, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CollaborationsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/collaborations")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBatches(data.batches);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 max-w-[1440px] mx-auto pb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Collaboration Imports</h1>
            <p className="text-[#64748b]">Manage partner student batches and enterprise course entitlements.</p>
          </div>
          <Link 
            href="/hp-45641c95fa7157d2/collaborations/import"
            className="flex items-center gap-2 bg-[#00ff41] hover:bg-[var(--hp-primary-hover)] text-[#06030c] font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(191,95,255,0.3)]"
          >
            <Plus size={18} />
            <span>Import New Batch</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#64748b] animate-pulse">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="text-center py-24 bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] rounded-2xl">
            <Users className="mx-auto text-[#64748b] mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">No collaborations yet</h2>
            <p className="text-[#64748b] mb-6">Import your first student batch to get started.</p>
            <Link 
              href="/hp-45641c95fa7157d2/collaborations/import"
              className="inline-block bg-[#00ff41] text-[#06030c] font-bold px-6 py-2 rounded-xl"
            >
              Start Import
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map(batch => (
              <div 
                key={batch.id} 
                onClick={() => router.push(`/hp-45641c95fa7157d2/collaborations/${batch.id}`)}
                className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] hover:border-[#00ff41] p-6 rounded-2xl cursor-pointer transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-lg text-white mb-1 group-hover:text-[#00ff41] transition-colors">{batch.organization}</h2>
                    <p className="text-sm text-[#64748b] flex items-center gap-2">
                      <Shield size={14} /> {batch.courseName}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                    batch.plan === 'PREMIUM' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' :
                    batch.plan === 'INTERMEDIATE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-green-500/10 text-green-400 border-green-500/30'
                  }`}>
                    {batch.plan}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#111118] p-3 rounded-xl border border-[rgba(0,255,65,0.3)]">
                    <span className="block text-[10px] text-[#64748b] uppercase mb-1">Students</span>
                    <span className="font-bold text-white flex items-center gap-2"><Users size={14}/> {batch.totalStudents}</span>
                  </div>
                  <div className="bg-[#111118] p-3 rounded-xl border border-[rgba(0,255,65,0.3)]">
                    <span className="block text-[10px] text-[#64748b] uppercase mb-1">Activated</span>
                    <span className="font-bold text-green-400 flex items-center gap-2"><Star size={14}/> {batch.activated}</span>
                  </div>
                  <div className="bg-[#111118] p-3 rounded-xl border border-[rgba(0,255,65,0.3)]">
                    <span className="block text-[10px] text-[#64748b] uppercase mb-1">HPLabs Access</span>
                    <span className="font-bold text-white flex items-center gap-2"><Clock size={14}/> {batch.accessDurationMonths} mo</span>
                  </div>
                  <div className="bg-[#111118] p-3 rounded-xl border border-[rgba(0,255,65,0.3)]">
                    <span className="block text-[10px] text-[#64748b] uppercase mb-1">Method</span>
                    <span className="font-bold text-white text-xs flex items-center gap-2 mt-1 truncate">{batch.activationMethod}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-[#64748b] border-t border-[rgba(0,255,65,0.15)] pt-4 mt-auto">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(batch.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity">View Details <ExternalLink size={12}/></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
