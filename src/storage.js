// Minimal async storage helper used by the App.
// Provides window.storage.get(key) and window.storage.set(key, value)
(function () {
  const storage = {
    get: async (key) => {
      try {
        const v = localStorage.getItem(key);
        return { value: v };
      } catch (e) {
        return { value: null };
      }
    },
    set: async (key, value) => {
      try {
        localStorage.setItem(key, value);
        return { ok: true };
      } catch (e) {
        return { ok: false };
      }
    },
    remove: async (key) => {
      try {
        localStorage.removeItem(key);
        return { ok: true };
      } catch (e) {
        return { ok: false };
      }
    },
  };

  if (typeof window !== "undefined") window.storage = storage;
  export default storage;
})();
