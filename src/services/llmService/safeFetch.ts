/**
 * Custom fetch wrapper to handle non-standard API error responses.
 * Some AI providers return HTTP 200 with error info in the body instead of
 * proper HTTP status codes. This wrapper detects such responses and converts
 * them to proper HTTP errors, preventing unnecessary SDK retries and providing
 * clearer error messages.
 *
 * To add new error patterns, simply append a detector function to the
 * `errorDetectors` array below.
 */

interface DetectedError {
    message: string;
    code?: string | number;
}

type ErrorDetector = (body: Record<string, unknown>) => DetectedError | null;

/**
 * Extensible list of error detection strategies.
 * Each detector inspects the parsed response body and returns a DetectedError
 * if it matches a known error pattern, or null to pass to the next detector.
 */
const errorDetectors: ErrorDetector[] = [
    // Pattern 1: Non-standard status/code at top level
    // e.g. MiniMax: {"status":"439","msg":"Token expired","body":null}
    // e.g. Others:  {"code":10001,"message":"Invalid API key"}
    (body) => {
        const status = body.status ?? body.code ?? body.errcode ?? body.error_code;
        if (status == null || ['200', '0', 'ok', 'success'].includes(String(status).toLowerCase())) {
            return null;
        }
        const msg = body.msg ?? body.message ?? body.errmsg ?? body.error_msg;
        return {
            message: String(msg || `Non-standard API error (status: ${status})`),
            code: status as string | number,
        };
    },

    // Pattern 2: OpenAI-style error object without proper HTTP status
    // e.g. {"error":{"message":"unknown provider...","type":"server_error","code":"internal_server_error"}}
    // e.g. {"error":"Something went wrong"}
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

    // Add more detectors here as new error patterns are discovered...
];

export const safeFetch: typeof fetch = async (input, init) => {
    const response = await globalThis.fetch(input, init);
    if (!response.ok) return response;

    const cloned = response.clone();
    try {
        const text = await cloned.text();
        const body = JSON.parse(text);

        if (body && typeof body === 'object' && !Array.isArray(body)) {
            // Valid AI response fields — pass through
            if ('choices' in body || 'candidates' in body) return response;

            // Run through error detectors
            for (const detect of errorDetectors) {
                const error = detect(body);
                if (error) {
                    return new Response(
                        JSON.stringify({ error: { message: error.message, code: error.code } }),
                        { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } }
                    );
                }
            }
        }
    } catch {
        // Parsing failed — let SDK handle original response
    }
    return response;
};
