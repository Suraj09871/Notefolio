const serverless = require('serverless-http');
const app = require('../../server/app');

// Wrap Express app for AWS Lambda (Netlify Functions)
// Netlify redirects /api/* to /.netlify/functions/api/:splat
// serverless-http strips the function base path automatically
// So Express receives /api/* which matches our route definitions
module.exports.handler = serverless(app);
