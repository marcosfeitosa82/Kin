import { NextResponse } from "next/server";

const SECURE_DISHES = {
  "Velvet Bourguignon": { price: 44.90, extras: { "Bacon Artesanal": 12, "Crocante de Panko Trufado": 14, "Cogumelos Selvagens": 18 } },
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
    const { cart, deliveryFee, loyaltyPhone, correlationID, descricao } = await request.json();
    
    // Recalcula e valida o pedido no servidor para obter o total seguro
    const secureOrder = await getSecureOrderTotal(cart, deliveryFee, loyaltyPhone);

    // Encaminha a requisição para a API Vercel que já tem o Woovi integrado
    const vercelResponse = await fetch("https://fastapi-python-boilerplate-phi-cyan.vercel.app/criar-pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        total: secureOrder.finalTotal,
        descricao,
        correlationID
      })
    });

    const resData = await vercelResponse.json();

    if (!vercelResponse.ok) {
      console.error("[Vercel Woovi Error]:", resData);
      return NextResponse.json(resData, { status: vercelResponse.status });
    }

    return NextResponse.json(resData);
  } catch (error) {
    console.error("[Criar Pix Woovi Exception]:", error);
    return NextResponse.json({ sucesso: false, erro: error.message }, { status: 500 });
  }
}
