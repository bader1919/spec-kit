// Authentication middleware for validating N8N API key
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-n8n-api-key'] || req.headers.authorization?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key required',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Attach API key to request for downstream use
  req.n8nApiKey = apiKey;
  next();
};

module.exports = authMiddleware;
