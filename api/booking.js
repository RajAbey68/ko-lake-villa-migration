// Serverless Function: Handle booking requests for Ko Lake Villa
// Deploy this as a Replit Function for serverless API handling

export async function handler(request) {
  const { method, url } = request;
  const urlPath = new URL(url).pathname;
  
  try {
    // Handle CORS
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }

    if (method === 'POST' && urlPath.includes('/api/booking')) {
      // Handle booking creation
      const bookingData = await request.json();
      
      // Validate booking data
      if (!bookingData.name || !bookingData.email || !bookingData.dates) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }), 
          { status: 400, headers }
        );
      }

      // Process booking (integrate with your booking system)
      const booking = {
        id: crypto.randomUUID(),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('New booking:', booking);

      return new Response(
        JSON.stringify({ 
          success: true, 
          booking,
          message: 'Booking request received successfully'
        }), 
        { status: 201, headers }
      );
    }

    if (method === 'GET' && urlPath.includes('/api/booking/')) {
      // Handle booking retrieval
      const bookingId = urlPath.split('/').pop();
      
      // Mock booking data (replace with actual database query)
      const booking = {
        id: bookingId,
        name: 'Ko Lake Villa Guest',
        status: 'confirmed'
      };

      return new Response(
        JSON.stringify({ booking }), 
        { status: 200, headers }
      );
    }

    // Route not found
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }), 
      { status: 404, headers }
    );

  } catch (error) {
    console.error('Booking API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}