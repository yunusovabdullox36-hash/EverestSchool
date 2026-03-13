const STATE_KEY = "english_group_state_v1";
const SESSION_KEY = "english_group_session_v1";
const CHANNEL = "english_group_updates";

const defaultData = {
  teachers: [],
  students: [],
  tests: [],
};

let channel;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  channel = new BroadcastChannel(CHANNEL);
}

export async function loadInitialState() {
  const cached = localStorage.getItem(STATE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(STATE_KEY);
    }
  }

  try {
    const res = await fetch("/db.json");
    if (!res.ok) {
      throw new Error("db.json fetch failed");
    }
    const data = await res.json();
    const merged = { ...defaultData, ...data };
    localStorage.setItem(STATE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    localStorage.setItem(STATE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
}

export function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  if (channel) {
    channel.postMessage({ type: "state-updated", at: Date.now() });
  }
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function subscribeRealtime(cb) {
  const onStorage = (e) => {
    if (e.key === STATE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);

  let onMessage;
  if (channel) {
    onMessage = () => cb();
    channel.addEventListener("message", onMessage);
  }

  return () => {
    window.removeEventListener("storage", onStorage);
    if (channel && onMessage) {
      channel.removeEventListener("message", onMessage);
    }
  };
}

export function readLocalState() {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
