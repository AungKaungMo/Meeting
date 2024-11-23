import React from "react";
import { TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface CustomTimePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
    label,
    value,
    onChange,
    error = false,
    helperText = "",
    fullWidth = true,
}) => {
    return (
        <TimePicker
            label={label}
            value={value}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth: fullWidth,
                    error: error,
                    helperText: helperText,
                    sx: {
                        "&.MuiFormLabel-root": {
                            fontSize: "0.9rem",
                        },
                    },
                },
            }}
        />
    );
};

export default CustomTimePicker;
