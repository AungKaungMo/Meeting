import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface CustomDatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (newValue : Dayjs | null) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    label,
    value,
    onChange,
    error = false,
    helperText = "",
    fullWidth = true,
}) => {
    return (
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth: fullWidth,
                    error: error,
                    helperText: helperText,
                    sx: {
                        "&. MuiFormLabel-root": {
                            fontSize: "0.9rem"
                        }
                    }
                }
            }}
        />
    );
};

export default CustomDatePicker;
