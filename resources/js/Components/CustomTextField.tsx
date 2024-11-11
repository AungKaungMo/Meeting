import React from "react";
import TextField from "@mui/material/TextField";

interface CustomTextFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    value,
    onChange,
    error = false,
    helperText = "",
    fullWidth = true,
}) => {
    return (
        <TextField
            fullWidth={fullWidth}
            label={label}
            value={value}
            onChange={onChange}
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
