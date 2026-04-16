const hostedBackendUrl = process.env.REACT_APP_API_URL;

export const API_BASE_URL = hostedBackendUrl || (
  window.location.hostname.includes("github.io") ? null : "http://localhost:5000"
);

export const isBackendAvailable = Boolean(API_BASE_URL);
