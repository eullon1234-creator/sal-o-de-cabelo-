import React, { useState, useEffect } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Service, Professional, ServiceCategory } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Check,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Scissors,
  CheckCircle2,
  Share2,
  MessageCircle,
  Copy,
  ExternalLink,
  CreditCard,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '09:00',
  '09:45',
  '10:30',
  '11:15',
  '13:30',
  '14:15',
  '15:00',
  '15:45',
  '16:30',
  '17:15',
  '18:00',
];

export const BookingView: React.FC = () => {
  const {
    services,
    professionals,
    salonSettings,
    addAppointment,
    setClientTab,
    bookingPreselectedServiceId,
    setBookingPreselectedServiceId,
    sendWhatsAppReminder,
    generateClientWhatsAppBookingMessage,
  } = useSalon();

  // Wizard steps: 1: Service, 2: Professional, 3: Date/Time, 4: Client Info, 5: Confirmed
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  
  // Date default to tomorrow
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowString());
  const [selectedTime, setSelectedTime] = useState<string>('10:30');

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Result & WhatsApp helper states
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [msgCopied, setMsgCopied] = useState<boolean>(false);

  // Handle preselected service from Hero
  useEffect(() => {
    if (bookingPreselectedServiceId) {
      const found = services.find((s) => s.id === bookingPreselectedServiceId);
      if (found) {
        setSelectedService(found);
        setStep(2);
      }
      setBookingPreselectedServiceId(null);
    }
  }, [bookingPreselectedServiceId, services]);

  const categories: string[] = ['Todos', 'Cabelo', 'Coloração', 'Tratamento', 'Penteado & Noivas', 'Estética & Barba'];

  const filteredServices = selectedCategory === 'Todos'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleProfessionalSelect = (prof: Professional | null) => {
    setSelectedProfessional(prof);
    setStep(3);
  };

  const handleDateTimeNext = () => {
    if (!selectedDate || !selectedTime) return;
    setStep(4);
  };

  const handlePhoneChange = (val: string) => {
    // simple Brazilian phone format (11) 98765-4321
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    setClientPhone(formatted);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName.trim() || clientPhone.replace(/\D/g, '').length < 10) {
      return;
    }

    const assignedProf = selectedProfessional || professionals[0];

    const apt = addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      professionalId: assignedProf.id,
      professionalName: assignedProf.name,
      date: selectedDate,
      time: selectedTime,
      notes: clientNotes.trim() || undefined,
    });

    setCreatedAppointmentId(apt.id);
    setStep(5);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div id="booking-container" className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Wizard Progress Indicator */}
      <div id="booking-stepper" className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/90 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 w-full z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />

          {[
            { num: 1, label: 'Serviço' },
            { num: 2, label: 'Profissional' },
            { num: 3, label: 'Data & Hora' },
            { num: 4, label: 'Seus Dados' },
            { num: 5, label: 'Confirmação' },
          ].map((item) => (
            <div key={item.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step > item.num
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                    : step === item.num
                    ? 'bg-stone-900 text-amber-300 ring-4 ring-amber-200 shadow-md'
                    : 'bg-stone-100 text-stone-400 border border-stone-300'
                }`}
              >
                {step > item.num ? <Check className="w-4 h-4 text-stone-950 stroke-[3]" /> : item.num}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-stone-600 mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div id="step-service-selection" className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
                1. Escolha o Procedimento
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Selecione o serviço ideal para o seu momento de cuidado.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-amber-300 shadow'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={`select-service-${service.id}`}
                onClick={() => handleServiceSelect(service)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center group ${
                  selectedService?.id === service.id
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-md'
                }`}
              >
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {service.durationMinutes} min
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 truncate mt-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                    <span className="text-sm font-bold text-stone-900">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1">
                      Selecionar <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Professional */}
      {step === 2 && (
        <div id="step-professional-selection" className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
                2. Profissional Responsável
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Serviço selecionado: <strong className="text-stone-800">{selectedService?.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          </div>

          {professionals.length === 1 ? (
            /* Single Owner Exclusive Profile Card */
            <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 rounded-2xl p-6 sm:p-8 text-stone-100 border border-amber-500/30 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <div className="relative">
                  <img
                    src={professionals[0].avatarUrl}
                    alt={professionals[0].name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-amber-400 shadow-xl ring-4 ring-amber-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-900 shadow">
                    Online
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                        Atendimento Exclusivo & Personalizado
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                        {professionals[0].name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                      ★ {professionals[0].rating} (Avaliação Máxima)
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 font-medium">
                    {professionals[0].role} • Fundadora do {salonSettings.salonName}
                  </p>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
                    {professionals[0].bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 justify-center sm:justify-start">
                    {professionals[0].specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[11px] bg-stone-800 text-amber-200/90 border border-stone-700 px-2.5 py-0.5 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      id="btn-confirm-single-owner"
                      type="button"
                      onClick={() => handleProfessionalSelect(professionals[0])}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      Prosseguir com {professionals[0].name.split(' ')[0]}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-stone-400">
                      Horário dedicado exclusivamente para você
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-professional grid if team members are registered */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                id="select-any-professional"
                onClick={() => handleProfessionalSelect(null)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
                  selectedProfessional === null
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-md'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold shrink-0 shadow">
                  <Sparkles className="w-8 h-8 text-stone-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700">
                    Primeiro Profissional Disponível
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Ideal para quem deseja o horário mais rápido ou flexível.
                  </p>
                  <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                    Mais agilidade
                  </span>
                </div>
              </div>

              {professionals.map((prof) => (
                <div
                  key={prof.id}
                  id={`select-professional-${prof.id}`}
                  onClick={() => handleProfessionalSelect(prof)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
                    selectedProfessional?.id === prof.id
                      ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : 'bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  <img
                    src={prof.avatarUrl}
                    alt={prof.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-amber-200 shadow group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700">
                        {prof.name}
                      </h3>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                        ★ {prof.rating}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">{prof.role}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prof.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Date and Time */}
      {step === 3 && (
        <div id="step-datetime-selection" className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
                3. Data & Horário
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Profissional: <strong className="text-stone-800">{selectedProfessional?.name || 'Primeiro Disponível'}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            {/* Date Selector */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Escolha a Data
              </label>
              <input
                id="booking-date-input"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 font-medium"
              />

              {/* Quick shortcut buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 2);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Em 2 dias
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Garantia de Pontualidade
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  Trabalhamos com intervalos adequados para que você seja atendido sem esperas.
                </p>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Horários Disponíveis ({formatDisplayDate(selectedDate)})
              </label>
              <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    id={`time-slot-${slot}`}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTime === slot
                        ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400 shadow'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                id="btn-confirm-datetime-next"
                type="button"
                onClick={handleDateTimeNext}
                className="w-full mt-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                Continuar para Dados <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Client Information Form */}
      {step === 4 && (
        <form onSubmit={handleConfirmBooking} id="step-client-info-form" className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
                4. Seus Dados de Contato
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Usaremos o seu WhatsApp para enviar o lembrete automático e a confirmação em 1 clique.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Recap Card */}
            <div className="md:col-span-1 bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg h-fit">
              <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-stone-800 pb-2">
                Resumo do Agendamento
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-400 block">Serviço:</span>
                  <span className="text-white font-bold">{selectedService?.name}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Profissional:</span>
                  <span className="text-white font-semibold">
                    {selectedProfessional?.name || 'Primeiro Disponível'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Data e Horário:</span>
                  <span className="text-white font-semibold">
                    {formatDisplayDate(selectedDate)} às {selectedTime}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Duração aproximada:</span>
                  <span className="text-stone-200">{selectedService?.durationMinutes} minutos</span>
                </div>
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-stone-400">Total:</span>
                  <span className="text-lg font-bold text-amber-400">
                    R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Payment Info Card */}
              <div className="mt-4 pt-4 border-t border-stone-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pagamento no Salão</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Pague tranquilamente no término do seu atendimento. Aceitamos <strong>Cartões, Dinheiro e PIX</strong>.
                </p>
                <div className="bg-stone-800/80 rounded-xl p-2.5 border border-stone-700/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span>Chave PIX ({salonSettings.pixKeyType})</span>
                    <span className="text-amber-400">{salonSettings.pixBeneficiary}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-mono font-semibold text-white truncate select-all">
                      {salonSettings.pixKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(salonSettings.pixKey);
                        setPixCopied(true);
                        setTimeout(() => setPixCopied(false), 2500);
                      }}
                      className="text-[10px] bg-stone-700 hover:bg-stone-600 text-stone-200 px-2 py-1 rounded flex items-center gap-1 shrink-0"
                    >
                      {pixCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {pixCopied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-client-name"
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  WhatsApp com DDD (para envio da mensagem e confirmação) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-client-phone"
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={clientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Ao confirmar, você poderá enviar uma mensagem pronta direto no WhatsApp da Juliana para garantir sua vaga.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  E-mail (opcional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-client-email"
                    type="email"
                    placeholder="amanda@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Observações ou Preferências para o Cabelo (opcional)
                </label>
                <textarea
                  id="input-client-notes"
                  rows={2}
                  placeholder="Ex: Cabelo com químicas anteriores, prefere tom acobreado, etc."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-appointment"
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-stone-950" />
                  Confirmar e Gerar Mensagem no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* STEP 5: Success & WhatsApp Message Ready */}
      {step === 5 && (() => {
        const assignedProfName = selectedProfessional?.name || professionals[0]?.name || 'Juliana Castro';
        const readyMessage = generateClientWhatsAppBookingMessage({
          clientName,
          clientPhone,
          serviceName: selectedService?.name || '',
          servicePrice: selectedService?.price || 0,
          professionalName: assignedProfName,
          date: selectedDate,
          time: selectedTime,
          notes: clientNotes,
        });

        const rawSalonPhone = salonSettings?.phone || salonSettings?.whatsappNumber || '11987654321';
        const cleanSalonPhone = (rawSalonPhone || '').replace(/\D/g, '');
        const salonPhoneWithCountry = cleanSalonPhone.length <= 11 ? `55${cleanSalonPhone}` : cleanSalonPhone;
        const whatsappUrl = `https://wa.me/${salonPhoneWithCountry}?text=${encodeURIComponent(readyMessage)}`;
        const ownerName = salonSettings?.ownerName || 'Juliana Castro';
        const ownerFirstName = ownerName.split(' ')[0];

        return (
          <div id="step-booking-confirmed" className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6 max-w-2xl mx-auto animate-fade-in-scale">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                Horário Pré-Agendado com Sucesso!
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-stone-900">
                Tudo pronto, {clientName}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Agora envie a mensagem pronta abaixo para a <strong>{ownerName}</strong> no WhatsApp para confirmar o seu horário.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Código da Reserva:</span>
                <span className="font-mono font-bold text-stone-800">{createdAppointmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Serviço:</span>
                <span className="font-bold text-stone-800">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Especialista:</span>
                <span className="font-bold text-stone-800">{assignedProfName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Data e Horário:</span>
                <span className="font-bold text-amber-700">
                  {formatDisplayDate(selectedDate)} às {selectedTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pagamento:</span>
                <span className="font-semibold text-stone-700">No Salão (Dinheiro, Cartão ou PIX)</span>
              </div>
            </div>

            {/* WhatsApp Ready Message Box */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Mensagem Pronta para Enviar via WhatsApp</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(readyMessage);
                    setMsgCopied(true);
                    setTimeout(() => setMsgCopied(false), 2500);
                  }}
                  className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {msgCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {msgCopied ? 'Texto Copiado!' : 'Copiar Texto'}
                </button>
              </div>

              {/* Chat bubble preview */}
              <div className="bg-white rounded-xl p-3.5 border border-emerald-200/80 text-[11px] text-stone-800 font-sans whitespace-pre-line leading-relaxed shadow-sm">
                {readyMessage}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                <a
                  id="btn-send-whatsapp-booking"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar no WhatsApp da {ownerFirstName} Agora
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[10px] text-center text-stone-500">
                  Ao abrir o WhatsApp, a mensagem já estará preenchida. Basta apertar enviar!
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-view-my-appointments"
                onClick={() => setClientTab('my-appointments')}
                className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs transition-colors"
              >
                Ver Meus Agendamentos
              </button>

              <button
                id="btn-book-another"
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedProfessional(null);
                  setCreatedAppointmentId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
