const Card = ({ children, className = '', hover = false }) => {
  const hoverStyles = hover ? 'hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300' : '';
  
  return (
    <div className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;