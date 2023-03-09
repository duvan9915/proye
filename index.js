const expres = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const { patch } = require('./routes/index.js');
const path = require('path');

//initializations
const app = expres();
const PORT = 8080;

const connection = {
	host: 'bmeiwqnfwcrbpfkrzx1b-mysql.services.clever-cloud.com',
	user: 'uakrcgdwwmcoy5ct',
	password: 'l7NGlvQeLmar97Me8D8D',
	port: 3306,
	database: 'bmeiwqnfwcrbpfkrzx1b'  
};

//configuracion de cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//settings
app.set('port', PORT);

app.use(expres.urlencoded({extended:false}));
app.use(expres.json({extended:true}));
app.use(expres.static(path.join(__dirname, 'upload')))




//conexion a la DB
app.use(myConnection(mysql, connection, 'single'));

//global variables



//Routes
app.use('/',require('./routes/index.js'));


//public


//starting the server

app.listen(app.get('port'),()=>{
    console.log("server start" + app.get('port'));
})