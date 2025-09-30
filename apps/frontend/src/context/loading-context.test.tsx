import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react";
import { LoadingProvider, useLoading } from "./loading-context";

describe("LoadingContext", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("isLoading é inicializado como false", async () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: ({ children }) => <LoadingProvider>{children}</LoadingProvider>,
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("atualiza isLoading ao chamar setLoading", async () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: ({ children }) => <LoadingProvider>{children}</LoadingProvider>,
    });

    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("lança erro ao usar useLoading fora do LoadingProvider", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useLoading())).toThrow(
      "useLoading deve ser usado dentro de LoadingProvider",
    );

    consoleErrorSpy.mockRestore();
  });

  it("retorna contexto corretamente ao usar useLoading dentro do LoadingProvider", async () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: ({ children }) => <LoadingProvider>{children}</LoadingProvider>,
    });
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("setLoading");
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.setLoading).toBe("function");
  });
});
