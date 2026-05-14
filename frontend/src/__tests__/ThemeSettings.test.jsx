import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeSettings from "../components/ThemeSettings";
import * as client from "../api/client";

vi.mock("../api/client");

const THEMES = [
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
  {
    id: "charcoal",
    name: "Charcoal",
    colors: {
      bg: "#1a1a1a",
      surface: "#2d2d2d",
      surface2: "#3a3a3a",
      accent: "#999999",
      primary: "#666666",
      secondary: "#555555",
      success: "#999999",
      warning: "#999999",
      error: "#999999",
    },
  },
  {
    id: "custom_0",
    name: "My Custom Theme",
    colors: {
      bg: "#1a1a2e",
      surface: "#16213e",
      surface2: "#2d2d4d",
      accent: "#e94560",
      primary: "#ff6b9d",
      secondary: "#c44b8a",
      success: "#00d4ff",
      warning: "#ffa502",
      error: "#e05c6a",
    },
  },
];

function wrap(ui) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("ThemeSettings", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    client.getThemes.mockResolvedValue(THEMES);
    client.getCurrentTheme.mockResolvedValue(THEMES[0]);
    client.deleteTheme.mockResolvedValue({ message: "Theme deleted" });
    client.renameTheme.mockResolvedValue({ id: "charcoal", name: "Charcoal Updated", colors: THEMES[2].colors });
    client.updateTheme.mockResolvedValue({ id: "custom_0", name: "My Custom Theme", colors: THEMES[3].colors });
  });

  it("renders theme list", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => {
      expect(screen.getByText("Dark")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
      expect(screen.getByText("Charcoal")).toBeInTheDocument();
    });
  });

  it("shows current theme as selected", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => {
      expect(screen.getByText("Dark").closest("button")).toHaveClass("theme-active");
    });
  });

  it("allows switching themes", async () => {
    client.setTheme.mockResolvedValue(THEMES[1]);
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Light"));

    fireEvent.click(screen.getByText("Light"));

    await waitFor(() => {
      expect(client.setTheme).toHaveBeenCalledWith("light");
    });
  });

  it("shows color editor for current theme", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Dark"));

    fireEvent.click(screen.getByRole("button", { name: /customize.*current/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^accent$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^primary$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^secondary$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^success$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^warning$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^error$/i)).toBeInTheDocument();
    });
  });

  it("shows color editor for custom theme when clicking edit", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("My Custom Theme"));

    // Click edit icon on custom theme
    const editButtons = screen.getAllByLabelText(/edit/i);
    const customThemeEditBtn = editButtons.find(btn => btn.getAttribute("aria-label") === "Edit My Custom Theme");
    fireEvent.click(customThemeEditBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/^accent$/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/My Custom Theme/i)).toBeInTheDocument();
    });
  });

  it("allows editing individual colors", async () => {
    client.saveTheme.mockResolvedValue({ id: "custom", name: "Dark Custom", colors: THEMES[0].colors });
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Dark"));

    fireEvent.click(screen.getByRole("button", { name: /customize.*current/i }));
    await waitFor(() => screen.getByLabelText(/^accent$/i));

    const colorInput = screen.getByLabelText(/^accent$/i);
    fireEvent.change(colorInput, { target: { value: "#FF0000" } });

    fireEvent.click(screen.getByRole("button", { name: /save.*theme/i }));

    await waitFor(() => {
      expect(client.saveTheme).toHaveBeenCalledWith(
        expect.objectContaining({ colors: expect.objectContaining({ accent: "#ff0000" }) })
      );
    });
  });

  it("allows saving custom theme", async () => {
    const user = userEvent.setup();
    client.saveTheme.mockResolvedValue({ id: "custom", name: "My Theme", colors: THEMES[0].colors });
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Dark"));

    fireEvent.click(screen.getByRole("button", { name: /customize.*current/i }));
    await waitFor(() => screen.getByLabelText(/^accent$/i));

    const nameInput = screen.getByPlaceholderText(/theme name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "My Theme");

    fireEvent.click(screen.getByRole("button", { name: /save.*theme/i }));

    await waitFor(() => {
      expect(client.saveTheme).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My Theme" })
      );
    });
  });

  it("shows 5 color swatches per theme card", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => {
      const colorSamples = screen.getAllByTestId((content, element) => {
        return element?.className.includes("color-sample");
      });
      // 4 themes * 5 colors = 20 swatches
      expect(colorSamples.length).toBeGreaterThanOrEqual(20);
    });
  });

  it("shows action icons for non-protected themes", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Charcoal"));

    // Charcoal is not protected, so it should have action icons
    const editButtons = screen.queryAllByLabelText(/edit/i);
    expect(editButtons.some(btn => btn.getAttribute("aria-label") === "Edit Charcoal")).toBe(true);

    const copyButtons = screen.queryAllByLabelText(/copy/i);
    expect(copyButtons.some(btn => btn.getAttribute("aria-label") === "Copy Charcoal")).toBe(true);

    const renameButtons = screen.queryAllByLabelText(/rename/i);
    expect(renameButtons.some(btn => btn.getAttribute("aria-label") === "Rename Charcoal")).toBe(true);

    const deleteButtons = screen.queryAllByLabelText(/delete/i);
    expect(deleteButtons.some(btn => btn.getAttribute("aria-label") === "Delete Charcoal")).toBe(true);
  });

  it("hides action icons for protected themes", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Dark"));

    const editButtons = screen.queryAllByLabelText(/edit/i);
    expect(editButtons.some(btn => btn.getAttribute("aria-label") === "Edit Dark")).toBe(false);

    const copyButtons = screen.queryAllByLabelText(/copy/i);
    expect(copyButtons.some(btn => btn.getAttribute("aria-label") === "Copy Dark")).toBe(false);
  });

  it("applies theme colors globally", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Dark"));

    fireEvent.click(screen.getByText("Light"));

    await waitFor(() => {
      const root = document.documentElement;
      expect(root.style.getPropertyValue("--bg")).toBeTruthy();
    });
  });

  it("shows action icons for custom themes", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("My Custom Theme"));

    const deleteButtons = screen.queryAllByLabelText(/delete/i);
    expect(deleteButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.some(btn => btn.getAttribute("aria-label") === "Delete My Custom Theme")).toBe(true);
  });

  it("shows delete confirmation modal", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("My Custom Theme"));

    const deleteBtn = screen.getByLabelText("Delete My Custom Theme");
    fireEvent.click(deleteBtn);

    await waitFor(() => expect(screen.getByText("Delete theme?")).toBeInTheDocument());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls deleteTheme on confirm", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("My Custom Theme"));

    const deleteBtn = screen.getByLabelText("Delete My Custom Theme");
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^Delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(client.deleteTheme).toHaveBeenCalledWith("custom_0");
    });
  });

  it("allows copying a theme", async () => {
    client.saveTheme.mockResolvedValue({ id: "custom_1", name: "Charcoal Copy", colors: THEMES[2].colors });
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Charcoal"));

    const copyButtons = screen.getAllByLabelText(/copy/i);
    const charcoalCopyBtn = copyButtons.find(btn => btn.getAttribute("aria-label") === "Copy Charcoal");
    fireEvent.click(charcoalCopyBtn);

    await waitFor(() => {
      expect(client.saveTheme).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Charcoal Copy", colors: THEMES[2].colors })
      );
    });
  });

  it("allows renaming a theme", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("Charcoal"));

    const renameButtons = screen.getAllByLabelText(/rename/i);
    const charcoalRenameBtn = renameButtons.find(btn => btn.getAttribute("aria-label") === "Rename Charcoal");
    fireEvent.click(charcoalRenameBtn);

    await waitFor(() => expect(screen.getByText("Rename theme")).toBeInTheDocument());

    const nameInput = screen.getByPlaceholderText(/new theme name/i);
    fireEvent.change(nameInput, { target: { value: "Dark Gray" } });

    const renameBtn = screen.getByRole("button", { name: /^Rename$/i });
    fireEvent.click(renameBtn);

    await waitFor(() => {
      expect(client.renameTheme).toHaveBeenCalledWith("charcoal", "Dark Gray");
    });
  });

  it("allows updating custom theme in-place", async () => {
    wrap(<ThemeSettings />);
    await waitFor(() => screen.getByText("My Custom Theme"));

    const editButtons = screen.getAllByLabelText(/edit/i);
    const customThemeEditBtn = editButtons.find(btn => btn.getAttribute("aria-label") === "Edit My Custom Theme");
    fireEvent.click(customThemeEditBtn);

    await waitFor(() => {
      const saveBtn = screen.getByRole("button", { name: /update.*theme/i });
      expect(saveBtn).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue(/My Custom Theme/i);
    fireEvent.change(nameInput, { target: { value: "My Updated Theme" } });

    const updateBtn = screen.getByRole("button", { name: /update.*theme/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(client.updateTheme).toHaveBeenCalledWith(
        "custom_0",
        expect.objectContaining({ name: "My Updated Theme" })
      );
    });
  });
});
