'use strict'

//Cargar modulos para cargar servidor
const express = require('express');
const bodyParser = require('body-parser');

//Ejecutar express http
const app = express();

//Cargar ficheros
const articleRoutes = require('./routes/article.route')


//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Prefijos a rutas

app.use('/api', articleRoutes)

//Exportar modulo actual
module.exports = app;