import React, { useState } from 'react';
import { ArrowLeft, Check, Flame, KeyRound, Lock, LogOut, Mail, ShieldCheck, Sparkles, User, Wand2 } from 'lucide-react';

type Mode = 'signin' | 'register' | 'forgot' | 'unpaid';

type SessionState = {
  loggedIn: boolean;
  authorized: boolean;
  email: string | null;
  name?: string;
  planTier?: string | null;
  accessStatus?: string;
};

export function PromoterAuthPage({ session, onLogout }: { session: SessionState; onLogout: () => Promise<void> }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState(session.email ?? '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo(null);
    setIsLoading(true);
    try {
      if (mode === 'signin' || mode === 'register') {
        const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mode === 'register' ? { email, password, name } : { email, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Something went wrong');
        if (result.paid) {
          window.location.href = '/dashboard';
          return;
        }
        setMode('unpaid');
        setInfo(`Welcome${result.email ? `, ${result.email}` : ''} — your account is created. Activate a plan to open your dashboard.`);
        return;
      }
      if (mode === 'forgot') {
        const response = await fetch('/api/auth/forgot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Something went wrong');
        setInfo(`Password reset link generated:${window.location.origin}${result.resetUrl}`);
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setInfo(null);
    setPassword('');
  };

  if (mode === 'unpaid') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF] px-6 text-[#1B1035]">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-fuchsia-500/10">
          <div className="mx-auto inline-flex rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 shadow-lg shadow-amber-500/30"><Lock className="h-6 w-6 text-white" /></div>
          <h1 className="mt-6 text-2xl font-black tracking-tight">Your dashboard is locked</h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
            {session.email ? `${session.email} is registered but not yet on a paid plan.` : 'Your account is created.'}
            {' '}Activate a plan to start running viral campaigns.
          </p>
          {info && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">{info}</p>}
          <a href="/#pricing" className="mt-6 block rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-rose-500/30 transition-transform hover:scale-[1.03]">View plans</a>
          <button onClick={onLogout} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF] px-6 py-12 text-[#1B1035]">
      <div className="w-full max-w-md">
        <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-fuchsia-600"><ArrowLeft className="h-4 w-4" /> Back to ViralWins</a>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-fuchsia-500/10">
          <div className="animate-vw-gradient bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur"><Flame className="h-5 w-5" /></div>
              <strong className="text-xl font-black tracking-tight">ViralWins</strong>
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight">
              {mode === 'register' ? 'Create your promoter account' : mode === 'forgot' ? 'Reset your password' : 'Welcome back'}
            </h1>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 text-center text-xs font-black">
              {([['signin', 'Sign in'], ['register', 'Register'], ['forgot', 'Forgot']] as [Mode, string][]).map(([m, label]) => (
                <button key={m} onClick={() => switchMode(m)} className={`rounded-xl py-2.5 transition ${mode === m ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <div><label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">Full name</label><div className="relative"><User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-colors focus:border-fuchsia-400" placeholder="Alex Smith" /></div></div>
              )}
              <div><label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-colors focus:border-fuchsia-400" placeholder="you@yourbrand.com" /></div></div>
              {mode !== 'forgot' && (
                <div><label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">Password</label><div className="relative"><KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-colors focus:border-fuchsia-400" placeholder="At least 8 characters" /></div></div>
              )}
              {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
              {info && <p className="break-all rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">{info}</p>}
              <button disabled={isLoading} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-rose-500/30 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
                {isLoading ? 'One moment…' : mode === 'forgot' ? 'Generate reset link' : mode === 'register' ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Account access unlocks only after a plan is activated</div>
          </div>
        </div>
      </div>
    </div>
  );
}