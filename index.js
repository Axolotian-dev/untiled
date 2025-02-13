const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware for JSON, CORS, and Cookies
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// General Proxy Endpoint: Handles GET & POST requests
app.all("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Error: No URL specified. Use ?url=<target URL>");
  }

  try {
    const options = {
      method: req.method,
      headers: {
        ...req.headers, // Forward all headers, including authorization
        host: new URL(targetUrl).host, // Fix host header
      },
      body: ["GET", "HEAD"].includes(req.method) ? null : JSON.stringify(req.body),
    };

    // Fetch the requested URL
    const response = await fetch(targetUrl, options);
    
    // Forward headers & cookies
    response.headers.forEach((value, key) => res.setHeader(key, value));
    const responseBody = await response.text();

    res.send(responseBody);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Error fetching the target URL.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
