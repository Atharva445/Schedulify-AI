import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import TimetableCard from '../components/timetable/TimetableCard';
import TimetableFilters from '../components/timetable/TimetableFilters';

const MyTimetables = () => {
  const [filters, setFilters] = useState({ search: '', filter: 'all' });
  
  const savedTimetables = [
    {
      id: 1,
      name: 'Final Exam Preparation',
      createdAt: 'Oct 10, 2025',
      subjects: 8,
      hours: 42,
      efficiency: 95,
      isActive: true,
      tags: ['Exams', 'High Priority'],
      startTime: '09:00 AM',
      endTime: '06:00 PM',
    },
    {
      id: 2,
      name: 'Weekly Study Schedule',
      createdAt: 'Oct 5, 2025',
      subjects: 6,
      hours: 30,
      efficiency: 88,
      isActive: false,
      tags: ['Regular', 'Balanced'],
      startTime: '10:00 AM',
      endTime: '05:00 PM',
    },
    {
      id: 3,
      name: 'Project Work Plan',
      createdAt: 'Sep 28, 2025',
      subjects: 4,
      hours: 25,
      efficiency: 92,
      isActive: false,
      tags: ['Project', 'Deadline'],
      startTime: '11:00 AM',
      endTime: '04:00 PM',
    },
  ];
  
  const handleView = (id) => {
    console.log('View timetable:', id);
    // Navigate to results page with this timetable
  };
  
  const handleDelete = (id) => {
    console.log('Delete timetable:', id);
    // Delete timetable logic
  };
  
  const handleExport = (id) => {
    console.log('Export timetable:', id);
    // Export logic
  };
  
  const handleShare = (id) => {
    console.log('Share timetable:', id);
    // Share logic
  };
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
    // Apply filter logic here
  };
  
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">My Timetables</h1>
            <p className="text-slate-400">View and manage your saved schedules</p>
          </div>
          
          <Button variant="primary">
            <Calendar className="w-5 h-5" />
            Create New
          </Button>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <TimetableFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Timetable Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTimetables.map((timetable) => (
            <TimetableCard
              key={timetable.id}
              timetable={timetable}
              onView={handleView}
              onDelete={handleDelete}
              onExport={handleExport}
              onShare={handleShare}
            />
          ))}
        </div>
        
        {/* Empty State - Uncomment if no timetables */}
        {/* {savedTimetables.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center">
              <Calendar className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-300 mb-3">
              No Timetables Yet
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first AI-powered timetable to get started with smarter scheduling
            </p>
            <Button variant="primary">
              <Calendar className="w-5 h-5" />
              Create Timetable
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MyTimetables;