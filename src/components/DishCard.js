import React from "react";

export default function DishCard({
  dish,
  isExpanded,
  currentQty,
  dishExtrasSelected,
  toggleDishSelection,
  handleQtyChange,
  handleDishQtyChange,
  addToCart
}) {
  let extrasTotal = 0;
  dish.extras.forEach((ext) => {
    const extQty = dishExtrasSelected[ext.name] || 0;
    extrasTotal += ext.price * extQty;
  });
  const cardTotal = (dish.price + extrasTotal) * currentQty;
  const hasExtras = extrasTotal > 0 || currentQty > 1;

  return (
    <article className="menu-card reveal visible">
      <div className="image-wrapper">
        <img src={dish.image} className="menu-image" alt={dish.name} />
        <div className="image-overlay">
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
        </div>
      </div>
      <div className="menu-content">
        <div className="menu-top">
          <span
            className="price"
            style={
              hasExtras
                ? {
                    transition: "color 0.3s, text-shadow 0.3s",
                    color: "#d4af6a",
                    textShadow: "0 0 10px rgba(184,154,95,0.6)"
                  }
                : {}
            }
          >
            R$ {cardTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <button
            onClick={() => toggleDishSelection(dish.id)}
            className={`order-btn ${isExpanded ? "active" : ""}`}
          >
            {isExpanded ? "Selecionado" : "Selecionar"}
          </button>
        </div>
        <div className="sommelier-suggestion">
          <div className="sommelier-title">
            <i className="fas fa-wine-glass-alt"></i> Harmonização Sommelier
          </div>
          <p className="sommelier-text">{dish.sommelier}</p>
        </div>

        {/* CUSTOMIZER CONTAINER */}
        <div className={`extras-wrapper ${isExpanded ? "active" : ""}`}>
          <div className="extras-content">
            <h4 className="extras-title">Personalize seu pedido</h4>

            {dish.extras.map((ext) => {
              const qty = dishExtrasSelected[ext.name] || 0;
              return (
                <div key={ext.name} className="extra-option-row">
                  <span>{ext.name}</span>
                  <strong>+ R$ {ext.price.toFixed(2)}</strong>
                  <div className="qty-control">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(dish.id, ext.name, -1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-val">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(dish.id, ext.name, 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="dish-qty-row">
              <span>Quantidade deste prato</span>
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => handleDishQtyChange(dish.id, -1)}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-val">{currentQty}</span>
                <button
                  type="button"
                  onClick={() => handleDishQtyChange(dish.id, 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => addToCart(dish)}
              className={`checkout-btn ${isExpanded ? "visible" : ""}`}
            >
              Adicionar à Sacola
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
