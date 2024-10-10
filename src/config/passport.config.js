import passport from "passport";
import local from 'passport-local'
import { usersModel } from '../dao/models/userModel.js'
import { createHash, isValidPassword, generateToken, SECRETKEY } from '../utils.js'
import passportJWT from 'passport-jwt'
import { UserReadDTO, UserSaveDTO } from "../DTO/userDto.js";

const LocalStrategy = local.Strategy

const buscaToken = (req) => {
    let token=null

    if(req.cookies.coderCookie){
        token=req.cookies.coderCookie
    }

    return token
}

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            let user = await usersModel.findOne({ email: username })
            if (user) {
                console.log("El usuario existe")
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await usersModel.create(new UserSaveDTO(newUser))
            return done(null, result)
        } catch (error) {
            return done("Error al obtener el usuario" + error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id)
        done(null, user)
    })


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username })
            if (!user) {
                console.log("El usuario no existe")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("jwt", new passportJWT.Strategy(
        {
            secretOrKey:SECRETKEY,
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken])
        },
        async(contenidoToken , done)=>{
            try {
                console.log(contenidoToken)
                return done(null, contenidoToken)
            } catch (error) {
                return done(error)
            }
        }
    ))
}

export default initializePassport