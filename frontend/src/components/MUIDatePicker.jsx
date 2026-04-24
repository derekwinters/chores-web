import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./MUIDatePicker.css";

export default function MUIDatePicker({ initialDate, onSelect, onCancel }) {
  const [value, setValue] = React.useState(initialDate ? dayjs(initialDate) : null);

  const handleChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const dateStr = newValue.format("YYYY-MM-DD");
      onSelect(dateStr);
    }
  };

  const getComputedStyle = (varName) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="mui-date-picker-wrapper">
        <DatePicker
          value={value}
          onChange={handleChange}
          format="YYYY-MM-DD"
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-root": {
                  backgroundColor: `var(--surface)`,
                  color: `var(--text)`,
                  "& fieldset": {
                    borderColor: `var(--border)`,
                  },
                  "&:hover fieldset": {
                    borderColor: `var(--text-muted)`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: `var(--accent)`,
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: `var(--text)`,
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: `var(--surface)`,
                  color: `var(--text)`,
                  border: `1px solid var(--border)`,
                },
              },
            },
          }}
          componentsProps={{
            day: {
              sx: {
                color: `var(--text)`,
                border: `1px solid var(--border)`,
                backgroundColor: `var(--surface2)`,
                "&:hover": {
                  backgroundColor: `var(--accent)`,
                  color: `var(--surface)`,
                  borderColor: `var(--accent)`,
                },
                "&.Mui-selected": {
                  backgroundColor: `var(--accent)`,
                  color: `var(--surface)`,
                  borderColor: `var(--accent)`,
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
