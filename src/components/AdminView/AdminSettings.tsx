import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { SalonSettings } from '../../types';
import {
  Settings,
  Building,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  Save,
  CheckCircle2,
  Sparkles,
  QrCode,
  User,
  Scissors,
} from 'lucide-react';

const WEEK_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export const AdminSettings: React.FC = () => {
  const { salonSettings, updateSalonSettings } = useSalon();

  const [formData, setFormData] = useState<SalonSettings>({
    salonName: salonSettings.salonName || 'Studio Juliana Castro Concept',
    ownerName: salonSettings.ownerName || 'Juliana Castro',
    whatsappNumber: salonSettings.whatsappNumber || salonSettings.phone || '11987654321',
    phone: salonSettings.phone || salonSettings.whatsappNumber || '(11) 98765-4321',
    address: salonSettings.address || 'Alameda Lorena, 1420 - Jardins, São Paulo - SP',
    pixKeyType: salonSettings.pixKeyType || 'Celular',
    pixKey: salonSettings.pixKey || '(11) 98765-4321',
    pixBeneficiary: salonSettings.pixBeneficiary || 'Juliana Castro Cabeleireira ME',
    openingTime: salonSettings.openingTime || '09:00',
    closingTime: salonSettings.closingTime || '19:00',
    slotIntervalMinutes: salonSettings.slotIntervalMinutes || 45,
    openDays: salonSettings.openDays || [
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    lunchStart: salonSettings.lunchStart || '12:30',
    lunchEnd: salonSettings.lunchEnd || '13:30',
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const exists = prev.openDays.includes(day);
      if (exists) {
        return { ...prev, openDays: prev.openDays.filter((d) => d !== day) };
      } else {
        return { ...prev, openDays: [...prev.openDays, day] };
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="admin-settings-page" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Configurações Gerais
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900 mt-1">
            Dados do Salão & Expediente
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Altere os dados da empresa, chaves de recebimento PIX e a grade de horários do agendamento online.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Configurações Salvas!' : 'Salvar Alterações'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identity & Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-stone-900 font-bold font-['Cinzel',serif] text-lg border-b border-stone-100 pb-3">
            <Building className="w-5 h-5 text-amber-600" />
            <h3>Identidade do Salão & Contato</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nome Comercial do Salão *
              </label>
              <input
                type="text"
                required
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nome da Proprietária (Mulher Empreendedora) *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Número do WhatsApp (com DDD) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: 11987654321"
                  value={formData.whatsappNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setFormData({
                      ...formData,
                      whatsappNumber: clean,
                      phone: e.target.value,
                    });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Este é o WhatsApp para onde as mensagens prontas dos clientes serão enviadas.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Endereço Físico do Salão *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: PIX & Payments */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-stone-900 font-bold font-['Cinzel',serif] text-lg border-b border-stone-100 pb-3">
            <QrCode className="w-5 h-5 text-amber-600" />
            <h3>Recebimento PIX no Salão</h3>
          </div>

          <p className="text-xs text-stone-500">
            Configure a chave PIX que será exibida para os clientes copiarem no momento do agendamento e no fechamento dos atendimentos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Tipo da Chave PIX
              </label>
              <select
                value={formData.pixKeyType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pixKeyType: e.target.value as SalonSettings['pixKeyType'],
                  })
                }
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Celular">Celular</option>
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
                <option value="E-mail">E-mail</option>
                <option value="Aleatória">Chave Aleatória</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Valor da Chave PIX *
              </label>
              <input
                type="text"
                required
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nome do Beneficiário / Titular *
              </label>
              <input
                type="text"
                required
                value={formData.pixBeneficiary}
                onChange={(e) => setFormData({ ...formData, pixBeneficiary: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operating Hours & Slots */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-stone-900 font-bold font-['Cinzel',serif] text-lg border-b border-stone-100 pb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3>Grade de Horários & Expediente</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Horário de Abertura
              </label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Horário de Encerramento
              </label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Intervalo entre Slots
              </label>
              <select
                value={formData.slotIntervalMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, slotIntervalMinutes: Number(e.target.value) })
                }
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos (1 hora)</option>
              </select>
            </div>
          </div>

          {/* Lunch Break */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-stone-100">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Início da Pausa / Almoço
              </label>
              <input
                type="time"
                value={formData.lunchStart || ''}
                onChange={(e) => setFormData({ ...formData, lunchStart: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Fim da Pausa / Almoço
              </label>
              <input
                type="time"
                value={formData.lunchEnd || ''}
                onChange={(e) => setFormData({ ...formData, lunchEnd: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Operating Days */}
          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
            <label className="block font-semibold text-stone-700">
              Dias de Atendimento na Semana
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.map((day) => {
                const isSelected = formData.openDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Todas as Configurações
          </button>
        </div>
      </form>
    </div>
  );
};
