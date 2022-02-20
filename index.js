const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Directs posts api calls to posts router
app.get('/api/posts', require('./routes/api/posts'))

// Directs ping api calls to ping router
app.get('/api/ping', require('./routes/api/ping'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));