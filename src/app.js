import express from 'express'
import handlebars from 'express-handlebars'
import { router as viewsRouter } from './routes/viewsRouter.js'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import { router as productRouter } from './routes/productsRouter.js'
import { router as cartsRouter } from './routes/cartsRouter.js'
import mongoose from 'mongoose'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import sessionsRouter from './routes/sessionsRouter.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import FileStore from 'session-file-store'
import { config } from './config/config.js'

const fileStorage = FileStore(session)

const PORT = config.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// passport
app.use(cookieParser())
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        ttl: 15,
    })
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//configurar Handlebars para leer el contenido de los endpoints
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/products', passport.authenticate('jwt', { failureRedirect: '/faillogin' }), productRouter)
app.use('/api/carts', passport.authenticate('jwt', { failureRedirect: '/faillogin' }), cartsRouter)
app.use('/', viewsRouter)
app.use('/api/sessions', passport.authenticate('jwt', { failureRedirect: '/faillogin' }), sessionsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`))
export const socketServer = new Server(httpServer)
socketServer.on("connect", () => {
    console.log(`Cliente conectado`)
})

// export default socketServer

try {
    await mongoose.connect(config.MONGO_URL)
    console.log('DB conectada')
    
} catch (error) {
    console.log(error)
}