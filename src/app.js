import express from 'express'
import handlebars from 'express-handlebars'
import { router as productRouter } from './routes/productRouter.js'
import { router as cartsRouter } from './routes/cartRouter.js'
import { router as viewsRouter } from './routes/viewsRouter.js'
import __dirname from './utils.js'
import { Server } from 'socket.io'

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//configurar Handlebars para leer el contenido de los endpoints
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`))
export const socketServer = new Server(httpServer)
socketServer.on("connect", () => {
    console.log(`Cliente conectado`)
})

// export default socketServer