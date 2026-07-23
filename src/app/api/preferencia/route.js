import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

const SECURE_DISHES = {
  "Velvet Bourguignon": { price: 44.90, extras: { "Alho Poró Salteado": 12, "Crocante de Panko Trufado": 14, "Cogumelos Selvagens": 18 } },
  "Riviera Gold": { price: 42.90, extras: { "Toque de Limão Siciliano": 8, "Farofa de Castanhas Crocantes": 12, "Emulsão de Ervas Finas": 8 } },
  "Velari Classic": { price: 32.90, extras: { "Upgrade: Corte Bovino Especial": 8.99, "Batata Extra": 8, "Bacon Artesanal": 12, "Molho Especial": 6 } },
  "Imperial Velari": { price: 34.90, extras: { "Upgrade: Corte Bovino Especial": 8.99, "Parmesão Premium": 10, "Batata Trufada": 14 } },
  "Black Signature": { price: 37.90, extras: { "Upgrade: Corte Bovino Especial": 8.99, "Cream Cheese Especial": 12, "Molho Signature": 9 } }
};

async function getSecureOrderTotal(cart, deliveryFee, loyaltyPhone) {
  let subtotal = 0;
  
  for (const item of cart) {
    const secureDish = SECURE_DISHES[item.name];
    if (!secureDish) throw new Error(`Prato inválido: ${item.name}`);
    
    let extrasTotal = 0;
    if (item.extras && Array.isArray(item.extras)) {
      for (const extra of item.extras) {
        const secureExtraPrice = secureDish.extras[extra.name];
        if (secureExtraPrice === undefined) throw new Error(`Adicional inválido para ${item.name}: ${extra.name}`);
        extrasTotal += secureExtraPrice * extra.qty;
      }
    }
    
    subtotal += (secureDish.price + extrasTotal) * item.qty;
  }
  
  let loyaltyDiscount = 0;
  if (loyaltyPhone) {
    const rawPhone = loyaltyPhone.replace(/\D/g, "");
    if (rawPhone.length >= 10) {
      try {
        const fbRes = await fetch(`https://cocina-velari-fidelidade-default-rtdb.firebaseio.com/loyalty/${rawPhone}.json`);
        if (fbRes.ok) {
          const data = await fbRes.json();
          let stamps = 0;
          if (data && typeof data.stamps === "number") {
            stamps = data.stamps;
          }
          const currentStamps = stamps % 10;
          if (currentStamps >= 9 || stamps >= 9) {
            let minPrice = Infinity;
            for (const item of cart) {
              const secureDish = SECURE_DISHES[item.name];
              if (secureDish.price < minPrice) {
                minPrice = secureDish.price;
              }
            }
            if (minPrice !== Infinity) {
              loyaltyDiscount = minPrice;
            }
          }
        }
      } catch (e) {
        console.error("Erro ao verificar fidelidade no servidor:", e);
      }
    }
  }
  
  const validFees = [0, 6.99, 8.99];
  const fee = parseFloat(deliveryFee) || 0;
  if (!validFees.includes(fee)) {
    throw new Error(`Taxa de entrega inválida: ${fee}`);
  }
  
  const finalTotal = Math.max(0, subtotal + fee - loyaltyDiscount);
  return {
    subtotal,
    deliveryFee: fee,
    loyaltyDiscount,
    finalTotal
  };
}

export async function POST(request) {
  try {
    const { cart, deliveryFee, loyaltyPhone, payer, statement_descriptor, back_urls } = await request.json();
    
    // Recalcula e valida o pedido no servidor
    const secureOrder = await getSecureOrderTotal(cart, deliveryFee, loyaltyPhone);
    
    // Prepara os itens reconstruídos a partir dos preços oficiais
    const mpItems = cart.map((item) => {
      const secureDish = SECURE_DISHES[item.name];
      let itemTitle = item.name;
      if (item.extras && item.extras.length > 0) {
        itemTitle += ` (${item.extras.map((e) => `${e.qty}x ${e.name}`).join(", ")})`;
      }
      
      let extrasTotal = 0;
      if (item.extras && Array.isArray(item.extras)) {
        for (const extra of item.extras) {
          extrasTotal += secureDish.extras[extra.name] * extra.qty;
        }
      }
      
      return {
        title: itemTitle,
        unit_price: secureDish.price + extrasTotal,
        quantity: item.qty,
        currency_id: "BRL"
      };
    });
    
    if (secureOrder.deliveryFee > 0) {
      mpItems.push({
        title: "Taxa de Entrega",
        unit_price: secureOrder.deliveryFee,
        quantity: 1,
        currency_id: "BRL"
      });
    }
    
    if (secureOrder.loyaltyDiscount > 0) {
      let discountRemaining = secureOrder.loyaltyDiscount;
      for (let i = 0; i < mpItems.length; i++) {
        if (mpItems[i].unit_price * mpItems[i].quantity > discountRemaining) {
          mpItems[i].unit_price -= discountRemaining / mpItems[i].quantity;
          discountRemaining = 0;
          break;
        } else {
          discountRemaining -= mpItems[i].unit_price * mpItems[i].quantity;
          mpItems[i].unit_price = 0;
        }
      }
    }
    
    // Configura a requisição para a API do Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `velari-pref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify({
        items: mpItems,
        payer,
        statement_descriptor,
        back_urls
      })
    });

    const resData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("[Mercado Pago Error]:", resData);
      return NextResponse.json(resData, { status: mpResponse.status });
    }

    return NextResponse.json(resData);
  } catch (error) {
    console.error("[Preferencia Exception]:", error);
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
