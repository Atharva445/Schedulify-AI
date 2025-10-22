const TimeSlot = ({ slot }) => {
  if (!slot) {
    return <div className="p-2 border-l border-slate-800"></div>;
  }
  
  const colorClasses = {
    indigo: {
      bg: 'from-indigo-500/20 to-purple-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-300',
      hoverBorder: 'hover:border-indigo-400',
      hoverShadow: 'hover:shadow-indigo-500/20',
      dot: 'bg-indigo-400',
    },
    teal: {
      bg: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-500/30',
      text: 'text-teal-300',
      hoverBorder: 'hover:border-teal-400',
      hoverShadow: 'hover:shadow-teal-500/20',
      dot: 'bg-teal-400',
    },
    purple: {
      bg: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
      hoverBorder: 'hover:border-purple-400',
      hoverShadow: 'hover:shadow-purple-500/20',
      dot: 'bg-purple-400',
    },
    emerald: {
      bg: 'from-emerald-500/20 to-green-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      hoverBorder: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    amber: {
      bg: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      hoverBorder: 'hover:border-amber-400',
      hoverShadow: 'hover:shadow-amber-500/20',
      dot: 'bg-amber-400',
    },
    blue: {
      bg: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      hoverBorder: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-blue-500/20',
      dot: 'bg-blue-400',
    },
    rose: {
      bg: 'from-rose-500/20 to-pink-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-300',
      hoverBorder: 'hover:border-rose-400',
      hoverShadow: 'hover:shadow-rose-500/20',
      dot: 'bg-rose-400',
    },
  };
  
  const colors = colorClasses[slot.color] || colorClasses.indigo;
  
  return (
    <div className="p-2 border-l border-slate-800">
      <div 
        className={`group h-full bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-3 ${colors.hoverBorder} hover:shadow-lg ${colors.hoverShadow} transition-all cursor-pointer`}
      >
        <div className="flex items-start justify-between mb-1">
          <h4 className={`text-sm font-semibold ${colors.text}`}>
            {slot.subject}
          </h4>
          <span className={`text-xs ${colors.text} opacity-60`}>
            {slot.duration}
          </span>
        </div>
        
        {slot.topic && (
          <p className={`text-xs ${colors.text} opacity-70 mb-2`}>
            {slot.topic}
          </p>
        )}
        
        <div className="mt-2 flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></div>
          <span className={`text-xs ${colors.text} opacity-60`}>
            {slot.priority} Priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlot;