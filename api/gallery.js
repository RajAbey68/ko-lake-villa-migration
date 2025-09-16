// Serverless Function: Handle gallery management for Ko Lake Villa
// Deploy this as a Replit Function for image and gallery operations

export async function handler(request) {
  const { method, url } = request;
  const urlPath = new URL(url).pathname;
  
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }

    if (method === 'GET' && urlPath.includes('/api/gallery')) {
      // Return gallery images for Ko Lake Villa
      const galleryImages = [
        {
          id: 1,
          url: '/images/hero/villa.jpg',
          title: 'Villa Exterior',
          description: 'Beautiful villa surrounded by nature'
        },
        {
          id: 2,
          url: '/images/hero/pool.jpg', 
          title: 'Infinity Pool',
          description: 'Relaxing infinity pool with lake view'
        },
        {
          id: 3,
          url: '/images/rooms/master.jpg',
          title: 'Master Bedroom',
          description: 'Luxurious master bedroom with lake view'
        }
        // Add more gallery images as needed
      ];

      return new Response(
        JSON.stringify({ 
          success: true,
          images: galleryImages,
          total: galleryImages.length
        }), 
        { status: 200, headers }
      );
    }

    if (method === 'POST' && urlPath.includes('/api/gallery/upload')) {
      // Handle image upload (for admin)
      const formData = await request.formData();
      const imageFile = formData.get('image');
      
      if (!imageFile) {
        return new Response(
          JSON.stringify({ error: 'No image file provided' }), 
          { status: 400, headers }
        );
      }

      // Process image upload (integrate with storage solution)
      const uploadResult = {
        id: crypto.randomUUID(),
        filename: imageFile.name,
        url: `/uploaded/${Date.now()}-${imageFile.name}`,
        uploadedAt: new Date().toISOString()
      };

      console.log('Image uploaded:', uploadResult);

      return new Response(
        JSON.stringify({ 
          success: true, 
          image: uploadResult,
          message: 'Image uploaded successfully'
        }), 
        { status: 201, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }), 
      { status: 404, headers }
    );

  } catch (error) {
    console.error('Gallery API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}