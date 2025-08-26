// src/lib/profileImageUtils.ts
import { User } from "@/types";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:5000";

/**
 * Genera la URL completa de la imagen de perfil del usuario
 * Works with file-based storage system
 */
export function getProfileImageUrl(user: User | null): string {
  if (!user?.foto_perfil_s3) {
    return getDefaultProfileImage(user?.username);
  }
  
  // If it's already a complete URL, return it
  if (user.foto_perfil_s3.startsWith('http')) {
    return user.foto_perfil_s3;
  }
  
  // Remove the folder path and construct clean URL
  const filename = user.foto_perfil_s3.replace('Fotos_Publicadas/', '');
  const url = `${IMAGE_BASE_URL}/${filename}`;
  console.log('Profile image URL:', url); // Debug
  return url;
}

/**
 * Genera una imagen de perfil por defecto usando Dicebear
 */
export function getDefaultProfileImage(seed?: string): string {
  const username = seed || 'default';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}&backgroundColor=b6e3f4`;
}

/**
 * Valida si un archivo es una imagen válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Verificar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)' 
    };
  }

  // Verificar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'La imagen debe ser menor a 5MB' 
    };
  }

  return { valid: true };
}

/**
 * Note: For your current testing setup, profile image upload is disabled
 * since it requires file upload functionality on the backend
 */