'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mode, setMode] = useState<'magic' | 'password' | 'signup'>('magic');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
        setMessage('Check your email for your secure sign-in link!');
      } else if (mode === 'password') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/account');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (error) throw error;
        setMessage('Account created! Please check your email to confirm your sign-up.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-2xl font-black text-stone-900 tracking-tight">
          Birds of Paradise
        </Link>
        <h2 className="mt-2 text-xl font-extrabold text-stone-800">
          Workshop Customer Portal
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Access your showroom history, online orders, and saved flock preferences.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-stone-200 sm:rounded-2xl sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-stone-200 mb-6">
            <button
              type="button"
              onClick={() => { setMode('magic'); setErrorMsg(null); setMessage(null); }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 cursor-pointer ${
                mode === 'magic'
                  ? 'border-emerald-800 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => { setMode('password'); setErrorMsg(null); setMessage(null); }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 cursor-pointer ${
                mode === 'password'
                  ? 'border-emerald-800 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); setMessage(null); }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 cursor-pointer ${
                mode === 'signup'
                  ? 'border-emerald-800 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="flockowner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              {mode === 'magic' && (
                <p className="text-[11px] text-stone-500 mt-1">
                  We'll email you a one-time sign-in link. No password required.
                </p>
              )}
            </div>

            {(mode === 'password' || mode === 'signup') && (
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Processing...'
                : mode === 'magic'
                ? 'Send Magic Sign-In Link'
                : mode === 'password'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/store" className="text-xs font-semibold text-emerald-800 hover:underline">
              ← Return to Workshop Store
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}