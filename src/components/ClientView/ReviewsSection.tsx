import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Star, ShieldCheck, Sparkles, MessageSquare, Plus, User } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview, services, professionals } = useSalon();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(services[0]?.name || 'Corte Visagista');
  const [selectedProfessional, setSelectedProfessional] = useState<string>(professionals[0]?.name || 'Juliana Castro');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const fiveStarPercent = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.rating === 5).length / totalReviews) * 100)
    : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    addReview({
      clientName: clientName.trim(),
      rating,
      comment: comment.trim(),
      serviceName: selectedService,
      professionalName: selectedProfessional,
      verifiedBooking: true,
    });

    setClientName('');
    setComment('');
    setShowAddModal(false);
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
  };

  return (
    <div id="reviews-page" className="max-w-5xl mx-auto space-y-10 py-4 animate-fade-in">
      {/* Header and Rating Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Transparência & Qualidade
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-stone-900">
            Avaliações de Quem Já Viveu a Experiência
          </h2>
          <p className="text-xs text-stone-500 max-w-lg leading-relaxed">
            Todas as avaliações são registradas por clientes reais após os atendimentos e procedimentos no salão.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-6 bg-stone-50 p-6 rounded-2xl border border-stone-200 shrink-0">
          <div className="text-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 font-sans">
              {avgRating}
            </span>
            <div className="flex items-center gap-1 justify-center mt-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-stone-500 font-medium block mt-1">
              Baseado em {totalReviews} avaliações
            </span>
          </div>

          <div className="border-l border-stone-200 pl-6 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-700">{fiveStarPercent}%</span>
              <span className="text-stone-500">deram 5 estrelas</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Verificadas
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Deixar Avaliação
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            id={`review-card-${rev.id}`}
            className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                    {rev.clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{rev.clientName}</h4>
                    <span className="text-[11px] text-stone-400 block">{formatDate(rev.date)}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-normal italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="font-medium text-stone-700">
                {rev.serviceName} • com {rev.professionalName}
              </span>
              {rev.verifiedBooking && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Atendimento Verificado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Studio Bella Arte
              </span>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-stone-900">
                Deixe seu depoimento
              </h3>
              <p className="text-xs text-stone-500">
                Conte-nos sobre a sua transformação e o atendimento da equipe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Camila Rodrigues"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Serviço Realizado
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Profissional
                  </label>
                  <select
                    value={selectedProfessional}
                    onChange={(e) => setSelectedProfessional(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stars */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nota do Atendimento
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">{rating} de 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Seu Comentário *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Compartilhe os detalhes da sua experiência..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow"
                >
                  Publicar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
