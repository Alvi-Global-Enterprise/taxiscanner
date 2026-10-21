"use client";

import Link from "next/link";
import { AdminOperatorZoneManager } from "@/components/admin/AdminOperatorZoneManager";
import { ArrowLeft, MapPin } from "lucide-react";

export default function AdminOperatorsPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition"
          >
            <ArrowLeft size={16} />
            Back to TaxiScanner Customer Search
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <MapPin size={14} className="text-emerald-600" />
            <span>Interactive UK Towns & Cities Boundaries Active</span>
          </div>
        </div>

        <AdminOperatorZoneManager />
      </div>
    </div>
  );
}
