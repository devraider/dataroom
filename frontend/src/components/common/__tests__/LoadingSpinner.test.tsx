import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner with animation", () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
  });

  it("displays custom text when provided", () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("does not display text when not provided", () => {
    const { container } = render(<LoadingSpinner />);
    const text = container.querySelector("p");
    expect(text).not.toBeInTheDocument();
  });
});
