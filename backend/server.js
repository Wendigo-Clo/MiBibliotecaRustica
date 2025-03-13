const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
const db = new sqlite3.Database("../database/mibiblioteca.db");

app.use(cors());
app.use(bodyParser.json());

// Obtener todos los libros
app.get("/libros", (req, res) => {
  db.all("SELECT * FROM libros", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Agregar un libro
app.post("/libros", (req, res) => {
    const { titulo, autorxs, ubicacion, prestado_a } = req.body;

    if (!titulo || !autorxs) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = `INSERT INTO libros (titulo, autorxs, ubicacion, prestado_a) VALUES (?, ?, ?, ?)`;
    db.run(sql, [titulo, autorxs, ubicacion || "", prestado_a || ""], function (err) {
        if (err) {
            console.error("Error en la base de datos:", err.message);
            return res.status(500).json({ error: err.message });
        }

        // DEVOLVER TODOS LOS DATOS EN LA RESPUESTA
        res.json({
            id: this.lastID,
            titulo,
            autorxs,
            ubicacion: ubicacion || "",  // Si es null, poner un string vacío para que el frontend lo maneje bien
            prestado_a: prestado_a || "",
        });
    });
});


// Eliminar un libro
app.delete("/libros/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM libros WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Libro eliminado" });
  });
});


//editar libro
app.put("/libros/:id", (req, res) => {
    const { id } = req.params;
    const {titulo, autorxs, ubicacion, prestado_a} = req.body;
    
    if (!titulo || !autorxs) {
        return res.status(400).json({ error: "Faltan datos" });
    }
    
    const sql = `UPDATE libros SET titulo = ?, autorxs = ?, ubicacion = ?, prestado_a = ? WHERE id = ?`;
    db.run(sql, [titulo, autorxs, ubicacion || "", prestado_a || "", id], function (err)  {
        if (err) {
            console.error("Error en la base de datos:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        res.json({ message: "Libro actualizado correctamente" });
        }
    );
});


// Servidor corriendo en el puerto 3000
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
