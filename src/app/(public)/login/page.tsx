'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, CheckCircle2 } from 'lucide-react';
import styles from '@/components/ui/ui.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (isRegister) {
      try {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const regData = await regRes.json();
        if (!regRes.ok) {
          setError(regData.error || 'Registration failed');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setError('An error occurred during registration');
        setIsLoading(false);
        return;
      }
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (res?.error) {
      setError(isRegister ? 'Registered successfully but login failed' : 'Invalid credentials');
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div style={{ display: 'flex', flex: 1, backgroundImage: 'url(/3d-bg.png)', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
      <div className={styles.glassCard} style={{ width: '100%', maxWidth: '440px', padding: '3.5rem 3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', color: '#1e293b', marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>
          {isRegister ? 'Create Account' : 'Login'}
        </h2>
        
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
              <input name="name" type="text" placeholder="John Doe" required className={styles.neumoInput} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <input name="email" type="email" placeholder="john@example.com" required className={styles.neumoInput} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input name="password" type="password" placeholder="••••••••••••" required minLength={8} className={styles.neumoInput} />
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" disabled={isLoading} className={styles.neumoBtn}>
              {isLoading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Login')}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
