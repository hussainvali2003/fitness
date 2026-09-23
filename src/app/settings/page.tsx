"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredProfile,
  saveStoredProfile,
  exportAllUserData,
  importAllUserData,
  resetAllDataToDefault,
} from "@/lib/storage";
import { UserProfile } from "@/types";
import {
  Settings,
  User,
  Target,
  Download,
  Upload,
  RefreshCw,
  Smartphone,
  Database,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const jsonStr = exportAllUserData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apex-fitness-hussain-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllUserData(content);
      if (success) {
        setImportStatus("Data successfully restored!");
        setProfile(getStoredProfile());
      } else {
        setImportStatus("Error: Invalid backup file format.");
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data to default baseline seed state?")) {
      resetAllDataToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
            System &amp; Profile
          </span>
          <span className="text-xs text-surface-400 font-semibold font-mono">Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
          Settings &amp; Personalization
        </h1>
        <p className="text-xs text-surface-400">
          Manage your transformation targets, export backup data, and configure Supabase / Health Connect.
        </p>
      </div>

      {/* Profile & Target Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-800">
          <User className="w-5 h-5 text-brand-emerald" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            User Profile &amp; Custom Targets
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value, 10) || 22 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Height (cm)</label>
              <input
                type="number"
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: parseFloat(e.target.value) || 167 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-surface-400 uppercase">Starting Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.startingWeightKg}
                onChange={(e) => setProfile({ ...profile, startingWeightKg: parseFloat(e.target.value) || 82 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-brand-emerald uppercase">Target Goal Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.targetWeightKg}
                onChange={(e) => setProfile({ ...profile, targetWeightKg: parseFloat(e.target.value) || 70 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-brand-rose uppercase">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={profile.calorieTarget}
                onChange={(e) => setProfile({ ...profile, calorieTarget: parseInt(e.target.value, 10) || 1850 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-brand-amber uppercase">Daily Protein Target (g)</label>
              <input
                type="number"
                value={profile.proteinTargetMax}
                onChange={(e) => setProfile({ ...profile, proteinTargetMax: parseInt(e.target.value, 10) || 135 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-brand-cyan uppercase">Daily Step Target</label>
              <input
                type="number"
                value={profile.stepTarget}
                onChange={(e) => setProfile({ ...profile, stepTarget: parseInt(e.target.value, 10) || 10000 })}
                className="w-full mt-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-emerald to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </button>

            {saveSuccess && (
              <span className="text-xs font-bold text-brand-emerald flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Supabase Free Tier Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-800">
          <Database className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Supabase Database &amp; Vercel Deployment
          </h2>
        </div>

        <p className="text-xs text-surface-300 leading-relaxed">
          Your personal application is built to connect seamlessly to <strong>Supabase (Free Tier PostgreSQL)</strong>.
          To deploy online with cloud persistence:
        </p>

        <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-2 font-mono text-[11px] text-surface-300">
          <p className="text-brand-cyan font-bold">1. Create a free Supabase project at https://supabase.com</p>
          <p className="text-surface-400">2. Copy your PostgreSQL connection string from Project Settings &rarr; Database</p>
          <p className="text-surface-400">3. Set <code className="text-brand-emerald">DATABASE_URL</code> in Vercel Environment Variables</p>
          <p className="text-surface-400">4. Run <code className="text-brand-emerald">npx prisma db push</code> to sync schema</p>
        </div>
      </div>

      {/* Data Sovereignty: Export / Import & Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121826] border border-surface-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-800">
          <ShieldCheck className="w-5 h-5 text-brand-emerald" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Data Sovereignty &amp; Backups (100% Personal Privacy)
          </h2>
        </div>

        <p className="text-xs text-surface-300">
          You have full ownership of your fitness logs. Export your entire workout history, body measurements, macros, and PR records as a clean JSON backup file at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-brand-emerald font-bold text-xs border border-surface-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-brand-cyan font-bold text-xs border border-surface-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition-colors ml-auto"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reset to Baseline Demo</span>
          </button>
        </div>

        {importStatus && (
          <p className="text-xs font-bold text-brand-cyan pt-2 animate-fade-in">{importStatus}</p>
        )}
      </div>
    </div>
  );
}
