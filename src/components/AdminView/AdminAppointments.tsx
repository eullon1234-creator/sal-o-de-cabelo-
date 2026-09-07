import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Check,
  Plus,
  Search,
  Filter,
  Eye,
  Scissors,
  Share2,
} from 'lucide-react';

export const AdminAppointments: React.FC = () => {
  const {
    appointments,
    professionals,
    services,
    updateAppointmentStatus,
    confirmAppointment,
    sendWhatsAppReminder,
    addAppointment,
    triggerAllPendingReminders,
  } = useSalon();

  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterProfessional, setFilterProfessional] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Modal for new manual appointment
  const [showNewAptModal, setShowNewAptModal] = useState<boolean>(false);
  const [manualClientName, setManualClientName] = useState<string>('');
  const [manualClientPhone, setManualClientPhone] = useState<string>('');
  const [manualServiceId, setManualServiceId] = useState<string>(services[0]?.id || '');
  const [manualProfId, setManualProfId] = useState<string>(professionals[0]?.id || '');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState<string>('14:00');
  const [manualNotes, setManualNotes] = useState<string>('');

  // WhatsApp Preview Modal
  const [previewApt, setPreviewApt] = useState<Appointment | null>(null);

  const filtered = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'Todos' || apt.status === filterStatus;
    const matchesProf = filterProfessional === 'Todos' || apt.professionalId === filterProfessional;
    const matchesDate = !selectedDate || apt.date === selectedDate;
    const matchesSearch =
      (apt.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.clientPhone || '').includes(searchTerm) ||
      (apt.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesProf && matchesDate && matchesSearch;
  });

  const handleCreateManualApt = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = services.find((s) => s.id === manualServiceId) || services[0];
    const profObj = professionals.find((p) => p.id === manualProfId) || professionals[0];

    addAppointment({
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      serviceId: serviceObj.id,
      serviceName: serviceObj.name,
      servicePrice: serviceObj.price,
      professionalId: profObj.id,
      professionalName: profObj.name,
      date: manualDate,
      time: manualTime,
      notes: manualNotes.trim() || undefined,
    });

    setManualClientName('');
    setManualClientPhone('');
    setManualNotes('');
    setShowNewAptModal(false);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmado
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" /> Pendente
          </span>
        );
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
            <Scissors className="w-3 h-3 text-sky-600" /> Concluído
          </span>
        );
      case 'Cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" /> Cancelado
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
  };

  return (
    <div id="admin-appointments-page" className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Controle de Agenda & WhatsApp
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900">
            Agendamentos & Lembretes
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerencie atendimentos, acompanhe confirmações em 1 clique e envie lembretes automáticos para clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-bulk-whatsapp"
            onClick={() => triggerAllPendingReminders()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Disparar Todos os Lembretes
          </button>

          <button
            id="btn-admin-add-appointment"
            onClick={() => setShowNewAptModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Agendamento Presencial
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search by name/service */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          >
            <option value="Todos">Status: Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Professional Filter */}
        <div>
          <select
            value={filterProfessional}
            onChange={(e) => setFilterProfessional(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          >
            <option value="Todos">Profissional: Todos</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-stone-400 hover:text-stone-600 font-bold p-1 text-xs"
              title="Limpar filtro de data"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Cliente & Contato</th>
                <th className="py-3 px-4">Serviço & Preço</th>
                <th className="py-3 px-4">Profissional</th>
                <th className="py-3 px-4">Data / Horário</th>
                <th className="py-3 px-4">Status & WhatsApp</th>
                <th className="py-3 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-stone-400 italic">
                    Nenhum agendamento encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{apt.clientName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {apt.clientPhone}
                      </div>
                      {apt.notes && (
                        <span className="text-[10px] text-amber-700 italic block mt-0.5 truncate max-w-xs">
                          Obs: {apt.notes}
                        </span>
                      )}
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{apt.serviceName}</span>
                      <span className="text-emerald-700 font-bold font-sans">
                        R$ {(apt?.servicePrice ?? 0).toFixed(2).replace('.', ',')}
                      </span>
                    </td>

                    {/* Stylist */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-800">{apt.professionalName}</span>
                    </td>

                    {/* Date and Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{formatDate(apt.date)}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600" /> {apt.time}
                      </div>
                    </td>

                    {/* Status & WhatsApp log */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div>{getStatusBadge(apt.status)}</div>
                      {apt.whatsappReminderSent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5" /> Lembrete Enviado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-400">
                          Lembrete pendente
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Confirm Button */}
                        {apt.status === 'Pendente' && (
                          <button
                            onClick={() => confirmAppointment(apt.id)}
                            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition-colors"
                            title="Confirmar Presença (1 clique)"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* WhatsApp Reminder Direct Trigger */}
                        <button
                          onClick={() => sendWhatsAppReminder(apt)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 text-[11px] shadow-sm transition-all"
                          title="Enviar lembrete via WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </button>

                        {/* Status Switcher Dropdown */}
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className="p-1.5 rounded-lg border border-stone-200 text-[11px] font-semibold bg-stone-50 focus:outline-none"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Concluído">Concluir (Receita)</option>
                          <option value="Cancelado">Cancelar</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Appointment Modal */}
      {showNewAptModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Studio Bella Arte
              </span>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                Novo Agendamento na Recepção
              </h3>
              <p className="text-xs text-stone-500">
                Cadastre um horário feito por telefone, WhatsApp ou balcão presencial.
              </p>
            </div>

            <form onSubmit={handleCreateManualApt} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Nome da Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={manualClientName}
                  onChange={(e) => setManualClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 98765-4321"
                  value={manualClientPhone}
                  onChange={(e) => setManualClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Procedimento
                  </label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - R$ {s.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Profissional
                  </label>
                  <select
                    value={manualProfId}
                    onChange={(e) => setManualProfId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Informações adicionais..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewAptModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
