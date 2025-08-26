import { useEffect, useState } from "react";
import { getGallery, purchase } from "@/lib/api";
import { Artwork } from "@/types";
import { useAuth } from "@/context/AuthContext";
import GalleryItem from "@/components/GalleryItem";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user, setUser } = useAuth();

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        console.log("Loading gallery...");
        const data = await getGallery();
        console.log("Gallery data:", data);
        setArtworks(data);
        setError("");
      } catch (err) {
        console.error("Error loading gallery:", err);
        setError("Error al cargar la galería");
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const handleBuy = async (artwork: Artwork) => {
    if (!user) {
      alert("Debes iniciar sesión para comprar");
      return;
    }

    try {
      const result = await purchase({ 
        username: user.username, 
        id_obra: artwork.id_obra 
      });
      
      alert("Compra realizada exitosamente");
      
      // Actualizar el saldo del usuario
      setUser({
        ...user,
        saldo: result.saldo
      });
      
      // Actualizar la disponibilidad de la obra
      setArtworks(prev => 
        prev.map(art => 
          art.id_obra === artwork.id_obra 
            ? { ...art, disponible: false }
            : art
        )
      );
    } catch (err) {
      console.error("Error en compra:", err);
      alert("Error al realizar la compra. Verifica tu saldo.");
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Galería de Arte</h1>
        <p>Cargando obras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Galería de Arte</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1></h1>
      
      {user && (
        <div style={{ 
          background: '#171616ff', 
          padding: '20px 40px 10px 40px', 
          marginBottom: '20px',
          borderRadius: '5px'
        }}>
          <p>Bienvenido, {user.nombre_completo}</p>
          <p>Saldo disponible: ${user.saldo}</p>
        </div>
      )}

      {artworks.length === 0 ? (
        <p>No hay obras disponibles en este momento.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {artworks.map(artwork => (
            <div key={artwork.id_obra} style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '5px'
            }}>
              <GalleryItem 
                art={artwork} 
                onBuy={() => handleBuy(artwork)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}