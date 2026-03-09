# Dental Mode — Manual Verification Guide

This guide provides a step-by-step walkthrough to verify the full implementation of the Dental Mode, including the frontend extension, custom layout, backend persistence, and authentication.

---

## 🛠 Pre-requisites: Setup Environment

Before starting the verification, ensure both the backend and frontend are running.

1.  **Start the Backend**:
    *   Open a terminal in the project root.
    *   Run: `cd platform/backend && npm install && node index.js`
    *   **Verify**: You should see `Dental Backend running on http://localhost:5000`.

2.  **Start the Frontend**:
    *   Open another terminal in the project root.
    *   Run: `yarn dev`
    *   **Verify**: The viewer should be accessible at `http://localhost:3000`.

Key Features Accomplished:

Custom Dental Interface: A complete UI overhaul featuring a specialized "Practice Header" and a dedicated dark-themed dental aesthetic.

Interactive Dental Chart: A built-in tooth selector that allows dentists to select specific teeth and automatically toggle between Universal and FDI numbering systems.

Specialized Clinical Tools: A new set of measurement tools specifically for dentistry, including:
PA Length & Root Length
Canal Angle
Crown Width

Intelligent Auto-Tagging: Measurements are automatically labeled and linked to the currently selected tooth, removing the need for manual data entry.

Secure Persistence: A backend system that requires a secure login and automatically saves all measurements to a database, ensuring data is never lost when closing the browser.

One-Click Export: The ability to export all clinical findings into a structured format for easy sharing or integration with other systems.
