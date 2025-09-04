export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Dump/log all received fields for debugging (remove in production!)
  console.log("Received Retell webhook payload:", JSON.stringify(req.body, null, 2));

  // Optionally, just echo everything back for Retell, Airtable, logging, etc.
  // Always reply 200 OK so Retell knows it was received
  return res.status(200).json({
    success: true,
    received: req.body
  });
}
