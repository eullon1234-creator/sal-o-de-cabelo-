import React, { useState, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Product } from '../../types';
import {
  ShoppingBag,
  Search,
  Check,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Zap,
  X,
  SlidersHorizontal,
  Star,
  Tag,
  ArrowUpDown,
  Flame,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ProductShopProps {
  onOpenCheckoutDirectly?: (product: Product) => void;
}

export const ProductShop: React.FC<ProductShopProps> = ({ onOpenCheckoutDirectly }) => {
  const { products, addToCart } = useSalon();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');

  // Only retail products
  const retailProducts = useMemo(() => products.filter((p) => p.isRetail), [products]);

  const categories = [
    { label: 'Todos', icon: '✨' },
    { label: 'Shampoo', icon: '🧴' },
    { label: 'Máscara', icon: '💧' },
    { label: 'Óleo & Sérum', icon: '✨' },
    { label: 'Finalizador', icon: '💨' },
    { label: 'Kit', icon: '🎁' },
  ];

  const brands = ['Todas', 'Kérastase', 'L’Oréal Professionnel', 'Braé', 'Wella', 'Olaplex'];

  const quickFilterPills = [
    { label: 'Kérastase', type: 'brand', val: 'Kérastase' },
    { label: 'Máscaras Reparadoras', type: 'category', val: 'Máscara' },
    { label: 'Óleo & Sérum', type: 'category', val: 'Óleo & Sérum' },
    { label: 'Olaplex', type: 'brand', val: 'Olaplex' },
    { label: 'Kits Completos', type: 'category', val: 'Kit' },
  ];

  // Dynamic real-time search & filter
  const filteredProducts = useMemo(() => {
    return retailProducts
      .filter((product) => {
        const query = searchTerm.trim().toLowerCase();
        const matchSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);

        const matchCategory =
          selectedCategory === 'Todos' ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchBrand =
          selectedBrand === 'Todas' ||
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase());

        return matchSearch && matchCategory && matchBrand;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // relevance / default
      });
  }, [retailProducts, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedBrand('Todas');
    setSortBy('relevance');
  };

  const handleQuickTagClick = (type: string, val: string) => {
    if (type === 'brand') {
      setSelectedBrand(val);
      setSelectedCategory('Todos');
    } else if (type === 'category') {
      setSelectedCategory(val);
      setSelectedBrand('Todas');
    }
  };

  return (
    <div id="product-shop-page" className="max-w-7xl mx-auto space-y-8 py-4 animate-fade-in">
      {/* Luxury Eye-Catching Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-stone-100 p-8 sm:p-12 border border-amber-500/20 shadow-2xl animate-fade-in-scale">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-700/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Boutique Home-Care Exclusiva
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Cinzel',serif] text-stone-100 leading-tight">
              Os Segredos do Salão no Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Ritual Diário</span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-light">
              Fórmulas originais e lacradas Kérastase, Olaplex, Wella e Braé. Mantenha a nutrição, o brilho espelhado e o tratamento profundo mesmo após o atendimento.
            </p>

            {/* Promo Coupon Pill */}
            <div className="inline-flex items-center gap-2.5 p-2 px-4 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Use o cupom <strong>BELLA10</strong> e ganhe <strong>10% de desconto</strong> no seu primeiro pedido!</span>
            </div>
          </div>

          {/* Quick Stats & Trust Badges */}
          <div className="lg:col-span-4 bg-stone-900/80 backdrop-blur-md rounded-2xl p-5 border border-stone-800 space-y-3.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100">Garantia de Autenticidade</h4>
                <p className="text-[11px] text-stone-400">Produtos 100% originais direto dos distribuidores</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100">Checkout Instantâneo</h4>
                <p className="text-[11px] text-stone-400">PIX com aprovação imediata ou até 12x no cartão</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100">Retirada ou Envio Rápido</h4>
                <p className="text-[11px] text-stone-400">Retire no salão sem frete ou receba com entrega express</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC SEARCH & FILTER CONTROLS BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-lg space-y-5 animate-fade-in-delayed">
        {/* Top Search Input Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Dynamic Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              id="search-products-dynamic-input"
              type="text"
              placeholder="Digite o nome do produto ou categoria (ex: shampoo, máscara, sérum, Kérastase)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-2xl border-2 border-stone-200/90 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 transition-all bg-stone-50/50 hover:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name">Nome (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Busca rápida:
          </span>
          {quickFilterPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handleQuickTagClick(pill.type, pill.val)}
              className="px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 text-stone-600 font-medium text-xs whitespace-nowrap transition-all"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Category Tabs with Icons */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.label.toLowerCase();
            const count =
              cat.label === 'Todos'
                ? retailProducts.length
                : retailProducts.filter((p) => p.category.toLowerCase() === cat.label.toLowerCase()).length;

            return (
              <button
                key={cat.label}
                id={`category-tab-${cat.label.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-stone-950 text-amber-300 shadow-md shadow-stone-950/20 scale-[1.02]'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">
              Mostrando <strong className="text-stone-950 font-bold">{filteredProducts.length}</strong> de {retailProducts.length} produtos
            </span>
            {(searchTerm || selectedCategory !== 'Todos' || selectedBrand !== 'Todas') && (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                Filtros ativos
              </span>
            )}
          </div>

          {(searchTerm || selectedCategory !== 'Todos' || selectedBrand !== 'Todas') && (
            <button
              onClick={handleClearFilters}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpar todos os filtros
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-['Cinzel',serif] text-stone-900">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs text-stone-500">
              Não encontramos nenhum produto para a sua busca <strong>"{searchTerm}"</strong> ou filtros selecionados.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition-all"
          >
            Ver Todos os Produtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock <= product.minStockAlert && product.stock > 0;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative animate-fade-in"
              >
                {/* Photo & Overlays */}
                <div className="relative h-60 bg-stone-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Brand Tag Pill */}
                  <span className="absolute top-3.5 left-3.5 bg-stone-950/85 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow border border-amber-400/20 tracking-wide">
                    {product.brand}
                  </span>

                  {/* Stock Status Badge */}
                  {isOutOfStock ? (
                    <span className="absolute top-3.5 right-3.5 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      Esgotado
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute top-3.5 right-3.5 bg-amber-500 text-stone-950 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Apenas {product.stock} un!
                    </span>
                  ) : (
                    <span className="absolute top-3.5 right-3.5 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <Check className="w-3 h-3" /> Em estoque
                    </span>
                  )}

                  {/* Rating Stars Overlay */}
                  <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                    <span className="text-stone-400 font-normal">| Profissional</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors pt-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block font-medium">Preço exclusivo</span>
                        <div className="text-2xl font-black text-stone-900 font-sans tracking-tight">
                          R$ {(product?.price ?? 0).toFixed(2).replace('.', ',')}
                        </div>
                        <span className="text-[11px] text-emerald-700 font-semibold block">
                          ou 3x de R$ {((product?.price ?? 0) / 3).toFixed(2).replace('.', ',')} s/ juros
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        id={`btn-add-cart-${product.id}`}
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product, 1)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isOutOfStock
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Sacola
                      </button>

                      <button
                        id={`btn-buy-now-${product.id}`}
                        disabled={isOutOfStock}
                        onClick={() => {
                          addToCart(product, 1);
                          if (onOpenCheckoutDirectly) {
                            onOpenCheckoutDirectly(product);
                          }
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isOutOfStock
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-amber-500/25 hover:shadow-lg'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        Comprar Agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
