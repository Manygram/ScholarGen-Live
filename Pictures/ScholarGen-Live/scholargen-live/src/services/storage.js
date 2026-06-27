// Thin JSON wrapper around AsyncStorage so the signed-in user survives app
// reloads. Lazy-required so the bundle never hard-crashes if the native module
// is unavailable (e.g. an older web preview).
let AsyncStorage = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  AsyncStorage = null;
}

export async function getItem(key) {
  if (!AsyncStorage) return null;
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  if (!AsyncStorage) return;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write failures
  }
}

export async function removeItem(key) {
  if (!AsyncStorage) return;
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
