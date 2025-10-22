import { X } from 'lucide-react';

const SubjectChip = ({ subject, onRemove, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20',
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20',
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-2 px-4 py-2 ${colorClasses[color]} border rounded-lg text-sm font-medium transition-all group`}
    >
      {subject}
      {onRemove && (
        <button 
          onClick={onRemove}
          className="hover:opacity-100 opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </span>
  );
};

export default SubjectChip;