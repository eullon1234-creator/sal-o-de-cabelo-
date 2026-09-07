import React from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Calendar,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Heart,
  Award,
  Scissors,
  Flame,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { services, setClientTab, setBookingPreselectedServiceId, reviews, professionals } = useSalon();

  const handleBookService = (serviceId: string) => {
    setBookingPreselectedServiceId(serviceId);
    setClientTab('booking');
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const transformations = [
    {
      title: 'Morena Iluminada Mel Dourado',
      stylist: 'Juliana Castro',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      tag: 'Coloração & Mechas',
    },
    {
      title: 'Corte Bob Visagista & Texturização',
      stylist: 'Rodrigo Mendonça',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
      tag: 'Visagismo',
    },
    {
      title: 'Terapia Capilar & Fusio-Dose',
      stylist: 'Beatriz Lima',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
      tag: 'Tratamento Profundo',
    },
    {
      title: 'Loiro Platinado Pérola Saudável',
      stylist: 'Juliana Castro',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
      tag: 'Loiro Luxo',
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* LUXURY HERO BANNER */}
      <section
        id="hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white p-8 sm:p-12 lg:p-16 border border-amber-500/20 shadow-2xl animate-fade-in-scale"
      >
        {/* Luminous Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-amber-700/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              Alta Perfomance em Visagismo & Estética
            </div>

            <h1 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.15]">
              A Transformação que o Seu Cabelo <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Sempre Mereceu</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Agendamento 100% intuitivo, lembretes inteligentes via <strong>WhatsApp com confirmação em 1 clique</strong>, equipe premiada e os melhores tratamentos das marcas Kérastase, L'Oréal e Wella.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-btn-book"
                onClick={() => {
                  setBookingPreselectedServiceId(null);
                  setClientTab('booking');
                }}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                Agendar Horário Online
              </button>

              <button
                id="hero-btn-shop"
                onClick={() => setClientTab('shop')}
                className="px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-amber-500/30 text-stone-100 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all hover:border-amber-400/70 hover:shadow-lg shadow-black/40"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                Comprar Produtos na Loja
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-800/90 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lembrete 1-clique WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>{avgRating} de nota ({reviews.length} clientes)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pontualidade Rigorosa</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PIX e Cartão em até 12x</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card with Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 group">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                alt="Studio Bella Arte Ambience"
                className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-amber-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Cinzel',serif] font-bold text-amber-300 text-sm">
                    Studio Bella Arte Jardins
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Aberto Hoje
                  </span>
                </div>
                <p className="text-stone-300 text-[11px] leading-snug">
                  Ambiente intimista com atendimento personalizado, drinks de boas-vindas e os melhores profissionais.
                </p>
              </div>

              {/* Floating Rating Pill */}
              <div className="absolute top-4 right-4 bg-stone-950/90 backdrop-blur-md border border-amber-400/30 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-xl">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0 Excelência</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES SHOWCASE */}
      <section id="popular-services-section" className="space-y-8 animate-fade-in-delayed">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-1 block">
              Menu de Tratamentos & Visagismo
            </span>
            <h2 className="font-['Cinzel',serif] text-2xl sm:text-4xl font-bold text-stone-900">
              Procedimentos Mais Desejados
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Reserve online em segundos com os melhores especialistas do Studio.
            </p>
          </div>
          <button
            id="view-all-booking-btn"
            onClick={() => setClientTab('booking')}
            className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 flex items-center gap-2 transition-all group bg-amber-100/80 hover:bg-amber-200 px-4 py-2.5 rounded-xl self-start md:self-auto"
          >
            Ver Cardápio Completo de Horários
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group animate-fade-in"
            >
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3.5 left-3.5 bg-stone-950/85 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow border border-amber-400/20">
                  {service.category}
                </span>
                <span className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-black px-2.5 py-1 rounded-full shadow">
                  {service.durationMinutes} min
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block font-medium">A partir de</span>
                    <span className="text-xl font-extrabold text-stone-900 font-sans tracking-tight">
                      R$ {(service?.price ?? 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    id={`book-card-btn-${service.id}`}
                    onClick={() => handleBookService(service.id)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE & AFTER / TRANSFORMATIONS GALLERY */}
      <section className="space-y-6 bg-stone-950 text-white p-8 sm:p-12 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Galeria de Transformações
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Cinzel',serif] text-stone-100 mt-1">
              Resultados Reais no Bella Arte
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Técnicas exclusivas de visagismo que harmonizam corte, tonalidade e saúde capilar.
            </p>
          </div>

          <button
            onClick={() => setClientTab('booking')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all self-start md:self-auto"
          >
            Quero Minha Transformação
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {transformations.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-lg hover:border-amber-400/50 transition-all duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-700/50 px-2 py-0.5 rounded-md inline-block">
                  {item.tag}
                </span>
                <h4 className="font-bold text-stone-100 text-sm leading-snug">{item.title}</h4>
                <p className="text-[11px] text-stone-400">por {item.stylist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP AUTOMATION FEATURE BANNER */}
      <section
        id="whatsapp-feature-banner"
        className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border border-emerald-800/80 text-emerald-50 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden animate-fade-in"
      >
        <div className="space-y-4 max-w-xl relative z-10">
          <span className="bg-emerald-800/80 text-emerald-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-emerald-600/40">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            Lembretes Automáticos Inteligentes
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold font-['Cinzel',serif] text-white leading-tight">
            Nunca Mais Perca um Horário: Confirmação em 1 Clique
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
            Esqueça ligações e confirmações demoradas. Nosso sistema dispara uma mensagem personalizada no seu WhatsApp antes do seu atendimento com um link exclusivo para <strong>confirmar sua presença instantaneamente</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setClientTab('booking')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Agendar e Receber Lembrete
            </button>
            <button
              onClick={() => setClientTab('my-appointments')}
              className="px-4 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-emerald-300 text-xs font-semibold border border-emerald-700/50"
            >
              Ver Meus Horários Marcados
            </button>
          </div>
        </div>

        {/* WhatsApp Message Mockup */}
        <div className="bg-stone-950 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl max-w-sm w-full text-stone-100 space-y-3.5 text-xs relative z-10">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-stone-950 font-bold text-xs">
                BA
              </div>
              <div>
                <span className="font-bold text-white block">Studio Bella Arte</span>
                <span className="text-[10px] text-emerald-400">Mensagem Oficial WhatsApp</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-500">Hoje às 10:00</span>
          </div>

          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-2 text-stone-200">
            <p className="leading-relaxed">
              Olá, <strong>Camila!</strong> ✨<br />
              Seu horário para <strong>Corte Visagista</strong> com <strong>Juliana Castro</strong> está reservado para hoje às <strong>14:30</strong>.
            </p>
            <p className="text-[11px] text-stone-400">
              Para confirmar sua presença, clique no botão abaixo:
            </p>
          </div>

          <button
            onClick={() => setClientTab('my-appointments')}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-stone-950 font-extrabold text-center py-3 rounded-xl shadow-lg hover:from-emerald-400 hover:to-emerald-300 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmar Meu Horário (1 Clique)
          </button>
        </div>
      </section>
    </div>
  );
};
