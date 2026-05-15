import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getThemes, getCurrentTheme, setTheme } from "../api/client";
import { applyTheme } from "../utils/theme";
import "./Preferences.css";

const PREVIEW_COLORS = ["primary", "secondary", "accent", "bg"];

export default function Preferences() {
  const queryClient = useQueryClient();

  const { data: themes = [], isLoading: themesLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });

  const { data: currentTheme, isLoading: currentLoading } = useQuery({
    queryKey: ["current-theme"],
    queryFn: getCurrentTheme,
  });

  const setThemeMutation = useMutation({
    mutationFn: (themeId) => setTheme(themeId),
    onSuccess: async (data) => {
      applyTheme(data.colors);
      await queryClient.refetchQueries({ queryKey: ["current-theme"] });
    },
  });

  if (themesLoading || currentLoading) {
    return <div className="loading">Loading preferences...</div>;
  }

  return (
    <div className="preferences-page">
      <div className="page-header">
        <h1>Preferences</h1>
      </div>

      <section className="preferences-section">
        <h2 className="preferences-section-heading">Theme</h2>
        <hr className="preferences-section-rule" />
        <p className="preferences-description">
          Choose your personal theme. This applies only to your account.
        </p>

        <div className="preferences-themes-list">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`preferences-theme-card ${currentTheme?.id === theme.id ? "preferences-theme-active" : ""}`}
              onClick={() => setThemeMutation.mutate(theme.id)}
              disabled={setThemeMutation.isPending}
              aria-pressed={currentTheme?.id === theme.id}
            >
              <div className="preferences-theme-name">{theme.name}</div>
              <div className="preferences-theme-preview">
                {PREVIEW_COLORS.map((colorKey) => (
                  <div
                    key={colorKey}
                    className="preferences-color-sample"
                    style={{ backgroundColor: theme.colors[colorKey] }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
