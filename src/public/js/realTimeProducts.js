const socket = io();

const addProd = document.getElementById('createProd');

addProd.addEventListener('click', () => {

    const prod = {
        title : document.getElementById('title').value,
        description : document.getElementById('description').value,
        price : document.getElementById('price').value,
        thumbnail : document.getElementById('thumbnail').value,
        code : document.getElementById('code').value,
        stock : document.getElementById('stock').value,
        category : document.getElementById('category').value
    };

    socket.emit('addProd', prod);
    
});

const delProd = document.getElementById('deleteProd')

delProd.addEventListener('click', () => {

    const id = document.getElementById('deleteId').value;

    socket.emit('delProd', id);
})

socket.on('update', async (data) => {

    const container = document.getElementById('products');
    container.innerHTML=``;
    
        data.forEach( (prod)=> {

            let prodcontainer = document.createElement("div")
            prodcontainer.innerHTML = `
            <h4>Producto: ${prod.id}</h4>
            <ul>
                <li>Titulo: ${prod.title}</li>
                <li>Descripcion: ${prod.description}</li>
                <li>Precio: ${prod.price}</li>
                <li>Imagen: ${prod.thumbnail}</li>
                <li>Codigo: ${prod.code}</li>
                <li>Stock: ${prod.stock}</li>
                <li>Estado: ${prod.status}</li>
                <li>Categoria: ${prod.category}</li>
            </ul>
            `
            container.appendChild(prodcontainer);

        });

});