import React from "react";

export default function CustomerModal({
  isOpen,
  getUserLocation,
  isLocateLoading,
  locateStatus,
  name,
  setName,
  phone,
  setPhone,
  street,
  setStreet,
  number,
  setNumber,
  district,
  setDistrict,
  city,
  matchedZone,
  formatPhone,
  paymentGateway,
  setPaymentGateway,
  setActiveModal,
  handleCustomerSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal active" id="customerModal">
      <div className="modal-content">
        <h2>🛎️ Seus Dados</h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
          Preencha ou confirme seus dados para entrega.
        </p>

        <div style={{ marginBottom: "24px", textAlign: "left" }}>
          <button
            type="button"
            id="geoLocateBtn"
            onClick={getUserLocation}
            disabled={isLocateLoading}
            style={
              locateStatus === "success"
                ? {
                    width: "100%",
                    padding: "14px",
                    background: "rgba(76,175,80,0.08)",
                    border: "1px solid rgba(76,175,80,0.3)",
                    borderRadius: "12px",
                    color: "#4caf50",
                    fontSize: "14px",
                    fontWeight: 600
                  }
                : {
                    width: "100%",
                    padding: "14px",
                    background: "rgba(184,154,95,0.08)",
                    border: "1px solid rgba(184,154,95,0.3)",
                    borderRadius: "12px",
                    color: "var(--gold)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }
            }
          >
            <i className={isLocateLoading ? "fas fa-spinner fa-spin" : "fas fa-map-marker-alt"}></i>
            {isLocateLoading
              ? " Obtendo localização..."
              : locateStatus === "success"
              ? "✅ Localização preenchida!"
              : "📍 Preencher com minha localização"}
          </button>
        </div>

        <form id="customerForm" onSubmit={(e) => e.preventDefault()}>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ color: "var(--gold)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Ex.: Maria Silva"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "6px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
                fontSize: "15px"
              }}
            />
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ color: "var(--gold)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
              WhatsApp (com DDD)
            </label>
            <input
              type="tel"
              placeholder="Ex.: (83) 98765-4321"
              required
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "6px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
                fontSize: "15px"
              }}
            />
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ color: "var(--gold)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Endereço de entrega
            </label>
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <input
                type="text"
                placeholder="Rua / Av."
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                style={{
                  flex: 2,
                  width: "100%",
                  minWidth: 0,
                  padding: "14px",
                  height: "50px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "15px"
                }}
              />
              <input
                type="text"
                placeholder="Nº"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  padding: "14px",
                  height: "50px",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "15px"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Bairro (ex: Altiplano)"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  padding: "14px",
                  height: "50px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "15px"
                }}
              />
              <input
                type="text"
                placeholder="Cidade"
                value={city}
                disabled
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  padding: "14px",
                  height: "50px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--muted)",
                  fontSize: "15px"
                }}
              />
            </div>
            {matchedZone === 0 && district.trim() !== "" && (
              <div id="districtWarning" style={{ marginTop: "8px", fontSize: "13px", color: "var(--gold)", textAlign: "left" }}>
                <div style={{ color: "#b89a5f", marginTop: "8px", lineHeight: "1.6", fontSize: "14px" }}>
                  <i className="fas fa-info-circle"></i> Ainda não atendemos essa região para que possamos lhe entregar a
                  melhor experiência da nossa cozinha. Em breve estaremos com uma unidade pertinho de você. ✨
                  <br />
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    (Lembre-se que você poderá fazer o seu pedido a partir de um endereço central ou de uma localidade
                    mais próxima em outra oportunidade).
                  </span>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* GATEWAY SELECTOR */}
        <div className="gateway-selector" style={{ marginTop: "24px" }}>
          <h4
            className="gateway-title"
            style={{
              color: "var(--gold)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
              textAlign: "left"
            }}
          >
            Meio de Pagamento Seguro
          </h4>
          <div className="gateways-grid">
            <label className="gateway-option">
              <input
                type="radio"
                name="paymentGateway"
                value="mercadopago"
                checked={paymentGateway === "mercadopago"}
                onChange={() => setPaymentGateway("mercadopago")}
              />
              <div className="gateway-box">
                <div className="gateway-box-header">
                  <i className="fa-solid fa-credit-card"></i>
                  <span>Cartão ou Pix</span>
                </div>
                <div className="gateway-box-footer">
                  <span className="secure-processor">Via</span>
                  <strong className="mp-text-small">Mercado Pago</strong>
                </div>
              </div>
            </label>
            <label className="gateway-option">
              <input
                type="radio"
                name="paymentGateway"
                value="woovi"
                checked={paymentGateway === "woovi"}
                onChange={() => setPaymentGateway("woovi")}
              />
              <div className="gateway-box">
                <div className="gateway-box-header">
                  <i className="fa-solid fa-qrcode"></i>
                  <span>Pix Copia e Cola</span>
                </div>
                <div className="gateway-box-footer">
                  <span className="secure-processor">Via</span>
                  <strong className="woovi-text-small">Copia e Cola</strong>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* CONFIDENCE SHIELDS */}
        <div className="checkout-security-block">
          <div className="security-item">
            <i className="fa-solid fa-shield-halved secure-icon-gold"></i>
            <div className="security-text">
              <strong>Ambiente 100% Criptografado</strong>
              <p>Seus dados de pagamento são protegidos por criptografia SSL direta com o processador.</p>
            </div>
          </div>
          {paymentGateway === "mercadopago" && (
            <div className="security-item" id="mpGuaranteeShield" style={{ display: "flex" }}>
              <i className="fa-solid fa-shield-halved secure-icon-gold" style={{ fontSize: "28px" }}></i>
              <div className="security-text">
                <strong>Compra Garantida Mercado Pago</strong>
                <p>Receba a sua experiência gastronômica ou o seu dinheiro de volta.</p>
              </div>
            </div>
          )}
        </div>

        {/* BANDETRAS MP */}
        {paymentGateway === "mercadopago" && (
          <div className="accepted-cards-container" id="acceptedCardsRow" style={{ display: "flex" }}>
            <span style={{ color: "var(--muted)", fontSize: "11px", textAlign: "left" }}>
              Bandeiras aceitas via Mercado Pago:
            </span>
            <div className="cards-logos-row" style={{ marginTop: "4px" }}>
              <i className="fa-brands fa-cc-visa card-icon-gray" title="Visa"></i>
              <i className="fa-brands fa-cc-mastercard card-icon-gray" title="Mastercard"></i>
              <i className="fa-brands fa-cc-amex card-icon-gray" title="Amex"></i>
              <i className="fa-brands fa-cc-diners-club card-icon-gray" title="Diners"></i>
              <span className="pix-badge-small">Pix</span>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn" onClick={() => setActiveModal("cart")}>
            Voltar
          </button>
          <button
            className="modal-btn primary"
            disabled={
              matchedZone === 0 ||
              !name ||
              phone.replace(/\D/g, "").length < 10 ||
              !street ||
              !number ||
              !district
            }
            onClick={handleCustomerSubmit}
          >
            Avançar para Pagamento 💳
          </button>
        </div>
      </div>
    </div>
  );
}
