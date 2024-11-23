import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    SelectChangeEvent,
    FormHelperText,
    Checkbox,
    ListItemText,
} from "@mui/material";

interface OptionType {
    id: string | number;
    name: string;
}

interface CustomDropDownMultipleProps {
    label: string;
    value: (string | number)[] | undefined;
    onChange: (event: SelectChangeEvent<(string | number)[]>) => void;
    options: any[];
    placeholder?: string;
    width?: number;
    error?: boolean;
    helperText?: string;
    selectedId?: string;
}

const CustomDropDownMultiple: React.FC<CustomDropDownMultipleProps> = ({
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

    const getSelectedNames = (selectedIds: (string | number)[]) => {
        return selectedIds
            .map((id) => {
                const option = options.find((opt) => opt[selectedId as keyof OptionType] === id);
                return option ? option.name : '';
            })
            .join(", ");
    };

    return (
        <FormControl sx={{ m: 1, width: "100%" }} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={value || []}
                onChange={onChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) =>
                    getSelectedNames(selected as (string | number)[])
                }
            >
                {options && options.length > 0 ? (
                    options.map((option, index) => (
                        <MenuItem
                            disabled={option.disabled}
                            key={index}
                            value={option[selectedId as keyof OptionType]}
                        >
                                <Checkbox
                                    checked={
                                        Array.isArray(value) &&
                                        value.includes(option[selectedId as keyof OptionType])
                                    }
                                />
                            <ListItemText primary={option.name} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No data found.</MenuItem>
                )}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomDropDownMultiple;
