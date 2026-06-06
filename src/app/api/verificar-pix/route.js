import { NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const correlationID = searchParams.get("correlationID");
    const paymentID = searchParams.get("payment_id");

    if (correlationID) {
      // Verificação via Woovi (por meio da API Vercel)
      const vercelResponse = await fetch(
        `https://fastapi-python-boilerplate-phi-cyan.vercel.app/verificar-pix?correlationID=${correlationID}`,
        { method: "GET" }
      );
      
      const resData = await vercelResponse.json();
      return NextResponse.json(resData);
    } 
    
    if (paymentID) {
      // Verificação direta via Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentID}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${MP_ACCESS_TOKEN}`
        }
      });

      const resData = await mpResponse.json();

      if (!mpResponse.ok) {
        console.error("[Mercado Pago Check Error]:", resData);
        return NextResponse.json(resData, { status: mpResponse.status });
      }

      const mpStatus = resData.status;
      const status = mpStatus === "approved" ? "COMPLETED" : (
        ["cancelled", "rejected"].includes(mpStatus) ? "EXPIRED" : "PENDING"
      );

      return NextResponse.json({
        status: status,
        mp_status: mpStatus
      });
    }

    return NextResponse.json({ erro: "correlationID ou payment_id obrigatorio" }, { status: 400 });
  } catch (error) {
    console.error("[Verificar Pix Exception]:", error);
    return NextResponse.json({ status: "PENDING", erro: error.message }, { status: 500 });
  }
}
