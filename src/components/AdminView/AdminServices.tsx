import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Service, ServiceCategory } from '../../types';
import { Scissors, Plus, Clock, DollarSign, Search, Edit2, Trash2, X, Image } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useSalon();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Service form state
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('Cabelo');
  const [description, setDescription] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [price, setPrice] = useState<number>(150);
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  );

  const resetForm = () => {
    setName('');
    setCategory('Cabelo');
    setDescription('');
    setDurationMinutes(60);
    setPrice(150);
    setImageUrl('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80');
    setEditingService(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setDurationMinutes(srv.durationMinutes);
    setPrice(srv.price);
    setImageUrl(srv.imageUrl);
    setShowModal(true);
  };

  const filteredServices = services.filter((s) => {
    return (
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        category,
        description: description.trim(),
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        imageUrl: imageUrl.trim(),
      });
    } else {
      addService({
        name: name.trim(),
        category,
        description: description.trim(),
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        imageUrl: imageUrl.trim(),
      });
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div id="admin-services-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Cardápio & Procedimentos
          </span>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-stone-900 mt-1">
            Gestão de Serviços
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cadastre, edite valores, altere fotos ou exclua serviços disponíveis para agendamento online.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Cadastrar Novo Serviço
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm max-w-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar serviço por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="relative h-44 bg-stone-100">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-stone-900/85 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {service.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-white/95 text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                {service.durationMinutes} min
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-stone-900 text-sm font-['Cinzel',serif]">{service.name}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Preço ao cliente:</span>
                  <span className="text-base font-extrabold text-stone-900 font-sans">
                    R$ {(service?.price ?? 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Editar procedimento"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja apagar o serviço "${service.name}"?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                    title="Apagar serviço"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-fade-in-scale">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {editingService ? 'Atualização de Serviço' : 'Novo Procedimento'}
                </span>
                <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                  {editingService ? `Editar ${editingService.name}` : 'Cadastrar Novo Serviço'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nome do Procedimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Terapia de Ozônio Capilar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Cabelo">Cabelo</option>
                    <option value="Coloração">Coloração</option>
                    <option value="Tratamento">Tratamento</option>
                    <option value="Penteado & Noivas">Penteado & Noivas</option>
                    <option value="Estética & Barba">Estética & Barba</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Valor (R$) *
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
                  <label className="block font-semibold text-stone-700 mb-1">
                    Foto (URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 truncate"
                  />
                </div>
              </div>

              {imageUrl && (
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-amber-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[11px] text-stone-500">
                    Prévia da imagem selecionada
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={2}
                  placeholder="Etapas do tratamento, benefícios, produtos utilizados..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                  {editingService ? 'Salvar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
