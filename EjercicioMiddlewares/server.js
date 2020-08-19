const fs = require('fs');
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const { query } = require('express');
const server = express();

server.listen(3000, () => {
    console.log('Start Server...');
})

// middlewares

function writeLog(method, path, query, body) {
    let time = 'Fecha' + new moment().format('YYYY/MM/DD HH:mm:ss')
    return time + ': ' + method + ' ' + path + ' ' + query + ' ' + body + '\n';
}


function logger(req, res, next) {
    //console.log(req);
    const {query} = req.query;
    fs.appendFile('log.txt', writeLog(req.method, req.path, query, req.body), e => {
        if (e) throw e;
        console.log('eureka');
    })
    next();
}

server.use(logger)
server.use(bodyParser.json())

// routes
server.get('/demo', (req, res) => {
    res.json({ res: 'hola mundo' });
})

server.post('/contacto', (req, res) => {
    console.log(req.body);
    const body = req.body;
    if (body) {
        res.status(200)
        .send('Todo bien')
    } else {
        res.status(700)        
        .send('no body found')
    }
})
