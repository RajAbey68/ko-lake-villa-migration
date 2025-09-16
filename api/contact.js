// Serverless Function: Handle contact form submissions for Ko Lake Villa
// Deploy this as a Replit Function for contact and inquiry handling

export async function handler(request) {
  const { method, url } = request;
  
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }

    if (method === 'POST') {
      const contactData = await request.json();
      
      // Validate contact form data
      const { name, email, message, phone } = contactData;
      
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['name', 'email', 'message']
          }), 
          { status: 400, headers }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }), 
          { status: 400, headers }
        );
      }

      // Process contact form submission
      const contactSubmission = {
        id: crypto.randomUUID(),
        name,
        email,
        phone: phone || null,
        message,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };

      // Log the contact submission (replace with actual database/email service)
      console.log('New contact submission:', contactSubmission);

      // Here you could integrate with:
      // - Email service (SendGrid, Mailgun, etc.)
      // - Database storage
      // - CRM system
      // - Notification service

      return new Response(
        JSON.stringify({ 
          success: true,
          submissionId: contactSubmission.id,
          message: 'Thank you for contacting Ko Lake Villa. We will get back to you soon!'
        }), 
        { status: 201, headers }
      );
    }

    if (method === 'GET') {
      // Return contact information
      const contactInfo = {
        name: 'Ko Lake Villa',
        email: 'info@kolakevilla.com',
        phone: '+94 XXX XXX XXX',
        address: 'Beautiful Lake Location, Sri Lanka',
        hours: 'Available 24/7 for inquiries'
      };

      return new Response(
        JSON.stringify(contactInfo), 
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process contact form'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}