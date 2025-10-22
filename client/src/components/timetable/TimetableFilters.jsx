import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const TimetableFilters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const filters = [
    { id: 'all', label: 'All Timetables' },
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived' },
    { id: 'recent', label: 'Recent' },
  ];
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilterChange?.({ search: value, filter: selectedFilter });
  };
  
  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    onFilterChange?.({ search: searchTerm, filter: filterId });
  };
  
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search timetables..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterSelect(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === filter.id
                ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Advanced Filters</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date Range
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>All time</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort By
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Most Recent</option>
                <option>Oldest First</option>
                <option>Highest Efficiency</option>
                <option>Most Hours</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Reset
            </button>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-all">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableFilters;