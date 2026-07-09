require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

// Principio de codificación segura:
// Nunca confiar en la entrada del usuario.
// Antes de procesar la información, se valida que el nombre no esté vacío y que el correo tenga un formato válido. Esto ayuda a prevenir errores, datos inválidos y posibles ataques mediante entradas maliciosas.
app.post(
  '/api/registro',

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('correo')
    .isEmail()
    .withMessage('El correo no es válido'),

  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    res.json({
      mensaje: 'Usuario registrado correctamente',
      datos: req.body
    });

  }
);

app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

const tareasRouter = require('./routes/tareas');

app.use('/api/tareas', tareasRouter);

module.exports = app;