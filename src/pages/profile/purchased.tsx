import { useEffect, useState } from "react";
import Link from "next/link";
import { getPurchasedArtworks } from "@/lib/api";
import { Artwork } from "@/types";
import { useAuth } from "@/context/AuthContext";
import GalleryItem from "@/components/GalleryItem";

export default function PurchasedArtworksPage() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      getPurchasedArtworks(user.username)
        .then(setArtworks)
        .catch((err) => {
          console.error("Error fetching purchased artworks:", err);
          setError("Error al cargar las obras adquiridas");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container-sm mt-xl text-center fade-in">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1>Acceso Requerido</h1>
        <p className="text-muted mb-lg">Debes iniciar sesión para ver tus obras</p>
        <Link href="/login" className="btn btn-primary btn-lg">
          🔑 Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-xl">
        <div className="pulse">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
          <h1>Mis Obras Adquiridas</h1>
          <p className="text-lg">Cargando tu colección...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-sm mt-xl text-center fade-in">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h1>Error</h1>
        <p className="text-muted mb-lg">{error}</p>
        <Link href="/profile" className="btn btn-primary">
          ← Volver al perfil
        </Link>
      </div>
    );
  }

  // Calculate total investment safely
  const totalInvestment = artworks.reduce((sum, artwork) => {
    const precio = Number(artwork.precio) || 0;
    return sum + precio;
  }, 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="text-center mb-xl">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
        <h1>Mi Colección de Arte</h1>
        <p className="text-muted">
          {artworks.length === 0 
            ? "Aún no has adquirido ninguna obra" 
            : `Has adquirido ${artworks.length} obra${artworks.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      <div className="container-lg">
        {artworks.length === 0 ? (
          <div className="text-center">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card-body text-center p-xl">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                <h2 className="mb-md">¡Comienza tu colección!</h2>
                <p className="text-muted mb-lg">
                  Explora nuestra galería y encuentra obras de arte únicas para comenzar tu colección personal.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                  🏛️ Explorar Galería
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
              <div className="card text-center">
                <div className="card-body">
                  <div style={{ fontSize: '2rem' }}>🎨</div>
                  <div className="font-bold text-lg">{artworks.length}</div>
                  <div className="text-sm text-muted">
                    Obra{artworks.length !== 1 ? 's' : ''} Adquirida{artworks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="card text-center">
                <div className="card-body">
                  <div style={{ fontSize: '2rem' }}>💰</div>
                  <div className="font-bold text-lg">
                    ${totalInvestment.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted">Inversión Total</div>
                </div>
              </div>

              <div className="card text-center">
                <div className="card-body">
                  <div style={{ fontSize: '2rem' }}>📈</div>
                  <div className="font-bold text-lg">
                    ${(totalInvestment / artworks.length).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted">Precio Promedio</div>
                </div>
              </div>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 gap-lg">
              {artworks.map((artwork) => (
                <div key={artwork.id_obra} className="card">
                  <GalleryItem art={artwork} />
                  
                  <div className="card-footer">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted">
                        ✅ Obra adquirida
                      </div>
                      <div className="text-sm font-semibold text-success">
                        💎 En tu colección
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="text-center mt-xl">
          <div className="flex gap-md justify-center flex-wrap">
            <Link href="/profile" className="btn btn-secondary">
              ← Mi Perfil
            </Link>
            <Link href="/" className="btn btn-primary">
              🏛️ Explorar Más Arte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}