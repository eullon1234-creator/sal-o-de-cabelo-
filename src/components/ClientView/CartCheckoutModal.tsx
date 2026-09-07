import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { PaymentMethod } from '../../types';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkoutCart,
    sendWhatsAppReminder,
  } = useSalon();

  // Mode: 'cart' | 'checkout' | 'success'
  const [modalMode, setModalMode] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  // Customer Form
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'salon' | 'express'>('salon');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');

  // Credit Card Form
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [installments, setInstallments] = useState<number>(1);

  // States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [paidTotalAmount, setPaidTotalAmount] = useState<number>(0);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pixDiscount = paymentMethod === 'PIX' ? rawSubtotal * 0.05 : 0;
  const shippingCost = deliveryType === 'express' ? 15.0 : 0.0;
  const grandTotal = Math.max(0, rawSubtotal - pixDiscount + shippingCost);

  const pixKeyMock = `00020126580014br.gov.bcb.pix0136studiobellaarte-pix@gmail.com520400005303986540${grandTotal.toFixed(2)}5802BR5917STUDIO BELLA ARTE6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKeyMock);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsProcessing(true);

    // Simulate payment gateway API latency
    setTimeout(async () => {
      const orderId = `PED-${Date.now().toString().slice(-6)}`;
      setPaidTotalAmount(grandTotal);
      setCompletedOrderId(orderId);

      await checkoutCart(
        {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        paymentMethod
      );

      setIsProcessing(false);
      setModalMode('success');

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
        });
      } catch {
        // ignore
      }
    }, 1500);
  };

  const handleCloseAll = () => {
    setModalMode('cart');
    onClose();
  };

  return (
    <div id="cart-checkout-modal-backdrop" className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="cart-checkout-modal-card"
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-stone-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                {modalMode === 'cart'
                  ? 'Sua Sacola de Produtos'
                  : modalMode === 'checkout'
                  ? 'Checkout & Gateway de Pagamento'
                  : 'Compra Concluída com Sucesso!'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {modalMode === 'checkout'
                  ? 'Transação 100% Criptografada & Segura'
                  : 'Studio Bella Arte Boutique'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAll}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* MODE 1: CART OVERVIEW */}
          {modalMode === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-14 h-14 text-stone-300 mx-auto stroke-[1.5]" />
                  <h4 className="text-base font-bold text-stone-800">Sua sacola está vazia</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Conheça nossa seleção de cosméticos profissionais home-care para cuidar do seu cabelo.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-3 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                  >
                    Explorar Produtos da Loja
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 divide-y divide-stone-100">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        id={`cart-row-${item.product.id}`}
                        className="pt-3 first:pt-0 flex items-center justify-between gap-4"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-700 uppercase">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-stone-800 block mt-0.5">
                            R$ {item.product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded text-stone-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= item.product.stock}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded text-stone-600 disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remover produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal dos produtos:</span>
                      <span className="font-semibold text-stone-800">
                        R$ {rawSubtotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Retirada no Salão Bella Arte:</span>
                      <span className="font-semibold text-emerald-600">Grátis</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                      <span className="font-bold text-stone-800 text-sm">Total Estimado:</span>
                      <span className="font-extrabold text-stone-900 text-base">
                        R$ {rawSubtotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={clearCart}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold hover:bg-stone-100"
                    >
                      Esvaziar
                    </button>
                    <button
                      id="btn-proceed-to-checkout"
                      onClick={() => setModalMode('checkout')}
                      className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                    >
                      Avançar para Pagamento Seguro <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* MODE 2: GATEWAY DE PAGAMENTO (CHECKOUT) */}
          {modalMode === 'checkout' && (
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {/* Delivery mode */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Opção de Entrega
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryType('salon')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs transition-all ${
                      deliveryType === 'salon'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 font-bold text-amber-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <div>
                      <span>Retirar no Salão</span>
                      <span className="block text-[10px] text-stone-400 font-normal">
                        Pronto em 30 min (Grátis)
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryType('express')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs transition-all ${
                      deliveryType === 'express'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 font-bold text-amber-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <div>
                      <span>Envio Expresso</span>
                      <span className="block text-[10px] text-stone-400 font-normal">
                        R$ 15,00 (Receba hoje)
                      </span>
                    </div>
                  </div>
                </div>

                {deliveryType === 'express' && (
                  <input
                    type="text"
                    required
                    placeholder="Endereço de entrega completo (Rua, Número, Bairro, CEP)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full mt-2 p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Customer Contact */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Dados do Comprador
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nome completo *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp com DDD *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="email"
                    placeholder="E-mail (para envio do comprovante)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="sm:col-span-2 p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Escolha o Método de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'PIX'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>PIX (-5% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cartão de Crédito')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'Cartão de Crédito'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>Cartão (até 12x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Boleto')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'Boleto'
                        ? 'bg-stone-100 border-stone-500 text-stone-900 ring-2 ring-stone-400'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-stone-600" />
                    <span>Boleto Bancário</span>
                  </button>
                </div>

                {/* Sub-interface: PIX */}
                {paymentMethod === 'PIX' && (
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-700" /> QR Code PIX Instantâneo
                      </span>
                      <span className="bg-emerald-200 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        5% Desconto Aplicado
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-emerald-200">
                      {/* Stylized QR Code */}
                      <div className="w-28 h-28 bg-stone-950 p-2 rounded-lg flex items-center justify-center shrink-0">
                        <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white rounded">
                          <div className="bg-stone-950 col-span-2 row-span-2 rounded-sm" />
                          <div className="bg-stone-300 col-span-1" />
                          <div className="bg-stone-950 col-span-2 row-span-2 rounded-sm" />
                          <div className="bg-stone-950 col-span-1" />
                          <div className="bg-stone-950 col-span-3 row-span-1" />
                          <div className="bg-stone-950 col-span-2 row-span-2 rounded-sm" />
                          <div className="bg-stone-300 col-span-1" />
                          <div className="bg-stone-950 col-span-2 row-span-2 rounded-sm" />
                        </div>
                      </div>

                      <div className="space-y-2 text-stone-700 flex-1">
                        <p className="text-[11px] leading-relaxed">
                          1. Abra o app do seu banco e selecione <strong>PIX Copia e Cola</strong>.
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixKeyMock}
                            className="bg-stone-100 p-2 rounded-lg text-[10px] font-mono text-stone-600 truncate flex-1 border border-stone-200"
                          />
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                          >
                            {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedPix ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                        <p className="text-[10px] text-emerald-800 font-semibold">
                          ⚡ Aprovação imediata! O estoque e o fluxo de caixa serão atualizados automaticamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-interface: Credit Card */}
                {paymentMethod === 'Cartão de Crédito' && (
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" /> Gateway Criptografado (Visa / Master / Elo)
                      </span>
                      <span className="text-[10px] text-stone-400">SSL 256 bits</span>
                    </div>

                    <div className="space-y-2.5">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="Número do Cartão (0000 0000 0000 0000)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      <input
                        type="text"
                        required
                        placeholder="Nome impresso no Cartão"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="Validade (MM/AA)"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="p-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="CVV (Código)"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="p-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Parcelamento:
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        >
                          <option value={1}>1x de R$ {grandTotal.toFixed(2).replace('.', ',')} (à vista sem juros)</option>
                          <option value={2}>2x de R$ {(grandTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value={3}>3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value={6}>6x de R$ {(grandTotal / 6).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value={10}>10x de R$ {(grandTotal / 10).toFixed(2).replace('.', ',')} sem juros</option>
                          <option value={12}>12x de R$ {(grandTotal / 12).toFixed(2).replace('.', ',')} sem juros</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-interface: Boleto */}
                {paymentMethod === 'Boleto' && (
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-xs space-y-2">
                    <p className="font-semibold text-stone-800">
                      Boleto Bancário com vencimento em 3 dias úteis.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      O código de barras será disponibilizado logo após a confirmação para pagamento em qualquer banco ou lotérica.
                    </p>
                  </div>
                )}
              </div>

              {/* Total breakdown */}
              <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span>R$ {rawSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {paymentMethod === 'PIX' && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto PIX (5%):</span>
                    <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-stone-400">
                    <span>Taxa de Envio Expresso:</span>
                    <span>+ R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">Total a Pagar:</span>
                  <span className="text-xl font-extrabold text-amber-400 font-sans">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setModalMode('cart')}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Voltar à Sacola
                </button>
                <button
                  id="btn-confirm-gateway-payment"
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
                >
                  {isProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Processando com Segurança...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Pagar R$ {grandTotal.toFixed(2).replace('.', ',')} Agora
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: SUCCESS CONFIRMATION */}
          {modalMode === 'success' && (
            <div id="order-success-view" className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Pagamento Aprovado com Sucesso!
                </span>
                <h4 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900 mt-2">
                  Obrigado pela sua compra, {customerName}!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Seu pedido <strong className="text-stone-800">#{completedOrderId}</strong> foi processado. O estoque do salão e o fluxo de caixa já foram devidamente atualizados!
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Valor Pago:</span>
                  <span className="font-bold text-stone-900 font-sans">
                    R$ {paidTotalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Forma de Pagamento:</span>
                  <span className="font-bold text-emerald-700">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Entrega:</span>
                  <span className="font-semibold text-stone-800">
                    {deliveryType === 'salon' ? 'Retirada no Studio Bella Arte' : `Expresso: ${deliveryAddress}`}
                  </span>
                </div>
              </div>

              {/* WhatsApp Receipt Button */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <a
                  href={`https://wa.me/55${(customerPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá, ${customerName}! ✨ Seu pedido #${completedOrderId} no valor de R$ ${(paidTotalAmount ?? 0)
                      .toFixed(2)
                      .replace('.', ',')} foi aprovado no Studio Bella Arte. Seu produto já está sendo preparado com todo carinho!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar Comprovante via WhatsApp
                </a>

                <button
                  onClick={handleCloseAll}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
