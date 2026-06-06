import React from "react";

export default function LoyaltyCard({
  loyaltyPhone,
  setLoyaltyPhone,
  loyaltyLoading,
  checkLoyaltyCard,
  activeStampsPhone,
  loyaltyMessage,
  formatPhone,
  setActiveModal
}) {
  return (
    <div className="loyalty-container reveal visible">
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          color: "var(--gold)",
          fontSize: "19px",
          letterSpacing: "2px",
          marginBottom: "12px"
        }}
      >
        💎 CARTÃO FIDELIDADE PREMIUM
      </h3>
      <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "20px", lineHeight: "1.6" }}>
        A cada 9 pedidos, o seu 10º prato principal é por nossa conta.
        <br />
        Digite seu telefone para consultar seus carimbos.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          maxWidth: "320px",
          margin: "0 auto"
        }}
      >
        <input
          type="tel"
          id="loyaltyPhoneInput"
          placeholder="Ex.: (83) 98765-4321"
          value={loyaltyPhone}
          onChange={(e) => setLoyaltyPhone(formatPhone(e.target.value))}
          style={{
            flex: 1,
            padding: "14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "var(--text)",
            fontSize: "15px",
            textAlign: "center",
            outline: "none",
            fontFamily: "'Inter', sans-serif"
          }}
        />
        <button
          type="button"
          className="btn"
          onClick={checkLoyaltyCard}
          style={{ padding: "14px 22px", fontSize: "13px", fontWeight: "600", borderRadius: "12px", height: "100%" }}
        >
          {loyaltyLoading ? <i className="fas fa-spinner fa-spin"></i> : "Consultar"}
        </button>
      </div>

      {activeStampsPhone && (
        <p
          onClick={() => setActiveModal("loyalty")}
          style={{
            marginTop: "15px",
            fontSize: "12.5px",
            color: "#4caf50",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "underline",
            letterSpacing: "0.5px"
          }}
        >
          ✅ Fidelidade Ativo! Clique para ver seus carimbos.
        </p>
      )}
    </div>
  );
}
