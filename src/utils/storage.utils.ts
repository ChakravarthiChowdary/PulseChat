export const StorageUtils = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },
};
