import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" style={{ padding: "1.5rem 0" }}> {/* un poco más alto */}
      <div className="container">
        <div className="flex items-center justify-between">
          {/* LOGO / NOMBRE */}
          <div className="flex-1">
            <Link
              href="/"
              className="font-bold text-white glow-effect tracking-wide"
              style={{
                textDecoration: "none",
                letterSpacing: "1.5px",
                fontSize: "2.5rem", // 🔹 un poco más grande
                lineHeight: "1.2",
              }}
            >
              GALERIA DE ARTE
            </Link>
          </div>

          {/* SALDO + BOTONES */}
          <div className="flex items-center gap-4 flex-1 justify-end"> {/* 🔹 un poco más de espacio */}
            {user ? (
              <>
                {/* BLOQUE DE SALDO FIJO */}
                <div
                  className="user-balance pulse-glow px-8 py-4 text-center rounded-lg shadow-lg"
                  style={{
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
                    background: "rgba(0,0,0,0.7)",
                    zIndex: 9999,
                    padding: "1rem 2rem",
                    fontSize: "1.25rem",
                  }}
                >
                  <span className="text-lg block mb-2 font-medium text-white">
                    Hola, <strong>{user.username}</strong>
                  </span>
                  <div className="text-2xl font-bold tracking-wide text-white">
                    ${user.saldo}
                  </div>
                </div>

                {/* BOTONES PERFIL / LOGOUT */}
                <Link
                  href="/profile"
                  className="btn btn-secondary btn-md"
                  style={{ padding: "0.75rem 1.25rem", fontSize: "1rem" }}
                >
                  👤 Mi Perfil
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-danger btn-md"
                  style={{ padding: "0.75rem 1.25rem", fontSize: "1rem" }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-primary btn-md"
                  style={{ padding: "0.75rem 1.25rem", fontSize: "1rem" }}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="btn btn-success btn-md"
                  style={{ padding: "0.75rem 1.25rem", fontSize: "1rem" }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
