async function getLinkUrl(shortURL) {
  try {
    const response = await fetch(`http://localhost:8080/shorturl/${shortURL}`);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function GET({ params, redirect }) {
  const { shortURL } = params;

  const link = await getLinkUrl(shortURL);

  if (!link) {
    console.log('No link found');
    return redirect('/expired', 301);
  }

  return redirect(link, 301);
}
