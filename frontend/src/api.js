const hostedBackendUrl = process.env.REACT_APP_API_URL;
const isGitHubPages = typeof window !== "undefined" && window.location.hostname.includes("github.io");
const sameOriginApi = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}/api` : null;

export const API_BASE_URL = hostedBackendUrl || (isGitHubPages ? null : sameOriginApi);
export const isBackendAvailable = Boolean(API_BASE_URL);
