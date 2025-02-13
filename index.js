const express = require('express');
const fetch = require('node-fetch');

const app = express();

// A simple proxy endpoint. Usage: GET /proxy?url=https://example.com
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Error: No URL specified. Use ?url=<target URL>');
  }
  
  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');
    const body = await response.text();
    
    // Set the same content-type as the target response
    res.set('Content-Type', contentType || 'text/html');
    res.send(body);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Error fetching the target URL.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
