import React from 'react';
import { useSalon } from '../context/SalonContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationToast: React.FC = () => {
  const { notificationToast, setNotificationToast } = useSalon();

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 max-w-md pointer-events-none">
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            id="toast-message"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border ${
              notificationToast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-800'
                : notificationToast.type === 'warning'
                ? 'bg-amber-950/95 text-amber-100 border-amber-800'
                : 'bg-stone-900/95 text-stone-100 border-stone-800'
            }`}
          >
            {notificationToast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {notificationToast.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            {notificationToast.type === 'info' && (
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-sm font-medium leading-relaxed">
              {notificationToast.message}
            </div>

            <button
              id="toast-close-btn"
              onClick={() => setNotificationToast(null)}
              className="text-stone-400 hover:text-white p-1 transition-colors"
              title="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
