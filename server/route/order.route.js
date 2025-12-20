import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe, UPIOrderController, VerifyUPIPaymentController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.post('/upi',auth,UPIOrderController)
orderRouter.put('/upi-verify',auth,VerifyUPIPaymentController)
orderRouter.get("/order-list",auth,getOrderDetailsController)

export default orderRouter