import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        role: { type: String, default: 'user' }
    }, {
        timestamps: true,
    }
)

userSchema.pre("find", function() {
    this.lean()
})

userSchema.pre("findOne", function() {
    this.lean()
})

export const usersModel = mongoose.model("users", userSchema)