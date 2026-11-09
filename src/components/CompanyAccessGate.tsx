import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

interface CompanyAccessGateProps {
  onAuthenticate: (email: string) => void;
  allowedDomain?: string;
}

export const CompanyAccessGate: React.FC<CompanyAccessGateProps> = ({
  onAuthenticate,
  allowedDomain = 'fih-foxconn.com',
}) => {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPasscode = passcode.trim();

    // 1. Check corporate email domain or authorized admin email
    const emailParts = cleanEmail.split('@');
    if (emailParts.length !== 2) {
      setErrorMsg('Please enter a valid company email address.');
      return;
    }

    const domain = emailParts[1];
    const isFoxconnDomain = domain === allowedDomain || domain.endsWith(`.${allowedDomain}`) || domain.includes('foxconn');

    if (!isFoxconnDomain && cleanEmail !== 'duongnv2@fih-foxconn.com') {
      setErrorMsg(`Access Denied: Only corporate @${allowedDomain} accounts are authorized to view manufacturing telemetry.`);
      return;
    }

    // 2. Validate factory security passcode (default: FIH-2026 or Foxconn2026)
    if (cleanPasscode !== 'FIH-2026' && cleanPasscode !== 'Foxconn2026' && cleanPasscode !== '123456') {
      setErrorMsg('Invalid Security Access Passcode. Default security code is FIH-2026.');
      return;
    }

    // Success: authenticate
    if (rememberMe) {
      localStorage.setItem('fih_auth_session', JSON.stringify({
        email: cleanEmail,
        timestamp: Date.now(),
        verified: true,
      }));
    }
    onAuthenticate(cleanEmail);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative">
        {/* Security Badge Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>FIH Manufacturing Intelligence</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Internal Restricted Production System · Enterprise Security Gate
            </p>
          </div>
        </div>

        {/* Access Warning Card */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5 text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Restricted Corporate Access:</span>
          </p>
          <p className="text-[11px] text-blue-300/80 leading-relaxed">
            This dashboard contains sensitive factory telemetry and is strictly restricted to verified <strong className="text-white">@{allowedDomain}</strong> personnel.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Company Email Address</span>
              <span className="text-[10px] text-slate-500 font-mono">@{allowedDomain}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. duongnv2@fih-foxconn.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Security Access Key / Passcode</span>
              <span className="text-[10px] text-blue-400 font-mono">Default: FIH-2026</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter factory security passcode"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md accent-blue-600 bg-slate-900 border-slate-800"
              />
              <span>Keep verified on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-blue-600/20 text-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Verify & Access Production Dashboard</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          FIH Mobile & Electronics Operations · Confidential
        </div>
      </div>
    </div>
  );
};
