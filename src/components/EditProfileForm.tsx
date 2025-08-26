import { useState } from "react";
import { User } from "@/types";
import { uploadProfileImage } from "@/lib/api";
import { getProfileImageUrl, getDefaultProfileImage } from "@/lib/profileImageUtils";
import ImageUpload from "./ImageUpload";

export default function EditProfileForm({ 
  user, 
  onSave 
}: { user: User; onSave: (data: Record<string, unknown>) => void }) {
  const [usernameNuevo, setUsernameNuevo] = useState(user.username);
  const [nombre, setNombre] = useState(user.nombre_completo);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (file: File) => {
    setProfileImage(file);
    
    // Generar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let foto_perfil_key: string | undefined;

    try {
      // Subir nueva imagen si se seleccionó una
      if (profileImage) {
        setUploadingImage(true);
        foto_perfil_key = await uploadProfileImage(profileImage);
      }

      onSave({ 
        username: user.username, 
        usernameNuevo, 
        nombre_completo: nombre, 
        passwordConfirm,
        foto_perfil_key
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen. Los demás cambios se guardarán sin la imagen.");
      
      // Guardar sin la imagen
      onSave({ 
        username: user.username, 
        usernameNuevo, 
        nombre_completo: nombre, 
        passwordConfirm 
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const hasChanges = usernameNuevo !== user.username || 
                     nombre !== user.nombre_completo || 
                     profileImage !== null;

  const currentImageUrl = getProfileImageUrl(user);
  const displayImageUrl = profileImagePreview || currentImageUrl;

  return (
    <form onSubmit={handleSubmit}>
      {/* Imagen de perfil */}
      <ImageUpload
        currentImageUrl={displayImageUrl}
        onImageSelect={handleImageSelect}
        loading={uploadingImage}
        label="Cambiar Foto de Perfil"
        preview={profileImagePreview}
      />

      {profileImage && (
        <div className="alert alert-info mb-lg">
          <strong>Nueva imagen seleccionada:</strong>
          <div className="text-sm mt-xs">
            {profileImage.name} ({(profileImage.size / 1024).toFixed(1)} KB)
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">👤 Nuevo Usuario</label>
        <input 
          className="form-input"
          placeholder="Ingresa tu nuevo nombre de usuario"
          value={usernameNuevo} 
          onChange={e => setUsernameNuevo(e.target.value)}
          required
        />
        {usernameNuevo !== user.username && (
          <div className="text-sm text-muted mt-xs">
            Cambiarás de {user.username} a {usernameNuevo}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">✨ Nuevo Nombre</label>
        <input 
          className="form-input"
          placeholder="Ingresa tu nuevo nombre completo"
          value={nombre} 
          onChange={e => setNombre(e.target.value)}
          required
        />
        {nombre !== user.nombre_completo && (
          <div className="text-sm text-muted mt-xs">
            ℹ️ Cambiarás de {user.nombre_completo} a {nombre}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">🔐 Confirmar Contraseña</label>
        <input 
          type="password" 
          className="form-input"
          placeholder="Ingresa tu contraseña actual para confirmar"
          value={passwordConfirm} 
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        <div className="text-sm text-muted mt-xs">
          Requerido para confirmar los cambios por seguridad
        </div>
      </div>

      {hasChanges && (
        <div className="alert alert-warning mb-lg">
          <strong>Cambios pendientes:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            {usernameNuevo !== user.username && (
              <li>Usuario: {user.username} → {usernameNuevo}</li>
            )}
            {nombre !== user.nombre_completo && (
              <li>Nombre: {user.nombre_completo} → {nombre}</li>
            )}
            {profileImage && (
              <li>Foto de perfil: Nueva imagen seleccionada</li>
            )}
          </ul>
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-success btn-lg"
        style={{ width: '100%' }}
        disabled={!hasChanges || !passwordConfirm || uploadingImage}
      >
        {uploadingImage ? (
          <>
            <span className="pulse">⏳</span> Subiendo imagen...
          </>
        ) : hasChanges ? (
          <>
            💾 Guardar Cambios
          </>
        ) : (
          <>
            Sin cambios pendientes
          </>
        )}
      </button>
    </form>
  );
}