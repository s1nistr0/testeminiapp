const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para listar modelos
app.get('/listModelos', (req, res) => {
    const directory = path.join(__dirname, 'public/images/modelos/Afrogaybe');
    let modelo = null;

    fs.readdir(directory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o diretório' });
        }

        for (const file of files) {
            if (path.extname(file).toLowerCase() === '.jpg') {
                modelo = {
                    id: 'Afrogaybe',
                    name: 'Afrogaybe',
                    image: `/images/modelos/Afrogaybe/${file}`
                };
                break;
            }
        }

        res.json(modelo);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
