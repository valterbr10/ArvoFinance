
import { User } from '../types';
import { supabase } from './supabase';

export const authService = {
  mapSupabaseUser: (sbUser: any): User => ({
    id: sbUser.id,
    email: sbUser.email!,
    name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email!.split('@')[0],
    tier: 'Pro',
    createdAt: sbUser.created_at
  }),

  login: async (email: string, pass: string): Promise<User> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockUser: User = {
            id: 'mock-user-id',
            email,
            name: email.split('@')[0],
            tier: 'Pro',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('arvo_user', JSON.stringify(mockUser));
        return mockUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    const user = authService.mapSupabaseUser(data.user);
    localStorage.setItem('arvo_user', JSON.stringify(user));
    return user;
  },

  loginAsGuest: (): User => {
    const guestUser: User = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      email: 'visitante@arvo.com',
      name: 'Investidor Visitante',
      tier: 'Free',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('arvo_user', JSON.stringify(guestUser));
    return guestUser;
  },

  signUp: async (email: string, pass: string, name: string): Promise<User> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
      return authService.login(email, pass);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { name }
      }
    });
    
    if (error) throw error;
    if (!data.user) throw new Error("Erro ao criar usuário.");

    const user = authService.mapSupabaseUser(data.user);
    
    if (data.session) {
      localStorage.setItem('arvo_user', JSON.stringify(user));
    }
    
    return user;
  },

  signInWithGoogle: async () => {
    const redirectTo = window.location.origin;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    try {
      if (!supabase.supabaseUrl.includes('nao-configurado')) {
        await supabase.auth.signOut();
      }
    } catch (e) {}
    localStorage.removeItem('arvo_user');
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem('arvo_user');
    return saved ? JSON.parse(saved) : null;
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    if (supabase.supabaseUrl.includes('nao-configurado')) return () => {};

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user = authService.mapSupabaseUser(session.user);
        localStorage.setItem('arvo_user', JSON.stringify(user));
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('arvo_user');
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  }
};
