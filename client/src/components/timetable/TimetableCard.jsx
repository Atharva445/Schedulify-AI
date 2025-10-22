import { Calendar, Clock, TrendingUp, Trash2, Download, Share2, Eye } from 'lucide-react';

const TimetableCard = ({ timetable, onView, onDelete, onExport, onShare }) => {
  return (
    <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors">
            {timetable.name}
          </h3>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {timetable.createdAt}
          </p>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(timetable.id);
          }}
          className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* Preview Badge */}
      {timetable.isActive && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          Active Schedule
        </div>
      )}
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b border-slate-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-100">{timetable.subjects}</p>
          <p className="text-xs text-slate-400 mt-1">Subjects</p>
        </div>
        <div className="text-center border-l border-r border-slate-800">
          <p className="text-2xl font-bold text-slate-100">{timetable.hours}</p>
          <p className="text-xs text-slate-400 mt-1">Hours</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-2xl font-bold text-emerald-400">{timetable.efficiency}%</p>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Efficiency</p>
        </div>
      </div>
      
      {/* Tags/Labels */}
      {timetable.tags && timetable.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {timetable.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Time Range */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <Clock className="w-4 h-4" />
        <span>{timetable.startTime} - {timetable.endTime}</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onView?.(timetable.id);
          }}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onExport?.(timetable.id);
          }}
          className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShare?.(timetable.id);
          }}
          className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TimetableCard;