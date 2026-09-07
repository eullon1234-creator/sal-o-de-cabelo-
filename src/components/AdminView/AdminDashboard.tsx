import React from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  MessageCircle,
  Scissors,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Boxes,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    transactions,
    appointments,
    products,
    selectedMonth,
    setSelectedMonth,
    triggerAllPendingReminders,
    sendWhatsAppReminder,
    setAdminTab,
    confirmAppointment,
  } = useSalon();

  // Filter transactions for selected month
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const totalIncomes = monthTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncomes - totalExpenses;

  // Appointments today / pending
  const todayStr = '2026-09-08'; // Matches mock date or use dynamic
  const todayAppointments = appointments.filter((a) => a.date === todayStr || a.date === '2026-09-07');
  const pendingWhatsAppReminders = appointments.filter((a) => !a.whatsappReminderSent && a.status !== 'Cancelado');

  // Low stock alert items
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div id="admin-dashboard-page" className="space-y-8">
      {/* Month Selector & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Painel Executivo
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
            Gestão & Visão Geral do Salão
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanhamento em tempo real de faturamento, agenda, estoque e disparos de WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-stone-600 uppercase">Mês de Análise:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 text-xs font-bold rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Faturamento do Mês */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Receita do Mês
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-sans">
            {formatCurrency(totalIncomes)}
          </div>
          <p className="text-[11px] text-stone-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">Serviços + Loja</span> no período
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Despesas & Saídas
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-sans">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[11px] text-stone-500">
            Estoque, aluguel, contas e comissões
          </p>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Resultado Líquido
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              netBalance >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
            }`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold font-sans ${netBalance >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
            {formatCurrency(netBalance)}
          </div>
          <p className="text-[11px] text-stone-500">
            Margem operacional positiva no mês
          </p>
        </div>

        {/* Estoque Crítico Alert */}
        <div className={`p-5 rounded-2xl border shadow-sm space-y-2 cursor-pointer transition-all ${
          lowStockProducts.length > 0
            ? 'bg-amber-50/80 border-amber-300'
            : 'bg-white border-stone-200'
        }`}
          onClick={() => setAdminTab('inventory')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Estoque Crítico
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockProducts.length > 0 ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
            }`}>
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-sans">
            {lowStockProducts.length} itens
          </div>
          <p className="text-[11px] text-amber-800 font-medium">
            {lowStockProducts.length > 0 ? 'Exigem reposição imediata' : 'Nível de estoque normal'}
          </p>
        </div>
      </div>

      {/* Quick Action WhatsApp Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-emerald-50 border border-emerald-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            Automação de Lembretes WhatsApp
          </div>
          <h3 className="text-xl font-bold font-['Cinzel',serif] text-white">
            {pendingWhatsAppReminders.length > 0
              ? `Existem ${pendingWhatsAppReminders.length} clientes aguardando lembrete de horário`
              : 'Todos os lembretes do WhatsApp foram enviados com sucesso!'}
          </h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Envie as mensagens personalizadas com o link de confirmação em 1 clique para reduzir o no-show e manter a agenda cheia.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-admin-send-all-whatsapp"
            onClick={() => triggerAllPendingReminders()}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Disparar Todos os Lembretes Pendentes
          </button>
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
          >
            Ver Agenda
          </button>
        </div>
      </div>

      {/* Two columns: Upcoming Appointments & Low Stock Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-['Cinzel',serif] text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" /> Próximos Atendimentos
            </h3>
            <button
              onClick={() => setAdminTab('appointments')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              Ver agenda completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{apt.clientName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'Confirmado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-0.5">
                    {apt.serviceName} com <strong className="text-stone-700">{apt.professionalName}</strong>
                  </p>
                  <span className="text-[11px] text-stone-400 font-medium">
                    Data: {apt.date} às {apt.time} • R$ {(apt?.servicePrice ?? 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'Pendente' && (
                    <button
                      onClick={() => confirmAppointment(apt.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                    >
                      Confirmar
                    </button>
                  )}
                  <button
                    onClick={() => sendWhatsAppReminder(apt)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning Box (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-['Cinzel',serif] text-stone-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" /> Alerta de Estoque
            </h3>
            <button
              onClick={() => setAdminTab('inventory')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Gerenciar
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4 text-center">
                Todos os produtos estão com níveis seguros no estoque.
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-stone-900">{p.name}</h4>
                    <span className="text-[11px] text-stone-500">
                      {p.brand} • {p.isRetail ? 'Loja de Vendas' : 'Uso Interno'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      {p.stock} un
                    </span>
                    <span className="block text-[10px] text-stone-400 mt-0.5">
                      Mín: {p.minStockAlert}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setAdminTab('inventory')}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Fazer Reposição de Mercadorias
          </button>
        </div>
      </div>
    </div>
  );
};
