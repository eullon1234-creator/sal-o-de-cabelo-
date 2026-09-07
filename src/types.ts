export type ServiceCategory = 'Cabelo' | 'Coloração' | 'Tratamento' | 'Penteado & Noivas' | 'Estética & Barba';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatarUrl: string;
  specialties: string[];
  phone?: string;
  isActive?: boolean;
}

export interface SalonSettings {
  salonName: string;
  ownerName: string;
  whatsappNumber: string;
  phone?: string;
  address: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'Celular' | 'E-mail' | 'Aleatória';
  pixKey: string;
  pixBeneficiary: string;
  openingTime: string;
  closingTime: string;
  slotIntervalMinutes: number;
  openDays: string[];
  lunchStart?: string;
  lunchEnd?: string;
}

export interface SubscriptionSettings {
  planName: string;
  monthlyPrice: number;
  status: 'Ativo' | 'Pendente' | 'Teste';
  renewalDate: string;
  mercadoPagoPublicKey: string;
  mercadoPagoAccessToken: string;
  mercadoPagoPreferenceId: string;
  webhookUrl: string;
  lastPaymentDate?: string;
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: 'Aprovado' | 'Pendente';
  }[];
}

export type AppointmentStatus = 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  whatsappReminderSent?: boolean;
  confirmedAt?: string;
  createdAt: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  serviceName: string;
  professionalName: string;
  date: string;
  verifiedBooking: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Shampoo' | 'Máscara' | 'Óleo & Sérum' | 'Finalizador' | 'Kit';
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  imageUrl: string;
  isRetail: boolean; // available for sales in shop
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type TransactionType = 'Entrada' | 'Saída';
export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Boleto';

export interface CashFlowTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: 'Serviço' | 'Venda de Produto' | 'Estoque' | 'Aluguel & Contas' | 'Comissões' | 'Outros';
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string; // appointmentId or orderId
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Aprovado' | 'Pendente' | 'Cancelado';
  date: string;
}
