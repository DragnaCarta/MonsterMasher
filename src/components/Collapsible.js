import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="card">
      <div 
        className="collapsible-header"
        onClick={toggleOpen}
      >
        <h2 className="text-2xl font-bold">{title}</h2>
        <ChevronDown className={`rotate-icon ${isOpen ? 'open' : ''}`} />
      </div>
      <div 
        ref={contentRef}
        className={`collapsible-content ${isOpen ? 'open' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapsible;