import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Product } from '../../types';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  Search,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateStock, addProduct, updateProduct, deleteProduct } = useSalon();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'Todos' | 'Loja' | 'Interno'>('Todos');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<'Shampoo' | 'Máscara' | 'Óleo & Sérum' | 'Finalizador' | 'Kit'>('Máscara');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(120);
  const [costPrice, setCostPrice] = useState<number>(60);
  const [stock, setStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(3);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80');
  const [isRetail, setIsRetail] = useState<boolean>(true);

  // Calculations
  const totalItemsCount = products.reduce((sum, p) => sum + p.stock, 0);
  const totalCostValuation = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'Todos' ||
      (filterType === 'Loja' && p.isRetail) ||
      (filterType === 'Interno' && !p.isRetail);
    return matchesSearch && matchesType;
  });

  const resetForm = () => {
    setName('');
    setBrand('');
    setCategory('Máscara');
    setDescription('');
    setPrice(120);
    setCostPrice(60);
    setStock(10);
    setMinStockAlert(3);
    setImageUrl('https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80');
    setIsRetail(true);
    setEditingProduct(null);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price);
    setCostPrice(p.costPrice);
    setStock(p.stock);
    setMinStockAlert(p.minStockAlert);
    setImageUrl(p.imageUrl);
    setIsRetail(p.isRetail);
    setShowAddModal(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        brand: brand.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock),
        minStockAlert: Number(minStockAlert),
        imageUrl,
        isRetail,
      });
    } else {
      addProduct({
        name: name.trim(),
        brand: brand.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock),
        minStockAlert: Number(minStockAlert),
        imageUrl,
        isRetail,
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  return (
    <div id="admin-inventory-page" className="space-y-6">
      {/* Header and Summary Cards */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Almoxarifado & Boutique
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
            Gestão de Estoque
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Controle de químicos e produtos utilizados no salão e itens disponíveis para venda aos clientes.
          </p>
        </div>

        <button
          id="btn-admin-add-product"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Cadastrar Novo Produto
        </button>
      </div>

      {/* Stock Value KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-xs space-y-1">
          <span className="text-stone-500 uppercase font-bold tracking-wider">Itens Totais em Estoque</span>
          <div className="text-2xl font-extrabold text-stone-900">{totalItemsCount} unidades</div>
          <span className="text-[11px] text-stone-400">{products.length} produtos cadastrados</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-xs space-y-1">
          <span className="text-stone-500 uppercase font-bold tracking-wider">Custo Total Imobilizado</span>
          <div className="text-2xl font-extrabold text-rose-700 font-sans">
            R$ {totalCostValuation.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-stone-400">Capital investido em mercadorias</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-xs space-y-1">
          <span className="text-stone-500 uppercase font-bold tracking-wider">Potencial de Venda (Loja)</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-sans">
            R$ {totalRetailValuation.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Margem bruta média de {Math.round(((totalRetailValuation - totalCostValuation) / (totalCostValuation || 1)) * 100)}%
          </span>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm text-xs space-y-1 ${
          lowStockCount > 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-200'
        }`}>
          <span className="text-amber-800 uppercase font-bold tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Nível de Alerta
          </span>
          <div className="text-2xl font-extrabold text-stone-900">{lowStockCount} produtos críticos</div>
          <span className="text-[11px] text-amber-700 font-medium">
            Abaixo da quantidade mínima
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto">
          {(['Todos', 'Loja', 'Interno'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === type
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {type === 'Todos' ? 'Todos' : type === 'Loja' ? 'Venda na Loja' : 'Uso Interno no Salão'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Destinação</th>
                <th className="py-3 px-4">Custo Unitário</th>
                <th className="py-3 px-4">Preço de Venda</th>
                <th className="py-3 px-4">Margem Unitária</th>
                <th className="py-3 px-4">Estoque Atual</th>
                <th className="py-3 px-4 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isCritical = p.stock <= p.minStockAlert;
                const profit = p.price - p.costPrice;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-amber-700 uppercase">
                            {p.brand}
                          </span>
                          <h4 className="font-bold text-stone-900 max-w-xs truncate">{p.name}</h4>
                          <span className="text-[10px] text-stone-400">{p.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-4">
                      {p.isRetail ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Venda na Loja
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          Uso Interno
                        </span>
                      )}
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-4 text-stone-700 font-semibold font-sans">
                      R$ {(p?.costPrice ?? 0).toFixed(2).replace('.', ',')}
                    </td>

                    {/* Sell Price */}
                    <td className="py-3.5 px-4 font-bold text-stone-900 font-sans">
                      R$ {(p?.price ?? 0).toFixed(2).replace('.', ',')}
                    </td>

                    {/* Margin */}
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 font-bold font-sans">
                        + R$ {(profit ?? 0).toFixed(2).replace('.', ',')}
                      </span>
                      <span className="block text-[10px] text-stone-400">
                        {Math.round((profit / (p.costPrice || 1)) * 100)}% margem
                      </span>
                    </td>

                    {/* Current Stock with alert */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-extrabold text-sm px-2 py-0.5 rounded-md font-sans ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {p.stock} un
                        </span>
                        {isCritical && (
                          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Mín: {p.minStockAlert}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Adjustment & Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg">
                          <button
                            onClick={() => updateStock(p.id, p.stock - 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center shadow-xs transition-colors"
                            title="Dar baixa em 1 unidade"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateStock(p.id, p.stock + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center shadow-xs transition-colors ml-0.5"
                            title="Entrada de 1 unidade"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateStock(p.id, p.stock + 5)}
                            className="px-1.5 h-6 rounded bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[10px] flex items-center justify-center ml-0.5"
                            title="Repor +5 unidades"
                          >
                            +5
                          </button>
                        </div>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Editar informações do produto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja apagar o produto "${p.name}" do estoque?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Excluir produto do estoque"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5 animate-fade-in-scale">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {editingProduct ? 'Atualização de Item' : 'Cadastro de Mercadoria'}
                </span>
                <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                  {editingProduct ? `Editar ${editingProduct.name}` : 'Adicionar Produto ao Estoque'}
                </h3>
                <p className="text-xs text-stone-500">
                  Cadastre suprimentos do salão ou produtos para venda na vitrine da loja.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Shampoo Nutritive"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Marca / Fabricante *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kérastase"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Shampoo">Shampoo</option>
                    <option value="Máscara">Máscara</option>
                    <option value="Óleo & Sérum">Óleo & Sérum</option>
                    <option value="Finalizador">Finalizador</option>
                    <option value="Kit">Kit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Destinação
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={isRetail}
                        onChange={() => setIsRetail(true)}
                        className="text-amber-500"
                      />
                      <span>Venda na Loja</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isRetail}
                        onChange={() => setIsRetail(false)}
                        className="text-amber-500"
                      />
                      <span>Uso Interno</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Estoque Inicial
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Alerta Mínimo
                  </label>
                  <input
                    type="number"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Descrição do Produto
                </label>
                <textarea
                  rows={2}
                  placeholder="Benefícios, modo de uso ou ativos..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow transition-all"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar no Estoque'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
