import express from 'express'
import { router as productRouter } from './routes/productRouter.js';
import { router as cartsRouter } from './routes/cartRouter.js';
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
});