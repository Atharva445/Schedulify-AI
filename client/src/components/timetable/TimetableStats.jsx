import { BookOpen, Clock, Coffee, TrendingUp } from 'lucide-react';

const TimetableStats = ({ stats }) => {
  const statItems = [
    {
      icon: BookOpen,
      value: stats.totalSubjects || 0,
      label: 'Total Subjects',
      color: 'indigo',
    },
    {
      icon: Clock,
      value: stats.studyHours || 0,
      label: 'Study Hours',
      color: 'teal',
    },
    {
      icon: Coffee,
      value: stats.breakTimes || 0,
      label: 'Break Times',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      value: `${stats.efficiency || 0}%`,
      label: 'Efficiency',
      color: 'emerald',
    },
  ];
  
  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    teal: 'bg-teal-500/10 text-teal-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colorClasses[item.color]} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{item.value}</p>
                <p className="text-sm text-slate-400">{item.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimetableStats;