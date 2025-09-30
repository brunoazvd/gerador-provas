import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";
import { LoadingProvider } from "./loading-context";

const sampleUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  nome: "John Doe",
};

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LoadingProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoadingProvider>
  );

  beforeEach(() => {
    vi.resetModules();
  });

  it("valores são inicializados corretamente", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.authLoading).toBe(true);
  });

  it("atualização de valores funciona", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper });
    act(() => {
      result.current.setUser(sampleUser);
      result.current.setAccessToken("new-token");
    });
    expect(result.current.user).toEqual(sampleUser);
    expect(result.current.accessToken).toBe("new-token");
  });

  it("clearAuth reseta os valores", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper });
    act(() => {
      result.current.setUser(sampleUser);
      result.current.setAccessToken("new-token");
    });
    expect(result.current.user).toEqual(sampleUser);
    expect(result.current.accessToken).toBe("new-token");

    act(() => {
      result.current.clearAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
  });

  it("lança erro ao usar useAuth fora de LoadingProvider", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      renderHook(() => useAuth(), { wrapper: AuthProvider }),
    ).toThrow("useLoading deve ser usado dentro de LoadingProvider");

    consoleErrorSpy.mockRestore();
  });

  it("lança erro ao usar useAuth fora do AuthProvider", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      renderHook(() => useAuth(), { wrapper: LoadingProvider }),
    ).toThrow("useAuth deve ser usado dentro de AuthProvider");

    consoleErrorSpy.mockRestore();
  });

  it("authLoading muda para false após efeito rodar", async () => {
    vi.doMock("@api/auth", () => ({
      refreshAccessToken: vi.fn().mockResolvedValue({
        user: { ...sampleUser },
        accessToken: "brand-new-token",
      }),
    }));

    vi.useFakeTimers();

    const { AuthProvider, useAuth } = await import("./auth-context");
    const { LoadingProvider } = await import("./loading-context");

    const newWrapper = ({ children }: { children: React.ReactNode }) => (
      <LoadingProvider>
        <AuthProvider>{children}</AuthProvider>
      </LoadingProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: newWrapper });

    expect(result.current.authLoading).toBe(true);
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.authLoading).toBe(false);
    vi.useRealTimers();
  });

  it("setAccessTokenGetter e setAccessTokenSetter são chamados corretamente", async () => {
    const setAccessTokenGetterMock = vi.fn();
    const setAccessTokenSetterMock = vi.fn();

    vi.doMock("@lib/api-client", () => ({
      setAccessTokenGetter: (fn: () => string | null) =>
        setAccessTokenGetterMock(fn),
      setAccessTokenSetter: (fn: (token: string) => void) =>
        setAccessTokenSetterMock(fn),
    }));

    const { AuthProvider, useAuth } = await import("./auth-context");
    const { LoadingProvider } = await import("./loading-context");

    const newWrapper = ({ children }: { children: React.ReactNode }) => (
      <LoadingProvider>
        <AuthProvider>{children}</AuthProvider>
      </LoadingProvider>
    );

    await act(async () => renderHook(() => useAuth(), { wrapper: newWrapper }));

    expect(setAccessTokenGetterMock).toHaveBeenCalled();
    expect(setAccessTokenSetterMock).toHaveBeenCalled();
  });
});
