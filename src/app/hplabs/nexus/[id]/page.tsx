"use client";
import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Users, Clock, Shield, Star, CheckCircle, Ticket, Mail, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  const router = useRouter();
  const [batch, setBatch] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/collaborations/${resolved.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBatch(data.batch);
          setStudents(data.students);
        }
        setLoading(false);
      });
  }, [resolved.id]);

  const handleAdminApprove = async (studentId: string) => {
    try {
      const res = await fetch(`/api/admin/collaborations/${resolved.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (data.success) {
        setStudents(students.map(s => s.id === studentId ? { ...s, status: 'ACTIVATED', userId: data.userId } : s));
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Error approving student");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 max-w-[1440px] mx-auto text-center text-[#64748b] animate-pulse">Loading batch details...</div>
    </div>
  );

  if (!batch) return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 max-w-[1440px] mx-auto text-center text-red-400">Batch not found.</div>
    </div>
  );

  const pending = students.filter(s => s.status === 'PENDING').length;
  const activated = students.filter(s => s.status === 'ACTIVATED').length;

  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 max-w-[1440px] mx-auto pb-24">
        
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Link href="/hp-45641c95fa7157d2/collaborations" className="p-2 hover:bg-[#0d0d14] rounded-lg text-[#64748b] transition-colors"><ArrowLeft size={20}/></Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{batch.organization} <span className="text-[#64748b] font-normal text-xl">/ {batch.courseName}</span></h1>
              <div className="flex items-center gap-4 text-sm text-[#64748b]">
                <span className="flex items-center gap-1"><Shield size={14}/> Imported by {batch.importedBy}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {new Date(batch.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {batch.activationMethod === 'COUPON' && (
            <div className="flex items-center gap-2 bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] text-[#64748b] px-4 py-2 rounded-xl text-sm">
              <Ticket size={16} /> Secure Coupons Generated
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-4 rounded-xl">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Total Imported</span>
            <span className="text-2xl font-bold text-white">{students.length}</span>
          </div>
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-4 rounded-xl">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Activated</span>
            <span className="text-2xl font-bold text-green-400 flex items-center gap-2"><CheckCircle size={18}/> {activated}</span>
          </div>
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-4 rounded-xl">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Pending</span>
            <span className="text-2xl font-bold text-yellow-400">{pending}</span>
          </div>
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-4 rounded-xl">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Plan Assigned</span>
            <span className="text-xl font-bold text-[#00ff41] truncate">{batch.plan}</span>
          </div>
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-4 rounded-xl">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Method</span>
            <span className="text-sm font-bold text-white mt-1 block truncate">{batch.activationMethod}</span>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111118] border-b border-[rgba(0,255,65,0.15)]">
                  <th className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Student Name</th>
                  <th className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Status</th>
                  {batch.activationMethod === 'COUPON' && (
                    <th className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Coupon Code</th>
                  )}
                  <th className="p-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">User ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} className={`border-b border-[rgba(0,255,65,0.15)] hover:bg-[#111118] transition-colors ${idx % 2 === 0 ? 'bg-[#050508]/50' : 'bg-transparent'}`}>
                    <td className="p-4 text-sm text-white font-medium">{student.name}</td>
                    <td className="p-4 text-sm text-[#64748b] flex items-center gap-2"><Mail size={14}/> {student.email}</td>
                    <td className="p-4">
                      {student.status === 'ACTIVATED' ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs font-bold tracking-wider">ACTIVATED</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded text-xs font-bold tracking-wider">PENDING</span>
                          {batch.activationMethod === 'ADMIN_APPROVAL' && (
                            <button 
                              onClick={() => handleAdminApprove(student.id)}
                              className="px-2 py-1 bg-[#00ff41] text-[#06030c] text-xs font-bold rounded hover:opacity-80 transition-opacity"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    {batch.activationMethod === 'COUPON' && (
                      <td className="p-4">
                        {student.couponCode ? (
                          <span className="font-mono text-xs text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-1 rounded border border-[#00e5ff]/30 flex items-center gap-2 w-max">
                            <Ticket size={12}/> {student.couponCode}
                          </span>
                        ) : (
                          <span className="text-xs text-[#64748b]">-</span>
                        )}
                      </td>
                    )}
                    <td className="p-4">
                      {student.userId ? (
                        <Link href={`/hp-45641c95fa7157d2/users/${student.userId}`} className="font-mono text-xs text-[#00ff41] hover:underline">
                          {student.userId.substring(0, 13)}...
                        </Link>
                      ) : (
                        <span className="text-xs text-[#64748b] italic">Not registered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
