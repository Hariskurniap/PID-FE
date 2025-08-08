import React from 'react';
import Icon from '../../../components/AppIcon';

const FloatingActionButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 bg-primary text-primary-foreground
        rounded-full shadow-elevated
        flex items-center justify-center
        transition-smooth hover:scale-110 hover:shadow-modal
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
    >
      <Icon name="Plus" size={24} />
      <span className="sr-only">Upload Invoice Baru</span>
    </button>
  );
};

export default FloatingActionButton;