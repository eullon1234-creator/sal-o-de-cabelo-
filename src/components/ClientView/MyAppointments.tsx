import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageCircle,
  Star,
  Search,
  Check,
  Scissors,
} from 'lucide-react';

export const MyAppointments: React.FC = () => {
  const {
    appointments,
    confirmAppointment,
    updateAppointmentStatus,
    sendWhatsAppReminder,
    addReview,
    setClientTab,
  } = useSalon();

  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Review Modal State
  const [reviewModalAppointment, setReviewModalAppointment] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'Todos' || apt.status === filterStatus;
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmado
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Aguardando Confirmação
          </span>
        );
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Scissors className="w-3.5 h-3.5 text-sky-600" /> Concluído
          </span>
        );
      case 'Cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenReviewModal = (apt: Appointment) => {
    setReviewModalAppointment(apt);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalAppointment) return;

    addReview(
      {
        clientName: reviewModalAppointment.clientName,
        rating: reviewRating,
        comment: reviewComment.trim(),
        serviceName: reviewModalAppointment.serviceName,
        professionalName: reviewModalAppointment.professionalName,
        verifiedBooking: true,
      },
      reviewModalAppointment.id
    );

    setReviewModalAppointment(null);
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
  };

  return (
    <div id="my-appointments-page" className="max-w-5xl mx-auto space-y-8 py-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-stone-900">
            Histórico & Meus Agendamentos
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Acompanhe seus horários agendados, confirme sua presença com 1 clique ou avalie seu atendimento.
          </p>
        </div>

        <button
          id="btn-schedule-new-from-history"
          onClick={() => setClientTab('booking')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow transition-all self-start md:self-auto"
        >
          <Calendar className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-appointments-input"
            type="text"
            placeholder="Buscar por cliente, serviço ou profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-stone-800"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {['Todos', 'Pendente', 'Confirmado', 'Concluído', 'Cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 space-y-4">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-800">Nenhum agendamento encontrado</h3>
            <p className="text-xs text-stone-500">
              Não encontramos agendamentos com os filtros selecionados.
            </p>
          </div>
          <button
            onClick={() => setClientTab('booking')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            Fazer um Agendamento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              id={`appointment-card-${apt.id}`}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    #{apt.id}
                  </span>
                  {getStatusBadge(apt.status)}
                  {apt.whatsappReminderSent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <MessageCircle className="w-3 h-3" /> Lembrete WhatsApp Enviado
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">{apt.serviceName}</h3>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    Cliente: <strong>{apt.clientName}</strong> • Profissional: <strong>{apt.professionalName}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {formatDate(apt.date)}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {apt.time}
                  </span>
                  <span className="font-bold text-stone-900">
                    R$ {(apt?.servicePrice ?? 0).toFixed(2).replace('.', ',')}
                  </span>
                  {apt.notes && (
                    <span className="text-stone-500 italic max-w-xs truncate">
                      Obs: {apt.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                {/* 1-Click Confirmation Button */}
                {apt.status === 'Pendente' && (
                  <button
                    id={`btn-confirm-1click-${apt.id}`}
                    onClick={() => confirmAppointment(apt.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all hover:scale-[1.02]"
                    title="Confirmar presença com 1 clique"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    Confirmar Presença (1 Clique)
                  </button>
                )}

                {/* Open WhatsApp Reminder */}
                <button
                  id={`btn-open-wa-${apt.id}`}
                  onClick={() => sendWhatsAppReminder(apt)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Enviar mensagem com confirmação via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </button>

                {/* Review Button for completed */}
                {apt.status === 'Concluído' && (
                  <button
                    id={`btn-review-${apt.id}`}
                    disabled={apt.reviewed}
                    onClick={() => handleOpenReviewModal(apt)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      apt.reviewed
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-600" />
                    {apt.reviewed ? 'Avaliado' : 'Avaliar Serviço'}
                  </button>
                )}

                {/* Cancel option */}
                {apt.status !== 'Concluído' && apt.status !== 'Cancelado' && (
                  <button
                    id={`btn-cancel-${apt.id}`}
                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelado')}
                    className="px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                    title="Cancelar agendamento"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evaluation & Review Modal */}
      {reviewModalAppointment && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Avaliação de Experiência
              </span>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                Como foi seu atendimento?
              </h3>
              <p className="text-xs text-stone-500">
                {reviewModalAppointment.serviceName} com {reviewModalAppointment.professionalName}
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Selector */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Seu Comentário ou Elogio
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Conte como foi sua experiência, o que mais gostou no resultado e no ambiente..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalAppointment(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow"
                >
                  Enviar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
