/*
    path: api/login
*/ 

const {Router} =require('express');
const { check } = require('express-validator');

const { CrearUsuario, Login, renewToken } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new',[
    check('nombre', 'El nombre es obligatorio compa!').not().isEmpty(),
    check('email', 'El correo es obligatorio compa!').isEmail(),
    check('password', 'La contra es obligatorio compa, o le van a ver todo!').not().isEmpty().isLength({ min: 5 }),
    validarCampos
], CrearUsuario);

router.post('/',[
    check('email', 'Correo invalido!').isEmail(),
    check('password', 'La contraseña es invalida!').not().isEmpty(),
    validarCampos
],Login);

router.get('/renew',validarJWT,renewToken);






module.exports = router;