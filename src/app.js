import express from 'express'
import handlebars from 'express-handlebars'
// import { router as productRouter } from './routes/productRouter.js'
// import { router as cartsRouter } from './routes/cartRouter.js'
import { router as viewsRouter } from './routes/viewsRouter.js'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import { router as productRouter } from './routes/productsRouter.js'
import { router as cartsRouter } from './routes/cartsRouter.js'
import mongoose from 'mongoose'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import sessionsRouter from './routes/sessions.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import FileStore from 'session-file-store'

const fileStorage = FileStore(session)

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

app.use(cookieParser())
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://josycamgon:BohG2TFXz7D0ogDJ@atlascluster.jpwmt.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster',
        ttl: 15,
    })
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/sessions', sessionsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`))
export const socketServer = new Server(httpServer)
socketServer.on("connect", () => {
    console.log(`Cliente conectado`)
})

// export default socketServer

try {
    await mongoose.connect('mongodb+srv://josycamgon:BohG2TFXz7D0ogDJ@atlascluster.jpwmt.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster')
    // await mongoose.connect('mongodb+srv://<USUARIO>:<CLAVE>@cluster0.3lvxg2p.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce')
    console.log('DB conectada')
    
} catch (error) {
    console.log(error)
}
