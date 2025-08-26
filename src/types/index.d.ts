export interface User {
  id_usuario?: number;
  username: string;
  nombre_completo: string;
  saldo: number;
  foto_perfil_s3?: string;
}

export interface Artwork {
  id_obra: number;
  titulo: string;
  autor_nombre: string;
  anio_publicacion: number;
  precio: number;
  imagen_s3: string;
  disponible: boolean;
}
