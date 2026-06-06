import React from "react";

export default function LoyaltyCard({
  loyaltyPhone,
  setLoyaltyPhone,
  loyaltyLoading,
  checkLoyaltyCard,
  activeStampsPhone,
  loyaltyStamps,
  loyaltyMessage,
  formatPhone
}) {
  return (
    <div className="loyalty-container reveal visible">
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          color: "var(--gold)",
          fontSize: "20px",
          letterSpacing: "2px",
          marginBottom: "12px"
        }}
      >
        💎 CARTÃO FIDELIDADE PREMIUM
      </h3>
      <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
        A cada 9 pedidos, o seu 10º prato principal é por nossa conta.
        <br />
        Digite seu telefone para consultar seus carimbos.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          maxWidth: "400px",
          margin: "0 auto 20px"
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
        <div id="loyaltyStampsGrid" className="stamp-grid" style={{ display: "grid" }}>
          {Array.from({ length: 10 }).map((_, idx) => {
            const i = idx + 1;
            const currentStamps = loyaltyStamps % 10;
            if (i === 10) {
              const activeClass = currentStamps === 9 || loyaltyStamps >= 9 ? "active" : "";
              return (
                <div key={i} className={`stamp-circle free-gift ${activeClass}`} title="10º Prato Grátis!">
                  <i className="fas fa-gift"></i>
                </div>
              );
            } else {
              const activeClass = i <= currentStamps ? "active" : "";
              const content = i <= currentStamps ? <i className="fas fa-crown"></i> : i;
              return (
                <div key={i} className={`stamp-circle ${activeClass}`}>
                  {content}
                </div>
              );
            }
          })}
        </div>
      )}
      {loyaltyMessage && (
        <p
          id="loyaltyStatusMessage"
          style={{ marginTop: "20px", fontSize: "14px", color: "var(--gold)", fontWeight: "600", lineHeight: "1.5" }}
        >
          {loyaltyMessage}
        </p>
      )}
    </div>
  );
}
