import React from 'react';

const SpeedSection = ({ speed, setSpeed }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-bold">Speed</span>
      <input
        type="number"
        value={speed}
        onChange={(e) => setSpeed(Math.max(0, parseInt(e.target.value)))}
        className="input w-16 text-center"
        min="0"
      />
      <span>ft.</span>
    </div>
  );
};

export default SpeedSection;