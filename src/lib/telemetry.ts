// Safe, optional client – never throws
type Event = { name: string; props?: Record<string, unknown> };

export async function sendEvent(evt: Event) {
  try {
    await fetch('/.netlify/functions/event-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evt),
    });
  } catch {
    // swallow – telemetry must never break UX
  }
}

