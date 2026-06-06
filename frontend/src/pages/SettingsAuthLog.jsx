import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthLog } from "../api/client";
import "./Settings.css";
import "./AdminPanel.css";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "login_succeeded", label: "Login succeeded" },
  { value: "login_failed", label: "Login failed" },
  { value: "password_changed", label: "Password changed" },
  { value: "password_reset", label: "Password reset" },
  { value: "user_created", label: "User created" },
];

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

function actionLabel(action) {
  const match = ACTION_OPTIONS.find((o) => o.value === action);
  return match ? match.label : action;
}

export default function SettingsAuthLog() {
  const [username, setUsername] = useState("");
  const [action, setAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState({});

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ["auth-log", filters],
    queryFn: () => getAuthLog(filters),
  });

  const handleFilter = (e) => {
    e.preventDefault();
    setFilters({
      ...(username ? { username } : {}),
      ...(action ? { action } : {}),
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
    });
  };

  const handleClear = () => {
    setUsername("");
    setAction("");
    setStartDate("");
    setEndDate("");
    setFilters({});
  };

  return (
    <div className="settings-page">
      <section className="settings-section">
        <div className="section-row">
          <h3>Auth Event Log</h3>
        </div>
        <hr />
        <form onSubmit={handleFilter} style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
          <div className="setting-group" style={{ flex: "1 1 160px" }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Filter by username"
            />
          </div>
          <div className="setting-group" style={{ flex: "1 1 180px" }}>
            <label>Action</label>
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              {ACTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="setting-group" style={{ flex: "1 1 140px" }}>
            <label>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="setting-group" style={{ flex: "1 1 140px" }}>
            <label>End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn-primary">Filter</button>
            <button type="button" className="btn-secondary" onClick={handleClear}>Clear</button>
          </div>
        </form>

        {isLoading && <div className="loading">Loading auth log...</div>}
        {error && <div className="error-message">{error.message}</div>}

        {!isLoading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted, var(--text))" }}>Timestamp</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted, var(--text))" }}>Username</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted, var(--text))" }}>Action</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted, var(--text))" }}>Changed By</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "1rem 0.75rem", color: "var(--text-muted, var(--text))", textAlign: "center" }}>
                      No auth events found.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", whiteSpace: "nowrap" }}>{formatTimestamp(entry.timestamp)}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{entry.username}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{actionLabel(entry.action)}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: entry.changed_by ? "inherit" : "var(--text-muted, var(--text))" }}>
                        {entry.changed_by ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
