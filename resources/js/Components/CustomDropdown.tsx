import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    SelectChangeEvent,
    FormHelperText,
} from "@mui/material";

interface CustomDropdownProps {
    label: string;
    value: string | number | undefined;
    onChange: (event: SelectChangeEvent<string | number>) => void;
    options: any[];
    placeholder?: string;
    width?: number;
    error?: boolean;
    helperText?: string;
    selectedId?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Select options",
    width = 300,
    error,
    helperText,
    selectedId = "id",
}) => {
    return (
        <FormControl sx={{ m: 1, width: "100%" }} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value !== undefined ? value : ""}
                onChange={onChange}
                input={<OutlinedInput label={label} />}
            >
                {options && options.length > 0 ? options.map((option, index) => (
                            <MenuItem
                                disabled={option.disabled}
                                key={index}
                                value={
                                    option[selectedId as keyof typeof option]
                                }
                            >
                                {option.name}
                            </MenuItem>
                        )
                ) : (
                    <MenuItem disabled>No data found.</MenuItem>
                )}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomDropdown;
