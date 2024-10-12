import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true},
    purchase_datetime: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: { type: Number, required: true },
        }
      ]
    }
  },
  {
    timestamps: true,
  }
)

ticketSchema.pre("findOne", function(){
  this.lean()
})

ticketSchema.pre("find", function(){
  this.lean()
})

export const ticketModel = mongoose.model("tickets", ticketSchema)