import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Professional } from '../../types';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Phone,
  Star,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Camera,
} from 'lucide-react';

export const AdminProfessionals: React.FC = () => {
  const { professionals, addProfessional, updateProfessional, deleteProfessional, salonSettings } = useSalon();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProf, setEditingProf] = useState<Professional | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('Cabeleireira Especialista');
  const [specialtiesText, setSpecialtiesText] = useState<string>('Corte, Coloração, Escova');
  const [phone, setPhone] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1595956553066-fe24a8c33395?auto=format&fit=crop&w=600&q=80'
  );

  const resetForm = () => {
    setName('');
    setRole('Cabeleireira Especialista');
    setSpecialtiesText('Corte, Coloração, Escova');
    setPhone('');
    setAvatarUrl('https://images.unsplash.com/photo-1595956553066-fe24a8c33395?auto=format&fit=crop&w=600&q=80');
    setEditingProf(null);
  };

  const handleOpenEdit = (prof: Professional) => {
    setEditingProf(prof);
    setName(prof.name);
    setRole(prof.role);
    setSpecialtiesText((prof.specialties || []).join(', '));
    setPhone(prof.phone || '');
    setAvatarUrl(prof.avatarUrl);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingProf) {
      updateProfessional(editingProf.id, {
        name: name.trim(),
        role: role.trim(),
        specialties,
        phone: phone.trim(),
        avatarUrl,
      });
    } else {
      addProfessional({
        name: name.trim(),
        role: role.trim(),
        rating: 5.0,
        avatarUrl,
        specialties,
        phone: phone.trim(),
        isActive: true,
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  return (
    <div id="admin-professionals-page" className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Equipe & Especialistas
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {professionals.length} {professionals.length === 1 ? 'profissional ativa' : 'profissionais ativas'}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900 mt-1">
            Profissionais do Salão
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 max-w-xl leading-relaxed">
            O salão foi desenhado com foco no atendimento exclusivo da <strong>{salonSettings?.ownerName || 'proprietária'}</strong>. Caso você convide uma parceira ou assistente, poderá cadastrá-la aqui a qualquer momento.
          </p>
        </div>

        <button
          id="btn-add-professional-modal"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Cadastrar Nova Profissional
        </button>
      </div>

      {/* Grid of Professionals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((prof, index) => {
          const isPrimaryOwner = index === 0;
          return (
            <div
              key={prof.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                isPrimaryOwner ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={prof.avatarUrl}
                      alt={prof.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    {isPrimaryOwner && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                        Dona
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-stone-900 font-['Cinzel',serif]">
                        {prof.name}
                      </h4>
                    </div>
                    <p className="text-xs font-semibold text-amber-700">{prof.role}</p>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-stone-800">{prof.rating.toFixed(1)}</span>
                      <span>(Avaliações de clientes)</span>
                    </div>
                    {prof.phone && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{prof.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialties Badges */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Especialidades & Técnicas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.specialties?.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium">
                  {isPrimaryOwner ? 'Profissional Principal' : 'Membro da Equipe'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(prof)}
                    className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Editar informações e foto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  {!isPrimaryOwner && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja remover ${prof.name} da equipe?`)) {
                          deleteProfessional(prof.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold transition-colors"
                      title="Excluir profissional"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Professional Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-fade-in-scale">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {editingProf ? 'Atualizar Dados' : 'Novo Cadastro'}
                </span>
                <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                  {editingProf ? `Editar ${editingProf.name}` : 'Cadastrar Nova Profissional'}
                </h3>
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cargo / Função no Salão
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Colorista & Especialista em Loiros"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Telefone / WhatsApp (opcional)
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Especialidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mechas, Cortes, Escova, Penteados"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  URL da Foto de Perfil
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Insira o link direto de uma foto de alta resolução para exibir no perfil de agendamento.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow"
                >
                  {editingProf ? 'Salvar Alterações' : 'Cadastrar Profissional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
