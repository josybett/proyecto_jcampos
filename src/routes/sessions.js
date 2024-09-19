import { Router } from 'express'
import passport from 'passport'
import { generateToken } from '../utils.js'

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
});

router.get('/failregister', async (req, res) => {
    res.send({ error: "Failed" })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
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
});

router.get('/faillogin', (req, res) => {
    res.send("Login fallido")
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

router.get('/current', passport.authenticate('jwt', { failureRedirect: '/faillogin' }), (req, res) => {
    res.send(req.user);
})

export default router;