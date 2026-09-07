import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  Professional,
  Product,
  Appointment,
  Review,
  CashFlowTransaction,
  CartItem,
  PaymentMethod,
  AppointmentStatus,
  SalonSettings,
  SubscriptionSettings,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_PROFESSIONALS,
  INITIAL_PRODUCTS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_SALON_SETTINGS,
  INITIAL_SUBSCRIPTION,
} from '../mockData';

export type AdminTabType =
  | 'dashboard'
  | 'appointments'
  | 'services'
  | 'inventory'
  | 'professionals'
  | 'settings'
  | 'subscription'
  | 'cashflow'
  | 'reports';

interface SalonContextType {
  services: Service[];
  professionals: Professional[];
  products: Product[];
  appointments: Appointment[];
  reviews: Review[];
  transactions: CashFlowTransaction[];
  cart: CartItem[];
  salonSettings: SalonSettings;
  subscription: SubscriptionSettings;
  currentRole: 'client' | 'admin';
  setCurrentRole: (role: 'client' | 'admin') => void;
  clientTab: 'home' | 'booking' | 'shop' | 'my-appointments' | 'reviews';
  setClientTab: (tab: 'home' | 'booking' | 'shop' | 'my-appointments' | 'reviews') => void;
  adminTab: AdminTabType;
  setAdminTab: (tab: AdminTabType) => void;
  
  // Settings & Subscription
  updateSalonSettings: (settings: Partial<SalonSettings>) => void;
  updateSubscription: (sub: Partial<SubscriptionSettings>) => void;
  simulateSubscriptionPayment: (method: string) => void;

  // Appointment actions
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  confirmAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;
  sendWhatsAppReminder: (appointment: Appointment) => string;
  triggerAllPendingReminders: () => number;
  generateClientWhatsAppBookingMessage: (apt: {
    clientName: string;
    clientPhone: string;
    serviceName: string;
    servicePrice: number;
    professionalName: string;
    date: string;
    time: string;
    notes?: string;
  }) => string;
  generateAdminWhatsAppReplyMessage: (
    apt: Appointment,
    type: 'confirm' | 'reschedule' | 'reminder' | 'thanks',
    customNote?: string
  ) => string;
  openWhatsAppWithClient: (
    apt: Appointment,
    type: 'confirm' | 'reschedule' | 'reminder' | 'thanks',
    customNote?: string
  ) => void;
  
  // Review actions
  addReview: (review: Omit<Review, 'id' | 'date'>, appointmentId?: string) => void;

  // Cart & Shop
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutCart: (customerInfo: { name: string; phone: string; email: string }, paymentMethod: PaymentMethod) => Promise<boolean>;

  // Inventory, Services & Professionals CRUD
  updateStock: (productId: string, newStock: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addProfessional: (prof: Omit<Professional, 'id'>) => void;
  updateProfessional: (id: string, prof: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;

  // Cash Flow
  addTransaction: (tx: Omit<CashFlowTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  // Helpers
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  notificationToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  setNotificationToast: (toast: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;
  bookingPreselectedServiceId: string | null;
  setBookingPreselectedServiceId: (id: string | null) => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'bella_arte_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
      return { ...defaultValue, ...parsed };
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [salonSettings, setSalonSettings] = useState<SalonSettings>(() => {
    const stored = getStored('salonSettings', INITIAL_SALON_SETTINGS);
    const phone = stored.phone || stored.whatsappNumber || INITIAL_SALON_SETTINGS.phone || '11987654321';
    return {
      ...INITIAL_SALON_SETTINGS,
      ...stored,
      phone,
      whatsappNumber: stored.whatsappNumber || phone,
    };
  });
  const [subscription, setSubscription] = useState<SubscriptionSettings>(() => getStored('subscription', INITIAL_SUBSCRIPTION));
  const [services, setServices] = useState<Service[]>(() => getStored('services', INITIAL_SERVICES));
  const [professionals, setProfessionals] = useState<Professional[]>(() => getStored('professionals', INITIAL_PROFESSIONALS));
  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStored('appointments', INITIAL_APPOINTMENTS));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [transactions, setTransactions] = useState<CashFlowTransaction[]>(() => getStored('transactions', INITIAL_TRANSACTIONS));
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));

  const [currentRole, setCurrentRole] = useState<'client' | 'admin'>('client');
  const [clientTab, setClientTab] = useState<'home' | 'booking' | 'shop' | 'my-appointments' | 'reviews'>('home');
  const [adminTab, setAdminTab] = useState<AdminTabType>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [bookingPreselectedServiceId, setBookingPreselectedServiceId] = useState<string | null>(null);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => {
        setNotificationToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // Persist state changes
  useEffect(() => setStored('salonSettings', salonSettings), [salonSettings]);
  useEffect(() => setStored('subscription', subscription), [subscription]);
  useEffect(() => setStored('services', services), [services]);
  useEffect(() => setStored('professionals', professionals), [professionals]);
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('appointments', appointments), [appointments]);
  useEffect(() => setStored('reviews', reviews), [reviews]);
  useEffect(() => setStored('transactions', transactions), [transactions]);
  useEffect(() => setStored('cart', cart), [cart]);

  // Check URL params for 1-click WhatsApp confirmation link: e.g. ?confirm=apt-102
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const confirmId = params.get('confirm');
    if (confirmId) {
      const apt = appointments.find((a) => a.id === confirmId);
      if (apt && apt.status !== 'Confirmado') {
        confirmAppointment(confirmId);
        setNotificationToast({
          message: `Horário de ${apt.clientName} para ${apt.serviceName} confirmado com sucesso com 1 clique!`,
          type: 'success',
        });
        setClientTab('my-appointments');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [appointments]);

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now().toString().slice(-6)}`,
      status: 'Pendente',
      whatsappReminderSent: false,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    setNotificationToast({
      message: `Agendamento realizado para ${newApt.date} às ${newApt.time}! Lembrete programado via WhatsApp.`,
      type: 'success',
    });
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, status };
          // If status moved to Concluído, auto-register transaction if not present
          if (status === 'Concluído') {
            const alreadyExists = transactions.some((t) => t.referenceId === apt.id);
            if (!alreadyExists) {
              addTransaction({
                date: apt.date,
                description: `Atendimento ${apt.serviceName} - ${apt.clientName} (${apt.professionalName})`,
                category: 'Serviço',
                type: 'Entrada',
                amount: apt.servicePrice,
                paymentMethod: 'PIX',
                referenceId: apt.id,
              });
            }
          }
          return updated;
        }
        return apt;
      })
    );
  };

  const confirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'Confirmado',
              confirmedAt: new Date().toISOString(),
            }
          : apt
      )
    );
    setNotificationToast({
      message: 'Presença confirmada com sucesso em 1 clique!',
      type: 'success',
    });
  };

  const sendWhatsAppReminder = (appointment: Appointment): string => {
    const cleanPhone = (appointment?.clientPhone || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    
    // 1-click confirmation URL for this applet
    const appUrl = window.location.origin + window.location.pathname;
    const confirmUrl = `${appUrl}?confirm=${appointment.id}`;

    const formattedDate = appointment.date.split('-').reverse().join('/');
    const message = `Olá, *${appointment.clientName}*! ✨\n\n` +
      `Aqui é do *Studio Bella Arte* para lembrar do seu horário especial:\n\n` +
      `💇‍♀️ *Serviço:* ${appointment.serviceName}\n` +
      `✂️ *Profissional:* ${appointment.professionalName}\n` +
      `📅 *Data:* ${formattedDate}\n` +
      `⏰ *Horário:* ${appointment.time}\n\n` +
      `👉 *Confirme sua presença com apenas 1 clique tocando aqui:*\n${confirmUrl}\n\n` +
      `Se precisar remarcar, nos responda por aqui. Estamos ansiosos para te receber! 💖`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encoded}`;

    // Update appointment record
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointment.id ? { ...apt, whatsappReminderSent: true } : apt))
    );

    // Open WhatsApp Web/App
    window.open(whatsappUrl, '_blank');

    setNotificationToast({
      message: `Lembrete com link de 1 clique enviado para o WhatsApp de ${appointment.clientName}!`,
      type: 'success',
    });

    return whatsappUrl;
  };

  const triggerAllPendingReminders = (): number => {
    const pendings = appointments.filter((a) => !a.whatsappReminderSent && a.status !== 'Cancelado');
    if (pendings.length === 0) {
      setNotificationToast({
        message: 'Todos os clientes já receberam lembretes para os próximos horários!',
        type: 'info',
      });
      return 0;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.status !== 'Cancelado' ? { ...a, whatsappReminderSent: true } : a))
    );

    setNotificationToast({
      message: `${pendings.length} lembretes automáticos foram disparados com sucesso via WhatsApp!`,
      type: 'success',
    });
    return pendings.length;
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>, appointmentId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: today,
    };
    setReviews((prev) => [newRev, ...prev]);

    if (appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, reviewed: true } : apt))
      );
    }

    setNotificationToast({
      message: 'Muito obrigado pela sua avaliação! Sua opinião ajuda a manter a nossa excelência.',
      type: 'success',
    });
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      setNotificationToast({
        message: 'Produto temporariamente esgotado no estoque.',
        type: 'warning',
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    setNotificationToast({
      message: `"${product.name}" adicionado à sacola de compras!`,
      type: 'success',
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const checkoutCart = async (
    customerInfo: { name: string; phone: string; email: string },
    paymentMethod: PaymentMethod
  ): Promise<boolean> => {
    if (cart.length === 0) return false;

    const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // 1. Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((ci) => ci.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // 2. Add entry to Cash Flow
    const today = new Date().toISOString().split('T')[0];
    const itemsDescription = cart.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');
    addTransaction({
      date: today,
      description: `Venda Loja: ${itemsDescription} (${customerInfo.name})`,
      category: 'Venda de Produto',
      type: 'Entrada',
      amount: totalAmount,
      paymentMethod,
    });

    // 3. Clear cart
    clearCart();

    return true;
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === productId ? { ...prod, stock: Math.max(0, newStock) } : prod))
    );
    setNotificationToast({
      message: 'Estoque atualizado com sucesso.',
      type: 'success',
    });
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now().toString().slice(-5)}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    setNotificationToast({
      message: `Produto "${newProd.name}" cadastrado com sucesso!`,
      type: 'success',
    });
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    setNotificationToast({
      message: 'Produto atualizado com sucesso!',
      type: 'success',
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setNotificationToast({
      message: 'Produto removido do catálogo.',
      type: 'info',
    });
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...serviceData,
      id: `srv-${Date.now().toString().slice(-5)}`,
    };
    setServices((prev) => [newSrv, ...prev]);
    setNotificationToast({
      message: `Serviço "${newSrv.name}" cadastrado com sucesso!`,
      type: 'success',
    });
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s))
    );
    setNotificationToast({
      message: 'Serviço atualizado com sucesso!',
      type: 'success',
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setNotificationToast({
      message: 'Serviço removido do catálogo.',
      type: 'info',
    });
  };

  const addProfessional = (profData: Omit<Professional, 'id'>) => {
    const newProf: Professional = {
      ...profData,
      id: `pro-${Date.now().toString().slice(-5)}`,
      rating: 5.0,
      isActive: true,
    };
    setProfessionals((prev) => [...prev, newProf]);
    setNotificationToast({
      message: `Profissional "${newProf.name}" cadastrada com sucesso!`,
      type: 'success',
    });
  };

  const updateProfessional = (id: string, profData: Partial<Professional>) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...profData } : p))
    );
    setNotificationToast({
      message: 'Dados da profissional atualizados!',
      type: 'success',
    });
  };

  const deleteProfessional = (id: string) => {
    if (professionals.length <= 1) {
      setNotificationToast({
        message: 'O salão precisa manter pelo menos uma profissional principal.',
        type: 'warning',
      });
      return;
    }
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
    setNotificationToast({
      message: 'Profissional removida.',
      type: 'info',
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setNotificationToast({
      message: 'Agendamento removido da agenda.',
      type: 'info',
    });
  };

  const updateSalonSettings = (newSettings: Partial<SalonSettings>) => {
    setSalonSettings((prev) => ({ ...prev, ...newSettings }));
    setNotificationToast({
      message: 'Configurações do salão salvas com sucesso!',
      type: 'success',
    });
  };

  const updateSubscription = (newSub: Partial<SubscriptionSettings>) => {
    setSubscription((prev) => ({ ...prev, ...newSub }));
    setNotificationToast({
      message: 'Configurações do Mercado Pago / Assinatura salvas!',
      type: 'success',
    });
  };

  const simulateSubscriptionPayment = (method: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextRenewal = nextMonth.toISOString().split('T')[0];

    setSubscription((prev) => ({
      ...prev,
      status: 'Ativo',
      lastPaymentDate: today,
      renewalDate: nextRenewal,
      paymentHistory: [
        {
          id: `pay-mp-${Date.now().toString().slice(-6)}`,
          date: today,
          amount: prev.monthlyPrice,
          method: `Mercado Pago (${method})`,
          status: 'Aprovado',
        },
        ...prev.paymentHistory,
      ],
    }));

    setNotificationToast({
      message: `Assinatura mensal de R$ ${(subscription?.monthlyPrice ?? 69.9).toFixed(2).replace('.', ',')} aprovada via Mercado Pago (${method})! Próxima renovação: ${nextRenewal.split('-').reverse().join('/')}`,
      type: 'success',
    });
  };

  const generateClientWhatsAppBookingMessage = (apt: {
    clientName: string;
    clientPhone: string;
    serviceName: string;
    servicePrice: number;
    professionalName: string;
    date: string;
    time: string;
    notes?: string;
  }): string => {
    const formattedDate = (apt.date || '').split('-').reverse().join('/');
    let msg = `Olá, *${salonSettings.ownerName}*! ✨\n\n`;
    msg += `Gostaria de solicitar um agendamento pelo seu site no *${salonSettings.salonName}*:\n\n`;
    msg += `💇‍♀️ *Serviço:* ${apt.serviceName}\n`;
    msg += `💰 *Valor:* R$ ${(apt.servicePrice ?? 0).toFixed(2).replace('.', ',')}\n`;
    msg += `✂️ *Profissional:* ${apt.professionalName}\n`;
    msg += `📅 *Data Desejada:* ${formattedDate}\n`;
    msg += `⏰ *Horário:* ${apt.time}\n`;
    msg += `👤 *Meu Nome:* ${apt.clientName}\n`;
    msg += `📱 *Meu WhatsApp:* ${apt.clientPhone}\n`;
    msg += `💳 *Pagamento:* No Salão (Dinheiro, Cartão ou PIX)\n`;
    if (apt.notes && apt.notes.trim()) {
      msg += `📝 *Observações:* ${apt.notes.trim()}\n`;
    }
    msg += `\nVocê pode confirmar esse horário para mim, por favor? Muito obrigada! 💖`;
    return msg;
  };

  const generateAdminWhatsAppReplyMessage = (
    apt: Appointment,
    type: 'confirm' | 'reschedule' | 'reminder' | 'thanks',
    customNote?: string
  ): string => {
    const formattedDate = (apt.date || '').split('-').reverse().join('/');
    if (type === 'confirm') {
      return `Olá, *${apt.clientName}*! ✨ Aqui é a ${salonSettings.ownerName} do *${salonSettings.salonName}*.\n\n` +
        `Passando para avisar que o seu horário para *${apt.serviceName}* no dia *${formattedDate} às ${apt.time}* está *CONFIRMADO*! 🎉\n\n` +
        `📍 *Endereço:* ${salonSettings.address}\n` +
        `💳 *Pagamento:* No salão ao final do procedimento (Cartão, Dinheiro ou PIX).\n` +
        `🔑 *Chave PIX (${salonSettings.pixKeyType}):* ${salonSettings.pixKey} (${salonSettings.pixBeneficiary})\n\n` +
        `Já reservei esse momento com todo o carinho para você. Até logo! 💖`;
    }
    if (type === 'reschedule') {
      return `Olá, *${apt.clientName}*! ✨ Aqui é a ${salonSettings.ownerName} do *${salonSettings.salonName}*.\n\n` +
        `Vi a sua solicitação para *${apt.serviceName}* no dia *${formattedDate} às ${apt.time}*.\n\n` +
        `${customNote ? `${customNote}\n\n` : `Infelizmente esse horário precisou ser remanejado por um procedimento longo.\n\n`}` +
        `Qual outro horário ou dia ficaria melhor para você? Me avise por aqui para eu reservar para você com prioridade! 💕`;
    }
    if (type === 'reminder') {
      return `Olá, *${apt.clientName}*! 💖 Lembrete do seu horário hoje:\n\n` +
        `💇‍♀️ *Serviço:* ${apt.serviceName}\n` +
        `⏰ *Horário:* ${apt.time}\n` +
        `📍 *Local:* ${salonSettings.address}\n\n` +
        `Já estou te esperando com aquele café especial! Se tiver qualquer imprevisto, me dê um toque aqui. ✨`;
    }
    if (type === 'thanks') {
      return `Olá, *${apt.clientName}*! ✨ Foi um prazer imenso cuidar do seu cabelo hoje no *${salonSettings.salonName}*!\n\n` +
        `Espero que tenha amado o resultado tanto quanto eu amei fazer! 🥰\n` +
        `Se puder deixar uma avaliação rápida no nosso site, me ajuda muito!\n\n` +
        `Até a próxima visita! Um grande beijo! 💖`;
    }
    return '';
  };

  const openWhatsAppWithClient = (
    apt: Appointment,
    type: 'confirm' | 'reschedule' | 'reminder' | 'thanks',
    customNote?: string
  ) => {
    const text = generateAdminWhatsAppReplyMessage(apt, type, customNote);
    const cleanPhone = (apt?.clientPhone || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    if (type === 'confirm') {
      confirmAppointment(apt.id);
    }
    setNotificationToast({
      message: `WhatsApp aberto com mensagem pronta para ${apt.clientName}!`,
      type: 'success',
    });
  };

  const addTransaction = (txData: Omit<CashFlowTransaction, 'id'>) => {
    const newTx: CashFlowTransaction = {
      ...txData,
      id: `tx-${Date.now().toString().slice(-6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setNotificationToast({
      message: `Lançamento de ${newTx.type === 'Entrada' ? 'Receita' : 'Despesa'} registrado no fluxo de caixa!`,
      type: 'success',
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setNotificationToast({
      message: 'Lançamento removido do fluxo de caixa.',
      type: 'info',
    });
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        professionals,
        products,
        appointments,
        reviews,
        transactions,
        cart,
        salonSettings,
        subscription,
        currentRole,
        setCurrentRole,
        clientTab,
        setClientTab,
        adminTab,
        setAdminTab,
        updateSalonSettings,
        updateSubscription,
        simulateSubscriptionPayment,
        addAppointment,
        updateAppointmentStatus,
        confirmAppointment,
        deleteAppointment,
        sendWhatsAppReminder,
        triggerAllPendingReminders,
        generateClientWhatsAppBookingMessage,
        generateAdminWhatsAppReplyMessage,
        openWhatsAppWithClient,
        addReview,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        updateStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addService,
        updateService,
        deleteService,
        addProfessional,
        updateProfessional,
        deleteProfessional,
        addTransaction,
        deleteTransaction,
        selectedMonth,
        setSelectedMonth,
        notificationToast,
        setNotificationToast,
        bookingPreselectedServiceId,
        setBookingPreselectedServiceId,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
