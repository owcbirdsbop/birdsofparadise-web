'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function UserNav() {
  const [client, setClient] = useState<{ first_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('clients')
          .select('first_name')
          .eq('auth_user_id', user.id)
          .single();
        setClient(data || { first_name: user.email?.split('@')[0] || 'Account' });
      } else {
        setClient(null);
      }
      setLoading(false);
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser();
      } else {
        setClient(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="w-16 h-8 bg-stone-100 animate-pulse rounded-lg" />;
  }

  if (client) {
    return (
      <Link
        href="/account"
        className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition"
      >
        <span>👤</span>
        <span className="max-w-[100px] truncate">{client.first_name || 'My Account'}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl hover:bg-stone-100 transition"
    >
      Sign In
    </Link>
  );
}