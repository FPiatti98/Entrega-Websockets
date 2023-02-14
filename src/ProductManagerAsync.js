import * as fs from 'fs';
let id = 0;

class ProductManager {
    constructor (path) {
        this.products = [];
        this.path = path;
    };

    async addProduct(title,description,price,thumbnail,code,stock,category){

        const fileName = this.path + "/products.json";
        
        const incrementId = () => {
            id = id + 1;
            return id;
        };

        const product = {
            id : 0,
            title : title,
            description : description,
            price : price,
            thumbnail : [thumbnail],
            code : code,
            stock : stock,
            status : true,
            category : category
        };

        if(!fs.existsSync(fileName)){

            if (product.title === undefined || product.description === undefined || isNaN(product.price) || product.thumbnail === undefined || product.code === undefined || isNaN(product.stock) || product.category === undefined) {
                return ("Producto invalido, Complete los datos necesarios.");
            } else {
                product.id = incrementId();
                this.products.push(product);
                const productsStr = JSON.stringify(this.products);
                await fs.promises.writeFile(fileName, productsStr);
            };

        } else {

            if (product.title === undefined || product.description === undefined || isNaN(product.price) || product.thumbnail === undefined || product.code === undefined || isNaN(product.stock) || product.category === undefined){
                return ("Usuario invalido, Complete los datos necesarios.");
            }

            this.products = [];
            let contenido = await fs.promises.readFile(fileName, "utf-8");
            this.products = JSON.parse(contenido);
            
            const codes = [];

            this.products.forEach((prod) => {
                codes.push(prod.code);
            });

            if (codes.includes(product.code)){
                return (`El producto ${product.title} con el code: ${product.code} ya esta agregado`);
    
            } else {
                const newId = this.products[this.products.length - 1].id + 1;
                product.id = newId;
                this.products.push(product);
                const productsStr = JSON.stringify(this.products);
                await fs.promises.writeFile(fileName, productsStr);
            };

        };
    };

    
    async getProducts(){
        const fileName = this.path + "/products.json";
        if(!fs.existsSync(fileName)){
            console.log(`El archivo en el path "${fileName}" no existe`);
        } else {
            let contenido = await fs.promises.readFile(fileName, "utf-8");
            const productsRead = JSON.parse(contenido);
            return productsRead;
        };
    };

    async getProductById(id){

        const fileName = this.path + "/products.json";

        if(!fs.existsSync(fileName)){
            return("nonexistant");
        } else {
    
            let contenido = await fs.promises.readFile(fileName, "utf-8");
            const productsRead = await JSON.parse(contenido);

            const ids = [];

            productsRead.forEach((prod) => {
                ids.push(prod.id);
            });

            if (ids.includes(id)){
                const arrprod = productsRead.filter(prod => prod.id === id);
                const index = productsRead.indexOf(arrprod[0]);
                return productsRead[index];
            } else {
                return ("Not Found");
            };
        };
    };

    async updateProduct(reqId, requestBody){

        const fileName = this.path + "/products.json";

        if(!fs.existsSync(fileName)){
            return (`El archivo en el path ${fileName} es inexistente`);
        } else {
    
            let contenido = await fs.promises.readFile(fileName, "utf-8");
            const productsRead = await JSON.parse(contenido);
        
            const ids = [];
    
            productsRead.forEach((prod) => {
                ids.push(prod.id);
            });
    
            if (ids.includes(reqId)){

                if(!requestBody.title || !requestBody.description || !requestBody.price || !requestBody.thumbnail || !requestBody.code || !requestBody.stock || !requestBody.category){
                    return (`Por favor complete todos los campos obligatorios para actualizar el archivo`);
                }

                const arrprod = productsRead.filter(prod => prod.id === reqId);
                const index = productsRead.indexOf(arrprod[0]);
    
                productsRead[index].title = requestBody.title;
                productsRead[index].description = requestBody.description;
                productsRead[index].price = requestBody.price;
                productsRead[index].thumbnail = [requestBody.thumbnail];
                productsRead[index].code = requestBody.code;
                productsRead[index].stock = requestBody.stock;
                productsRead[index].category = requestBody.category;
    
                const productsStr = JSON.stringify(productsRead);
                await fs.promises.writeFile(fileName, productsStr);
            } else {
                return (`El producto con el id ${reqId} no existe`);
            };
        };

/*
        if(propChange === "id" || propChange !== "title" && propChange !== "description" && propChange !== "price" && propChange !== "thumbnail" && propChange !== "code" && propChange !== "stock"){

            console.log("El nombre del campo a modificar no existe, recuerde que el id no se puede modificar");
            
        } else {

            const fileName = this.path + "/products.json";

            if(!fs.existsSync(fileName)){console.log(`El archivo en el path "${fileName}" no existe`);};

            let contenido = await fs.promises.readFile(fileName, "utf-8");
            const productsRead = await JSON.parse(contenido);

            const ids = [];

            productsRead.forEach((prod) => {
                ids.push(prod.id);
            });

            if (ids.includes(id)){
                productsRead.forEach((prod) => {
                    if (prod.id === id){
                        prod[propChange] = content;
                    }
                });
                const productsStr = JSON.stringify(productsRead);
                await fs.promises.writeFile(fileName, productsStr);
            } else {
                console.log("Not Found");
            }
        }
        */
    }

    async deleteProduct(id){
        const fileName = this.path + "/products.json";
        let contenido = await fs.promises.readFile(fileName, "utf-8");
        const productsRead = await JSON.parse(contenido);

        const ids = [];

        productsRead.forEach((prod) => {
            ids.push(prod.id);
        });

        if (ids.includes(id)){

            productsRead.forEach((prod) => {
                if (prod.id === id){
                    let index = productsRead.indexOf(prod)
                    productsRead.splice(index, 1);
                }
            });
            const productsStr = JSON.stringify(productsRead);
            await fs.promises.writeFile(fileName, productsStr);
        } else {
            return (`El producto con el id ${id} no existe`);
        };
    };

};

export default ProductManager;
