'use strict'

const mongoose = require("mongoose");
const app = require('./app');
const port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conexión correcta!');

    //Crear servidor
    app.listen(port, () => {
        console.log('Servidor corriendo en el puerto: '+port);
    });
});