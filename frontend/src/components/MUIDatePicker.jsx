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
                  color: `var(--text) !important`,
                  caretColor: `var(--text)`,
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: `var(--surface) !important`,
                  color: `var(--text) !important`,
                  border: `1px solid var(--border) !important`,
                },
                "& .MuiDayCalendar-root": {
                  color: `var(--text) !important`,
                },
                "& .MuiPickersCalendarHeader-root": {
                  color: `var(--text) !important`,
                  borderColor: `var(--border) !important`,
                },
                "& .MuiPickersWeekDayLabel-root": {
                  color: `var(--text-muted) !important`,
                },
                "& .MuiPickersDay-root": {
                  color: `var(--text) !important`,
                  borderColor: `var(--border) !important`,
                  backgroundColor: `var(--surface2) !important`,
                },
                "& .MuiPickersDay-root:hover": {
                  backgroundColor: `var(--accent) !important`,
                  color: `var(--surface) !important`,
                },
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: `var(--accent) !important`,
                  color: `var(--surface) !important`,
                },
                "& .MuiPickersMonth-root, & .MuiPickersYear-root": {
                  color: `var(--text) !important`,
                  backgroundColor: `var(--surface2) !important`,
                  borderColor: `var(--border) !important`,
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
