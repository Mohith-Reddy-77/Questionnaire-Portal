"use client";

import React, { useState } from 'react';
import { ShieldCheck, X, Key, ArrowRight } from 'lucide-react';
import { setAdminAuthenticated } from '@/lib/storage';

type AdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passkey.trim();
    if (cleanPass === '1234' || cleanPass.toUpperCase() === 'READY2026' || cleanPass.toLowerCase() === 'admin') {
      setAdminAuthenticated(true);
      setError(false);
      setPasskey('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Authentication Required</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter team password to access confidential data</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
          This page contains confidential student aptitude metrics, risk indexes, and diagnostic reports restricted strictly to team counselors.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Enter Team Password (PIN: <code className="text-orange-500 font-mono">1234</code> or <code className="text-orange-500 font-mono">READY2026</code>)
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                autoFocus
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-500 font-bold flex items-center gap-1">
                Incorrect admin password. Try 1234 or READY2026.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Verify & Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
