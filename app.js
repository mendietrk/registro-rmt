const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const session = require('express-session');

app.use(session({
  secret: 'mi_secreto_seguro', // cámbialo por algo más complejo en producción
  resave: false,
  saveUninitialized: true
}));

// Configuración de la aplicación Express

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

const indexRoutes = require("./src/routes/index.js");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

  // Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // <---- ¡Añade esta línea!
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);
const chrcRoutes = require('./src/routes/chrcRoutes');

// Start server (type: npm run dev)
app.listen(app.get("port"), () =>
{
    console.log("Server on port " + app.get("port"));
});

