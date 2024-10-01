async function getLinkUrl(shortURL) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/redirect/${shortURL}`
    );

    if (!response.ok) {
      throw new Error('Error fetching URL');
    }

    return response.url;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function GET({ params }) {
  const { shortURL } = params;

  const link = await getLinkUrl(shortURL);

  if (!link) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/expired',
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: link, // Redirige a la URL final
    },
  });
}
