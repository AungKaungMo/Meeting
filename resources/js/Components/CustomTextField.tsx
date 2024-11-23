import React from "react";
import TextField from "@mui/material/TextField";

interface CustomTextFieldProps {
    label: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    type?: string
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    value,
    onChange,
    error = false,
    helperText = "",
    fullWidth = true,
    type = 'text'
}) => {
    return (
        <TextField
            fullWidth={fullWidth}
            label={label}
            value={value || ''}
            onChange={onChange}
            type={type}
            sx={{
                "& .MuiFormLabel-root": {
                    fontSize: "0.9rem",
                },
            }}
            error={error}
            helperText={helperText}
        />
    );
};

export default CustomTextField;
