<div className="min-h-screen bg-slate-950 py-12">
  <div className="container mx-auto px-6 max-w-4xl">
    
    {/* Progress Steps */}
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" style={{width: '33%'}}></div>
        </div>
        
        {/* Step 1 */}
        <div className="relative flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/50">
            1
          </div>
          <span className="text-sm text-slate-400 mt-2">Basic Info</span>
        </div>
        
        {/* Step 2 */}
        <div className="relative flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-semibold">
            2
          </div>
          <span className="text-sm text-slate-500 mt-2">Preferences</span>
        </div>
        
        {/* Step 3 */}
        <div className="relative flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-semibold">
            3
          </div>
          <span className="text-sm text-slate-500 mt-2">Review</span>
        </div>
      </div>
    </div>
    
    {/* Form Card */}
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-12">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Tell us about your schedule
        </h2>
        <p className="text-slate-400">
          We'll use this information to create your perfect timetable
        </p>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-6">
        
        {/* Subjects/Tasks Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Subjects or Tasks
          </label>
          <div className="space-y-3">
            {/* Dynamic input with add button */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g., Mathematics, Physics, English"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all">
                + Add
              </button>
            </div>
            
            {/* Added subjects as chips */}
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm flex items-center gap-2">
                Mathematics
                <button className="hover:text-indigo-100">×</button>
              </span>
              <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm flex items-center gap-2">
                Physics
                <button className="hover:text-purple-100">×</button>
              </span>
            </div>
          </div>
        </div>
        
        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Hours per day */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Available Hours per Day
            </label>
            <input 
              type="number" 
              placeholder="8"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Working days */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Working Days per Week
            </label>
            <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none">
              <option>5 days</option>
              <option>6 days</option>
              <option>7 days</option>
            </select>
          </div>
        </div>
        
        {/* Break Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Break Duration (minutes)
          </label>
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all">
              15 min
            </button>
            <button className="flex-1 px-4 py-3 bg-indigo-500/20 border border-indigo-500 rounded-xl text-indigo-300 transition-all">
              30 min
            </button>
            <button className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all">
              45 min
            </button>
            <button className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all">
              60 min
            </button>
          </div>
        </div>
        
        {/* Difficulty/Priority Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Overall Difficulty Level
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Easy</span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              className="flex-1 accent-indigo-500"
            />
            <span className="text-sm text-slate-400">Hard</span>
          </div>
        </div>
        
        {/* Optional: Deadlines */}
        <div className="border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-300">
              Add Deadlines (Optional)
            </label>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              + Add Deadline
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Set specific deadlines for tasks to prioritize them in your schedule
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-10">
        <button className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all">
          Back
        </button>
        <button className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
          Continue
        </button>
      </div>
    </div>
  </div>
</div>