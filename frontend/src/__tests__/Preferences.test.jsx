import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Preferences from "../pages/Preferences";
import * as client from "../api/client";

vi.mock("../api/client");
vi.mock("../utils/theme", () => ({
  applyTheme: vi.fn(),
  DEFAULT_THEME_COLORS: {},
}));

const MOCK_THEMES = [
  {
    id: "dark",
    name: "Dark",
    colors: {
      bg: "#080c14",
      surface: "#16202e",
      surface2: "#1e2d40",
      accent: "#73B1DD",
      primary: "#3574B3",
      secondary: "#4a5568",
      success: "#3db87a",
      warning: "#e8a930",
      error: "#e05c6a",
    },
  },
  {
    id: "light",
    name: "Light",
    colors: {
      bg: "#f5f5f5",
      surface: "#ffffff",
      surface2: "#eeeeee",
      accent: "#0066cc",
      primary: "#0066cc",
      secondary: "#6c757d",
      success: "#00aa00",
      warning: "#ff9900",
      error: "#cc0000",
    },
  },
];

function wrap() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Preferences />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Preferences", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    client.getThemes.mockResolvedValue(MOCK_THEMES);
    client.getCurrentTheme.mockResolvedValue(MOCK_THEMES[0]);
  });

  it("renders the Preferences page heading", async () => {
    wrap();
    await waitFor(() => {
      expect(screen.getByText("Preferences")).toBeInTheDocument();
    });
  });

  it("renders the Theme section heading", async () => {
    wrap();
    await waitFor(() => {
      expect(screen.getByText("Theme")).toBeInTheDocument();
    });
  });

  it("renders all available themes", async () => {
    wrap();
    await waitFor(() => {
      expect(screen.getByText("Dark")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
    });
  });

  it("marks the current theme as active", async () => {
    wrap();
    await waitFor(() => {
      const darkCard = screen.getByText("Dark").closest("button");
      expect(darkCard).toHaveClass("preferences-theme-active");
    });
  });

  it("calls setTheme when a theme card is clicked", async () => {
    client.setTheme.mockResolvedValue(MOCK_THEMES[1]);
    wrap();
    await waitFor(() => screen.getByText("Light"));

    fireEvent.click(screen.getByText("Light").closest("button"));

    await waitFor(() => {
      expect(client.setTheme).toHaveBeenCalledWith("light");
    });
  });

  it("renders color swatches for each theme card", async () => {
    wrap();
    await waitFor(() => {
      const darkCard = screen.getByText("Dark").closest("button");
      const swatches = darkCard.querySelectorAll(".preferences-color-sample");
      expect(swatches.length).toBe(4);
    });
  });

  it("renders a personal theme description", async () => {
    wrap();
    await waitFor(() => {
      expect(screen.getByText(/applies only to your account/i)).toBeInTheDocument();
    });
  });
});
