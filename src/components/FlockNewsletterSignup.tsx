'use client';

import React, { useState } from 'react';

export default function FlockNewsletterSignup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [zip, setZip] = useState('');
  
  // Optional Step 2 details
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('KS');
  const [birdType, setBirdType] = useState('Conure / Cockatiel');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  // Submit Step 1 (Fast capture)
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, zip })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit.');

      setStatus('idle');
      setStep(2); // Move immediately to VIP profile setup
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Submission error.');
    }
  };

  // Submit Step 2 (Deep profile data)
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          firstName, 
          lastName, 
          phone, 
          address, 
          city, 
          state, 
          zip,
          birdDetails: birdType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update.');

      setStatus('success');
      setMsg('Profile locked in! Use code WELCOME15 at checkout.');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Error updating details.');
    }
  };

  return (
    <section className="bg-emerald-950 text-white py-12 px-4 sm:px-8 rounded-3xl my-10 max-w-5xl mx-auto shadow-2xl border border-emerald-800">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <span className="text-amber-400 font-black text-xs tracking-widest uppercase bg-emerald-900/90 px-3.5 py-1.5 rounded-full border border-emerald-700 inline-block">
            {step === 1 ? 'Flock Member Sign-Up' : 'Step 2: Customize Your Aviary Profile'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 text-white tracking-tight">
            {step === 1 ? 'Get 15% Off Your Next Order' : 'Tell Us About Your Feathered Companion'}
          </h2>
          <p className="mt-2 text-sm text-emerald-200">
            {step === 1 
              ? 'Join our community for seasonal perch batches, local seed harvest drops, and event notifications.' 
              : 'Help Angela and John curate the right perch diameters, foraging chew toys, and species-specific blends.'}
          </p>
        </div>

        {status === 'success' ? (
          <div className="mt-8 p-6 bg-emerald-900/80 border border-emerald-500 rounded-2xl text-center space-y-2">
            <p className="text-xl font-bold text-amber-300">🎉 You are officially in the Flock!</p>
            <p className="text-sm text-emerald-100">{msg}</p>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleStep1} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="email"
                required
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg cursor-pointer"
            >
              {status === 'loading' ? 'Joining...' : 'Unlock 15% Discount Code & Continue →'}
            </button>
          </form>
        ) : (
          /* Step 2 Form: Detailed Address & Birds */
          <form onSubmit={handleStep2} className="mt-8 space-y-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Phone (for delivery alerts)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="sm:col-span-2 px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">
                What species are in your flock?
              </label>
              <select
                value={birdType}
                onChange={(e) => setBirdType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none"
              >
                <option>Budgies / Finches / Canaries</option>
                <option>Cockatiels / Small Conures / Lovebirds</option>
                <option>African Greys / Amazons / Pionus</option>
                <option>Macaws / Cockatoos (Heavy Wood Chewers)</option>
                <option>Sugar Gliders / Small Critters</option>
                <option>Multiple Species / Mixed Aviary</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStatus('success');
                  setMsg('Code WELCOME15 unlocked! Profile skipped.');
                }}
                className="w-1/3 py-3 rounded-xl bg-transparent border border-emerald-700 text-emerald-300 font-bold text-xs hover:bg-emerald-800 transition"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-2/3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow cursor-pointer"
              >
                {status === 'loading' ? 'Saving Profile...' : 'Complete Profile & Save'}
              </button>
            </div>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-center text-xs text-rose-300 font-medium">{msg}</p>
        )}
      </div>
    </section>
  );
}