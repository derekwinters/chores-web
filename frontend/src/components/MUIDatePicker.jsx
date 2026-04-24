import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./MUIDatePicker.css";

export default function MUIDatePicker({ initialDate, onSelect, onCancel }) {
  const [value, setValue] = React.useState(initialDate ? dayjs(initialDate) : dayjs());

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
          slotProps={{
            popper: {
              placement: "bottom-start",
            },
          }}
        />
        <div className="date-picker-actions">
          <button type="button" className="btn-secondary btn-sm" onClick={() => handleChange(dayjs())}>
            Today
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
