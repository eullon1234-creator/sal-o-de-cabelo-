import React, { useState } from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { NotificationToast } from './components/NotificationToast';
import { HeroSection } from './components/ClientView/HeroSection';
import { BookingView } from './components/ClientView/BookingView';
import { ProductShop } from './components/ClientView/ProductShop';
import { MyAppointments } from './components/ClientView/MyAppointments';
import { ReviewsSection } from './components/ClientView/ReviewsSection';
import { CartCheckoutModal } from './components/ClientView/CartCheckoutModal';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { AdminAppointments } from './components/AdminView/AdminAppointments';
import { AdminInventory } from './components/AdminView/AdminInventory';
import { AdminCashFlow } from './components/AdminView/AdminCashFlow';
import { AdminReports } from './components/AdminView/AdminReports';
import { AdminServices } from './components/AdminView/AdminServices';
import { AdminProfessionals } from './components/AdminView/AdminProfessionals';
import { AdminSettings } from './components/AdminView/AdminSettings';
import { AdminSubscription } from './components/AdminView/AdminSubscription';
import {
  Scissors,
  Phone,
  Clock,
  MapPin,
  Instagram,
  MessageCircle,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole, clientTab, adminTab, setClientTab, setAdminTab } = useSalon();
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Global Notifications Toast */}
      <NotificationToast />

      {/* Main Header / Navigation */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'client' ? (
          <div key={clientTab} className="animate-fade-in">
            {clientTab === 'home' && <HeroSection />}
            {clientTab === 'booking' && <BookingView />}
            {clientTab === 'shop' && <ProductShop />}
            {clientTab === 'my-appointments' && <MyAppointments />}
            {clientTab === 'reviews' && <ReviewsSection />}
          </div>
        ) : (
          <div key={adminTab} className="animate-fade-in">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'appointments' && <AdminAppointments />}
            {adminTab === 'inventory' && <AdminInventory />}
            {adminTab === 'cashflow' && <AdminCashFlow />}
            {adminTab === 'reports' && <AdminReports />}
            {adminTab === 'services' && <AdminServices />}
            {adminTab === 'professionals' && <AdminProfessionals />}
            {adminTab === 'settings' && <AdminSettings />}
            {adminTab === 'subscription' && <AdminSubscription />}
          </div>
        )}
      </main>

      {/* Cart & Checkout Modal with Payment Gateways */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs py-12 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <Scissors className="w-4 h-4 text-stone-950" />
              </div>
              <span className="font-['Cinzel',serif] tracking-wider text-lg font-bold text-stone-100">
                Studio Bella Arte
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Especialistas em visagismo capilar, coloração de alta performance e bem-estar. Experiência personalizada do agendamento aos cuidados home-care.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-300">
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                title="WhatsApp do Salão"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-pink-600 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Horários */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">
              Horário de Atendimento
            </h4>
            <div className="space-y-1.5 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Terça a Sexta: 09:00 às 19:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Sábado: 08:30 às 18:30</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <span>Domingo e Segunda: Fechado</span>
              </div>
            </div>
          </div>

          {/* Col 3: Localização & Contato */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">
              Onde Estamos
            </h4>
            <div className="space-y-1.5 text-[11px] text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Av. Paulista, 1420 - Jardins, São Paulo - SP</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>(11) 98765-4321 • (11) 3210-9876</span>
              </div>
            </div>
          </div>

          {/* Col 4: Garantias & Transparência */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-100 uppercase tracking-wider text-xs">
              Compromisso & Segurança
            </h4>
            <div className="space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Pagamento 100% Protegido
              </div>
              <p className="leading-relaxed">
                Lembretes automáticos enviados via WhatsApp oficial com confirmação em 1 clique.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => {
                    setClientTab('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-colors"
                >
                  Agendar Meu Horário Agora
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} Studio Bella Arte — Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com dedicação para a sua beleza e bem-estar <Sparkles className="w-3 h-3 text-amber-400" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <MainContent />
    </SalonProvider>
  );
}
