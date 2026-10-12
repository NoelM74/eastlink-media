/**
 * Eastlink Media — Cloudflare Worker
 * Handles contact form submissions via Resend API.
 * Static assets are served by the assets binding in wrangler.jsonc, with their
 * security headers set in /_headers. Responses made here get the same headers
 * from withSecurityHeaders().
 */

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const LIMITS = { name: 100, email: 254, service: 100, message: 5400 };
const MAX_BODY_BYTES = 20000;

function withSecurityHeaders(response) {
  const res = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  return res;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function validateEmail(email) {
  return /^[^\s@"<>]+@[^\s@"<>]+\.[^\s@"<>]{2,}$/.test(email);
}

// Collapse control characters (keeps newlines in the message only)
function clean(value, keepNewlines = false) {
  const str = typeof value === 'string' ? value : '';
  const pattern = keepNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return str.replace(pattern, ' ').trim();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function handleContact(request, env) {
  const url = new URL(request.url);

  // Only accept submissions from this site's own pages
  if (request.headers.get('Origin') !== url.origin) {
    return jsonResponse({ error: 'Forbidden.' }, 403);
  }
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return jsonResponse({ error: 'Invalid request.' }, 415);
  }

  // Per-visitor rate limit (binding configured in wrangler.jsonc)
  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) {
      return jsonResponse({ error: 'Too many messages. Please wait a minute and try again.' }, 429);
    }
  }

  // Parse body
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Your message is too long.' }, 413);
  }
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }
  if (!body || typeof body !== 'object') {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  // Spam trap: the "company" field is hidden from people, so only bots fill it.
  // Answer as if it worked so they don't adapt.
  if (clean(body.company)) {
    return jsonResponse({ success: true, message: 'Message sent successfully.' });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const service = clean(body.service) || 'Not specified';
  const message = clean(body.message, true);

  // Validate required fields
  if (!name || !email || !message) {
    return jsonResponse({ error: 'Name, email, and message are required.' }, 400);
  }
  if (!validateEmail(email)) {
    return jsonResponse({ error: 'Invalid email address.' }, 400);
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email ||
      service.length > LIMITS.service || message.length > LIMITS.message) {
    return jsonResponse({ error: 'Your message is too long.' }, 400);
  }

  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return jsonResponse({ error: 'Email service not configured.' }, 500);
  }

  // Recipient email — change this if needed
  const TO_EMAIL = env.CONTACT_EMAIL || 'eastlinktrade@gmail.com';
  // From address — must be a verified domain in Resend, or use onboarding@resend.dev for testing
  const FROM_EMAIL = env.FROM_EMAIL || 'onboarding@resend.dev';

  const h = { name: escapeHtml(name), email: escapeHtml(email), service: escapeHtml(service), message: escapeHtml(message) };

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
        text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}\n\nSent from the eastlinkmedia.com contact form`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 12px;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #1a1a1a;">${h.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Email</td>
                <td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${h.email}">${h.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Service</td>
                <td style="padding: 8px 0; color: #1a1a1a;">${h.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #1a1a1a; white-space: pre-wrap;">${h.message}</td>
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

async function route(request, env) {
  const url = new URL(request.url);

  // Redirect HTTP → HTTPS (permanent)
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  // Contact form API endpoint
  if (url.pathname === '/api/contact') {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
    }
    return handleContact(request, env);
  }

  // Everything else falls through to static asset serving (handled by wrangler assets binding)
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    return withSecurityHeaders(await route(request, env));
  },
};
