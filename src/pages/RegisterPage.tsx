import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/coffea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER' as Role });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (register(form.name, form.email, form.password, form.role)) {
      navigate('/');
    } else {
      setError('El email ya está registrado');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold text-primary">☕ Coffea</Link>
          <h1 className="text-2xl font-display font-bold mt-4">Crear Cuenta</h1>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-sm font-medium block mb-1">Nombre</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="text-sm font-medium block mb-1">Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="text-sm font-medium block mb-1">Contraseña</label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
            <div>
              <label className="text-sm font-medium block mb-1">Tipo de cuenta</label>
              <select className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
                <option value="BUYER">Comprador</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Registrarse</Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
