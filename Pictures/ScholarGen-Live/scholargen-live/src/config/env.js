// Runtime configuration for ScholarGen Live.
//
// The API base URL can be overridden per build via app.json -> expo.extra.apiBaseUrl
// (or the EXPO_PUBLIC_API_BASE_URL env var). It falls back to the live API so the
// app works out of the box.
import Constants from 'expo-constants';

const extra =
  Constants.expoConfig?.extra ||
  Constants.manifest?.extra ||
  Constants.manifest2?.extra ||
  {};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  extra.apiBaseUrl ||
  'https://liveapi.scholargens.com/api.v1';
