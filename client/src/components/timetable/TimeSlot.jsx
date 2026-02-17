const TimeSlot = ({ slot }) => {
  const bgColor = slot.isLab
    ? "bg-purple-600/20 border-purple-500"
    : "bg-blue-600/20 border-blue-500";

  return (
    <div className="border-l border-slate-800 p-2">
      <div
        className={`w-full h-full border rounded-xl p-3 text-sm text-white ${bgColor}`}
      >
        <div className="font-semibold">
          {slot.subject}
        </div>

        <div className="text-xs text-slate-300 mt-1">
          {slot.blockType}
        </div>
      </div>
    </div>
  );
};

export default TimeSlot;
