import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Encaminha a requisição para a API Vercel que já tem o Woovi integrado
    const vercelResponse = await fetch("https://fastapi-python-boilerplate-phi-cyan.vercel.app/criar-pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
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
