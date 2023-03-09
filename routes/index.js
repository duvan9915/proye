const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificar = require('../controladores/verificar');
const login = require('../controladores/Login');
const registro = require('../controladores/registro');
const Listar = require('../controladores/visualizar');
const { examen } = require('../controladores/ActividadesExamen');
const { upload,uploadfile } = require('../controladores/upload');
const Admin = require('../controladores/Admin');
const { Trazabilidad, Logros } = require('../controladores/TrazabilidadLogros');

const routes = express.Router();



routes.get('/contra',(req,res)=>{
    const contrasena = "123";
	let contrasenaEncriptada = '';
	bcrypt.hash(contrasena, 10).then( async(hash) => {
		contrasenaEncriptada = await hash
        
         res.end(contrasenaEncriptada);
	}).catch((err) => {
        console.log(err)
		res.status(404).send('error al guardar la contraseña')
	})

   
})

routes.get('/prueba1',(req,res)=>{
  
    let consulta= `SELECT textocontenido FROM subcontenido WHERE idSubContenidoDetalle =79`;
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
    
            conn.query(consulta,(err,ress)=>{
                if(err){
                    console.log("error")
                }else{
                    console.log(ress)
                }
            })
        }
        
    })
})

routes.post('/login',login.login);



//Admin
routes.post('/registarAdminDocente',registro.docente);
routes.post('/registarAdminEstudiante',verificar.session,registro.estudiante);
routes.delete('/eliminarAdmin',verificar.session,registro.eliminar);


routes.put('/actualizar',registro.actualizar);

//Listar
routes.post('/Listar',Listar.tipo);
routes.post('/ListarUsuario',Listar.Correo);
routes.post('/ListarContenido',Listar.Contenido);
routes.post('/ListarSubContenido',Listar.SubContenido);
routes.post('/ListarSubContenidoCompleto',Listar.SubContenidoCompleto);
routes.post('/ListarSubContenidoAnteriorSiguente',Listar.SubContenidoAnterior,Listar.SubContenidoSiguente);
routes.post('/ListarExamenes',Listar.Examenes);
routes.post('/ListarPreguntas',Listar.Preguntas);
routes.post('/ListarPreguntasRespuestas',Listar.PreguntaRespuestas);
routes.post('/ListarCantidadExamenXEstudiante',verificar.session,Listar.ExamenesRespondidos);
routes.post('/ListarNotasxEstidante',verificar.session,Listar.NotasxEstidante);


//Actualizar
routes.put('/Update',Admin.UpdateDocente);
routes.put('/Update/Estudiante',Admin.UpdateEstudiante);
routes.put('/Update/Examen',examen.ModificarPreguntaExamen,examen.ModificarRespuestaExamen)

// validar
routes.post('/Calificar',verificar.session, examen.Calificar, Logros.insertExamen )
routes.post('/ValidarExamen',verificar.session,examen.ValidarExamen)
routes.post('/Calificaciones',verificar.session,examen.Calificaciones)

// Logros
routes.post('/ListarLogros',verificar.session,Logros.ListarLogros)
routes.post('/ListarLogrosDocente',verificar.session,Logros.ListarLogrosDocente)
routes.post('/ListarCantidadLogrosXEstudiante',verificar.session,Logros.ListarLogrosEstudiantes)

//trazabilidad and Logros
routes.post('/trazabilidad',verificar.session,Trazabilidad.validar ,Trazabilidad.insert, Logros.cantidadContenido, Logros.cantidadtrazabilidad, Logros.insert)
routes.post('/ListarCantidadTrazabilidadXEstudiante',verificar.session,Trazabilidad.Nsubcontido, Trazabilidad.ObtenerTrazabilidad)


//prueba 
routes.get('/prueba',verificar.session);
routes.post('/prueba',upload,uploadfile);

module.exports = routes;