import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Veritabanı bağlantısı
const db = new sqlite3.Database("./todo.db", (err) => {
    if (err) {
        console.error("Veritabanı bağlantısı başarısız:", err.message);
    } else {
        console.log("Veritabanına bağlanıldı.");
        db.run(`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, task TEXT, completed INTEGER)`);
    }
});

// GET - Tüm görevleri getir
app.get("/todos", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// POST - Yeni görev ekle
app.post("/todos", (req, res) => {
    const { task } = req.body;
    db.run("INSERT INTO todos (task, completed) VALUES (?, 0)", [task], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, task, completed: 0 });
        }
    });
});

// DELETE - Görev sil
app.delete("/todos/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM todos WHERE id = ?", id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Görev silindi!" });
        }
    });
});

// PUT - Görev güncelle
app.put("/todos/:id", (req, res) => {
    const id = req.params.id;
    const { task, completed } = req.body;

    const query = "UPDATE todos SET task = ?, completed = ? WHERE id = ?";
    db.run(query, [task, completed, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: "Görev bulunamadı!" });
        } else {
            res.json({ id, task, completed });
        }
    });
});


// Server başlat
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
