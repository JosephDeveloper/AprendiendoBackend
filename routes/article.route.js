const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty')
const md_upload = multipart({ uploadDir: './upload/articles' })

var article= require('../controllers/article.controller');

//Rutas de pruebas
router.get('/test-de-controlador', article.test)
router.post('/datos-curso', article.datosCurso)

//Rutas para articulos
router.post('/save', article.save)
//con parametro opcional
router.get('/articles/:last?', article.getArticles)
//con parametro obligatorio
router.get('/article/:id', article.getArticle)
router.put('/article/:id', article.update)
router.delete('/article/:id', article.delete)
router.post('/upload-image/:id?', md_upload, article.upload)
router.get('/get-image/:image', article.getImage)
router.get('/search/:search', article.search)

module.exports = router