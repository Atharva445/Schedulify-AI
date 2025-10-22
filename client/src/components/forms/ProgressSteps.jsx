const ProgressSteps = ({ currentStep, steps, onStepClick }) => {
  const progressPercentage = (currentStep / steps.length) * 100;
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 z-0">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick?.(stepNumber)}
              disabled={stepNumber > currentStep}
              className="relative flex flex-col items-center z-10 group disabled:cursor-not-allowed"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 border-2 border-slate-700 text-slate-400'
              } ${isCurrent ? 'scale-110' : ''}`}>
                {stepNumber}
              </div>
              <span className={`text-sm mt-2 transition-colors ${
                isActive ? 'text-slate-300' : 'text-slate-500'
              } ${isCurrent ? 'font-semibold' : ''}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;