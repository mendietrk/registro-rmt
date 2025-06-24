const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ubicacion = require("../models/ubicacions.js");

// Ruta GET para mostrar formulario de conexión
router.get('/', (req, res) => {
  res.render('home'); // Asegúrate de tener views/conexion.ejs
});

// POST /db/submit: conectar a MongoDB y redirigir al formulario de ubicación
router.post('/db/submit', async (req, res) => {
  if (!req.body || !req.body.db1) {
    return res.status(400).json({
      success: false,
      message: 'Datos incompletos',
    });
  }

  const URI = `mongodb+srv://${req.body.db1}:JLqfp91zOg8yjP2A@cluster0.lnpsbzn.mongodb.net/rapqp2?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    });

    // Respuesta JSON con instrucción de redirección
    return res.json({ success: true, redirectTo: '/registro-ubicacion' });

  } catch (error) {
    console.error('Error MongoDB:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Ruta GET para mostrar el formulario de ubicación
router.get('/registro-ubicacion', (req, res) => {
  res.render('ubicacion'); // Asegúrate de tener views/registro-ubicacion.ejs
});


// Ruta para guardar datos de ubicación
router.post("/registro-ubicacion", async (req, res) => {
  try {
    console.log("Datos de ubicación recibidos:", req.body);

    // Convertir strings a los tipos adecuados
    const nuevaUbicacion = new Ubicacion({
      nombre: req.body.nombre,
      latitud: parseFloat(req.body.latitud),
      longitud: parseFloat(req.body.longitud),
      entrada: req.body.entrada, // asegúrate que venga como "entrada" en el form
      fechaHora: new Date(req.body.fechaHora),
    });

    // Guardar en la base de datos
    const resultado = await nuevaUbicacion.save();
    console.log("Guardado en MongoDB:", resultado);

    res.redirect("/sorpresa"); // o la ruta que desees
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
    res.status(500).send("Error al guardar la ubicación");
  }
});

  router.get('/sorpresa', (req, res) => {
    res.render('sorpresa1');
});

router.get('/ubicaciones', async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find().sort({ fechaHora: -1 }); // más recientes primero
    res.render('../views/ubicaciones', { ubicaciones });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener ubicaciones');
  }
});

router.delete('/ubicaciones/:id', async (req, res) => {
  try {
    await Ubicacion.findByIdAndDelete(req.params.id);
    res.redirect('/ubicaciones');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al borrar el registro');
  }
});



module.exports = router;
