import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const user = await login({ username, password });
      setUser(user);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Credenciales inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm mt-xl fade-in">
      <div className="text-center mb-xl">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
        <h1>INICIA SESIÓN</h1>
        <p className="text-muted">Accede a tu cuenta para explorar y comprar arte</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error mb-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">👤 Usuario</label>
            <input
              className="form-input"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="pulse">⏳</span> Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-lg">
          <p className="text-muted">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center mt-lg">
        <Link href="/" className="btn btn-secondary">
          ← Volver a la galería
        </Link>
      </div>
    </div>
  );
}