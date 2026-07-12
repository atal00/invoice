'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Mail } from 'lucide-react';
import styles from '@/components/ui/ui.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) router.push('/login');
    else setError(await res.text());
  }

  return (
    <div style={{ display: 'flex', flex: 1, backgroundImage: 'url(/3d-bg.png)', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
      <div className={styles.glassCard} style={{ width: '100%', maxWidth: '440px', padding: '3.5rem 3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', color: '#1e293b', marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>Register</h2>
        
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
            <input name="name" type="text" placeholder="John Doe" required className={styles.neumoInput} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <input name="email" type="email" placeholder="••••••••••••" required className={styles.neumoInput} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input name="password" type="password" placeholder="••••••••••••" required className={styles.neumoInput} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className={styles.neumoBtn}>
              Sign Up
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/login" style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Already have an account? Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
