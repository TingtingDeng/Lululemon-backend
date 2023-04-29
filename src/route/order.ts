import {Router} from "express";
import {OrderController} from '../controller/OrderController'
const router=Router()

router.get("/",OrderController.all)
router.get("/:orderNo",OrderController.one)
router.post("/",OrderController.create)
router.put("/:orderNo",OrderController.update)
router.delete("/:orderNo",OrderController.delete)

// router.post('/create-pdf', OrderController.createPdf)
// router.get('/fetch-pdf/:orderNumber', OrderController.fetchPdf)

export default router
