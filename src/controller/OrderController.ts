import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";
import {Err,errCode, errMsg} from "../helper/Err";
import {validate} from "class-validator";
import { OrderStatus } from "../entity/OrderStatus";


// const pdf = require('html-pdf')
// const fs = require('fs')
// const pdfTemplate = require('../documents')

export class OrderController {
    public static get repo(){
        return getRepository(Order)
    }

    public static get orderStatusRepo(){
        return getRepository(OrderStatus)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let orders=[]
        try{
            orders=await OrderController.repo.find()

        }catch(e){
            return response.status(400).send(new Err(errCode.E400,errMsg.Fail,e))
        }
        return response.status(200).send(new Err(errCode.E200,errMsg.OK,orders))
    }

  static  async one(request: Request, response: Response, next: NextFunction) {
    let {orderNo}=request.params
    if(!orderNo){
        return response.status(404).send(new Err(errCode.E404,errMsg.Missing,null))
    }
    let order=null
    try{
        order= await OrderController.repo.findOneOrFail({where:{orderNo:orderNo}})
    }catch(e){
        return response.status(400).send(new Err(errCode.E400,errMsg.Fail,e))
    }
      return response.status(200).send(new Err(errCode.E200,errMsg.OK,order))
    }

   static async create(request: Request, response: Response, next: NextFunction) {
    const orderstatus=await OrderController.orderStatusRepo.findOne({name:'New'})
       const {orderItems, totalAmount, userEmail, taxRate,orderNumber,shippingAddress} = request.body
       let order = new Order()
       order.orderItems =orderItems
       order.totalAmount = totalAmount
       order.taxRate = taxRate
       order.userEmail=userEmail
       order.orderStatus=orderstatus
       order.orderNumber=orderNumber
       order.shippingAddress=shippingAddress
       let errors = await validate(order)
       console.log('order--->',order)
       if (errors.length > 0) {
           return response.status(400).send(new Err(errCode.E404, errMsg.Missing, null))
       }

      try{ await OrderController.repo.save(order)}catch(e){
          return response.status(404).send(new Err(errCode.E400, errMsg.Fail, e))
      }
       return response.status(200).send(new Err(errCode.E200,errMsg.OK,order))
   }

   static async update(request: Request, response: Response, next: NextFunction) {
    let {orderNo}=request.params
    if(!orderNo){
        return response.status(404).send(new Err(errCode.E404,errMsg.Missing,null))
    }
    let order=null
    try{
        let order= await OrderController.repo.findOne({where:{orderNo:orderNo}})
        // console.log('order1--->', order)
        const orderstatus=await OrderController.orderStatusRepo.findOne({name:'Paid'})
        // order.orderStatus=orderstatus
        // console.log('order2--->',order)
        await OrderController.repo.save(order)
    }catch(e){
        return response.status(400).send(new Err(errCode.E400,errMsg.Fail,e))
    }
    return response.status(200).send(new Err(errCode.E200,errMsg.OK,order)) 
    }

   static async delete(request: Request, response: Response, next: NextFunction) {
       return response.status(200).send('good')

    }
    // static async createPdf (request: Request, response: Response, next: NextFunction) {
    //     console.log('generate pdf')
    //     const {order} = request.body
    //     try {
    //         pdf.create(pdfTemplate(order), {
    //             "header": {
    //                 "height": "15mm",
    //             }
    //         }).toFile(`./src/documents/download/${order.orderNumber}.pdf`, (error) => {
    //             if (error) {
    //                 response.send(Promise.reject())
    //             }
    //             response.send(Promise.resolve())
    //         })
    //     } catch (error) {
    //         return response.status(400).send('fail to generate pdf')
    //     }
    // }
    //
    // // fetch and send pdf
    // static async fetchPdf (request: Request, response: Response, next: NextFunction) {
    //     console.log('fetch pdf')
    //     const {orderNumber} = request.params
    //     try {
    //         response.sendFile(`d:/learning/project/e-commerce-backend/src/documents/download/${orderNumber}.pdf`)
    //     } catch (error) {
    //         return response.status(400).send('fail to download pdf')
    //     }
    //     // return response.status(200).send(new Status(HttpCode.E200, StatusStr.OK, null))
    // }




}