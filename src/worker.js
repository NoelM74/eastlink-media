/**
 * Eastlink Media — Cloudflare Worker
 * Handles contact form submissions via Resend API.
 * Static assets are served by the assets binding in wrangler.jsonc.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function sanitize(str) {
  return str.replace(/[<>]/g, '').trim();
}

async function handleContact(request, env) {
  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const name = sanitize(body.name || '');
  const email = sanitize(body.email || '');
  const service = sanitize(body.service || 'Not specified');
  const message = sanitize(body.message || '');

  // Validate required fields
  if (!name || !email || !message) {
    return jsonResponse({ error: 'Name, email, and message are required.' }, 400);
  }
  if (!validateEmail(email)) {
    return jsonResponse({ error: 'Invalid email address.' }, 400);
  }

  // Rate-limit key (simple per-IP, optional KV upgrade later)
  // For now, just send the email

  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return jsonResponse({ error: 'Email service not configured.' }, 500);
  }

  // Recipient email — change this if needed
  const TO_EMAIL = env.CONTACT_EMAIL || 'eastlinktrade@gmail.com';
  // From address — must be a verified domain in Resend, or use onboarding@resend.dev for testing
  const FROM_EMAIL = env.FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Eastlink Media Contact <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New enquiry from ${name} — ${service}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 12px;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #1a1a1a;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Email</td>
                <td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Service</td>
                <td style="padding: 8px 0; color: #1a1a1a;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #1a1a1a; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; color: #999; font-size: 13px;">
              Sent from eastlinkmedia.com contact form
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend API error:', res.status, err);
      return jsonResponse({ error: 'Failed to send message. Please try again.' }, 502);
    }

    return jsonResponse({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);
    return jsonResponse({ error: 'An unexpected error occurred.' }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Contact form API endpoint
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    // Everything else falls through to static asset serving (handled by wrangler assets binding)
    return env.ASSETS.fetch(request);
  },
};
