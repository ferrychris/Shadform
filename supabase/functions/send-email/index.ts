import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { google } from 'npm:googleapis@131.0.0';
import { OAuth2Client } from 'npm:google-auth-library@9.6.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get('GOOGLE_CLIENT_ID'),
  clientSecret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
  redirectUri: 'https://developers.google.com/oauthplayground',
});

oauth2Client.setCredentials({
  refresh_token: Deno.env.get('GOOGLE_REFRESH_TOKEN'),
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

function createEmail(formData: any) {
  const emailContent = `
    New Job Application Received

    Contact Information:
    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Address: ${formData.address}
    City: ${formData.city}
    State: ${formData.state}
    Zip Code: ${formData.zipCode}

    Position Details:
    Position: ${formData.positionType}
    Experience: ${formData.experience}
    Availability: ${formData.availability}

    Additional Information:
    LinkedIn/Portfolio: ${formData.resume || 'Not provided'}
    Additional Notes: ${formData.additionalInfo || 'None'}
  `;

  const email = [
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    'Content-Transfer-Encoding: 7bit',
    'to: ' + Deno.env.get('RECIPIENT_EMAIL'),
    'subject: New Job Application - ' + formData.name,
    '',
    emailContent,
  ].join('\n');

  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    
    const raw = createEmail(formData);
    
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});