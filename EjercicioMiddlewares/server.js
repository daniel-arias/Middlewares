const fs = require('fs');
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const server = express();

server.listen(3000, () => {
    console.log('Start Server...');
})

const contactos = []

// middlewares

function writeLog(method, path, query, body) {
    let time = 'Fecha' + new moment().format('YYYY/MM/DD HH:mm:ss')
    return time + ': ' + method + ' ' + path + ' ' + query + ' ' + body + '\n';
}


function logger(req, res, next) {
    const {method, query, path, body} = req;
    fs.appendFile('log.txt', writeLog(method, path, JSON.stringify(query), JSON.stringify(body)), e => {
        if (e) throw e;
        console.log('eureka');
    })
    next();
}

function ContactosVerifier(req, res, next)
{
    const {nombre, apellido, email} = req.body;
    if(contactos.find(contacto => contacto.email === email ))
    {
        res.status(400)
        .send('contacto already exists');
    }
    else
    {        
        console.log('paso ContactosVerifier');
        next();
    }
}

function BodyVerifier(req, res, next)
{
    const {nombre, apellido, email} = req.body;
    if (!nombre || !apellido || !email) {
        res.status(400)
        .send('missing info in body')
    } else {
        console.log('paso BodyVerifier');
        next();
    }
}

function DemoVerifier(req, res, next)
{
    const {version} = req.query;
    if (version && isNaN(parseInt(version)) && version < 5) {
        res.status(400)
        .send('missing info in body')
    } else {
        console.log('paso BodyVerifier');
        next();
    }
}


server.use(bodyParser.json())
server.use(logger)

// routes
server.get('/demo',DemoVerifier, (req, res) => {
    res.json({ res: 'hola mundo' });
})

server.post('/contacto', BodyVerifier,ContactosVerifier , (req, res) => {
    contactos.push(req.body)
    contactos.forEach(contacto => console.log(contacto.nombre));
    res.status(200)
    .send('all good')
})
