import React from "react";

export default function PaymentModal({
  isOpen,
  paymentGateway,
  cart,
  subtotal,
  district,
  deliveryFee,
  loyaltyDiscount,
  totalGeral,
  handleMercadoPagoPayment,
  handleWooviPix,
  wooviQrCode,
  wooviBrCode,
  copyPixCode,
  paymentStatus,
  paymentTimerText,
  sendWooviOrderToWhatsApp,
  setActiveModal
}) {
  if (!isOpen) return null;

  return (
    <div className="modal active" id="paymentModal">
      <div className="modal-content">
        <h2 id="paymentModalTitle">
          {paymentGateway === "mercadopago" ? "💎 Pagamento Seguro" : "💎 Pagamento PIX"}
        </h2>

        {/* DETALHES GERAIS */}
        <div id="paymentDetails">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(184,154,95,0.03))",
              border: "1px solid rgba(184,154,95,0.25)",
              borderRadius: "16px",
              padding: "22px",
              textAlign: "left",
              margin: "20px 0",
              maxHeight: "250px",
              overflowY: "auto",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            <h4
              style={{
                color: "#b89a5f",
                borderBottom: "1px solid rgba(184,154,95,0.25)",
                paddingBottom: "8px",
                marginBottom: "12px",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "700"
              }}
            >
              Resumo do Pedido
            </h4>
            <div style={{ color: "#e4e0d7", fontSize: "14px", lineHeight: "1.6" }}>
              {cart.map((item, idx) => (
                <div key={idx}>
                  <p style={{ margin: "8px 0 4px", color: "#f4f1ea" }}>
                    <strong>
                      {item.qty}x {item.name}
                    </strong>{" "}
                    —{" "}
                    <span style={{ color: "#b89a5f", fontWeight: "600" }}>R$ {item.total.toFixed(2)}</span>
                  </p>
                  {item.extras.map((e, eidx) => (
                    <p key={eidx} style={{ margin: "4px 0 4px 12px", fontSize: "13px", color: "#c5c2b9" }}>
                      ➕ {e.qty}x {e.name} — R$ {(e.price * e.qty).toFixed(2)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(184,154,95,0.25)",
                marginTop: "14px",
                paddingTop: "12px",
                color: "#e4e0d7",
                fontSize: "14px"
              }}
            >
              <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal:</span> <strong style={{ color: "#f4f1ea" }}>R$ {subtotal.toFixed(2)}</strong>
              </p>
              <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between" }}>
                <span>Entrega ({district}):</span>{" "}
                <strong style={{ color: "#f4f1ea" }}>
                  {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}
                </strong>
              </p>
              {loyaltyDiscount > 0 && (
                <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between", color: "#4caf50" }}>
                  <span>Fidelidade:</span> <strong>- R$ {loyaltyDiscount.toFixed(2)}</strong>
                </p>
              )}
              <p
                style={{
                  margin: "8px 0 0",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  color: "#b89a5f",
                  fontWeight: 700,
                  borderTop: "1px dashed rgba(184,154,95,0.25)",
                  paddingTop: "8px"
                }}
              >
                <span>Total:</span> <span>R$ {totalGeral.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* MERCADO PAGO RENDER TARGETS */}
          {paymentGateway === "mercadopago" && (
            <>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(184,154,95,0.03))",
                  border: "1px solid rgba(184, 154, 95, 0.25)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "left",
                  margin: "20px 0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#b89a5f" }}>
                  <i className="fa-solid fa-lock" style={{ fontSize: "16px" }}></i>
                  <h4 style={{ fontFamily: "'Cinzel',serif", letterSpacing: "1px", margin: 0, fontSize: "14px", fontWeight: "700" }}>
                    Checkout Criptografado
                  </h4>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#e4e0d7",
                    lineHeight: "1.5",
                    borderTop: "1px solid rgba(184,154,95,0.2)",
                    paddingTop: "8px",
                    margin: 0
                  }}
                >
                  Uma tela de pagamento segura e oficial do <strong>Mercado Pago</strong> foi aberta. Complete a transação com
                  Cartão de Crédito, Débito ou Pix.
                </p>
              </div>
              <button
                onClick={handleMercadoPagoPayment}
                className="modal-btn primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "12px",
                  gap: "8px",
                  textShadow: "none"
                }}
              >
                <i className="fa-solid fa-lock"></i> 🔒 Abrir Tela de Pagamento
              </button>
              <div style={{ fontSize: "11px", color: "#c5c2b9", marginBottom: "12px", textAlign: "center" }}>
                <i className="fa-solid fa-shield-halved" style={{ color: "#b89a5f" }}></i> Seus dados estão 100% protegidos e
                criptografados.
              </div>
            </>
          )}
        </div>

        {/* WOOVI RENDER TARGETS */}
        {paymentGateway === "woovi" && (
          <div id="pixQrcodeContainer" style={{ display: "block", textAlign: "center" }}>
            {!wooviQrCode ? (
              <button
                onClick={() => handleWooviPix(totalGeral)}
                className="modal-btn primary"
                style={{ width: "100%", justifyContent: "center", marginBottom: "12px" }}
              >
                🔄 Gerar QR Code Pix
              </button>
            ) : (
              <>
                <div id="woovi-container" style={{ minWidth: "200px", minHeight: "200px" }}>
                  <img
                    src={wooviQrCode}
                    alt="QR Code PIX"
                    style={{ width: "200px", height: "200px", display: "block", margin: "auto" }}
                  />
                </div>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "8px" }}>ou copie o código PIX:</p>
                <div className="pix-code" id="pixCode" onClick={copyPixCode} style={{ wordBreak: "break-all" }}>
                  {wooviBrCode}
                </div>
              </>
            )}

            <div
              className={`payment-status ${
                paymentStatus === "approved" ? "approved" : paymentStatus === "rejected" ? "rejected" : "pending"
              }`}
              id="paymentStatus"
            >
              {paymentStatus === "approved"
                ? "✅ Pagamento aprovado!"
                : paymentStatus === "rejected"
                ? "❌ Pagamento cancelado ou expirado"
                : "⏳ Aguardando pagamento..."}
            </div>
            {paymentTimerText && (
              <div className="payment-timer" id="paymentTimer">
                {paymentTimerText}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn" onClick={() => setActiveModal("customer")}>
            <i className="fa-solid fa-arrow-left"></i> Voltar / Alterar Pagamento
          </button>
          {paymentGateway === "woovi" && (
            <button
              className="modal-btn primary"
              id="whatsappBtn"
              disabled={paymentStatus !== "approved"}
              style={paymentStatus === "approved" ? { display: "inline-block", animation: "pulse 1s infinite" } : { display: "none" }}
              onClick={sendWooviOrderToWhatsApp}
            >
              ✅ Pagamento Confirmado - Enviar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
