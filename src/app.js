import express from 'express';
import ProductsRouter from './routes/productsRoutes.js';
import CartsRouter from './routes/cartRoutes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', ProductsRouter);
app.use('/api', CartsRouter);

const SERVER_PORT = 8080
app.listen(SERVER_PORT, () => {
    console.log(`Escuchando desde el puerto ${SERVER_PORT}`);
});