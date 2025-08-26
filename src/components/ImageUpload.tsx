import { useState, useRef } from "react";
import { validateImageFile } from "@/lib/profileImageUtils";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelect: (file: File) => void;
  loading?: boolean;
  label?: string;
  preview?: string;
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageSelect, 
  loading = false,
  label = "Foto de Perfil",
  preview
}: ImageUploadProps) {
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Archivo inválido");
      return;
    }

    onImageSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const displayImageUrl = preview || currentImageUrl;

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
      {/* Vista previa de imagen */}
      {displayImageUrl && (
        <div className="text-center mb-md">
          <div 
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--border)',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-accent)'
            }}
          >
            <img 
              src={displayImageUrl}
              alt="Foto de perfil"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4`;
              }}
            />
          </div>
        </div>
      )}

      {/* Zona de drop */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-lg text-center cursor-pointer transition-all
          ${dragOver 
            ? 'border-primary bg-accent/20' 
            : 'border-gray-300 hover:border-primary hover:bg-accent/10'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        {loading ? (
          <div className="pulse">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>Subiendo imagen...</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {dragOver ? '📁' : '📁'}
            </div>
            <p className="text-lg font-semibold mb-sm">
              {dragOver ? 'Suelta la imagen aquí' : 'Seleccionar foto de perfil'}
            </p>
            <p className="text-sm text-muted">
              Arrastra y suelta o haz clic para seleccionar<br />
              Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)
            </p>
          </>
        )}
      </div>

      {/* Input oculto */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />

      {/* Error */}
      {error && (
        <div className="text-danger text-sm mt-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-muted mt-sm">
        💡 La imagen se redimensionará automáticamente para optimizar el almacenamiento
      </div>
    </div>
  );
}