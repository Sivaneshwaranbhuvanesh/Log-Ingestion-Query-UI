# Log Ingestion & Query System

**Author:** Sivaneshwaran  
**Tech Stack:** Node.js (Express) + React (Vite)

## Features
- **POST /logs** – Ingest logs with validation
- **GET /logs** – Query logs with multiple filters:
  - level (multiple levels allowed)
  - message substring search
  - resourceId
  - traceId
  - spanId
  - commit
  - date range (timestamp_start, timestamp_end)
- **GET /stats** – Returns total log count and breakdown by level
- **Frontend**:
  - Search fields & level checkboxes
  - Date range selectors
  - CSV export
  - Dark theme UI
  - Responsive layout
- Prefilled with 15 sample logs so UI works instantly

## Install & Run
```bash
# Install root tools
npm install

# Install backend & frontend dependencies
npm run install-all

# Start both backend & frontend together
npm run dev
