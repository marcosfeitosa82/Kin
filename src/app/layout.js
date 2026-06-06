import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Cocina Velari | Signature Strogonoff",
  description: "Uma experiência gastronômica premium desenvolvida para clientes que valorizam exclusividade, sofisticação e excelência artesanal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {children}
        <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
