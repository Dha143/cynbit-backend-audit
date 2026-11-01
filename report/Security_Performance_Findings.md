# Security & Performance Findings

HIGH Security:
1. Missing Rate Limiting - Contact form can be spammed to DoS backend
2. No Helmet Headers - CSP, HSTS, X-Frame-Options missing
3. CORS * - Allows any origin

MEDIUM Security:
1. No Input Sanitization - XSS risk if stored in CRM
2. No CAPTCHA
3. No device auth mentioned - API keys in firmware risk

HIGH Performance:
1. No Caching - Every telemetry fetch hits DB
2. No Pagination - /devices/:id/data will crash with 1M points

MEDIUM Performance:
1. No Edge Cache, No long TTL for assets
2. Polling instead of WebSocket/SSE for live data

Error Handling: Generic 404, no structured format {code, message, traceId}
