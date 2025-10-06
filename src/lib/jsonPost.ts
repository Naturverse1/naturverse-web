export type JsonPostError = Error & {
  status?: number;
  provider?: string;
  code?: string | number;
  errorKey?: string;
};

export async function jsonPost<T>(input: RequestInfo, body: unknown, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  const payload = body === undefined ? '{}' : JSON.stringify(body);

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      method: init?.method ?? 'POST',
      headers,
      body: payload,
    });
  } catch (error: any) {
    const message = error?.message || 'Network request failed';
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!contentType.includes('application/json')) {
    const snippet = text.trim().slice(0, 160);
    const err = new Error(
      snippet ? `Server returned non-JSON response: ${snippet}` : 'Server returned non-JSON response.',
    ) as JsonPostError;
    err.status = response.status;
    throw err;
  }

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!data || typeof data !== 'object') {
    const err = new Error('Invalid JSON response.') as JsonPostError;
    err.status = response.status;
    throw err;
  }

  const record = data as Record<string, unknown>;

  if (!response.ok) {
    const message = typeof record.error === 'string' ? record.error : 'Request failed.';
    const err = new Error(message) as JsonPostError;
    err.status = response.status;
    if (typeof record.provider === 'string') {
      err.provider = record.provider;
    }
    if (typeof record.code === 'string' || typeof record.code === 'number') {
      err.code = record.code;
    }
    if (typeof record.error === 'string') {
      err.errorKey = record.error;
    }
    throw err;
  }

  return record as T;
}
