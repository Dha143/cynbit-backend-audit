# Backend Technical Audit Report
Domain: cynbit.in

A. Architecture
Cynbit is IoT Lab Automation. Inferred stack:
[ESP32 Hardware] -> MQTT (EMQX) -> Ingestion Worker -> TimescaleDB/InfluxDB -> Redis Cache -> REST API (Node) -> Dashboard (Next.js)
Website currently is static/marketing.

B. API Behaviour Observed
- Contact form POST to /wp-json/contact-form-7 - legacy, not versioned REST
- No Rate-Limit headers (X-RateLimit-*)
- No /api/v1/health, /openapi.json
- Payload is form-data not JSON

C. Data Handling
- PII (name,email,phone) sent without field-level encryption
- No client validation beyond required
- No idempotency key for form submission
