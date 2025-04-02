const axios = require("axios");
const express = require('express');
const app = express.Router();

async function ytdl(url, format = 'mp4', maxRetries = 15) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      attempts++;

      const response = await axios.post(
        'https://www.clipto.com/api/youtube',
        { url: url },
        {
          headers: {
            "user-agent": "GoogleBot",
          }
        }
      );

      if (response.data?.success) {
        const data = response.data;
        const medias = data.medias?.filter(item => item.extension === format && item.is_audio === true) || [];

        if (medias.length === 0) {
          throw new Error(`Format ${format} non disponible ou audio non trouvé pour cette vidéo.`);
        }

        return medias[medias.length - 1].url;
      } else {
        throw new Error("Erreur API: " + (response.data?.message || "Réponse invalide"));
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error.message);

      if (attempts >= maxRetries) {
        throw new Error("Impossible de récupérer les données après " + maxRetries + " tentatives.");
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

app.get('/ovl-yt-dl', async (req, res) => {
  const { url, format } = req.query;

  if (!url || !format) {
    return res.json({ error: 'Veuillez fournir un lien et un format' });
  }

  try {
    const final_url = await ytdl(url, format);
    res.json({ 
      status: true, 
      creator: "Ainz", 
      url: final_url 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du lien:', error);
    res.status(500).json({ 
      status: false, 
      error: 'Erreur interne du serveur' 
    });
  }
});

module.exports = app;
