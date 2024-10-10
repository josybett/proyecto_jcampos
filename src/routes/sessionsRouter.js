import { Router } from 'express'
import passport from 'passport'
import { sessionFailRegister, sessionRegister, sessionLogin, sessionFailLogin, sessionLogout, sessionCurrent } from '../controllers/sessionsController.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), sessionRegister);
router.get('/failregister', sessionFailRegister)
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), sessionLogin)
router.get('/faillogin', sessionFailLogin)
router.post('/logout', sessionLogout)
router.get('/current', passport.authenticate('jwt', { failureRedirect: '/faillogin' }), sessionCurrent)

export default router;