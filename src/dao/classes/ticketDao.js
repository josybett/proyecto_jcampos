import { ticketModel } from "../models/ticketModel.js"
import { v4 as uuidv4 } from 'uuid';
import { logError } from "../../utils.js"

export class TicketDao {
  async createTicket(user, amount, products, sessionMongo) {
    try { 
      let [newTicket] = await ticketModel.create([{
          code: uuidv4(),
          purchaser: user.email,
          purchase_datetime: new Date(),
          amount,
          products
      }], { sessionMongo })
      console.log(newTicket)
      return newTicket
    } catch (error) {
      return logError('createTicket error mongoose: ', 500, error)
    }
  }

  async getByIdTicket(id) {
    try {
      const ticket = await ticketModel.findOne({_id: id}).populate('products.product', 'title price')
      return ticket
    } catch (error) {
      return logError('getByIdTicket error mongoose: ', 500, error)
    }
  }
}