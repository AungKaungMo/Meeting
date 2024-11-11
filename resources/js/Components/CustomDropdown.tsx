import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    SelectChangeEvent,
} from "@mui/material";

interface CustomDropdownProps {
    label: string;
    value: string | number;
    onChange: (event: SelectChangeEvent<string | number>) => void;
    options: { id: number | string; name: string }[];
    placeholder?: string;
    width?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Select options",
    width = 300,
}) => {
    return (
        <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                input={<OutlinedInput label={label} />}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomDropdown;
