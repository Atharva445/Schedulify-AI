import Card from '../ui/Card';

const FormCard = ({ title, subtitle, children, onBack, onNext, isFirstStep, isLastStep }) => {
  return (
    <Card>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-slate-400">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Form Content */}
      <div className="space-y-6 mb-8">
        {children}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        {!isFirstStep && onBack && (
          <button 
            onClick={onBack}
            className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all"
          >
            Back
          </button>
        )}
        {onNext && (
          <button 
            onClick={onNext}
            className={`${isFirstStep ? 'w-full' : 'flex-1'} px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300`}
          >
            {isLastStep ? 'Generate Timetable' : 'Continue'}
          </button>
        )}
      </div>
    </Card>
  );
};

export default FormCard;