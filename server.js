const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Legge i messaggi
app.get('/messaggi.json', (req, res) => {
  fs.readFile('messaggi.json', (err, data) => {
    if (err) return res.status(500).send("Errore lettura file");
    res.json(JSON.parse(data));
  });
});

// Aggiunge un nuovo messaggio e mantiene solo gli ultimi 5
app.post('/salva', (req, res) => {
  const nuovo = req.body;

  fs.readFile('messaggi.json', (err, data) => {
    let messaggi = [];
    if (!err && data.length) {
      try {
        messaggi = JSON.parse(data);
      } catch {}
    }

    messaggi.push(nuovo);
    // Tieni solo gli ultimi 5
    if (messaggi.length > 5) messaggi = messaggi.slice(-5);

    fs.writeFile('messaggi.json', JSON.stringify(messaggi, null, 2), (err) => {
      if (err) return res.status(500).send("Errore salvataggio");
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});
