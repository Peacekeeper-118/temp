
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from './Button';
import { NeoFilter } from './NeoIcons';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSizes: any[];
  availableBrands: any[];
  availableCategories: string[];
  availableColors: string[];
  currentFilters: {
    sort: string;
    size: string[];
    brand: string[];
    category: string[];
    color: string[];
  };
  onApply: (filters: { 
    sort: string; 
    size: string[]; 
    brand: string[];
    category: string[];
    color: string[];
  }) => void;
}

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
  count?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked, onChange, count }) => (
  <div 
    onClick={onChange}
    className="flex items-center gap-3 py-3 cursor-pointer group"
  >
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-pop-cyan border-pop-cyan' : 'border-earth-300 bg-white group-hover:border-earth-400'}`}>
      {isChecked && <Check className="w-3.5 h-3.5 text-earth-900" strokeWidth={4} />}
    </div>
    <span className={`text-sm font-bold flex-1 ${isChecked ? 'text-earth-900' : 'text-earth-600'}`}>{label}</span>
    {count !== undefined && <span className="text-xs text-earth-400 font-bold bg-earth-50 px-2 py-0.5 rounded-lg">{count}</span>}
  </div>
);

interface RadioProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

const Radio: React.FC<RadioProps> = ({ label, isChecked, onChange }) => (
  <div 
    onClick={onChange}
    className="flex items-center gap-3 py-3 cursor-pointer group"
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'border-earth-900' : 'border-earth-300 group-hover:border-earth-400'}`}>
      {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-earth-900" />}
    </div>
    <span className={`text-sm font-bold ${isChecked ? 'text-earth-900' : 'text-earth-600'}`}>{label}</span>
  </div>
);

export const FilterModal = ({
  isOpen,
  onClose,
  availableSizes,
  availableBrands,
  availableCategories,
  availableColors,
  currentFilters,
  onApply
}: FilterModalProps) => {
  const [activeSection, setActiveSection] = useState<'Sort By' | 'Category' | 'Brand' | 'Size' | 'Color'>('Sort By');
  
  const [localSort, setLocalSort] = useState(currentFilters.sort);
  const [localSize, setLocalSize] = useState<string[]>(currentFilters.size);
  const [localBrand, setLocalBrand] = useState<string[]>(currentFilters.brand);
  const [localCategory, setLocalCategory] = useState<string[]>(currentFilters.category);
  const [localColor, setLocalColor] = useState<string[]>(currentFilters.color);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setLocalSort(currentFilters.sort);
      setLocalSize(currentFilters.size);
      setLocalBrand(currentFilters.brand);
      setLocalCategory(currentFilters.category);
      setLocalColor(currentFilters.color);
      setActiveSection('Sort By'); // Reset to first tab
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      sort: localSort,
      size: localSize,
      brand: localBrand,
      category: localCategory,
      color: localColor
    });
    onClose();
  };

  const clearFilters = () => {
    setLocalSort('newest');
    setLocalSize([]);
    setLocalBrand([]);
    setLocalCategory([]);
    setLocalColor([]);
  };

  const toggleSelection = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const sections = ['Sort By', 'Category', 'Brand', 'Size', 'Color'];

  // Safe string converter
  const toSafeString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value?.name) return value.name;
    if (value?.label) return value.label;
    if (value?.size) return value.size;
    return String(value);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-earth-900/60 backdrop-blur-sm animate-fade-in-up p-4">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 bg-white z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-xl text-earth-900">Filters</h2>
            <NeoFilter className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="p-2 bg-earth-50 rounded-full hover:bg-earth-100 transition-colors">
            <X className="w-5 h-5 text-earth-500" />
          </button>
        </div>

        {/* Main Split Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Sections */}
          <div className="w-[35%] bg-earth-50 border-r border-earth-100 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                className={`w-full text-left px-5 py-4 text-sm font-bold border-l-4 transition-all ${
                  activeSection === section
                    ? 'bg-white border-earth-900 text-earth-900 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]'
                    : 'border-transparent text-earth-500 hover:bg-earth-100 hover:text-earth-700'
                }`}
              >
                {section}
                {/* Show indicator dot if filters active in this section */}
                {section === 'Category' && localCategory.length > 0 && <span className="inline-block w-1.5 h-1.5 bg-pop-cyan rounded-full ml-2 align-middle"></span>}
                {section === 'Brand' && localBrand.length > 0 && <span className="inline-block w-1.5 h-1.5 bg-pop-cyan rounded-full ml-2 align-middle"></span>}
                {section === 'Size' && localSize.length > 0 && <span className="inline-block w-1.5 h-1.5 bg-pop-cyan rounded-full ml-2 align-middle"></span>}
                {section === 'Color' && localColor.length > 0 && <span className="inline-block w-1.5 h-1.5 bg-pop-cyan rounded-full ml-2 align-middle"></span>}
              </button>
            ))}
          </div>

          {/* Right Column: Options */}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            {activeSection === 'Sort By' && (
              <div className="space-y-1">
                <Radio label="Newest First" isChecked={localSort === 'newest'} onChange={() => setLocalSort('newest')} />
                <Radio label="Price: Low to High" isChecked={localSort === 'price_asc'} onChange={() => setLocalSort('price_asc')} />
                <Radio label="Price: High to Low" isChecked={localSort === 'price_desc'} onChange={() => setLocalSort('price_desc')} />
              </div>
            )}

            {activeSection === 'Category' && (
              <div className="space-y-1">
                {availableCategories.map((cat, idx) => (
                  <Checkbox 
                    key={idx} 
                    label={cat} 
                    isChecked={localCategory.includes(cat)} 
                    onChange={() => toggleSelection(localCategory, cat, setLocalCategory)} 
                  />
                ))}
              </div>
            )}

            {activeSection === 'Brand' && (
              <div className="space-y-1">
                {availableBrands.map((brand, idx) => {
                  const safeBrand = toSafeString(brand);
                  return (
                    <Checkbox 
                      key={idx} 
                      label={safeBrand} 
                      isChecked={localBrand.includes(safeBrand)} 
                      onChange={() => toggleSelection(localBrand, safeBrand, setLocalBrand)} 
                    />
                  );
                })}
              </div>
            )}

            {activeSection === 'Size' && (
              <div className="grid grid-cols-2 gap-3">
                {availableSizes.map((size, idx) => {
                  const safeSize = toSafeString(size);
                  const isSelected = localSize.includes(safeSize);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSelection(localSize, safeSize, setLocalSize)}
                      className={`px-3 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        isSelected 
                          ? 'bg-earth-900 text-white border-earth-900 shadow-md' 
                          : 'bg-white text-earth-600 border-earth-200 hover:border-earth-300'
                      }`}
                    >
                      {safeSize}
                    </button>
                  );
                })}
              </div>
            )}

            {activeSection === 'Color' && (
              <div className="grid grid-cols-4 gap-4">
                {availableColors.map((color, idx) => {
                  const isSelected = localColor.includes(color);
                  const bgStyle = color.toLowerCase();
                  const isWhite = bgStyle === 'white' || bgStyle === '#ffffff';
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSelection(localColor, color, setLocalColor)}
                      className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all relative group ${
                        isSelected ? 'border-earth-900 scale-110 shadow-lg' : 'border-earth-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: bgStyle }}
                      title={color}
                    >
                      {isSelected && (
                        <Check className={`w-5 h-5 ${isWhite ? 'text-earth-900' : 'text-white'}`} strokeWidth={3} />
                      )}
                      {/* Tooltip for color name */}
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-earth-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-earth-100 bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-earth-400 uppercase tracking-wide">
                {localCategory.length + localBrand.length + localSize.length + localColor.length} filters applied
             </span>
             <button 
                onClick={clearFilters}
                className="text-sm font-bold text-earth-500 hover:text-pop-rose transition-colors text-left"
             >
                Clear All
             </button>
          </div>
          <Button onClick={handleApply} className="shadow-xl px-10">
            Apply
          </Button>
        </div>

      </div>
    </div>
  );
};
