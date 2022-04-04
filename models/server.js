const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { dbConnection } = require('../database/config');
const fileupload = require('express-fileupload')
class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            convertFiles : '/api/convert'
        }
        //Conectar a base de datos 
        //this.conectDatabase();

        //Middlewares
        this.middlewares()

        //Rutas de mi aplicacion
        this.routes()
    }

    // async conectDatabase(){
    //     await dbConnection();
    // }

    middlewares(){
        //Cors
        this.app.use( cors() );
        
        // Lectura y paseo de Body de
        //this.app.use( express.json());

        //Directorio publico
        this.app.use( express.static('public'));
        this.app.use( bodyParser.json({limit: '500mb'}) );
        this.app.use( bodyParser.urlencoded({
          limit: '500mb',
          extended: true,
          parameterLimit:50000
        }));

        //Para el manejo de archivos al servidor 
        this.app.use( fileupload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes (){
        //Rutas 
        this.app.use(this.paths.convertFiles,require('../routes/convert-files'));

        this.app.get('*', (req, res) => {
            res.status(404).send({
                Error : "Enpoint No encontrado"
            })
        })
    }

    listen() {
        this.app.listen(this.port,() => {
            console.log('listening on port ' + this.port)
        })
    }
}

module.exports = Server;