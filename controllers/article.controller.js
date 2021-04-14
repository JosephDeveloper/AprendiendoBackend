const fs = require('fs')
const path = require('path')
const validator = require('validator')
const { exists } = require('../models/article')
const Article = require('../models/article')

const controller = {
    datosCurso: (req, res) => {
        return res.status(200).send({
            curso: 'Framework'
        })
    },
    
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test'
        })
    },

    save: (req, res) => {
        //Tomar datos post
        const params = req.body;
        //Valida datos
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }

        if (validate_title && validate_content) {
            //Crear objeto a guardar
            var article = new Article();

            //Asigna valores
            article.title = params.title
            article.content = params.content

            if (params.image) {
                article.image = params.image
            }else{
                article.image = null
            }
            //Guarda valores
            article.save((err, articleStore) =>{
                if(err || !articleStore){
                    return res.status(400).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    })        
                }else{
                    return res.status(200).send({
                        status: 'success',
                        article: articleStore
                    })        
                }
            })
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            })
        }
    },

    getArticles: (req, res) => {

        var query = Article.find();
        var last = req.params.last;

        if(last || last!=undefined){
            query.limit(5)
        }

        query.sort('-_id').exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                })
            }
            if(!articles){
                return res.status(204).send({
                    status: 'error',
                    message: 'No hay articulos'
                })
            }
            return res.status(200).send({
                status: 'success',
                articles
            })
        })
    },
    
    getArticle: (req, res) => {
        //Recoger id de la url
        var articleId = req.params.id;
        //Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'El articulo no existe'
            })
        }
        // Buscar articulo
        Article.findById(articleId, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'El articulo no existe'
                })
            }
            //Devolver articulo
            return res.status(200).send({
                status: 'success',
                article
            })
        })
    },
    
    update: (req, res) => {
        var articleId = req.params.id
        var datos = req.body
        try {
            var validate_title = !validator.isEmpty(datos.title)
            var validate_content = !validator.isEmpty(datos.content)
        } catch (error) {
            return res.status(204).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })    
        }

        if (validate_title && validate_content) {
            Article.findOneAndUpdate({_id: articleId}, datos, {new: true}, (err, article)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Hubo un error al actualizar los datos'
                    })
                }
                if(!article){
                    return res.status(204).send({
                        status: 'error',
                        message: 'No exite el articulo'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    article
                })
            })
        } else {
            return res.status(204).send({
                status: 'error',
                message: 'Los datos no son validos'
            })
        }
    },

    delete: (req, res) => {
        var articleId = req.params.id

        Article.findOneAndDelete({_id: articleId}, (err, articleRemove) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                })
            }
            if(!articleRemove){
                return res.status(204).send({
                    status: 'error',
                    message: 'El articulo no exite'
                })
            }
            return res.status(200).send({
                status: 'success',
                articleRemove
            })
        })
    },

    upload: (req, res) => {
        //Configurar modulo connect multiparty (ya en route)

        //Tomar archivo
        var fileName = 'Imagen no subida...'

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: fileName
            })
        }
        //Tomar nombre y extension
        var file_path = req.files.file0.path
        var file_split = file_path.split('\\')
        //Para linux o mac debe ser asi
        //var file_split = file_path.split('/')
        //Nombre del archivo
        var file_name = file_split[2]
        //Extension del archivo
        var extension_split = file_name.split('\.')
        var file_ext = extension_split[1]
        //Comprobar extension, si no es valido se elimina
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar
            fs.unlink(file_path, (err) => {
                res.status(200).send({
                    status: 'error',
                    message: 'La extension no es valida'
                })
            })
        }else{
            //Si es valido
            //Busca articulo y actualizar imagen
            var articleId = req.params.id

            if (articleId) {
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(204).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del articulo'
                        })
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    })
                })                
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                })
            }
        }
    },

    getImage: (req, res) => {
        var file = req.params.image
        var path_file = './upload/articles/'+file

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(204).send({
                    status: 'error',
                    message: 'La imagen no existe'
                })
            }
        })
    },

    search: (req, res) => {
        var searchString = req.params.search;
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                })
            }
            if(!articles || articles.length <= 0){
                return res.status(200).send({
                    status: 'error',
                    message: 'No se encontraron similitudes'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            })
        })
    }

}

module.exports = controller;