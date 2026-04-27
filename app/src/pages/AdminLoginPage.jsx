import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const s = {
  page: {
    minHeight: '100vh',
    background: '#080808',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  box: {
    width: '100%',
    maxWidth: '360px',
    padding: '2.5rem',
    border: '1px solid #222',
    background: '#0d0d0d',
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    letterSpacing: '0.15em',
    color: '#f0ebe2',
    marginBottom: '2rem',
    display: 'block',
  },
  label: {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    color: '#666',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: '#111',
    border: '1px solid #222',
    color: '#f0ebe2',
    padding: '0.75rem',
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    background: '#f0ebe2',
    color: '#080808',
    border: 'none',
    padding: '0.85rem',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 600,
  },
  err: {
    color: '#c0392b',
    fontSize: '0.8rem',
    marginBottom: '1rem',
  },
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.cursor = 'auto';
    return () => { document.body.style.cursor = ''; };
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/admin');
  };

  return (
    <div style={s.page}>
      <div style={s.box}>
        <span style={s.logo}>framesbyraqueed</span>
        <form onSubmit={login}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={s.err}>{error}</p>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
