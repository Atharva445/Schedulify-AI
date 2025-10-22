import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', title, message, onClose }) => {
  const styles = {
    success: {
      bg: 'border-emerald-500/50 shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      icon: CheckCircle,
    },
    error: {
      bg: 'border-red-500/50 shadow-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      icon: AlertCircle,
    },
  };
  
  const config = styles[type];
  const Icon = config.icon;
  
  return (
    <div className={`fixed bottom-6 right-6 bg-slate-900/90 backdrop-blur-xl border ${config.bg} rounded-2xl p-4 shadow-2xl animate-fade-in`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-400">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;