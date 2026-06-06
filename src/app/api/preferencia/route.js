import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Configura a requisição para a API do Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `velari-pref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(body)
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
