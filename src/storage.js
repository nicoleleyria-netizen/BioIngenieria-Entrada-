// Minimal async storage helper used by the App.
// Provides window.storage.get(key) and window.storage.set(key, value)
const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return { value };
    } catch (error) {
      return { value: null };
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
  remove: async (key) => {
    try {
      localStorage.removeItem(key);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
};

if (typeof window !== "undefined") window.storage = storage;

export const appStorage = storage;
export default storage;
