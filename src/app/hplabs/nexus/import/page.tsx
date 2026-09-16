"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, FileType, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

type ImportRow = {
  name: string;
  email: string;
  college?: string;
  rollNumber?: string;
};

export default function ImportBatchPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportRow[]>([]);
  const [validRows, setValidRows] = useState<ImportRow[]>([]);
  const [invalidCount, setInvalidCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  
  // Configuration State
  const [organization, setOrganization] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("6");
  const [accessDuration, setAccessDuration] = useState("8");
  const [plan, setPlan] = useState("PREMIUM");
  const [activationMethod, setActivationMethod] = useState("AUTOMATIC");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false }) as any[];
        
        let valid: ImportRow[] = [];
        let invalid = 0;
        let dups = 0;
        let seenEmails = new Set();

        data.forEach(row => {
          // Normalize column names
          const keys = Object.keys(row);
          const getVal = (possibleNames: string[]) => {
            const key = keys.find(k => possibleNames.some(p => k.toLowerCase().includes(p)));
            return key ? row[key]?.toString().trim() : "";
          };

          const name = getVal(['name', 'student', 'full']);
          const email = getVal(['email', 'mail']).toLowerCase();
          const college = getVal(['college', 'university', 'org']);
          const rollNumber = getVal(['roll', 'id', 'reg']);

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!name || !email || !emailRegex.test(email)) {
            invalid++;
            return;
          }

          if (seenEmails.has(email)) {
            dups++;
            return;
          }

          seenEmails.add(email);
          valid.push({ name, email, college, rollNumber });
        });

        setParsedData(data);
        setValidRows(valid);
        setInvalidCount(invalid);
        setDuplicateCount(dups);
        setStep(2);
      } catch (err) {
        setError("Failed to parse file. Please ensure it is a valid CSV or XLSX.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (!organization || !courseName) {
      setError("Please fill out all required configuration fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization,
          courseName,
          courseDurationMonths: parseInt(courseDuration),
          accessDurationMonths: parseInt(accessDuration),
          plan,
          activationMethod,
          students: validRows
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.coupons && data.coupons.length > 0) {
          const exportData = data.coupons.map((c: any) => ({
            Name: c.studentName,
            Email: c.studentEmail,
            'Coupon Code': c.plaintextCode
          }));
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Coupons");
          XLSX.writeFile(wb, `${organization}_Secure_Coupons.xlsx`);
          alert("Coupons generated! The secure file has been downloaded. KEEP THIS SAFE - the full codes cannot be retrieved again.");
        }
        router.push(`/hp-45641c95fa7157d2/collaborations/${data.batchId}`);
      } else {
        setError(data.error || "Failed to import batch");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Network error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 max-w-4xl mx-auto pb-24">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#0d0d14] rounded-lg text-[#64748b]"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-3xl font-bold text-white">Import Student Batch</h1>
            <p className="text-[#64748b]">Securely onboard a new enterprise or university collaboration.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Wizard Progress */}
        <div className="flex gap-4 mb-8">
          <div className={`flex-1 p-4 rounded-xl border ${step >= 1 ? 'bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41]' : 'bg-[#0d0d14] border-[rgba(0,255,65,0.15)] text-[#64748b]'}`}>
            <span className="font-bold text-sm block mb-1">Step 1</span>
            <span className="text-xs uppercase tracking-wider">Upload File</span>
          </div>
          <div className={`flex-1 p-4 rounded-xl border ${step >= 2 ? 'bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41]' : 'bg-[#0d0d14] border-[rgba(0,255,65,0.15)] text-[#64748b]'}`}>
            <span className="font-bold text-sm block mb-1">Step 2</span>
            <span className="text-xs uppercase tracking-wider">Configure Access</span>
          </div>
          <div className={`flex-1 p-4 rounded-xl border ${step >= 3 ? 'bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41]' : 'bg-[#0d0d14] border-[rgba(0,255,65,0.15)] text-[#64748b]'}`}>
            <span className="font-bold text-sm block mb-1">Step 3</span>
            <span className="text-xs uppercase tracking-wider">Confirm & Import</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-12 rounded-2xl text-center border-dashed">
            <input type="file" id="file" accept=".csv, .xlsx" className="hidden" onChange={handleFileUpload} />
            <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
              <div className="w-20 h-20 bg-[#111118] border border-[rgba(0,255,65,0.3)] rounded-full flex items-center justify-center mb-6">
                <Upload size={32} className="text-[#00ff41]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Student List</h3>
              <p className="text-[#64748b] mb-6 max-w-md">Accepts CSV or XLSX. Must contain Name and Email columns. College and Roll Number are optional.</p>
              <div className="bg-[#111118] text-white px-6 py-3 rounded-xl border border-[rgba(0,255,65,0.3)] hover:border-[#00ff41] transition-colors">
                Browse Files
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-[rgba(0,255,65,0.15)] pb-4">Data Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
                  <span className="block text-2xl font-bold text-green-400">{validRows.length}</span>
                  <span className="text-xs uppercase tracking-wider text-green-400/80">Valid Students</span>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
                  <span className="block text-2xl font-bold text-yellow-400">{invalidCount}</span>
                  <span className="text-xs uppercase tracking-wider text-yellow-400/80">Invalid Rows</span>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl">
                  <span className="block text-2xl font-bold text-orange-400">{duplicateCount}</span>
                  <span className="text-xs uppercase tracking-wider text-orange-400/80">Duplicates</span>
                </div>
              </div>
              <p className="text-xs text-[#64748b] mt-4 flex items-center gap-2"><AlertTriangle size={14}/> Invalid or duplicate rows will be automatically ignored.</p>
            </div>

            <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-[rgba(0,255,65,0.15)] pb-4">Collaboration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">Organization / Partner Name *</label>
                  <input type="text" value={organization} onChange={e=>setOrganization(e.target.value)} placeholder="e.g. Fruzentrix" className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">Course / Batch Name *</label>
                  <input type="text" value={courseName} onChange={e=>setCourseName(e.target.value)} placeholder="e.g. CyberSec Fall 2026" className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">Course Duration (Months)</label>
                  <input type="number" value={courseDuration} onChange={e=>setCourseDuration(e.target.value)} className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-6 rounded-2xl border-l-4 border-l-[#00ff41]">
              <h3 className="text-lg font-bold text-[#00ff41] mb-4 border-b border-[rgba(0,255,65,0.15)] pb-4">HPLabs Entitlement Config</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">HPLabs Plan</label>
                  <select value={plan} onChange={e=>setPlan(e.target.value)} className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none appearance-none">
                    <option value="BASIC">Basic</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">Access Duration (Months)</label>
                  <input type="number" value={accessDuration} onChange={e=>setAccessDuration(e.target.value)} className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#64748b] mb-2 font-bold tracking-wider">Activation Method</label>
                  <select value={activationMethod} onChange={e=>setActivationMethod(e.target.value)} className="w-full bg-[#111118] border border-[rgba(0,255,65,0.3)] text-white p-3 rounded-xl focus:border-[#00ff41] focus:outline-none appearance-none">
                    <option value="AUTOMATIC">Automatic on Register</option>
                    <option value="COUPON">Manual via Coupon</option>
                    <option value="ADMIN_APPROVAL">Admin Manual Approval</option>
                  </select>
                </div>
              </div>
              
              <p className="text-xs text-[#64748b] leading-relaxed italic bg-[#111118] p-3 rounded-lg border border-[rgba(0,255,65,0.3)]">
                <strong>NOTE:</strong> Access Duration operates independently of Course Duration. When the access duration expires, the user gracefully drops to their highest paid active tier or FREE.
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] text-white hover:bg-[#111118]">Back</button>
              <button 
                onClick={() => {
                  if(!organization || !courseName) setError("Organization and Course Name required");
                  else setStep(3);
                }} 
                className="px-6 py-3 rounded-xl bg-[#00ff41] text-[#06030c] font-bold hover:bg-[var(--hp-primary-hover)] flex items-center gap-2"
              >
                Review & Confirm <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[#0d0d14] border border-[rgba(0,255,65,0.15)] p-8 rounded-2xl text-center">
              <CheckCircle className="mx-auto text-[#00ff41] mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Import</h2>
              <p className="text-[#64748b] mb-8">You are about to securely provision HPLabs access for {validRows.length} students.</p>
              
              <div className="bg-[#111118] border border-[rgba(0,255,65,0.3)] rounded-xl p-6 text-left max-w-md mx-auto mb-8 shadow-lg">
                <div className="flex justify-between border-b border-[rgba(0,255,65,0.15)] pb-2 mb-2">
                  <span className="text-[#64748b] text-sm">Organization</span>
                  <span className="font-bold text-white text-sm">{organization}</span>
                </div>
                <div className="flex justify-between border-b border-[rgba(0,255,65,0.15)] pb-2 mb-2">
                  <span className="text-[#64748b] text-sm">Course</span>
                  <span className="font-bold text-white text-sm">{courseName}</span>
                </div>
                <div className="flex justify-between border-b border-[rgba(0,255,65,0.15)] pb-2 mb-2">
                  <span className="text-[#64748b] text-sm">Plan</span>
                  <span className="font-bold text-[#00ff41] text-sm">{plan}</span>
                </div>
                <div className="flex justify-between border-b border-[rgba(0,255,65,0.15)] pb-2 mb-2">
                  <span className="text-[#64748b] text-sm">Access Duration</span>
                  <span className="font-bold text-white text-sm">{accessDuration} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b] text-sm">Valid Students</span>
                  <span className="font-bold text-green-400 text-sm">{validRows.length}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button disabled={isSubmitting} onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-[#111118] border border-[rgba(0,255,65,0.15)] text-white hover:bg-[#0d0d14] transition-colors">
                  Go Back
                </button>
                <button disabled={isSubmitting} onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-[#00ff41] text-[#06030c] font-bold hover:bg-[var(--hp-primary-hover)] transition-all shadow-[0_0_20px_rgba(191,95,255,0.4)] disabled:opacity-50">
                  {isSubmitting ? "Importing..." : "Confirm Import"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
