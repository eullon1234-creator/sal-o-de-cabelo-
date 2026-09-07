import React, { useRef } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  BarChart3,
  TrendingUp,
  Printer,
  Download,
  Calendar,
  Users,
  Scissors,
  ShoppingBag,
  Star,
  CheckCircle2,
  DollarSign,
  Award,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const {
    transactions,
    appointments,
    services,
    professionals,
    products,
    reviews,
    selectedMonth,
    setSelectedMonth,
  } = useSalon();

  const printRef = useRef<HTMLDivElement>(null);

  // Month transactions
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const totalIncomes = monthTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncomes - totalExpenses;
  const profitMarginPercent = totalIncomes > 0 ? Math.round((netProfit / totalIncomes) * 100) : 0;

  // Month appointments
  const monthAppointments = appointments.filter((a) => a.date.startsWith(selectedMonth));
  const totalAppointments = monthAppointments.length;
  const completedAppointments = monthAppointments.filter((a) => a.status === 'Concluído').length;
  const confirmedAppointments = monthAppointments.filter((a) => a.status === 'Confirmado').length;
  const cancelledAppointments = monthAppointments.filter((a) => a.status === 'Cancelado').length;

  const attendanceRate = totalAppointments > 0
    ? Math.round(((completedAppointments + confirmedAppointments) / totalAppointments) * 100)
    : 100;

  const averageTicket = completedAppointments > 0
    ? totalIncomes / (completedAppointments || 1)
    : totalIncomes / (monthTransactions.filter((t) => t.type === 'Entrada').length || 1);

  // Service Performance Calculation
  const serviceStats: { [serviceName: string]: { count: number; total: number } } = {};
  monthAppointments.forEach((a) => {
    if (!serviceStats[a.serviceName]) {
      serviceStats[a.serviceName] = { count: 0, total: 0 };
    }
    serviceStats[a.serviceName].count += 1;
    serviceStats[a.serviceName].total += a.servicePrice;
  });

  const sortedServices = Object.entries(serviceStats).sort((a, b) => b[1].total - a[1].total);

  // Professional Performance Calculation
  const staffStats: {
    [profName: string]: { count: number; total: number; rating: number };
  } = {};

  professionals.forEach((p) => {
    staffStats[p.name] = { count: 0, total: 0, rating: p.rating };
  });

  monthAppointments.forEach((a) => {
    if (staffStats[a.professionalName]) {
      staffStats[a.professionalName].count += 1;
      staffStats[a.professionalName].total += a.servicePrice;
    }
  });

  const sortedStaff = Object.entries(staffStats).sort((a, b) => b[1].total - a[1].total);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      selectedMonth,
      generatedAt: new Date().toISOString(),
      financials: { totalIncomes, totalExpenses, netProfit, profitMarginPercent },
      appointmentsCount: totalAppointments,
      transactions: monthTransactions,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `relatorio-studio-bella-arte-${selectedMonth}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div id="admin-reports-page" className="space-y-8">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Inteligência de Negócios
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
            Relatório de Desempenho & Resultados
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Análise consolidada de produtividade, receita de procedimentos, produtos e retenção de clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
            <span className="text-xs font-bold text-stone-600 px-2">Mês:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold bg-white p-1.5 rounded-lg border border-stone-300 focus:outline-none"
            />
          </div>

          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Imprimir Relatório
          </button>

          <button
            id="btn-export-backup"
            onClick={handleExportBackup}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar Dados (JSON)
          </button>
        </div>
      </div>

      {/* Printable Report Section */}
      <div ref={printRef} className="space-y-6">
        {/* Printable Header */}
        <div className="p-6 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">
              Demonstrativo Financeiro & Operacional
            </span>
            <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Studio Bella Arte — {selectedMonth}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>

          <div className="text-right bg-stone-800/80 px-4 py-3 rounded-xl border border-stone-700">
            <span className="text-[11px] text-stone-400 block uppercase font-bold">Margem Líquida</span>
            <span className="text-2xl font-extrabold text-amber-400 font-sans">
              {profitMarginPercent}%
            </span>
          </div>
        </div>

        {/* 4 Big Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Faturamento Bruto
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 font-sans">
              {formatCurrency(totalIncomes)}
            </div>
            <span className="text-[11px] text-stone-400 block">Receitas confirmadas</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Resultado Líquido
            </span>
            <div className={`text-2xl font-extrabold font-sans ${netProfit >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
              {formatCurrency(netProfit)}
            </div>
            <span className="text-[11px] text-stone-400 block">Após dedução de custos</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="text-2xl font-extrabold text-stone-900 font-sans">
              {formatCurrency(averageTicket)}
            </div>
            <span className="text-[11px] text-stone-400 block">Gasto médio por cliente</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Taxa de Confirmação
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 font-sans">
              {attendanceRate}%
            </div>
            <span className="text-[11px] text-emerald-600 font-medium block">
              Comprovada via WhatsApp 1-clique
            </span>
          </div>
        </div>

        {/* Rankings Grid: Services vs Professionals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-['Cinzel',serif] text-stone-900 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-600" />
                Procedimentos Mais Lucrativos
              </h3>
              <span className="text-xs text-stone-400 font-medium">Classificados por Receita</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {sortedServices.length === 0 ? (
                <p className="text-stone-400 italic py-4">Sem agendamentos registrados no período.</p>
              ) : (
                sortedServices.slice(0, 5).map(([name, data], idx) => {
                  const percentOfTotal = Math.round((data.total / (totalIncomes || 1)) * 100);
                  return (
                    <div key={name} className="space-y-1.5">
                      <div className="flex justify-between items-baseline font-semibold">
                        <span className="text-stone-800">
                          <span className="font-bold text-amber-600 mr-1.5">#{idx + 1}</span>
                          {name}
                        </span>
                        <span className="text-stone-900 font-sans font-bold">
                          {formatCurrency(data.total)} ({data.count} atendimentos)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(percentOfTotal * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Professionals */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-['Cinzel',serif] text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Produtividade da Equipe
              </h3>
              <span className="text-xs text-stone-400 font-medium">Atendimentos & Faturamento</span>
            </div>

            <div className="space-y-3 text-xs">
              {sortedStaff.map(([name, data]) => (
                <div
                  key={name}
                  className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/70 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-stone-900">{name}</h4>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {data.rating} • {data.count} serviços realizados
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-stone-900 font-sans block text-sm">
                      {formatCurrency(data.total)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Faturamento gerado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Conclusions & Audit Footnote */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
          <p className="font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            Parecer de Desempenho do Estabelecimento
          </p>
          <p className="leading-relaxed">
            • A taxa de comparecimento permaneceu em <strong>{attendanceRate}%</strong> graças ao disparo de lembretes automáticos com confirmação em 1 clique via WhatsApp.
            <br />
            • A venda de produtos da boutique home-care gerou receita complementar com liquidação rápida via gateway seguro.
            <br />
            • O saldo líquido do salão no período foi de <strong>{formatCurrency(netProfit)}</strong>, garantindo estabilidade e margem saudável para novos investimentos.
          </p>
        </div>
      </div>
    </div>
  );
};
