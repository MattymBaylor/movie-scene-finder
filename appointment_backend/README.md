# Appointment Backend for Retell AI Agents

This repository provides a minimal backend for Retell AI voice agents to
retrieve and confirm appointment details. It exposes two HTTP endpoints
implemented as serverless functions: one for looking up existing
appointments (`/api/appointment_details`) and another for marking
appointments as confirmed (`/api/appointment_confirmation`).

## Endpoints

### `POST /api/appointment_details`

Looks up an existing appointment by phone number, appointment ID, or
customer name. Returns a JSON object with the appointment details.

**Request Body** (JSON):

```
{
  "lookup_key": "5551230000",       // phone, appointment ID, or name
  "lookup_type": "phone"            // one of "phone", "appointment_id", "name" (optional)
}
```

**Response** (200 OK):

```
{
  "appointment_id": "apt_001",
  "customer_name": "Cindy Parker",
  "service": "Window inspection",
  "appointment_date_spoken": "Friday, September 12th",
  "appointment_time_spoken": "3 PM",
  "appointment_timezone": "ET",
  "prep_notes": "Please clear a path to the windows.",
  "homeowners_required": true
}
```

Returns `404 Not Found` if no matching appointment is found.

### `POST /api/appointment_confirmation`

Marks an appointment as confirmed and records whether all
homeowners will be present. Returns a JSON object containing a
confirmation ID.

**Request Body** (JSON):

```
{
  "appointment_id": "apt_001",
  "all_homeowners_present": true
}
```

**Response** (200 OK):

```
{
  "success": true,
  "confirmation_id": "conf_apt_001_1693680000000"
}
```

Returns `400 Bad Request` if required fields are missing or invalid.

## Deploying on Vercel

1. Install the [Vercel CLI](https://vercel.com/docs/cli) if you haven't already:

   ```bash
   npm install -g vercel
   ```

2. From the root of this project, deploy to Vercel:

   ```bash
   vercel --prod
   ```

   Vercel will prompt you for project settings and then output
   production URLs for the endpoints, typically
   `https://YOUR-APP.vercel.app/api/appointment_details` and
   `https://YOUR-APP.vercel.app/api/appointment_confirmation`.

3. Use these URLs when configuring your custom functions in Retell.

## Configuring Retell Custom Functions

Create two custom functions in your Retell project, using the
production URLs from your Vercel deployment. Below are the
recommended configurations:

### appointment_details (Lookup)

* **Name:** `appointment_details`
* **Method:** `POST`
* **URL:** `https://YOUR-APP.vercel.app/api/appointment_details`
* **Headers:** `Content-Type: application/json`
* **Payload: args only:** enabled
* **Parameters (JSON schema):**

  ```json
  {
    "type": "object",
    "properties": {
      "lookup_key": {
        "type": "string",
        "description": "Phone number, appointment ID, or customer name"
      },
      "lookup_type": {
        "type": "string",
        "enum": ["phone", "appointment_id", "name"],
        "default": "phone"
      }
    },
    "required": ["lookup_key"]
  }
  ```

### appointment_confirmation (Mark Confirmed)

* **Name:** `appointment_confirmation`
* **Method:** `POST`
* **URL:** `https://YOUR-APP.vercel.app/api/appointment_confirmation`
* **Headers:** `Content-Type: application/json`
* **Payload: args only:** enabled
* **Parameters (JSON schema):**

  ```json
  {
    "type": "object",
    "properties": {
      "appointment_id": { "type": "string" },
      "all_homeowners_present": { "type": "boolean" }
    },
    "required": ["appointment_id", "all_homeowners_present"]
  }
  ```

## Testing Endpoints Locally

You can run the functions locally using any Node.js environment that
supports ESM modules. For example:

```bash
npm install
# Run using Vercel dev environment (requires vercel CLI):
vercel dev
```

Send a test request with `curl`:

```bash
# Test lookup endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"lookup_key": "5551230000"}' \
  http://localhost:3000/api/appointment_details

# Test confirmation endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"appointment_id": "apt_001", "all_homeowners_present": true}' \
  http://localhost:3000/api/appointment_confirmation
```

Once deployed, update the host URL accordingly.