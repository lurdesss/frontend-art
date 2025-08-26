import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "../styles/globals.css"; // Importar los estilos globales

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="container slide-in">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}