// components/ui/select.jsx

import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const FilterSelect = ({ label, options, value, onChange }) => {
  return (
    <div className="w-64">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="p-2 border rounded-md w-full text-gray-700">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;