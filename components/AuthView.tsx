
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { authService } from '../services/auth';
import { User } from '../types';

interface Props {
  onLoginSuccess: (user: User) => void;
}

const AuthView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const errorMsg = params.get('error_description');
    if (errorMsg) {
      setError(`Erro do Google: ${errorMsg}. Dica: Verifique se seu e-mail está na lista de 'Test Users' no Google Cloud Console.`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const user = await authService.login(email, password);
        onLoginSuccess(user);
      } else {
        const user = await authService.signUp(email, password, name);
        if (user && user.id) onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Falha na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      setError(`Erro na conexão com Google. Tente o acesso como visitante.`);
      setIsGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const user = authService.loginAsGuest();
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 bg-[#0A1E32] p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <i className="fas fa-shield-halved text-[40rem] -translate-y-20 translate-x-40 text-slate-800"></i>
        </div>
        <div className="relative z-10"><Logo type="horizontal" size={40} /></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
            Inteligência <br/>que cuida do <br/><span className="text-[#C4953D]">seu futuro.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium">Controle de investimentos automatizado.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#F8F9FB]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-[#0A1E32] tracking-tighter">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta Arvo'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">Acesse sua carteira inteligente.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-6 text-sm font-bold outline-none focus:border-[#C4953D]" required={!isLogin} />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-6 text-sm font-bold outline-none focus:border-[#C4953D]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-6 text-sm font-bold outline-none focus:border-[#C4953D]" required />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[11px] font-bold border border-red-100">
                <i className="fas fa-exclamation-circle mr-2"></i> {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-[#0A1E32] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#12304d] transition-all flex items-center justify-center space-x-3 shadow-lg shadow-slate-900/10">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>{isLogin ? 'Entrar' : 'Cadastrar'}</span>}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
              <span className="bg-[#F8F9FB] px-4">Ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full bg-white border border-slate-200 text-[#0A1E32] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center space-x-4 shadow-sm">
               {isGoogleLoading ? <div className="w-5 h-5 border-2 border-[#0A1E32] border-t-transparent rounded-full animate-spin"></div> : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />}
               <span className="text-[10px]">Google (Bloqueado? Use o botão abaixo)</span>
             </button>
             
             <button onClick={handleGuestLogin} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center space-x-4 shadow-lg shadow-emerald-500/20">
                <i className="fas fa-user-secret"></i>
                <span className="text-[10px]">Acessar como Visitante (Modo Rápido)</span>
             </button>
          </div>

          <div className="text-center pt-4">
             <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0A1E32]">
                {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Entre aqui'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
