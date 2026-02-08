import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold text-primary">☕ Coffea</Link>
          <h1 className="text-2xl font-display font-bold mt-4">Iniciar Sesión</h1>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-sm font-medium block mb-1">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><label className="text-sm font-medium block mb-1">Contraseña</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full">Ingresar</Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
          </p>
        </div>

        <div className="mt-6 bg-muted rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Cuentas de prueba:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🛒 juan@example.com / buyer123</p>
            <p>🏪 cafedelhuila@example.com / seller123</p>
            <p>🔐 admin@coffea.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
