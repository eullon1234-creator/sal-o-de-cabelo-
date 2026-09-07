import React from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  Star,
  Clock,
  LayoutDashboard,
  Boxes,
  DollarSign,
  BarChart3,
  Scissors,
  ShieldCheck,
  User,
  MessageCircle,
  Users,
  Settings,
  CreditCard,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const {
    currentRole,
    setCurrentRole,
    clientTab,
    setClientTab,
    adminTab,
    setAdminTab,
    cart,
    appointments,
  } = useSalon();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'Pendente').length;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 text-stone-100 transition-all shadow-xl">
      {/* Delicate Golden Top Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 shadow-sm" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => {
              if (currentRole === 'client') setClientTab('home');
              else setAdminTab('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <span className="font-['Cinzel',serif] tracking-wider text-xl font-bold text-stone-100 flex items-center gap-2">
                BELLA ARTE
                <span className="text-xs tracking-widest text-amber-400 font-sans uppercase font-medium bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded-full">
                  Studio
                </span>
              </span>
              <p className="text-xs text-stone-400 font-sans">Salão de Cabelo & Estética</p>
            </div>
          </div>

          {/* Navigation Links based on role */}
          <nav id="role-navigation" className="hidden md:flex items-center gap-1">
            {currentRole === 'client' ? (
              <>
                <button
                  id="nav-client-home"
                  onClick={() => setClientTab('home')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    clientTab === 'home'
                      ? 'bg-stone-800 text-amber-300 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  Início
                </button>
                <button
                  id="nav-client-booking"
                  onClick={() => setClientTab('booking')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    clientTab === 'booking'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Agendar Horário
                </button>
                <button
                  id="nav-client-shop"
                  onClick={() => setClientTab('shop')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    clientTab === 'shop'
                      ? 'bg-stone-800 text-amber-300 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Produtos & Loja
                </button>
                <button
                  id="nav-client-appointments"
                  onClick={() => setClientTab('my-appointments')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    clientTab === 'my-appointments'
                      ? 'bg-stone-800 text-amber-300 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Meus Agendamentos
                </button>
                <button
                  id="nav-client-reviews"
                  onClick={() => setClientTab('reviews')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    clientTab === 'reviews'
                      ? 'bg-stone-800 text-amber-300 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Avaliações
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-admin-dashboard"
                  onClick={() => setAdminTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'dashboard'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Visão Geral
                </button>
                <button
                  id="nav-admin-appointments"
                  onClick={() => setAdminTab('appointments')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all relative ${
                    adminTab === 'appointments'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Agenda & WhatsApp
                  {pendingAppointmentsCount > 0 && (
                    <span className="ml-1 bg-amber-400 text-stone-950 text-xs font-bold px-1.5 py-0.2 rounded-full">
                      {pendingAppointmentsCount}
                    </span>
                  )}
                </button>
                <button
                  id="nav-admin-inventory"
                  onClick={() => setAdminTab('inventory')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'inventory'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Boxes className="w-4 h-4" />
                  Estoque
                </button>
                <button
                  id="nav-admin-cashflow"
                  onClick={() => setAdminTab('cashflow')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'cashflow'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Fluxo de Caixa
                </button>
                <button
                  id="nav-admin-reports"
                  onClick={() => setAdminTab('reports')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'reports'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Relatórios
                </button>
                <button
                  id="nav-admin-services"
                  onClick={() => setAdminTab('services')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'services'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  Serviços
                </button>
                <button
                  id="nav-admin-professionals"
                  onClick={() => setAdminTab('professionals')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'professionals'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Equipe
                </button>
                <button
                  id="nav-admin-settings"
                  onClick={() => setAdminTab('settings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'settings'
                      ? 'bg-amber-600/90 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button
                  id="nav-admin-subscription"
                  onClick={() => setAdminTab('subscription')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    adminTab === 'subscription'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow'
                      : 'text-amber-400 hover:text-amber-300 hover:bg-stone-800/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Assinatura Pro
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Cart Button (Always accessible or when items exist) */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors flex items-center justify-center"
              title="Ver sacola de produtos"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalCartItems > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                >
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Quick WhatsApp Support */}
            <a
              id="header-whatsapp-btn"
              href="https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20servi%C3%A7os%20do%20Studio%20Bella%20Arte."
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold transition-colors"
              title="Atendimento no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Role Switcher Pill: Cliente <-> Administrador */}
            <div id="role-switcher-container" className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                id="role-btn-client"
                onClick={() => setCurrentRole('client')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'client'
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cliente</span>
              </button>
              <button
                id="role-btn-admin"
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gestão Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div id="mobile-subnav" className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-stone-800/80 text-xs gap-2 no-scrollbar">
          {currentRole === 'client' ? (
            <>
              <button
                onClick={() => setClientTab('home')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  clientTab === 'home' ? 'bg-stone-800 text-amber-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => setClientTab('booking')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  clientTab === 'booking' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Agendar
              </button>
              <button
                onClick={() => setClientTab('shop')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  clientTab === 'shop' ? 'bg-stone-800 text-amber-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Loja
              </button>
              <button
                onClick={() => setClientTab('my-appointments')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  clientTab === 'my-appointments' ? 'bg-stone-800 text-amber-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Meus Horários
              </button>
              <button
                onClick={() => setClientTab('reviews')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  clientTab === 'reviews' ? 'bg-stone-800 text-amber-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Avaliações
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'dashboard' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setAdminTab('appointments')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'appointments' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Agenda ({pendingAppointmentsCount})
              </button>
              <button
                onClick={() => setAdminTab('inventory')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'inventory' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Estoque
              </button>
              <button
                onClick={() => setAdminTab('cashflow')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'cashflow' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Fluxo de Caixa
              </button>
              <button
                onClick={() => setAdminTab('reports')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'reports' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Relatórios
              </button>
              <button
                onClick={() => setAdminTab('services')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'services' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setAdminTab('professionals')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'professionals' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Equipe
              </button>
              <button
                onClick={() => setAdminTab('settings')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'settings' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400'
                }`}
              >
                Configurações
              </button>
              <button
                onClick={() => setAdminTab('subscription')}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md ${
                  adminTab === 'subscription' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-amber-400'
                }`}
              >
                Assinatura Pro
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
