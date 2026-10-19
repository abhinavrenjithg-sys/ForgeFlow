import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setIsLoading(true);
    setError(null);
    try {
      await register(email, fullName, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#84CC16] to-[#65A30D] text-[#0B0F17] shadow-xl shadow-lime-500/20 mb-3">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ForgeFlow</h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">Plan smarter. Build faster. Ship together.</p>
        </div>

        <div className="bg-[#141A24] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="text-base font-semibold text-white">Create an account</h2>
            <Link to="/login" className="text-xs text-[#84CC16] hover:underline font-medium">
              Sign in instead
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Vance"
                  className="w-full bg-[#0F141E] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@forgeflow.io"
                  className="w-full bg-[#0F141E] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#0F141E] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] rounded-xl text-xs font-semibold shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
