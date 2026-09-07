import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2,
  RefreshCw,
  KeyRound,
  History,
  AlertCircle,
  QrCode,
  DollarSign,
} from 'lucide-react';

export const AdminSubscription: React.FC = () => {
  const { subscription, updateSubscription, simulateSubscriptionPayment } = useSalon();

  const [isEditingKeys, setIsEditingKeys] = useState<boolean>(false);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(subscription.monthlyPrice || 69.9);
  const [mercadoPagoPublicKey, setMercadoPagoPublicKey] = useState<string>(
    subscription.mercadoPagoPublicKey || 'APP_USR-7a18b2c4-9d03-4e56-8f71-2b83901a8ef1'
  );
  const [mercadoPagoAccessToken, setMercadoPagoAccessToken] = useState<string>(
    subscription.mercadoPagoAccessToken || 'APP_USR-8472910384729103-090812-7bf8103c81034e'
  );
  const [webhookUrl, setWebhookUrl] = useState<string>(
    subscription.webhookUrl || 'https://sua-api.antigravity.dev/api/webhooks/mercadopago'
  );
  const [mercadoPagoPreferenceId, setMercadoPagoPreferenceId] = useState<string>(
    subscription.mercadoPagoPreferenceId || 'pref_sub_julianacastro_2026'
  );

  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubscription({
      monthlyPrice: Number(monthlyPrice),
      mercadoPagoPublicKey,
      mercadoPagoAccessToken,
      webhookUrl,
      mercadoPagoPreferenceId,
    });
    setIsEditingKeys(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Assinatura Ativa
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Aguardando Renovação
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            {status}
          </span>
        );
    }
  };

  return (
    <div id="admin-subscription-page" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Monetização & SaaS
            </span>
            {getStatusBadge(subscription.status)}
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900 mt-1.5">
            Assinatura Mensal do Sistema
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 max-w-xl leading-relaxed">
            Estrutura pronta para conexão com o <strong>Mercado Pago</strong>. Aqui você gerencia o valor cobrado da dona do salão pelo uso do software de agendamento e automações.
          </p>
        </div>

        <div className="bg-stone-950 text-white px-5 py-3 rounded-2xl text-right shrink-0 border border-stone-800">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">
            Mensalidade do Salão
          </span>
          <div className="text-2xl font-black text-amber-400 font-sans">
            R$ {(subscription?.monthlyPrice ?? 69.9).toFixed(2).replace('.', ',')}
            <span className="text-xs text-stone-400 font-normal"> / mês</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">
            Renovação: {(subscription?.renewalDate || '').split('-').reverse().join('/')}
          </span>
        </div>
      </div>

      {/* Info Card: Antigravity & Mercado Pago Integration */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-stone-100 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
                Pronto para Antigravity & Mercado Pago Subscriptions
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Webhook Ready
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Toda a arquitetura de tokens, preferência de assinatura e histórico de recebimento está configurada. Quando você conectar o backend definitivo no Antigravity, basta apontar as variáveis de ambiente para as credenciais do Mercado Pago abaixo.
            </p>
          </div>
        </div>

        {/* Action Testing Buttons */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-stone-300">Testar cobrança no ambiente:</span>
          <button
            onClick={() => simulateSubscriptionPayment('PIX')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            Simular Renovação PIX
          </button>
          <button
            onClick={() => simulateSubscriptionPayment('Cartão de Crédito')}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Simular Pagamento Cartão
          </button>
          <button
            onClick={() => setIsEditingKeys(!isEditingKeys)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors ml-auto"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {isEditingKeys ? 'Fechar Credenciais' : 'Configurar Chaves MP'}
          </button>
        </div>
      </div>

      {/* Edit Credentials Form (Collapsible) */}
      {isEditingKeys && (
        <form
          onSubmit={handleSaveCredentials}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              Credenciais da API do Mercado Pago
            </h4>
            <span className="text-[11px] text-stone-400">Ambiente de Produção / Sandbox</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Valor da Assinatura Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Preference ID da Assinatura (Mercado Pago)
              </label>
              <input
                type="text"
                required
                value={mercadoPagoPreferenceId}
                onChange={(e) => setMercadoPagoPreferenceId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Public Key (Mercado Pago)
              </label>
              <input
                type="text"
                required
                value={mercadoPagoPublicKey}
                onChange={(e) => setMercadoPagoPublicKey(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Access Token (Privado)
              </label>
              <input
                type="password"
                required
                value={mercadoPagoAccessToken}
                onChange={(e) => setMercadoPagoAccessToken(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                URL de Retorno / Webhook Notification (Antigravity Backend)
              </label>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingKeys(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow"
            >
              Salvar Credenciais
            </button>
          </div>
        </form>
      )}

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-stone-900 text-base font-['Cinzel',serif] flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              Histórico de Mensalidades Cobradas
            </h3>
            <p className="text-xs text-stone-500">
              Registro de todas as faturas liquidadas pelo salão através do Mercado Pago.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {subscription.paymentHistory?.length || 0} faturas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-6">ID Fatura</th>
                <th className="py-3 px-6">Data de Pagamento</th>
                <th className="py-3 px-6">Valor</th>
                <th className="py-3 px-6">Método de Liquidação</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {subscription.paymentHistory && subscription.paymentHistory.length > 0 ? (
                subscription.paymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-stone-800">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-6 text-stone-700">
                      {(item.date || '').split('-').reverse().join('/')}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-stone-900 font-sans">
                      R$ {(item.amount ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3.5 px-6 text-stone-700 font-medium">
                      {item.method}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Nenhum pagamento registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
