import {response, Router} from 'express';
import ProductManager from "../ProductManagerAsync.js";

const router = Router();

router.get('/', async (request,response) => {

    let limit = request.query.limit;
    //Traer todos los productos del JSON
    let productsRead = await Products.getProducts();

        if(limit <= productsRead.length){
            const newarr = [];
            //Crea un nuevo array para treaer a los productos con el limite
            for (let i = 1; i <= limit; i++){
                newarr.push(productsRead[i-1])
            }
            response.render('realTimeProducts',{
                products:newarr
            });
        } else {
            response.render('realTimeProducts', {
                products:productsRead
            });
        }
});

const Products = new ProductManager("./filesasync");

export default router
