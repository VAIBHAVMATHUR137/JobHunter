import { NextFunction } from "express";
import { constants } from "../constants";
const errorHandler=(err:Error,req:Request,res:Response&{statusCode?:number},next:NextFunction)=>{
    const statusCode=res.statusCode?res.statusCode:500
    switch(statusCode){
        case constants.VALIDATION_ERROR:

        
    }
}