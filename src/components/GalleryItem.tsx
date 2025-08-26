import { Artwork } from "@/types";

export default function GalleryItem({ art, onBuy }: { art: Artwork; onBuy?: () => void }) {
  // Get base URL from environment or use a default local path
  const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:5000/images";
  
  // Construct image URL properly
  const getImageUrl = (filename: string | null) => {
    if (!filename) return null;
    
    // If it's already a complete URL, return it
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Remove any leading path separators and construct full URL
    const cleanFilename = filename.replace(/^\/+/, '');
    return `${IMAGE_BASE}/${cleanFilename}`;
  };
  
  const imageUrl = art.imagen_s3 ? getImageUrl(art.imagen_s3) : null;
  
  console.log('Gallery item image URL:', imageUrl); // Debug

  return (
    <div className="gallery-item p-xl">
      <div className="flex gap-lg items-start">
        {imageUrl && (
          <div style={{ flexShrink: 0 }}>
            <img 
              src={imageUrl} 
              alt={art.titulo}
              className="gallery-image"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid var(--border)'
              }}
              onError={(e) => {
                console.error("Error loading image:", imageUrl);
                console.error("IMAGE_BASE:", IMAGE_BASE);
                console.error("art.imagen_s3:", art.imagen_s3);
                // Show placeholder instead of hiding
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIE5vIERpc3BvbmlibGU8L3RleHQ+Cjwvc3ZnPg==";
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", imageUrl);
              }}
            />
          </div>
        )}
        
        {!imageUrl && (
          <div 
            style={{ 
              flexShrink: 0, 
              width: '200px', 
              height: '200px', 
              backgroundColor: 'var(--bg-accent)',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'var(--text-muted)'
            }}
          >
          </div>
        )}
        
        <div className="flex-1">
          <div className="card-header">
            <h3 className="mb-sm">{art.titulo}</h3>
          </div>
          
          <div className="card-body">
            <p className="mb-sm">
              <strong>Autor:</strong> {art.autor_nombre}
            </p>
            <p className="mb-sm">
              <strong>Año:</strong> {art.anio_publicacion}
            </p>
            <p className="text-xl font-bold mb-sm glow-effect">
              ${Number(art.precio).toFixed(2)}
            </p>
            
            <div className="mb-lg">
              {art.disponible ? (
                <span className="alert alert-success" style={{ padding: '0.5rem 1rem', display: 'inline-block' }}>
                  ✅ Disponible
                </span>
              ) : (
                <span className="alert alert-error" style={{ padding: '0.5rem 1rem', display: 'inline-block' }}>
                  ❌ Vendido
                </span>
              )}
            </div>
          </div>
          
          {art.disponible && onBuy && (
            <div className="card-footer">
              <button 
                onClick={onBuy}
                className="btn btn-primary btn-lg pulse-glow"
              >
                🛒 Comprar Ahora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}