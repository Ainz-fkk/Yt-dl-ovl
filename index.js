const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;
const ytdlRoute = require('./ytdl');

app.use(cors());  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ytdlRoute);

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

module.exports = app;
