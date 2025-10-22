import { useState } from 'react';
import { Plus } from 'lucide-react';
import SubjectChip from '../timetable/SubjectChip';

const SubjectInput = ({ subjects = [], onChange }) => {
  const [newSubject, setNewSubject] = useState('');
  
  const colors = ['indigo', 'teal', 'purple', 'emerald', 'amber', 'rose'];
  
  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      onChange([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };
  
  const removeSubject = (index) => {
    onChange(subjects.filter((_, i) => i !== index));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Subjects or Tasks
      </label>
      
      <div className="space-y-3">
        {/* Input Field */}
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Mathematics, Physics, English"
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button 
            onClick={addSubject}
            type="button"
            className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
        
        {/* Subject Chips */}
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject, index) => (
              <SubjectChip
                key={index}
                subject={subject}
                color={colors[index % colors.length]}
                onRemove={() => removeSubject(index)}
              />
            ))}
          </div>
        )}
        
        {/* Helper Text */}
        <p className="text-xs text-slate-500">
          Press Enter or click Add to include subjects
        </p>
      </div>
    </div>
  );
};

export default SubjectInput;