import React from "react";

export default function CartModal({
  isOpen,
  cart,
  updateCartItemQty,
  removeFromCart,
  subtotal,
  deliveryFee,
  matchedZone,
  getCartItemsCount,
  loyaltyDiscount,
  totalGeral,
  setActiveModal
}) {
  if (!isOpen) return null;

  return (
    <div className="modal active" id="cartModal">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <h2>🛒 Sua Sacola</h2>
        <div
          id="cartItemsList"
          style={{
            margin: "20px 0",
            maxHeight: "300px",
            overflowY: "auto",
            textAlign: "left",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "15px"
          }}
        >
          {cart.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                gap: "12px"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <strong style={{ color: "var(--text)", fontSize: "15px" }}>{item.name}</strong>
                  <div className="qty-control" style={{ padding: "2px 6px", gap: "8px" }}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateCartItemQty(idx, -1)}
                      style={{ width: "20px", height: "20px", fontSize: "12px", lineHeight: 1 }}
                    >
                      -
                    </button>
                    <span className="qty-val" style={{ fontSize: "12px", minWidth: "10px" }}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateCartItemQty(idx, 1)}
                      style={{ width: "20px", height: "20px", fontSize: "12px", lineHeight: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <span style={{ color: "var(--gold)", fontSize: "14px" }}>R$ {item.total.toFixed(2)}</span>
                {item.extras.length > 0 && (
                  <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", paddingLeft: "12px" }}>
                    {item.extras.map((ext, extIdx) => (
                      <span key={extIdx}>
                        ➕ {ext.qty}x {ext.name} (R$ {(ext.price * ext.qty).toFixed(2)})<br />
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="modal-btn"
                onClick={() => removeFromCart(idx)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  borderColor: "rgba(244,67,54,0.3)",
                  background: "rgba(244,67,54,0.1)",
                  color: "#f44336",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        <div id="cartSummary" style={{ textAlign: "left", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--muted)", fontSize: "14px" }}>Subtotal dos Pratos:</span>
            <span style={{ fontWeight: 600 }}>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--muted)", fontSize: "14px" }}>Taxa de Entrega:</span>
            <span style={{ fontWeight: 600 }}>
              {deliveryFee === 0
                ? matchedZone === 0
                  ? "A definir"
                  : getCartItemsCount() >= 2
                  ? "Grátis (2+ Pratos)"
                  : subtotal >= 90.0
                  ? "Grátis"
                  : "Grátis"
                : `R$ ${deliveryFee.toFixed(2)}`}
            </span>
          </div>

          {loyaltyDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#4caf50", fontSize: "14px" }}>
              <span>Desconto Fidelidade (10º Prato):</span>
              <span style={{ fontWeight: 600 }}>- R$ {loyaltyDiscount.toFixed(2)}</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "12px"
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--gold)" }}>Total Geral:</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--gold)" }}>R$ {totalGeral.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn" onClick={() => setActiveModal(null)}>
            Continuar Comprando
          </button>
          <button className="modal-btn primary" onClick={() => setActiveModal("customer")}>
            Avançar para Entrega 🛎️
          </button>
        </div>
      </div>
    </div>
  );
}
