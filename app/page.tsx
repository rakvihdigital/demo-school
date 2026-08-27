'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Updated Authentication Logic with Admin Pages Redirect
    if (email === 'admin@school.com' && password === 'admin123') {
      router.push('/adminpages');
    } else if (email === 'teacher@school.com' && password === 'teacher123') {
      router.push('/teacherpages');
    } else if (email === 'parent@school.com' && password === 'parent123') {
      router.push('/parentpages');
    } else {
      setError('Invalid email or password. Please check the dummy credentials.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6 text-slate-100">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Rakvih School Demo
          </h1>
          <p className="text-sm text-slate-400 mt-2">Secure Login Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., admin@school.com"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-4"
          >
            Login to Portal
          </button>
        </form>

        {/* Helper text for demo purposes */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Demo Credentials:</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li><strong className="text-slate-300">Admin:</strong> admin@school.com / admin123 (→ /adminpages)</li>
            <li><strong className="text-slate-300">Teacher:</strong> teacher@school.com / teacher123</li>
            <li><strong className="text-slate-300">Parent:</strong> parent@school.com / parent123</li>
          </ul>
        </div>
      </div>
    </main>
  );
}