import { useState } from "react";

export default function TopupForm({ onTopup }: { onTopup: (monto: number) => void }) {
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopup = async () => {
    const amount = Number(monto);
    
    // Validaciones
    if (!monto || monto.trim() === "") {
      alert("Por favor ingresa un monto");
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido mayor a 0");
      return;
    }

    if (amount > 1000000) { // INCREASED LIMIT
      alert("El monto máximo permitido es $1,000,000");
      return;
    }

    try {
      setLoading(true);
      await onTopup(amount);
      setMonto(""); // Limpiar el campo después de la recarga exitosa
    } catch (error) {
      console.error("Error in topup:", error);
    } finally {
      setLoading(false);
    }
  };

  // Montos predefinidos - UPDATED WITH HIGHER AMOUNTS
  const quickAmounts = [100, 1000, 5000, 10000, 50000, 100000, 1000000];

  return (
    <div>
      {/* Montos rápidos */}
      <div className="mb-lg">
        <h4 className="mb-md">Montos rápidos</h4>
        <div className="flex gap-sm flex-wrap">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => setMonto(amount.toString())}
              className="quick-amount-btn"
              disabled={loading}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Campo personalizado */}
      <div className="form-group">
        <label className="form-label">Monto personalizado</label>
        <div className="flex gap-md items-center">
          <div style={{ flex: 1 }}>
            <input 
              type="number"
              className="form-input"
              placeholder="Ingresa el monto deseado"
              value={monto} 
              onChange={e => setMonto(e.target.value)}
              min="1"
              max="1000000"
              step="1"
              disabled={loading}
            />
            <div className="text-sm text-muted mt-xs">
              Mínimo: $1 • Máximo: $1,000,000
            </div>
          </div>
          
          <button 
            onClick={handleTopup}
            disabled={loading || !monto || Number(monto) <= 0}
            className="btn btn-success btn-lg"
          >
            {loading ? (
              <>
                <span className="pulse">⳺</span> Procesando...
              </>
            ) : (
              <>
                RECARGAR
              </>
            )}
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="alert alert-info">
        <strong>Información:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>La recarga es instantánea</li>
          <li>Los fondos se agregan inmediatamente a tu saldo</li>
          <li>Puedes usar montos rápidos o ingresar uno personalizado</li>
          <li>Nuevo límite máximo: $1,000,000</li>
        </ul>
      </div>
    </div>
  );
}