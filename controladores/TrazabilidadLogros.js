
const Trazabilidad = {};
const Logros = {};

Trazabilidad.insert = (req, res, next) => {
    const {id:idusuario} = req.token
    const {body} = req;
    const {idContenido, idSubContenido} = body.datos;
    let consulta= `INSERT INTO trazabilidad(estudiante_usuario_Idusuario, SubContenido_Contenido_IdContenido, IdContenido) VALUES (${idusuario}, ${idSubContenido}, ${idContenido})`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad insert'})
                }else{
                    next();
                }
            })
        }
        
    })

}

Trazabilidad.Nsubcontido = (req, res, next) => {
    let consulta= `SELECT count(s.idSubContenidoDetalle) as NSubcontenido FROM subcontenido s`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad insert'})
                }else{
                    req.NSubcontenido = ress
                    console.log(req.NSubcontenido)
                    next();
                }
            })
        }
        
    })

}

Trazabilidad.ObtenerTrazabilidad = (req, res) => {
    let consulta= `SELECT u.NombreUsario, u.ApellidoUsuario , FORMAT((COUNT(estudiante_usuario_Idusuario) * 193 /100 ),2) as NTrazabilidad 
    FROM trazabilidad t 
    inner join usuario u on u.Idusuario = t.estudiante_usuario_Idusuario 
    GROUP by t.estudiante_usuario_Idusuario`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad insert'})
                }else{
                    res.status(200).json({ress});
                }
            })
        }
        
    })

}

Trazabilidad.validar = (req, res, next) => {
    const {id:idusuario} = req.token
    const {body} = req;
    const {idContenido,idSubContenido} = body.datos;
    let consulta= `SELECT 
                    CASE
                        when SubContenido_Contenido_IdContenido = ${idSubContenido} THEN true
                        when SubContenido_Contenido_IdContenido != ${idSubContenido} THEN false
                        ELSE false
                    END AS 'Validar'
                FROM trazabilidad 
                where estudiante_usuario_Idusuario = ${idusuario} 
                AND SubContenido_Contenido_IdContenido = ${idSubContenido}
                AND IdContenido = ${idContenido}`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    console.log("Validar")
                    res.status(404).send({registro:'error en la petición trazabilidad validar'})
                }else{
                    if(ress[0] != undefined){
                        if( ress[0].Validar ){
                            res.status(200).json(false);
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                    
                }
            })
        }
        
    })

}

Logros.cantidadContenido = (req, res, next) => {
    const {id:idusuario} = req.token
    const {body} = req;
    const {idContenido} = body.datos;
    let consulta= `
    SELECT COUNT(*) as ncontenido FROM subcontenido s
    WHERE s.Contenido_IdContenido = '${idContenido}'`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad cantidadContenido'})
                }else{
                    req.ncontenido = ress[0].ncontenido
                    next();
                }
            })
        }
        
    })

}

Logros.cantidadtrazabilidad = (req, res, next) => {
    const {id:idusuario} = req.token
    const {body} = req;
    const {idContenido} = body.datos;
    let consulta= `SELECT 
    COUNT(t.SubContenido_Contenido_IdContenido) as ntrazabilidad
    FROM trazabilidad t
    where T.IdContenido = ${idContenido}
    AND T.estudiante_usuario_Idusuario = '${idusuario}'`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad cantidadtrazabilidad'})
                }else{
                    req.ntrazabilidad = ress[0].ntrazabilidad
                    next();
                }
            })
        }
        
    })

}



Logros.insert = (req, res) => {
    const {ncontenido, ntrazabilidad} = req

    console.log("ncontenido " + ncontenido + " ntrazabilidad " + ntrazabilidad)
    if(ncontenido == ntrazabilidad){
        const {id:idusuario} = req.token
        const {body} = req;
        const {idContenido} = body.datos;
        let consulta= `
        INSERT INTO detalleslogros(estudiante_usuario_Idusuario, Logros_IdLogros) 
            VALUES (
                ${idusuario},
                (SELECT IdLogros FROM logros WHERE Contenido_IdContenido = ${idContenido} and Examen = false )
            )
        `;
    
        req.getConnection((err,conn)=>{
            if(err){
                res.status(404).send({registro:'error en la Conexión'})
            }else{
                conn.query(consulta,(err,ress)=>{
                    if(err){
                        res.status(404).send({registro:'error en la petición'})
                    }else{
                        res.status(200).json(true);
                    }
                })
            }
            
        })
    }else{
        res.status(200).json(false);
    }
    
}

Logros.insertExamen = (req, res) => {
    const {ncontenido, ntrazabilidad} = req
    const {body, idusuario, nota, aprobo} = req;
    const {dato} = body;
    const {id:idexamen} = dato.idexamen;
    let consulta= `
    INSERT INTO detalleslogros(estudiante_usuario_Idusuario, Logros_IdLogros) 
        VALUES (
            ${idusuario},
            (SELECT IdLogros FROM logros WHERE Contenido_IdContenido = (SELECT Contenido_IdContenido FROM examen WHERE Idexamen = ${idexamen})  and Examen = true )
        )
    `;

    if(aprobo){
        req.getConnection((err,conn)=>{
            if(err){
                res.status(404).send({registro:'error en la Conexión'})
            }else{
                conn.query(consulta,(err,ress)=>{
                    if(err){
                        res.status(404).send({registro:'error en la petición Logro'})
                    }else{
                        res.status(200).json({
                            nota
                        })
                    }
                })
            }
            
        })
    }else{
        res.status(200).json({
            nota
        })
    }
    
    
    
}

Logros.ListarLogrosDocente = (req, res) => {
    const {body} = req;
    const {id} = body.datos;
    let consulta= `SELECT l.IdLogros FROM detalleslogros d
    inner join logros l on l.IdLogros = d.Logros_IdLogros
    where d.estudiante_usuario_Idusuario = '${id}'`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad Listar logros'})
                }else{
                    res.status(200).json({ress});
                }
            })
        }
        
    })

}

Logros.ListarLogros = (req, res) => {
    const {id:idusuario} = req.token
    let consulta= `SELECT l.IdLogros FROM detalleslogros d
    inner join logros l on l.IdLogros = d.Logros_IdLogros
    where d.estudiante_usuario_Idusuario = '${idusuario}'`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad Listar logros'})
                }else{
                    res.status(200).json({ress});
                }
            })
        }
        
    })

}

Logros.ListarLogrosEstudiantes = (req, res) => {
    let consulta= `select d.estudiante_usuario_Idusuario ,u.NombreUsario, u.ApellidoUsuario ,COUNT(d.Logros_IdLogros) AS NCantidad 
    from detalleslogros d 
    inner join usuario u on u.Idusuario = d.estudiante_usuario_Idusuario 
    GROUP by d.estudiante_usuario_Idusuario`;
    
    req.getConnection((err,conn)=>{
        if(err){
            res.status(404).send({registro:'error en la Conexión'})
        }else{
            conn.query(consulta,(err,ress)=>{
                if(err){
                    res.status(404).send({registro:'error en la petición trazabilidad Listar logros'})
                }else{
                    res.status(200).json({ress});
                }
            })
        }
        
    })

}

module.exports = {
    Trazabilidad, 
    Logros
};