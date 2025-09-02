export default async function handler(req, res) {
  // Only allow POST to this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { lookup_key, lookup_type = 'phone' } = req.body || {};

  // Validate required fields
  if (!lookup_key) {
    return res.status(400).json({ error: 'Missing lookup_key in request body.' });
  }

  /*
    This endpoint returns appointment details for a given identifier. In a real
    implementation, you would look up the appointment in a database or
    scheduling system. For demonstration purposes, we define a simple in-memory
    object keyed by phone number, appointment ID, or customer name. Replace
    this mock with calls to your own persistence layer.
  */
  const MOCK_DB = {
    // Phone number lookup
    '5551230000': {
      appointment_id: 'apt_001',
      customer_name: 'Cindy Parker',
      service: 'Window inspection',
      appointment_date_spoken: 'Friday, September 12th',
      appointment_time_spoken: '3 PM',
      appointment_timezone: 'ET',
      prep_notes: 'Please clear a path to the windows.',
      homeowners_required: true
    },
    // Name lookup
    'Cindy Parker': {
      appointment_id: 'apt_001',
      customer_name: 'Cindy Parker',
      service: 'Window inspection',
      appointment_date_spoken: 'Friday, September 12th',
      appointment_time_spoken: '3 PM',
      appointment_timezone: 'ET',
      prep_notes: 'Please clear a path to the windows.',
      homeowners_required: true
    },
    // Appointment ID lookup
    'apt_001': {
      appointment_id: 'apt_001',
      customer_name: 'Cindy Parker',
      service: 'Window inspection',
      appointment_date_spoken: 'Friday, September 12th',
      appointment_time_spoken: '3 PM',
      appointment_timezone: 'ET',
      prep_notes: 'Please clear a path to the windows.',
      homeowners_required: true
    }
  };

  const key = String(lookup_key).trim();
  const record = MOCK_DB[key];

  if (!record) {
    return res.status(404).json({ error: 'Appointment not found for provided lookup_key.' });
  }

  // Return appointment record as JSON
  return res.status(200).json(record);
}