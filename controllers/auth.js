const { response } = require("express");
const bycript = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");



const CrearUsuario = async (req, res = response) => {
    
    const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        if( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bycript.genSaltSync();
        usuario.password = bycript.hashSync(password, salt);

        
        await usuario.save();

        //Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario, 
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador.'
        });
    }
    
    
}


const Login = async (req, res = response)=>{

    const {email, password} = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({email});
        if( !usuaioDB){
            return res.status(400).json({
                ok:false,
                msg: 'Email no encontrado'
            });
        }
        //VALIDAD LA CONTRASEÑA
        const validPassword = bycript.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'La contraseña es incorrecta'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB, 
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador.'
        });
    }

}

const renewToken = async( req, res = response) => {

    const uid = req.uid;

    //Generar el JWT
    const token = await generarJWT( uid);
    //Obtener el usuario por su id desde la DB
    const usuario = await Usuario.findById(uid);

    
    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports ={
    CrearUsuario,
    Login,
    renewToken

}