"use client";

import { useState, useEffect, useRef } from "react";
import DishCard from "../components/DishCard";
import LoyaltyCard from "../components/LoyaltyCard";
import CartModal from "../components/CartModal";
import CustomerModal from "../components/CustomerModal";
import PaymentModal from "../components/PaymentModal";

const DISHES = [
  {
    id: "velvet-bourguignon",
    name: "Velvet Bourguignon",
    price: 54.90,
    emoji: "🥩",
    image: "prato4.png",
    description: "Corte bovino selecionado lentamente envolvido em creme especial Velari, redução aromática sofisticada e acabamento gastronômico inspirado na alta cozinha europeia.",
    sommelier: "Sugestão: Pinot Noir (Bourgogne) ou Cabernet Sauvignon. Tintos de corpo médio a encorpados com taninos presentes, perfeitos para cortar a suntuosidade do filé mignon selado e o molho demi-glace. Compre nas adegas locais: Enoteca Decanter (Cabo Branco) ou Grand Cru (Altiplano).",
    extras: [
      { name: "Alho Poró Salteado", price: 12 },
      { name: "Crocante de Panko Trufado", price: 14 },
      { name: "Cogumelos Selvagens", price: 18 }
    ]
  },
  {
    id: "riviera-gold",
    name: "Riviera Gold",
    price: 52.90,
    emoji: "🦐",
    image: "prato5.png",
    description: "Camarões selecionados envolvidos em molho cremoso sofisticado, notas amanteigadas delicadas e acabamento premium desenvolvido para uma experiência exclusiva.",
    sommelier: "Sugestão: Chardonnay Barricado ou Espumante Brut. A estrutura cremosa e as notas amanteigadas do Chardonnay harmonizam em perfeita simetria com a riqueza da bisque e dos camarões grelhados. Compre nas adegas locais: Copa Adega (Tambaú) ou Enoteca Decanter (Cabo Branco).",
    extras: [
      { name: "Toque de Limão Siciliano", price: 8 },
      { name: "Farofa de Amêndoas Crocantes", price: 14 },
      { name: "Emulsão de Ervas Finas", price: 12 }
    ]
  },
  {
    id: "velari-classic",
    name: "Velari Classic",
    price: 32.90,
    emoji: "🍽️",
    image: "prato1.png",
    description: "Filé de sassami grelhado no ponto exato — proteína nobre, macia e suculenta. Envolto no creme aveludado da casa, arroz soltinho e batata rústica dourada e crocante. Conforto e elegância no mesmo prato.",
    sommelier: "Sugestão: Chardonnay jovem ou Pinot Noir leve. Uma harmonização sutil que acompanha a delicadeza e a cremosidade do creme de strogonoff sem sobressair sobre a carne branca. Compre nas adegas locais: Pão de Açúcar (Manaíra/Epitácio) ou Verdfrut (Altiplano).",
    extras: [
      { name: "Upgrade: Corte Bovino Especial", price: 8.99 },
      { name: "Batata Extra", price: 8 },
      { name: "Bacon Artesanal", price: 12 },
      { name: "Molho Especial", price: 6 }
    ]
  },
  {
    id: "imperial-velari",
    name: "Imperial Velari",
    price: 34.90,
    emoji: "👑",
    image: "prato2.png",
    description: "Filé de sassami de origem controlada ao limão siciliano e alcaparras — vibrante, refrescante e viciante. Finalizado com parmesão gratinado e batata trufada que eleva cada garfada a outro nível.",
    sommelier: "Sugestão: Sauvignon Blanc ou Espumante Brut. O perfil herbáceo e a alta acidez do Sauvignon Blanc limpam perfeitamente o paladar do toque salgado e ácido das alcaparras e do limão siciliano. Compre nas adegas locais: Copa Adega (Tambaú) ou Grand Cru (Manaíra).",
    extras: [
      { name: "Upgrade: Corte Bovino Especial", price: 8.99 },
      { name: "Parmesão Premium", price: 10 },
      { name: "Batata Trufada", price: 14 }
    ]
  },
  {
    id: "black-signature",
    name: "Black Signature",
    price: 37.90,
    emoji: "✨",
    image: "prato3.png",
    description: "Filé de sassami macio e suculento sobre champignons salteados em manteiga dourada, cobertos por uma redução sedosa de molho madeira. Intenso, terroso e absolutamente marcante.",
    sommelier: "Sugestão: Merlot ou Carménère. Tintos de corpo médio e macios que abraçam as notas terrosas dos cogumelos champignons e a redução adocicada do molho madeira. Compre nas adegas locais: Pão de Açúcar (Manaíra) ou Enoteca Decanter (Cabo Branco).",
    extras: [
      { name: "Upgrade: Corte Bovino Especial", price: 8.99 },
      { name: "Cream Cheese Especial", price: 12 },
      { name: "Molho Signature", price: 9 }
    ]
  }
];

const FIREBASE_DB_URL = "https://cocina-velari-fidelidade-default-rtdb.firebaseio.com";
const MP_PUBLIC_KEY = "APP_USR-0446830c-21af-431e-959a-74906819f2c3";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // States do prato selecionado ativamente para customização
  const [expandedDishId, setExpandedDishId] = useState(null);
  const [dishQuantities, setDishQuantities] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});

  // States do cliente
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("João Pessoa - PB");
  const [cpf, setCpf] = useState("");

  // States do fidelidade
  const [loyaltyPhone, setLoyaltyPhone] = useState("");
  const [loyaltyStamps, setLoyaltyStamps] = useState(0);
  const [activeStampsPhone, setActiveStampsPhone] = useState("");
  const [loyaltyMessage, setLoyaltyMessage] = useState("");
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  
  // States do frete e totais
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [matchedZone, setMatchedZone] = useState(0);
  
  // States do pagamento
  const [paymentGateway, setPaymentGateway] = useState("mercadopago");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [wooviQrCode, setWooviQrCode] = useState("");
  const [wooviBrCode, setWooviBrCode] = useState("");
  const [correlationID, setCorrelationID] = useState("");
  const [paymentTimerText, setPaymentTimerText] = useState("");
  const [isLocateLoading, setIsLocateLoading] = useState(false);
  const [locateStatus, setLocateStatus] = useState("");

  // Overlays
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isBadgeExpanded, setIsBadgeExpanded] = useState(false);
  const [isBadgeVisible, setIsBadgeVisible] = useState(true);

  // Refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const paymentCheckIntervalRef = useRef(null);
  const mpCheckIntervalRef = useRef(null);

  // Inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    // Carregar dados salvos do cliente
    const savedCustomer = localStorage.getItem("cocinaVelariCustomer");
    if (savedCustomer) {
      try {
        const data = JSON.parse(savedCustomer);
        setName(data.name || "");
        setPhone(data.phone || "");
        setStreet(data.street || "");
        setNumber(data.number || "");
        setDistrict(data.district || "");
      } catch (e) {
        console.error(e);
      }
    }

    // Inicia detector de clique único para tocar música (por conta das regras do navegador)
    const playMusicOnFirstClick = () => {
      startMusic();
      window.removeEventListener("click", playMusicOnFirstClick);
    };
    window.addEventListener("click", playMusicOnFirstClick);

    // Detector de retorno do Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    const collectionStatus = urlParams.get("collection_status") || urlParams.get("status");
    const paymentId = urlParams.get("collection_id") || urlParams.get("payment_id");

    if ((collectionStatus === "approved" || collectionStatus === "authorized") && paymentId) {
      handleMercadoPagoReturn(paymentId);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", playMusicOnFirstClick);
      if (paymentCheckIntervalRef.current) clearInterval(paymentCheckIntervalRef.current);
      if (mpCheckIntervalRef.current) clearInterval(mpCheckIntervalRef.current);
    };
  }, []);

  // Monitorar interrupções de áudio/saída da aba
  useEffect(() => {
    const stopAudio = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopAudio();
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", stopAudio);
    window.addEventListener("beforeunload", stopAudio);
    window.addEventListener("blur", stopAudio);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", stopAudio);
      window.removeEventListener("beforeunload", stopAudio);
      window.removeEventListener("blur", stopAudio);
    };
  }, []);

  // Atualizar taxas de frete sempre que a sacola ou o bairro mudarem
  useEffect(() => {
    calculateShipping();
  }, [cart, district]);

  // Toast premium
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Música lounge
  const startMusic = async () => {
    if (audioRef.current && audioRef.current.paused) {
      try {
        audioRef.current.volume = 0;
        await audioRef.current.play();
        setIsMusicPlaying(true);
        // Fade in
        let vol = 0;
        const interval = setInterval(() => {
          if (vol >= 0.35) {
            clearInterval(interval);
          } else {
            vol += 0.02;
            audioRef.current.volume = Math.min(vol, 0.35);
          }
        }, 100);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      startMusic();
    } else {
      let vol = audioRef.current.volume;
      const interval = setInterval(() => {
        if (vol <= 0.02) {
          clearInterval(interval);
          audioRef.current.pause();
          setIsMusicPlaying(false);
        } else {
          vol -= 0.02;
          audioRef.current.volume = Math.max(vol, 0);
        }
      }, 100);
    }
  };

  // Lógica da Sacola de Compras
  const toggleDishSelection = (dishId) => {
    if (expandedDishId === dishId) {
      setExpandedDishId(null);
      // Resetar seleções temporárias do prato
      setSelectedExtras((prev) => ({ ...prev, [dishId]: {} }));
      setDishQuantities((prev) => ({ ...prev, [dishId]: 1 }));
    } else {
      setExpandedDishId(dishId);
      setDishQuantities((prev) => ({ ...prev, [dishId]: 1 }));
      setSelectedExtras((prev) => ({ ...prev, [dishId]: {} }));
    }
  };

  const handleQtyChange = (dishId, extraName, change) => {
    setSelectedExtras((prev) => {
      const dishExtras = prev[dishId] || {};
      const currentQty = dishExtras[extraName] || 0;
      const newQty = Math.max(0, currentQty + change);
      return {
        ...prev,
        [dishId]: {
          ...dishExtras,
          [extraName]: newQty
        }
      };
    });
  };

  const handleDishQtyChange = (dishId, change) => {
    setDishQuantities((prev) => {
      const currentQty = prev[dishId] || 1;
      return {
        ...prev,
        [dishId]: Math.max(1, currentQty + change)
      };
    });
  };

  const addToCart = (dish) => {
    const qty = dishQuantities[dish.id] || 1;
    const dishExtrasSelected = selectedExtras[dish.id] || {};
    
    const extrasList = [];
    let extrasTotal = 0;
    
    dish.extras.forEach((ext) => {
      const extQty = dishExtrasSelected[ext.name] || 0;
      if (extQty > 0) {
        extrasList.push({
          name: ext.name,
          price: ext.price,
          qty: extQty
        });
        extrasTotal += ext.price * extQty;
      }
    });

    const itemTotal = (dish.price + extrasTotal) * qty;

    const newItem = {
      name: dish.name,
      basePrice: dish.price,
      qty: qty,
      extras: extrasList,
      extrasTotal: extrasTotal * qty,
      total: itemTotal
    };

    setCart((prev) => [...prev, newItem]);

    // Resetar
    setExpandedDishId(null);
    setSelectedExtras((prev) => ({ ...prev, [dish.id]: {} }));
    setDishQuantities((prev) => ({ ...prev, [dish.id]: 1 }));

    triggerToast(`🍽️ ${qty}x ${dish.name} adicionado à sacola!`);
  };

  const updateCartItemQty = (index, change) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQty = item.qty + change;
      
      if (newQty <= 0) {
        newCart.splice(index, 1);
        return newCart;
      }

      const singleExtrasTotal = item.extras.reduce((sum, ext) => sum + ext.price * ext.qty, 0);
      item.qty = newQty;
      item.extrasTotal = singleExtrasTotal * newQty;
      item.total = (item.basePrice + singleExtrasTotal) * newQty;
      
      return newCart;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };

  // Cálculo da taxa de entrega e zona de atendimento
  const calculateShipping = () => {
    const rawDistrict = district.trim().toLowerCase();
    if (!rawDistrict) {
      setDeliveryFee(0);
      setMatchedZone(0);
      return;
    }

    const zone1 = ["altiplano", "cabo branco", "tambau", "tambaú", "portal do sol", "penha"];
    const zone2 = ["manaira", "manaíra", "bessa", "jardim oceania", "oceania", "miramar", "torre"];

    let zone = 0;
    if (zone1.some((b) => rawDistrict.includes(b))) {
      zone = 1;
    } else if (zone2.some((b) => rawDistrict.includes(b))) {
      zone = 2;
    }

    setMatchedZone(zone);

    const totalDishes = getCartItemsCount();
    const cartTotalValue = getCartTotal();
    const isEligibleForFreeShipping = totalDishes >= 2;

    if (zone === 1) {
      if (isEligibleForFreeShipping || cartTotalValue >= 90.00) {
        setDeliveryFee(0);
      } else {
        setDeliveryFee(6.99);
      }
    } else if (zone === 2) {
      if (isEligibleForFreeShipping || cartTotalValue >= 90.00) {
        setDeliveryFee(0);
      } else {
        setDeliveryFee(8.99);
      }
    } else {
      setDeliveryFee(0);
    }
  };

  // Desconto Fidelidade
  const calculateFidelidadeDiscount = () => {
    if (!activeStampsPhone) return 0;
    const currentStamps = loyaltyStamps % 10;
    if (currentStamps < 9 && loyaltyStamps < 9) return 0;
    if (cart.length === 0) return 0;

    let minPrice = Infinity;
    cart.forEach((item) => {
      if (item.basePrice < minPrice) minPrice = item.basePrice;
    });

    return minPrice === Infinity ? 0 : minPrice;
  };

  // Consultar Cartão Fidelidade no Firebase
  const checkLoyaltyCard = async () => {
    const rawPhone = loyaltyPhone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      alert("Por favor, digite um número de WhatsApp válido com DDD.");
      return;
    }

    setLoyaltyLoading(true);
    setLoyaltyMessage("Consultando nosso banco de dados...");

    try {
      const response = await fetch(`${FIREBASE_DB_URL}/loyalty/${rawPhone}.json`);
      if (!response.ok) throw new Error("Erro ao conectar ao Firebase");
      const data = await response.json();

      let stamps = 0;
      if (data && typeof data.stamps === "number") {
        stamps = data.stamps;
      }

      setLoyaltyStamps(stamps);
      setActiveStampsPhone(rawPhone);

      const currentStamps = stamps % 10;
      const remaining = 9 - currentStamps;

      if (currentStamps === 9 || stamps >= 9) {
        setLoyaltyMessage(`🎉 Parabéns! Você completou seus carimbos. Seu 10º prato principal é GRÁTIS neste pedido! (O desconto será aplicado automaticamente na sacola).`);
      } else if (currentStamps === 0) {
        setLoyaltyMessage(`💎 Bem-vindo à Cocina Velari! Você ainda não possui carimbos neste número. Faça seu primeiro pedido hoje mesmo e comece a acumular!`);
      } else {
        setLoyaltyMessage(`💎 Você tem ${currentStamps} carimbo(s) ativo(s). Faltam ${remaining} pedido(s) para ganhar o seu prato principal grátis!`);
      }
    } catch (err) {
      console.error(err);
      setLoyaltyStamps(0);
      setActiveStampsPhone(rawPhone);
      setLoyaltyMessage(`✨ Bem-vindo ao nosso clube de fidelidade! Ainda não localizamos o seu número no sistema. Faça o seu primeiro pedido hoje para ativar seu cartão de fidelidade e começar a acumular carimbos!`);
    } finally {
      setLoyaltyLoading(false);
    }
  };

  // Geolocalização Autocomplete Nominatim
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsLocateLoading(true);
    setLocateStatus("Obtendo localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
          );
          if (!response.ok) throw new Error("Falha ao obter endereço");
          const data = await response.json();

          const addr = data.address || {};
          const road = addr.road || addr.suburb || "";
          const h_number = addr.house_number || "";
          const n_hood = addr.neighbourhood || addr.suburb || addr.quarter || "";

          if (road) setStreet(road);
          if (h_number) setNumber(h_number);
          if (n_hood) setDistrict(n_hood);

          setLocateStatus("success");
          setTimeout(() => {
            setIsLocateLoading(false);
            setLocateStatus("");
          }, 2500);
        } catch (err) {
          console.error(err);
          alert("Não foi possível obter o endereço exato. Por favor, digite manualmente.");
          setIsLocateLoading(false);
          setLocateStatus("");
        }
      },
      (error) => {
        console.error(error);
        alert("Erro ao obter localização. Verifique as permissões de localização do navegador.");
        setIsLocateLoading(false);
        setLocateStatus("");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Salvar formulário do cliente e avançar para o pagamento
  const handleCustomerSubmit = () => {
    const rawPhone = phone.replace(/\D/g, "");
    if (!name || rawPhone.length < 10 || !street || !number || !district) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente com um WhatsApp válido (com DDD).");
      return;
    }

    // Salvar no localStorage
    const customerData = { name, phone, street, number, district, city };
    localStorage.setItem("cocinaVelariCustomer", JSON.stringify(customerData));

    setActiveModal("payment");
  };

  // Gerar QR Code Pix Woovi
  const handleWooviPix = async (amount) => {
    setPaymentStatus("pending");
    setWooviQrCode("");
    setWooviBrCode("");
    setPaymentTimerText("");

    const orderID = "velari-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    setCorrelationID(orderID);

    try {
      const response = await fetch("/api/criar-pix-woovi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: amount,
          descricao: "Pedido Cocina Velari",
          correlationID: orderID
        })
      });

      if (!response.ok) throw new Error("Falha na chamada do servidor local");
      const data = await response.json();

      if (data.sucesso) {
        setWooviQrCode(data.qrCodeImage);
        setWooviBrCode(data.brCode);
        setPaymentTimerText("⏱️ Escaneie o QR Code para pagar");
        startWooviStatusCheck(orderID);
      } else {
        throw new Error(data.erro || "Erro interno do servidor");
      }
    } catch (e) {
      console.error(e);
      setPaymentStatus("rejected");
      setPaymentTimerText("❌ Falha ao carregar Woovi. Tente novamente.");
    }
  };

  const startWooviStatusCheck = (orderID) => {
    if (paymentCheckIntervalRef.current) clearInterval(paymentCheckIntervalRef.current);
    let attempts = 0;
    const maxAttempts = 60; // 5 minutos

    paymentCheckIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`/api/verificar-pix?correlationID=${orderID}`);
        if (!response.ok) return; // ignora erros 404/500 silenciosamente durante polling

        const data = await response.json();
        if (data.status === "COMPLETED") {
          clearInterval(paymentCheckIntervalRef.current);
          setPaymentStatus("approved");
          setPaymentTimerText("🎉 Pagamento confirmado!");
        } else if (data.status === "EXPIRED" || attempts >= maxAttempts) {
          clearInterval(paymentCheckIntervalRef.current);
          setPaymentStatus("rejected");
          setPaymentTimerText("❌ Pagamento expirado ou cancelado");
        } else {
          const mins = Math.floor((maxAttempts - attempts) * 5 / 60);
          const secs = ((maxAttempts - attempts) * 5) % 60;
          setPaymentTimerText(`⏱️ Aguardando... ${mins}m${secs}s restantes`);
        }
      } catch (e) {
        console.error("Erro no polling da Woovi:", e);
      }
    }, 5000);
  };

  // Gerar Preference ID Mercado Pago (Checkout Pro Lightbox)
  const handleMercadoPagoPayment = async () => {
    if (mpCheckIntervalRef.current) clearInterval(mpCheckIntervalRef.current);

    const subtotal = getCartTotal();
    const loyaltyDiscount = calculateFidelidadeDiscount();
    const totalGeral = Math.max(0, subtotal + deliveryFee - loyaltyDiscount);

    // Preparar itens para o Mercado Pago
    const mpItems = cart.map((item) => {
      let itemTitle = item.name;
      if (item.extras && item.extras.length > 0) {
        itemTitle += ` (${item.extras.map((e) => `${e.qty}x ${e.name}`).join(", ")})`;
      }
      return {
        title: itemTitle,
        unit_price: item.total / item.qty,
        quantity: item.qty,
        currency_id: "BRL"
      };
    });

    if (deliveryFee > 0) {
      mpItems.push({
        title: "Taxa de Entrega",
        unit_price: deliveryFee,
        quantity: 1,
        currency_id: "BRL"
      });
    }

    if (loyaltyDiscount > 0) {
      let discountRemaining = loyaltyDiscount;
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

    try {
      const response = await fetch("/api/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: mpItems,
          payer: {
            name: name,
            email: "cliente@cocinavelari.com"
          },
          statement_descriptor: "COCINA VELARI",
          back_urls: {
            success: window.location.href,
            pending: window.location.href,
            failure: window.location.href
          }
        })
      });

      if (!response.ok) throw new Error("Erro na geração do token local");
      const data = await response.json();

      if (!data.id) throw new Error("Preferencia ID nulo");

      // Salvar dados no localStorage para o fluxo de retorno do Mercado Pago
      const currentOrderDetails = {
        items: cart,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        loyaltyDiscount: loyaltyDiscount,
        finalTotal: totalGeral,
        matchedZone: matchedZone,
        customer: { name, phone, street, number, district, city }
      };

      localStorage.setItem("velari_customer", JSON.stringify(currentOrderDetails.customer));
      localStorage.setItem("velari_order_details", JSON.stringify(currentOrderDetails));

      // Inicializa o SDK Lightbox
      const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
      mp.checkout({
        preference: { id: data.id },
        autoOpen: true
      });

      // Polling para fechar o modal se o usuário fechar a lightbox MP no "X"
      let iframeDetected = false;
      mpCheckIntervalRef.current = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="mercadopago"], .mercadopago-checkout-iframe');
        if (iframe) {
          iframeDetected = true;
        } else if (iframeDetected) {
          clearInterval(mpCheckIntervalRef.current);
          mpCheckIntervalRef.current = null;
          setActiveModal("customer");
        }
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("Não foi possível conectar à API de Pagamentos do Mercado Pago.");
      setActiveModal("customer");
    }
  };

  // Trata o retorno do Mercado Pago aprovado
  const handleMercadoPagoReturn = (paymentId) => {
    const savedCustomer = localStorage.getItem("velari_customer");
    const savedOrderDetails = localStorage.getItem("velari_order_details");

    if (savedCustomer && savedOrderDetails) {
      try {
        const customerObj = JSON.parse(savedCustomer);
        const orderDetailsObj = JSON.parse(savedOrderDetails);

        // Limpar parâmetros da URL
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);

        localStorage.removeItem("velari_customer");
        localStorage.removeItem("velari_order_details");

        const totalDishes = orderDetailsObj.items.reduce((sum, item) => sum + item.qty, 0);
        const isFreeShipping = totalDishes >= 2 && orderDetailsObj.matchedZone !== 0;

        let feeText = orderDetailsObj.deliveryFee === 0
          ? (isFreeShipping ? "Grátis (Benefício 2+ Pratos)" : "Grátis")
          : `R$ ${orderDetailsObj.deliveryFee.toFixed(2)}`;

        let message = `🍽️ *NOVO PEDIDO - COCINA VELARI*%0A%0A`;
        orderDetailsObj.items.forEach((item) => {
          message += `📦 *${item.qty}x ${item.name}* (R$ ${item.total.toFixed(2)})%0A`;
          if (item.extras.length > 0) {
            item.extras.forEach((ext) => {
              message += `  ➕ ${ext.qty}x ${ext.name} (+ R$ ${(ext.price * ext.qty).toFixed(2)})%0A`;
            });
          }
          message += `%0A`;
        });

        message += `💵 *Subtotal:* R$ ${orderDetailsObj.subtotal.toFixed(2)}%0A`;
        if (orderDetailsObj.loyaltyDiscount > 0) {
          message += `🎁 *Desconto Fidelidade (10º Prato):* - R$ ${orderDetailsObj.loyaltyDiscount.toFixed(2)}%0A`;
        }
        message += `🛵 *Taxa de Entrega:* ${feeText}%0A`;
        message += `💎 *TOTAL PAGO:* R$ ${orderDetailsObj.finalTotal.toFixed(2)}%0A`;
        message += `✅ *Status:* Pagamento Confirmado via Mercado Pago%0A`;
        message += `💳 *ID da Transação:* ${paymentId}%0A%0A`;
        message += `👤 *Cliente:* ${customerObj.name || "N/I"}%0A`;
        message += `📱 *WhatsApp:* ${customerObj.phone || "N/I"}%0A`;
        message += `📍 *Entrega:* ${customerObj.street || ""}, ${customerObj.number || ""} - ${customerObj.district || ""} - ${customerObj.city || ""}%0A%0A`;

        if (orderDetailsObj.loyaltyDiscount > 0) {
          message += `💎 *Fidelidade:* Resgate do 10º prato grátis (WhatsApp: ${customerObj.phone})%0A%0A`;
        }
        message += `📞 Aguardando confirmação da cozinha.`;

        alert("✅ Pagamento Aprovado com Sucesso! Redirecionando para o WhatsApp para confirmar o envio.");

        setCart([]);
        localStorage.removeItem("cocinaVelariCart");

        // Pausa lounge music e navega
        if (audioRef.current) audioRef.current.pause();
        window.location.href = `https://wa.me/5583921505963?text=${message}`;
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Finalização do fluxo Pix Woovi
  const sendWooviOrderToWhatsApp = () => {
    const subtotal = getCartTotal();
    const loyaltyDiscount = calculateFidelidadeDiscount();
    const totalGeral = Math.max(0, subtotal + deliveryFee - loyaltyDiscount);

    const totalDishes = getCartItemsCount();
    const isFreeShipping = totalDishes >= 2 && matchedZone !== 0;

    let feeText = deliveryFee === 0
      ? (isFreeShipping ? "Grátis (Benefício 2+ Pratos)" : "Grátis")
      : `R$ ${deliveryFee.toFixed(2)}`;

    let message = `🍽️ *NOVO PEDIDO - COCINA VELARI*%0A%0A`;
    cart.forEach((item) => {
      message += `📦 *${item.qty}x ${item.name}* (R$ ${item.total.toFixed(2)})%0A`;
      if (item.extras.length > 0) {
        item.extras.forEach((ext) => {
          message += `  ➕ ${ext.qty}x ${ext.name} (+ R$ ${(ext.price * ext.qty).toFixed(2)})%0A`;
        });
      }
      message += `%0A`;
    });

    message += `💵 *Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
    if (loyaltyDiscount > 0) {
      message += `🎁 *Desconto Fidelidade (10º Prato):* - R$ ${loyaltyDiscount.toFixed(2)}%0A`;
    }
    message += `🛵 *Taxa de Entrega:* ${feeText}%0A`;
    message += `💎 *TOTAL PAGO:* R$ ${totalGeral.toFixed(2)}%0A`;
    message += `✅ *Status:* Pagamento Confirmado via PIX%0A%0A`;
    message += `👤 *Cliente:* ${name || "N/I"}%0A`;
    message += `📱 *WhatsApp:* ${phone || "N/I"}%0A`;
    message += `📍 *Entrega:* ${street || ""}, ${number || ""} - ${district || ""} - ${city || ""}%0A%0A`;

    if (loyaltyDiscount > 0) {
      message += `💎 *Fidelidade:* Resgate do 10º prato grátis (WhatsApp: ${activeStampsPhone})%0A%0A`;
    }
    message += `📞 Aguardando confirmação da cozinha.`;

    // Fechar e resetar
    if (paymentCheckIntervalRef.current) clearInterval(paymentCheckIntervalRef.current);
    setActiveModal(null);
    setCart([]);
    localStorage.removeItem("cocinaVelariCart");
    
    // Resetar fidelidade local
    setLoyaltyStamps(0);
    setActiveStampsPhone("");
    setLoyaltyMessage("");

    if (audioRef.current) audioRef.current.pause();
    window.location.href = `https://wa.me/5583921505963?text=${message}`;
  };

  const copyPixCode = () => {
    if (!wooviBrCode || wooviBrCode === "Clique para copiar") return;
    navigator.clipboard.writeText(wooviBrCode).then(() => {
      triggerToast("✅ Código PIX copiado com sucesso!");
    });
  };

  // Gerar dinamicamente os pontos da borda serrilhada do selo de frete off
  const getSerratedEdgePoints = () => {
    const points = [];
    const cx = 50, cy = 50;
    for (let i = 0; i < 72; i++) {
      const angle = (i * 5 * Math.PI) / 180;
      const r = i % 2 === 0 ? 49 : 45;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(" ");
  };

  // Máscaras de input de telefone
  const formatPhone = (val) => {
    let value = val.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      return `(${value}`;
    }
    return "";
  };

  // Renderização principal de Totais do Carrinho
  const subtotal = getCartTotal();
  const loyaltyDiscount = calculateFidelidadeDiscount();
  const totalGeral = Math.max(0, subtotal + deliveryFee - loyaltyDiscount);
  const cartItemsCount = getCartItemsCount();

  return (
    <>
      {/* BACKGROUND VIDEO */}
      <video ref={videoRef} autoPlay muted loop playsInline className="ambient-video">
        <source src="background.mp4" type="video/mp4" />
      </video>

      {/* AUDIO PLAYER */}
      <audio ref={audioRef} id="ambientMusic" loop>
        <source src="music.mp3" type="audio/mpeg" />
      </audio>

      {/* LOADING SCREEN */}
      {loading && (
        <div className="loading-screen" id="loadingScreen">
          <img src="logo.png" className="loading-logo" alt="Cocina Velari" />
          <div className="loading-text">Preparing your gourmet experience</div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showToast && <div id="premiumToast" className="show">{toastMessage}</div>}

      {/* NAV BAR */}
      <nav className="nav-bar">
        <img src="logo.png" className="nav-logo" alt="Cocina Velari" />
        <div className="nav-links">
          <a href="#menu" className="nav-link">Menu</a>
          <a href="https://instagram.com/cocinavelari" target="_blank" className="nav-social-icon" title="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsSpotifyOpen(!isSpotifyOpen);
              if (!isSpotifyOpen) stopAudio();
            }}
            className="nav-social-icon"
            id="spotify-nav-icon"
            title="Spotify"
          >
            <i className="fab fa-spotify"></i>
          </a>
          <a href="https://www.youtube.com/playlist?list=PL0ZgVKVdPzFKH5WRg6Q5WmK8f6duSQ3FQ" target="_blank" className="nav-social-icon" title="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </nav>

      {/* SPOTIFY WIDGET OVERLAY */}
      {isSpotifyOpen && (
        <div id="spotify-widget-container" className="spotify-widget-container active">
          <div className="spotify-widget-header">
            <span className="spotify-widget-title"><i className="fab fa-spotify"></i> Playlist Cocina Velari</span>
            <button onClick={() => setIsSpotifyOpen(false)} className="spotify-widget-close">&times;</button>
          </div>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/1mWd1aXaXw58jGZVj2sWkf?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <div className="spotify-widget-footer">
            <a href="https://open.spotify.com/playlist/1mWd1aXaXw58jGZVj2sWkf" target="_blank" className="spotify-open-btn">
              <i className="fab fa-spotify"></i> Abrir no Spotify
            </a>
          </div>
        </div>
      )}

      {/* MUSIC TOGGLE BUTTON */}
      <button onClick={toggleMusic} className="music-toggle" id="musicToggle">
        {isMusicPlaying ? "♫ Lounge Active" : "♫ Lounge Atmosphere"}
      </button>

      {/* FLOATING SHIPPING BADGE */}
      {isBadgeVisible && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsBadgeExpanded(!isBadgeExpanded);
          }}
          className={`floating-shipping-badge-container ${isBadgeExpanded ? "expanded" : ""}`}
          title="Frete OFF a partir do 2º prato!"
        >
          <svg className="rotating-text-svg" viewBox="0 0 100 100">
            <polygon id="serratedEdge" points={getSerratedEdgePoints()} fill="var(--gold)" stroke="#000" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="41" fill="#0a0a0a" stroke="var(--gold)" strokeWidth="1" />
            <path id="badgeTextPath" d="M 50,50 m -33,0 a 33,33 0 1,1 66,0 a 33,33 0 1,1 -66,0" fill="none" />
            <text fill="var(--gold)" fontSize="7.2" fontFamily="'Inter', sans-serif" fontWeight="800" letterSpacing="1.2">
              <textPath href="#badgeTextPath" startOffset="0%">
                • FRETE OFF • NO 2º PRATO
              </textPath>
            </text>
          </svg>
          <div className="badge-center-icon">
            <img src="logoboy2.webp" className="motoboy-img" alt="Motoboy" />
            <div className="diagonal-red-line"></div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <header>
        <div className="hero">
          <img src="logo.png" alt="Cocina Velari" className="floating-logo" />
          <h1 className="brand-name">COCINA VELARI</h1>
          <div className="brand-subtitle">Signature Strogonoff Experience</div>
          <div className="brand-domain">cocinavelari.com</div>
          <p className="hero-description">
            Uma experiência gastronômica premium criada para clientes que valorizam sofisticação, exclusividade e excelência artesanal.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="btn">Explorar Menu</a>
            <a href="https://wa.me/5583921505963" className="btn">Reservar Pedido</a>
          </div>
        </div>
      </header>

      {/* MENU AND DISHES */}
      <section id="menu">
        <h2 className="section-title">Signature Menu</h2>
        <p className="section-subtitle">
          Ingredientes selecionados, preparo artesanal e acabamento gastronômico inspirados na alta cozinha contemporânea.
        </p>

        {/* LOYALTY CARD COMPONENT */}
        <LoyaltyCard
          loyaltyPhone={loyaltyPhone}
          setLoyaltyPhone={setLoyaltyPhone}
          loyaltyLoading={loyaltyLoading}
          checkLoyaltyCard={checkLoyaltyCard}
          activeStampsPhone={activeStampsPhone}
          loyaltyStamps={loyaltyStamps}
          loyaltyMessage={loyaltyMessage}
          formatPhone={formatPhone}
        />

        {/* MENU GRID */}
        <div className="menu-grid">
          {DISHES.map((dish) => {
            const isExpanded = expandedDishId === dish.id;
            const currentQty = dishQuantities[dish.id] || 1;
            const dishExtrasSelected = selectedExtras[dish.id] || {};

            return (
              <DishCard
                key={dish.id}
                dish={dish}
                isExpanded={isExpanded}
                currentQty={currentQty}
                dishExtrasSelected={dishExtrasSelected}
                toggleDishSelection={toggleDishSelection}
                handleQtyChange={handleQtyChange}
                handleDishQtyChange={handleDishQtyChange}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      </section>

      {/* GATEWAY DETAILS BLOCK */}
      <section>
        <div className="payment-section reveal visible">
          <h2 className="section-title">Pagamento Exclusivo</h2>
          <p className="section-subtitle">
            A segurança e a agilidade que você merece. Utilizamos o PIX para transações instantâneas, diretamente do seu aplicativo bancário.
          </p>
          <div className="payment-highlight">
            <div className="payment-logo-grid" style={{ marginBottom: "8px" }}>
              <div className="payment-logo-item pix" title="PIX">
                <svg viewBox="0 0 256 256" style={{ width: "20px", height: "20px", fill: "currentColor" }}>
                  <path d="M128 43a16.8 16.8 0 0 0-11.8 4.9L49.9 114.2a16.8 16.8 0 0 0 0 23.6l66.3 66.3a16.8 16.8 0 0 0 23.6 0l66.3-66.3a16.8 16.8 0 0 0 0-23.6L139.8 47.9A16.8 16.8 0 0 0 128 43zm0 21.2L182.8 119l-54.8 54.8L73.2 119zm0 20.3L97.5 119l30.5 30.5 30.5-30.5z" />
                </svg>
              </div>
              <div className="payment-logo-item visa" title="Visa"><i className="fab fa-cc-visa"></i></div>
              <div className="payment-logo-item mastercard" title="Mastercard"><i className="fab fa-cc-mastercard"></i></div>
              <div className="payment-logo-item elo" title="Elo">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: "800", fontStyle: "italic", letterSpacing: "-1px", textTransform: "lowercase" }}>
                  <span style={{ color: "#00a4e4" }}>e</span><span style={{ color: "#ffd200" }}>l</span><span style={{ color: "#e30613" }}>o</span>
                </span>
              </div>
              <div className="payment-logo-item hipercard" title="Hipercard">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: "800", letterSpacing: "0px" }}>Hiper</span>
              </div>
              <div className="payment-logo-item amex" title="Amex"><i className="fab fa-cc-amex"></i></div>
            </div>
            <div className="payment-text">
              <h3>Pagamento PIX</h3>
              <p>Instantâneo, seguro e compatível com todos os bancos. Após a confirmação, seu pedido é encaminhado imediatamente.</p>
            </div>
          </div>
          <p style={{ marginTop: "24px", fontSize: "12px", color: "var(--muted)", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "16px", height: "16px", background: "var(--gold)", borderRadius: "50%", opacity: 0.6 }}></span>
            Transação criptografada • Dados protegidos
          </p>
        </div>
      </section>

      {/* FLOATING CART BAR */}
      <div className={`floating-cart-bar ${cartItemsCount > 0 ? "active" : ""}`} id="floatingCartBar">
        <div className="floating-cart-content" onClick={() => setActiveModal("cart")}>
          <span className="floating-cart-icon"><i className="fas fa-shopping-bag"></i></span>
          <span className="floating-cart-text">Finalizar Pedido (<span id="cartCount">{cartItemsCount}</span>)</span>
          <span className="floating-cart-total">R$ <span id="cartTotal">{subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
        </div>
      </div>

      <CartModal
        isOpen={activeModal === "cart"}
        cart={cart}
        updateCartItemQty={updateCartItemQty}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        matchedZone={matchedZone}
        getCartItemsCount={getCartItemsCount}
        loyaltyDiscount={loyaltyDiscount}
        totalGeral={totalGeral}
        setActiveModal={setActiveModal}
      />

      <CustomerModal
        isOpen={activeModal === "customer"}
        getUserLocation={getUserLocation}
        isLocateLoading={isLocateLoading}
        locateStatus={locateStatus}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        street={street}
        setStreet={setStreet}
        number={number}
        setNumber={setNumber}
        district={district}
        setDistrict={setDistrict}
        city={city}
        matchedZone={matchedZone}
        formatPhone={formatPhone}
        paymentGateway={paymentGateway}
        setPaymentGateway={setPaymentGateway}
        setActiveModal={setActiveModal}
        handleCustomerSubmit={handleCustomerSubmit}
      />

      <PaymentModal
        isOpen={activeModal === "payment"}
        paymentGateway={paymentGateway}
        cart={cart}
        subtotal={subtotal}
        district={district}
        deliveryFee={deliveryFee}
        loyaltyDiscount={loyaltyDiscount}
        totalGeral={totalGeral}
        handleMercadoPagoPayment={handleMercadoPagoPayment}
        handleWooviPix={handleWooviPix}
        wooviQrCode={wooviQrCode}
        wooviBrCode={wooviBrCode}
        copyPixCode={copyPixCode}
        paymentStatus={paymentStatus}
        paymentTimerText={paymentTimerText}
        sendWooviOrderToWhatsApp={sendWooviOrderToWhatsApp}
        setActiveModal={setActiveModal}
      />
    </>
  );
}
