'use strict';

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

var Redis = require('ioredis');
var redis = new Redis({
    port: 16379,
    host: '127.0.0.1'
});

module. exports = {
    start: () => {
        server.use(morgan('dev'));
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true}));

        // motd

        server.get('/test', (req, res) => {
            redis.get('test').then(function(result) {
                res.json({
                    message: 'redis test',
                    result: result
                });
            });
        })
        
        server.get('/set/:key/:value', (req, res) => {
            redis.set(req.params.key, req.params.value).then((result) => {
                res.json({ key: req.params.key, value: result });
            })
        })
        
        server.get('/get/:key', (req, res) => {
            redis.get(req.params.key).then((result) => {
                res.json({ key: req.params.key, value: result })
            })
        })
        
        let port = process.env.port || 3000;
        server.listen(port, () => {
            console.log('... listening on port ' + port + ' ...');
        })
    }
}