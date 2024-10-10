import passport from 'passport'
import { generateToken } from '../utils.js'
import { UserReadDTO } from '../DTO/userDto.js'

export const sessionRegister = async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
}

export const sessionFailRegister = async (req, res) => {
    res.send({ error: "Failed" })
}

export const sessionLogin = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales invalidas" })

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    let token = generateToken(req.user)
    res.cookie("coderCookie", token, {maxAge:1000*60*60, httpOnly:true})
    res.send({ status: "success", payload:  token})
}

export const sessionFailLogin = (req, res) => {
    res.send("Login fallido")
}

export const sessionLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
}

export const sessionCurrent = (req, res) => {
    const user = new UserReadDTO(req.user)
    res.send(user);
}