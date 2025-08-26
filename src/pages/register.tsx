import { useState } from "react";
import { useRouter } from "next/router";
import { register, uploadProfileImage } from "@/lib/api";
import { getDefaultProfileImage } from "@/lib/profileImageUtils";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    setLoading(true);
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      let foto_perfil_key: string | undefined;

      // Subir imagen si se seleccionó una
      if (profileImage) {
        setUploadingImage(true);
        try {
          foto_perfil_key = await uploadProfileImage(profileImage);
          console.log('Profile image uploaded successfully:', foto_perfil_key);
        } catch (imgError) {
          console.error("Error uploading profile image:", imgError);
          setError("Error al subir la imagen de perfil. Continuando sin imagen...");
          // Continuamos con el registro sin imagen
        } finally {
          setUploadingImage(false);
        }
      }

      // Registrar usuario
      const registerData = { 
        username, 
        nombre_completo: nombre, 
        password,
        foto_perfil_key 
      };
      
      console.log('Registering user with data:', registerData);
      
      await register(registerData);

      alert("¡Registro exitoso! 🎉 Ahora puedes iniciar sesión");
      router.push("/login");
    } catch (err: unknown) {
      let msg = "";
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else {
        msg = "Error al registrar usuario";
      }
      console.error("Registration error:", err);
      setError(msg);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const defaultImage = username ? getDefaultProfileImage(username) : getDefaultProfileImage();
  const displayImage = profileImagePreview || defaultImage;

  return (
    <div className="container-sm mt-xl fade-in">
      <div className="text-center mb-xl">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
        <h1>Crear Cuenta</h1>
        <p className="text-muted">Únete a nuestra comunidad de amantes del arte</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error mb-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Imagen de perfil */}
          <ImageUpload
            currentImageUrl={displayImage}
            onImageSelect={handleImageSelect}
            loading={uploadingImage}
            label="Foto de Perfil (Opcional)"
            preview={profileImagePreview}
          />

          {profileImage && (
            <div className="alert alert-info mb-lg">
              <strong>Imagen seleccionada:</strong>
              <div className="text-sm mt-xs">
                {profileImage.name} ({(profileImage.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre de Usuario</label>
            <input 
              className="form-input"
              placeholder="Elige un nombre de usuario único"
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input 
              className="form-input"
              placeholder="Tu nombre completo"
              value={nombre} 
              onChange={e => setNombre(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Repite tu contraseña"
              value={confirm} 
              onChange={e => setConfirm(e.target.value)}
              required
              disabled={loading}
            />
            {password && confirm && password !== confirm && (
              <div className="text-danger text-sm mt-sm">
                Las contraseñas no coinciden
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="btn btn-success btn-lg"
            style={{ width: '100%' }}
            disabled={loading || uploadingImage || (password !== confirm)}
          >
            {loading ? (
              <>
                <span className="pulse">⏳</span> 
                {uploadingImage ? "Subiendo imagen..." : "Creando cuenta..."}
              </>
            ) : (
              <>
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-lg">
          <p className="text-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold">
              Inicia sesión aquí
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