import { useState } from "react";
import { useRouter } from "next/router";
import { updateProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getProfileImageUrl } from "@/lib/profileImageUtils";
import EditProfileForm from "@/components/EditProfileForm";
import Link from "next/link";

export default function EditProfilePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="container-sm mt-xl text-center fade-in">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1>Acceso Requerido</h1>
        <p className="text-muted mb-lg">Debes iniciar sesión para editar tu perfil</p>
        <Link href="/login" className="btn btn-primary btn-lg">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError("");

      // Validar que se proporcionó la contraseña
      if (!data.passwordConfirm || data.passwordConfirm === "") {
        setError("Debes ingresar tu contraseña para confirmar los cambios");
        return;
      }

      console.log('Updating profile with data:', data);

      // Llamar al API
      await updateProfile({
        username: user.username,
        passwordConfirm: data.passwordConfirm as string,
        usernameNuevo: data.usernameNuevo as string,
        nombre_completo: data.nombre_completo as string,
        foto_perfil_key: data.foto_perfil_key as string | undefined,
      });

      // Actualizar el usuario en el contexto
      const updatedUser = {
        ...user,
        username: data.usernameNuevo as string || user.username,
        nombre_completo: data.nombre_completo as string || user.nombre_completo,
        foto_perfil_s3: data.foto_perfil_key as string || user.foto_perfil_s3,
      };
      
      console.log('Updated user data:', updatedUser);
      setUser(updatedUser);

      alert("¡Perfil actualizado exitosamente! 🎉");
      router.push("/profile");

    } catch (err) {
      console.error("Error updating profile:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al actualizar el perfil. Verifica tu contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  const profileImageUrl = getProfileImageUrl(user);

  return (
    <div className="container-sm mt-xl fade-in">
      <div className="text-center mb-xl">
        {/* Imagen de perfil actual */}
        <div 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--primary)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-accent)'
          }}
        >
          <img 
            src={profileImageUrl}
            alt={`Foto actual de ${user.username}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <h1>Editar Perfil</h1>
        <p className="text-muted">Actualiza tu información personal</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Información Actual</h3>
          <div className="grid grid-cols-1 gap-md">
            <div className="flex gap-md">
              <strong>Usuario:</strong>
              <span className="text-muted">{user.username}</span>
            </div>
            <div className="flex gap-md">
              <strong>Nombre:</strong>
              <span className="text-muted">{user.nombre_completo}</span>
            </div>
            <div className="flex gap-md">
              <strong>Foto:</strong>
              <span className="text-muted">
                {user.foto_perfil_s3 ? 'Imagen personalizada' : 'Avatar por defecto'}
              </span>
            </div>
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-error mb-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          <EditProfileForm user={user} onSave={handleSave} />
        </div>

        {loading && (
          <div className="text-center p-lg">
            <div className="pulse">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <p>Actualizando perfil...</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-lg">
        <Link href="/profile" className="btn btn-secondary">
          ← Volver al perfil
        </Link>
      </div>
    </div>
  );
}