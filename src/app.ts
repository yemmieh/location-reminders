
import express, {Application, Request,Response,NextFunction } from 'express'
import { Container } from "inversify";
import winston from "winston";
import { interfaces, InversifyExpressServer } from "inversify-express-utils";
import { Errors } from "./interfaces/errors";

const app: Application = express();

const add =(a:number,b:number):number =>a+b;


app.listen(5000, () =>{
    console.log('server running')
})