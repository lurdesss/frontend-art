import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile, topup } from "@/lib/api";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getProfileImageUrl, getDefaultProfileImage } from "@/lib/profileImageUtils";
import ProfileInfo from "@/components/ProfileInfo";
import TopupForm from "@/components/TopupForm";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getProfile(user.username)
        .then((fetchedProfile) => {
          console.log('Fetched profile:', fetchedProfile); // Debug
          setProfile(fetchedProfile);
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container-sm mt-xl text-center fade-in">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
        <h1>Acceso Requerido</h1>
        <p className="text-muted mb-lg">No has iniciado sesión</p>
        <Link href="/login" className="btn btn-primary btn-lg">
          INICIAR SESION
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-xl">
        <div className="pulse">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
          <h1>Mi Perfil</h1>
          <p className="text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  const handleTopup = async (monto: number) => {
    try {
      const result = await topup({ 
        username: user.username, 
        monto 
      });
      
      alert(`¡Saldo recargado exitosamente! 🎉\nNuevo saldo: $${result.saldo}`);
      
      // Actualizar el saldo en el perfil local y en el contexto
      const updatedProfile = { 
        ...profile!, 
        saldo: Number(result.saldo) 
      };
      setProfile(updatedProfile);
      setUser({
        ...user,
        saldo: Number(result.saldo)
      });
    } catch (err) {
      console.error("Error al recargar saldo:", err);
      alert("Error al recargar saldo. Intenta nuevamente.");
    }
  };

  const profileImageUrl = profile ? getProfileImageUrl(profile) : getDefaultProfileImage(user?.username);

  return (
    <div className="fade-in">
      <div className="text-center mb-xl">
        {/* Imagen de perfil en el header */}
        <div 
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid var(--primary)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-accent)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <img 
            src={profileImageUrl}
            alt={`Foto de perfil de ${profile?.username || user?.username}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.src = getDefaultProfileImage(profile?.username || user?.username);
            }}
          />
        </div>
        
        <h1>Hola, {profile?.nombre_completo || profile?.username}! 👋</h1>
        <p className="text-muted">Gestiona tu cuenta y saldo</p>
      </div>
      
      {profile && (
        <div className="grid grid-cols-1 gap-xl" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Información del Usuario */}
          <div className="card">
            <div className="card-header">
              <h2>Información Personal</h2>
            </div>
            
            <div className="card-body">
              <ProfileInfo user={profile} />
            </div>
            
            <div className="card-footer">
              <Link 
                href="/profile/edit"
                className="btn btn-primary"
              >
                Editar Perfil
              </Link>
              
              <Link 
                href="/profile/purchased"
                className="btn btn-success"
              >
                Mis Obras Adquiridas
              </Link>
            </div>
          </div>

          {/* Recargar Saldo */}
          <div className="card">
            <div className="card-header">
              <h2>Recargar Saldo</h2>
              <p className="text-muted mb-sm">
                Saldo actual: <strong className="text-success">${profile.saldo}</strong>
              </p>
            </div>
            
            <div className="card-body">
              <TopupForm onTopup={handleTopup} />
            </div>
          </div>

          {/* Navegación rápida */}
          <div className="card text-center">
            <div className="card-body">
              <h3 className="mb-md">Navegación Rápida</h3>
              <div className="flex gap-md justify-center flex-wrap">
                <Link href="/" className="btn btn-secondary">
                  Galería Principal
                </Link>
                <Link href="/profile/purchased" className="btn btn-secondary">
                  Mis Compras
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}