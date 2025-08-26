// src/lib/api.ts
import { User, Artwork } from "@/types";

/** Normaliza la base para evitar dobles // si tu .env tiene barra final */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

/** DTOs (request payloads) */
interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  nombre_completo: string;
  password: string;
  foto_perfil_key?: string;
}

interface PurchaseData {
  username: string;
  id_obra: number;
}

interface UpdateProfileData {
  username: string;
  passwordConfirm: string;
  usernameNuevo?: string;
  nombre_completo?: string;
  foto_perfil_key?: string;
}

interface TopupData {
  username: string;
  monto: number;
}

interface S3PresignData {
  folder: string;
  filename: string;
  contentType: string;
}

interface S3PresignResponse {
  uploadUrl: string;
  key: string;
}

/** Cliente genérico */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  console.log('Fetching:', url); // Debug
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` – ${text}` : ""}`);
  }
  return res.json() as Promise<T>;
}

/** Endpoints */

export const login = (data: LoginData) =>
  apiFetch<User>("/auth/login", { method: "POST", body: JSON.stringify(data) });

export const register = (data: RegisterData) =>
  apiFetch<{ msg: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) });

export const getGallery = () =>
  apiFetch<Artwork[]>("/gallery");

// Nuevo endpoint para obras compradas
export const getPurchasedArtworks = (username: string) =>
  apiFetch<Artwork[]>(`/profile/purchased?username=${encodeURIComponent(username)}`);

export const purchase = (data: PurchaseData) =>
  apiFetch<{ msg: string; saldo: number }>("/purchase", { method: "POST", body: JSON.stringify(data) });

export const getProfile = (username: string) =>
  apiFetch<User>(`/profile/me?username=${encodeURIComponent(username)}`);

export const updateProfile = (data: UpdateProfileData) =>
  apiFetch<{ msg: string }>("/profile", { method: "PUT", body: JSON.stringify(data) });

export const topup = (data: TopupData) =>
  apiFetch<{ saldo: number }>("/profile/topup", { method: "POST", body: JSON.stringify(data) });

// Nuevo endpoint para S3 presign
export const getS3PresignedUrl = (data: S3PresignData) =>
  apiFetch<S3PresignResponse>("/s3/presign", { method: "POST", body: JSON.stringify(data) });

/**
 * Sube un archivo a S3 usando una URL presignada
 */
export const uploadFileToS3 = async (file: File, presignedUrl: string): Promise<void> => {
  console.log('Uploading file to S3:', presignedUrl); // Debug
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!response.ok) {
    throw new Error(`Error uploading file: ${response.status} ${response.statusText}`);
  }
};

/**
 * Función completa para subir imagen de perfil
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  console.log('Starting profile image upload:', file.name); // Debug
  
  // Generar nombre único para el archivo
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `profile_${timestamp}_${random}.${extension}`;

  try {
    // Obtener URL presignada
    const { uploadUrl, key } = await getS3PresignedUrl({
      folder: 'profiles',
      filename,
      contentType: file.type
    });
    
    console.log('Got presigned URL, uploading...'); // Debug

    // Subir archivo a S3
    await uploadFileToS3(file, uploadUrl);

    console.log('File uploaded successfully, key:', key); // Debug

    // Retornar la key para almacenar en la base de datos
    return key;
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw error;
  }
};