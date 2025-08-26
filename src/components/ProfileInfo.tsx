import { User } from "@/types";
import { getProfileImageUrl, getDefaultProfileImage } from "@/lib/profileImageUtils";

export default function ProfileInfo({ user }: { user: User }) {
  const profileImageUrl = getProfileImageUrl(user);

  return (
    <div className="grid grid-cols-1 gap-md">
      {/* Foto de perfil */}
      <div className="flex items-center gap-md p-md" style={{ backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)' }}>
        
        <div className="flex-1">
          <div className="font-semibold text-sm text-muted">FOTO DE PERFIL</div>
          <div className="flex items-center gap-md mt-xs">
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-accent)'
              }}
            >
              <img 
                src={profileImageUrl}
                alt={`Foto de perfil de ${user.username}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.src = getDefaultProfileImage(user.username);
                }}
              />
            </div>
            <div className="font-bold text-sm">
              {user.foto_perfil_s3 ? 'Imagen personalizada' : 'Default Avatar'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-md p-md" style={{ backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)' }}>
        
        <div className="flex-1">
          <div className="font-semibold text-sm text-muted">USUARIO</div>
          <div className="font-bold">{user.username}</div>
        </div>
      </div>

      <div className="flex items-center gap-md p-md" style={{ backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)' }}>
        
        <div className="flex-1">
          <div className="font-semibold text-sm text-muted">NOMBRE COMPLETO</div>
          <div className="font-bold">{user.nombre_completo}</div>
        </div>
      </div>

      <div className="flex items-center gap-md p-md" style={{ backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)' }}>
        
        <div className="flex-1">
          <div className="font-semibold text-sm text-muted">SALDO DISPONIBLE</div>
          <div className="user-balance" style={{ display: 'inline-block', padding: '0.5rem 1rem', marginTop: '0.25rem' }}>
            ${user.saldo}
          </div>
        </div>
      </div>
    </div>
  );
}