import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchFilterCard = ({ onSearch, onReset, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderby, setOrderby] = useState('');

  const handleSearchSubmit = () => {
    onSearch({ searchTerm, orderby });
  };

  const handleReset = () => {
    setSearchTerm('');
    setOrderby('');
    onReset();
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari BAST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon="Search"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            placeholder="Urutkan"
            value={orderby}
            onChange={(e) => setOrderby(e.target.value)}
            options={[
              { value: '', label: 'Default' },
              { value: 'createdAt DESC', label: 'Terbaru' },
              { value: 'createdAt ASC', label: 'Terlama' },
              { value: 'idBast ASC', label: 'ID BAST A-Z' },
              { value: 'idBast DESC', label: 'ID BAST Z-A' },
            ]}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSearchSubmit}
            loading={isSearching}
          >
            Cari
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchFilterCard;