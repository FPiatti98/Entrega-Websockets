import {response, Router} from 'express';
import ProductManager from "../ProductManagerAsync.js"

const router = Router();

router.get('/products', async (request,response) => {

    let limit = request.query.limit;
    let productsRead = await Products.getProducts();

        if(limit <= productsRead.length){
            const newarr = [];
            for (let i = 1; i <= limit; i++){
                newarr.push(productsRead[i-1])
            }
            response.send(newarr);
        } else {
            response.send(productsRead);
        }
});

router.get('/products/:id', async (request,response) => {

    const id = parseInt(request.params.id); 

    const prod = await Products.getProductById(id);

    if (prod == "nonexistant"){
        response.status(400).send({status: "Error", message: "El archivo al que se intenta acceder es inexistente"});
    } else if(prod == "Not Found"){
        response.status(400).send({status: "Error", message: `El producto con el id ${id} es inexistente`});
    } else {
        response.send(prod);
    }

    /*
        if (id > 0 && id <= productsRead.length ){
            const prod = await Products.getProductById(id);
            response.send(prod);
        } else {
            response.status(400).send({status: "Error", message: `El producto con el id ${id} no existe`});
        }
    */
});

router.post('/', async (request, response) => {
    let product = request.body;
    let estado = await Products.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.category);;
    if(estado){
        response.status(400).send({status: "Error", message: estado});
    } else {  
        response.status(200).send({status: "Successful", message: `El producto fue agregado exitosamente`});
    }
});

router.put('/:id', async (request, response) => {

    const reqId = parseInt(request.params.id);

    if (request.body.id){
        return response.status(400).send({status: "Error", message: "No es posible cambiar el Id del producto"});
    }

    const check = await Products.updateProduct(reqId, request.body);

    if (check){
        return response.status(400).send({status: "Error", message: check});
    } else {
        return response.status(200).send({status: "Successful", message: `El producto con el id ${reqId} fue actualizado exitosamente`});
    }

});

router.delete('/:id', async (request, response) => {

    const id = parseInt(request.params.id); 
    const check = await Products.deleteProduct(id);
    if (check){
        return response.status(400).send({status: "Error", message: check});
    }else {
        return response.send({status: "Successful", message: `El producto con el id ${id} fue eliminado exitosamente`});
    }
})

const Products = new ProductManager("./filesasync");

/*
const testeo = async(test) => {

    //await test.addProduct("monitor samsung", "60hz, 1080p, 24 pulgadas", 40000, "/images/monitor1.png", "xyz3215", 5);
    //await test.addProduct("monitor samsung", "60hz, 1080p, 24 pulgadas", 40000, "/images/monitor1.png", "abc123", 5);
    //await test.addProduct("monitor phillips", "144hz, 1440p, 32 pulgadas", 120000, "/images/monitor2.png", "fra698", 3);
    //await test.getProducts();
    //await test.getProductById(3);
    //await test.updateProduct(2, "title", "TEST");
    //await test.deleteProduct(1);

}

testeo(test);
*/

export default router;
