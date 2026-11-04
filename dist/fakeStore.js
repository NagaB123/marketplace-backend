"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstreamError = void 0;
exports.fakeStoreRequest = fakeStoreRequest;
const config_1 = require("./config");
class UpstreamError extends Error {
    statusCode;
    constructor(message, statusCode = 502) {
        super(message);
        this.statusCode = statusCode;
        this.name = "UpstreamError";
    }
}
exports.UpstreamError = UpstreamError;
async function fakeStoreRequest(path, init) {
    const url = new URL(`${config_1.config.fakeStoreApiBaseUrl}${path}`);
    let response;
    try {
        response = await fetch(url, {
            ...init,
            signal: AbortSignal.timeout(config_1.config.upstreamTimeoutMs),
            headers: { "content-type": "application/json", ...init?.headers }
        });
    }
    catch {
        throw new UpstreamError("Fake Store API is unavailable", 502);
    }
    const body = await response.text();
    if (!response.ok) {
        throw new UpstreamError(body || "Fake Store API request failed", response.status);
    }
    try {
        return JSON.parse(body);
    }
    catch {
        throw new UpstreamError("Fake Store API returned an invalid response", 502);
    }
}
