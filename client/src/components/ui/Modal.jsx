import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;