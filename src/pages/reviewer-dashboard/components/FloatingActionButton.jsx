import React from 'react';
import Button from '../../../components/ui/Button';

const FloatingActionButton = ({ onClick }) => {
  return (
    <Button
      variant="default"
      size="lg"
      iconName="Plus"
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg"
      onClick={onClick}
    />
  );
};

export default FloatingActionButton;