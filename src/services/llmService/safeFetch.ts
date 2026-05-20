/**
 * Shared fetch wrapper to normalize provider APIs that report application
 * errors in a 200 response body.
 */

interface DetectedError {
  message: string;
  code?: string | number;
}

type ErrorDetector = (body: Record<string, unknown>) => DetectedError | null;

const NON_ERROR_STATUS_VALUES = new Set(['200', '0', 'ok', 'success']);
const RESPONSE_LIFECYCLE_STATUSES = new Set([
  'completed',
  'in_progress',
  'queued',
  'incomplete',
]);
const FAILURE_STATUS_KEYWORDS = [
  'error',
  'fail',
  'invalid',
  'unauthorized',
  'forbidden',
  'expired',
  'denied',
  'rate_limit',
  'not_found',
];

function normalizeStatus(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  return String(value).trim().toLowerCase();
}

function isKnownSuccessBody(body: Record<string, unknown>): boolean {
  if ('choices' in body || 'candidates' in body) {
    return true;
  }

  if (body.object === 'response') {
    return true;
  }

  const status = normalizeStatus(body.status);
  if (!status || !RESPONSE_LIFECYCLE_STATUSES.has(status)) {
    return false;
  }

  return 'output' in body || 'usage' in body || 'model' in body || 'id' in body;
}

const errorDetectors: ErrorDetector[] = [
  (body) => {
    const rawStatus = body.status ?? body.code ?? body.errcode ?? body.error_code;
    const status = normalizeStatus(rawStatus);

    if (
      status == null ||
      NON_ERROR_STATUS_VALUES.has(status) ||
      RESPONSE_LIFECYCLE_STATUSES.has(status)
    ) {
      return null;
    }

    const msg = body.msg ?? body.message ?? body.errmsg ?? body.error_msg;
    const hasMessage = msg != null && String(msg).trim() !== '';
    const looksNumericCode = typeof rawStatus === 'number' || /^\d+$/.test(status);
    const looksFailureStatus = FAILURE_STATUS_KEYWORDS.some((keyword) => status.includes(keyword));

    if (!looksNumericCode && !looksFailureStatus && !hasMessage) {
      return null;
    }

    return {
      message: String(msg || `Non-standard API error (status: ${status})`),
      code: rawStatus as string | number,
    };
  },
  (body) => {
    if (typeof body.error === 'object' && body.error !== null) {
      const error = body.error as Record<string, unknown>;
      if (error.message) {
        return {
          message: String(error.message),
          code: (error.code ?? error.type ?? 'unknown') as string | number,
        };
      }
    }
    if (typeof body.error === 'string' && body.error) {
      return { message: body.error };
    }
    return null;
  },
];

export const safeFetch: typeof fetch = async (input, init) => {
  const response = await globalThis.fetch(input, init);
  if (!response.ok) {
    return response;
  }

  const cloned = response.clone();
  try {
    const text = await cloned.text();
    const body = JSON.parse(text);

    if (body && typeof body === 'object' && !Array.isArray(body)) {
      if (isKnownSuccessBody(body)) {
        return response;
      }

      for (const detect of errorDetectors) {
        const error = detect(body);
        if (error) {
          return new Response(JSON.stringify({ error }), {
            status: 400,
            statusText: 'Bad Request',
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
  } catch {
    // Let upstream callers handle non-JSON payloads.
  }

  return response;
};
