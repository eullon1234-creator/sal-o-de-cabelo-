import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { CashFlowTransaction, TransactionType, PaymentMethod } from '../../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  QrCode,
  FileText,
  Search,
  Filter,
  PieChart,
} from 'lucide-react';

export const AdminCashFlow: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    selectedMonth,
    setSelectedMonth,
  } = useSalon();

  const [filterType, setFilterType] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Transaction Form
  const [txType, setTxType] = useState<TransactionType>('Saída');
  const [txCategory, setTxCategory] = useState<CashFlowTransaction['category']>('Aluguel & Contas');
  const [txDescription, setTxDescription] = useState<string>('');
  const [txAmount, setTxAmount] = useState<number>(150);
  const [txPaymentMethod, setTxPaymentMethod] = useState<PaymentMethod>('PIX');
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Filter transactions by selectedMonth (YYYY-MM)
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));

  const totalIncomes = monthTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncomes - totalExpenses;

  // Breakdown by Category
  const categoryTotals: { [key: string]: number } = {};
  monthTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // Breakdown by Payment Method
  const paymentMethodTotals: { [key: string]: number } = {};
  monthTransactions
    .filter((t) => t.type === 'Entrada')
    .forEach((t) => {
      paymentMethodTotals[t.paymentMethod] = (paymentMethodTotals[t.paymentMethod] || 0) + t.amount;
    });

  const filteredTransactions = monthTransactions.filter((t) => {
    const matchesType = filterType === 'Todos' || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription.trim() || txAmount <= 0) return;

    addTransaction({
      date: txDate,
      description: txDescription.trim(),
      category: txCategory,
      type: txType,
      amount: Number(txAmount),
      paymentMethod: txPaymentMethod,
    });

    setTxDescription('');
    setShowAddModal(false);
  };

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
  };

  return (
    <div id="admin-cashflow-page" className="space-y-6">
      {/* Header and Month Filter */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Controle Financeiro Mensal
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
            Fluxo de Caixa
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerenciamento de receitas de serviços, vendas de produtos e saídas operacionais do salão.
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
            id="btn-admin-add-transaction"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Entradas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Entradas (Receitas)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-sans">
            {formatCurrency(totalIncomes)}
          </div>
          <p className="text-[11px] text-stone-500">
            {monthTransactions.filter((t) => t.type === 'Entrada').length} transações registradas
          </p>
        </div>

        {/* Total Saídas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Saídas (Despesas)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-sans">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[11px] text-stone-500">
            {monthTransactions.filter((t) => t.type === 'Saída').length} custos operacionais e estoques
          </p>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Saldo Líquido do Mês
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
            {netBalance >= 0 ? 'Lucro operacional no período' : 'Déficit no período'}
          </p>
        </div>
      </div>

      {/* Methods & Category Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-600" />
            Receitas por Meio de Pagamento
          </h3>
          <div className="space-y-2 text-xs">
            {Object.keys(paymentMethodTotals).length === 0 ? (
              <p className="text-stone-400 italic py-2">Nenhuma receita registrada neste mês.</p>
            ) : (
              Object.entries(paymentMethodTotals).map(([method, val]) => {
                const percent = Math.round((val / (totalIncomes || 1)) * 100);
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-stone-700">{method}</span>
                      <span className="text-stone-900 font-sans">
                        {formatCurrency(val)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-amber-600" />
            Distribuição por Categorias
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(categoryTotals).map(([cat, val]) => (
              <div
                key={cat}
                className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100"
              >
                <span className="font-semibold text-stone-700">{cat}</span>
                <span className="font-bold text-stone-900 font-sans">{formatCurrency(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar lançamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['Todos', 'Entrada', 'Saída'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === t
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t === 'Todos' ? 'Todos os Tipos' : t === 'Entrada' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Descrição do Lançamento</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Excluir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-stone-400 italic">
                    Nenhum lançamento no fluxo de caixa para este filtro no mês selecionado.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-stone-600">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{tx.description}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-medium">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold font-sans">
                      <span
                        className={
                          tx.type === 'Entrada' ? 'text-emerald-700' : 'text-rose-700'
                        }
                      >
                        {tx.type === 'Entrada' ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remover lançamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Lançamento no Caixa
              </span>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                Registrar Movimentação
              </h3>
              <p className="text-xs text-stone-500">
                Adicione receitas de serviços avulsos ou despesas operacionais.
              </p>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Tipo de Lançamento
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Entrada">Entrada (Receita)</option>
                    <option value="Saída">Saída (Despesa)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Serviço">Serviço</option>
                    <option value="Venda de Produto">Venda de Produto</option>
                    <option value="Estoque">Estoque / Fornecedores</option>
                    <option value="Aluguel & Contas">Aluguel & Contas</option>
                    <option value="Comissões">Comissões de Profissionais</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de toalhas e descartáveis"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Boleto">Boleto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Data do Lançamento
                </label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
