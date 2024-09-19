import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const SECRETKEY = "JosyCamposCoder"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const logError = ($prexLog, code, error) => {
    console.log($prexLog, error.message)
    return {
        'success': false,
        'code': code,
        'message': `Ha ocurrido un error inesperado, intente más tarde`,
        'messageError': `: ${error.message}`,
    }
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => jwt.sign(user, SECRETKEY)