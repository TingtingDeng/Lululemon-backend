import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
// import {Request, Response} from "express";

// @ts-ignore
import routes from './route/index'
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import cors from 'cors';


const SERVER_PORT = 5000

createConnection()
    .then(async connection => {
        console.log('Connected to database')
//from typeorm, entrance function,打开数据库，链接数据库，若连接成功，会把连接数据成功的连接作为参数开始全局带过来。。。

        // create express app
        const app = express();
        //express is a backend node.js framework, provide http service
        // app.use(cors({
        //     allowedHeaders: ['Content-Type']
        // }));

        const cors=require("cors");
        app.use(cors())

        app.use(function(req, res, next) {
            // res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Origin", "http://localhost:3001");
            res.header('Access-Control-Allow-Methods', 'GET, PST, PUT, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });


        app.get('/', (req, res) => {
            res.send('Hello from Backend!');
        });

        app.use(bodyParser.json());
//插件

    // app.use('/', (req, res) => {
    //     console.log('received request:', req.params, req.query)
    //     const {name, phone, email} = req.query
    //     res.send(`hi backend server:), your name: ${name}, phone: ${phone}`)
    // })

        // register express routes from defined application routes
        // Routes.forEach(route => {
        //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        //         const result = (new (route.controller as any))[route.action](req, res, next);
        //         if (result instanceof Promise) {
        //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
        //
        //         } else if (result !== null && result !== undefined) {
        //             res.json(result);
        //         }
        //     });
        // });

        // setup express app here
        // ...

        app.use('/', routes)

        // start express server
        app.listen(SERVER_PORT);

        // insert new users for test
        // await connection.manager.save(connection.manager.create(User, {
        //     firstName: "Timber",
        //     lastName: "Saw",
        //     age: 27
        // }));
        // await connection.manager.save(connection.manager.create(User, {
        //     firstName: "Phantom",
        //     lastName: "Assassin",
        //     age: 24
        // }));

        console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

    }).catch(error => console.log(error));
