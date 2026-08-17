// Vercel serverless function: receives quote-form submissions and forwards
// them to the CRM-QM PushLead API. Keeps the CRM bearer token server-side only.

const CRM_ENDPOINT = 'https://thequotemasters.com/crm_api/api.php?action=push_lead';
const INDUSTRY_ID = 23; // Commercial office cleaning
const MAX_FIELD_LENGTH = 500;

function sanitize(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.CRM_API_TOKEN;
  if (!token) {
    console.error('CRM_API_TOKEN is not configured');
    return res.status(500).json({ error: 'Server is not configured. Please call us instead.' });
  }

  const body = req.body || {};

  const name = sanitize(body.name);
  const phone = sanitize(body.phone).replace(/[^\d]/g, '');
  const email = sanitize(body.email);
  const company = sanitize(body.company);
  const city = sanitize(body.city);
  const sqft = sanitize(body.sqft);
  const facilityType = sanitize(body.type);
  const frequency = sanitize(body.frequency);
  const notes = sanitize(body.notes);
  const utmSource = sanitize(body.utm_source);

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(' ') || '-';

  const noteParts = [];
  if (city) noteParts.push(`City: ${city}`);
  if (sqft) noteParts.push(`Approx. sqft: ${sqft}`);
  if (facilityType) noteParts.push(`Facility type: ${facilityType}`);
  if (frequency) noteParts.push(`Requested frequency: ${frequency}`);
  if (notes) noteParts.push(`Notes: ${notes}`);

  const payload = {
    zip: '',
    customer: {
      company_name: company,
      first_name: firstName,
      last_name: lastName,
      position: '',
      phone,
      email,
      email2: '',
      address: city,
      service_address: city,
      notes: noteParts.join(' | '),
    },
    industry: INDUSTRY_ID,
    questions: [],
    appointments: [],
    number_of_quotes: '1',
    utm_source: utmSource,
  };

  try {
    const crmResponse = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!crmResponse.ok) {
      const text = await crmResponse.text().catch(() => '');
      console.error('CRM PushLead failed', crmResponse.status, text);
      return res.status(502).json({ error: 'We could not submit your request. Please call us instead.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('CRM PushLead request error', err);
    return res.status(502).json({ error: 'We could not submit your request. Please call us instead.' });
  }
};
