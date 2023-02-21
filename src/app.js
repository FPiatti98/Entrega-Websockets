import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './util.js';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartRoutes.js';
import viewsRouter from './routes/viewsRoutes.js';
import ProductManager from "./ProductManagerAsync.js";

const app = express();


//Express
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Public
app.use(express.static(__dirname+'/public'));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine','handlebars');

//Routes
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/', viewsRouter);

//Server / Socket.io
const SERVER_PORT = 8080
const httpServer = app.listen(SERVER_PORT, () => {console.log(`Escuchando desde el puerto ${SERVER_PORT}`);});
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log("new connection");

    socket.on('addProd', async (data) => {
        const state = await Products.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock, data.category);
        if(state){
            throw console.error(state);
        } else {
            let productosJson = await Products.getProducts();
            socketServer.emit('update', productosJson)
        }
    });

    socket.on('delProd', async (data) => {
        const id = parseInt(data);

        const check = await Products.deleteProduct(id);
        //si lo que devuelve el metodo es un error envia un status 400
        if (check){
            throw console.error(state);
        }else {
            let productosJson = await Products.getProducts();
            socketServer.emit('update', productosJson)
        }
    })

});

const Products = new ProductManager("./filesasync");