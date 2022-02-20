const express = require('express');
const app = express();

// Directs posts api calls to posts router
app.use('/api/posts', require('./routes/api/posts'))

// Directs ping api calls to ping router
app.use('/api/ping', require('./routes/api/ping'))

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;