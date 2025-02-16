const mongoose = require("mongoose");

const AddInfoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        Income: {
            type: Number,
            required: true,
            min: 0,
        },
        Debt: {
            type: Number,
            required: true,
            min: 0
        },
        PortfolioValuation: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true,
    }
)

const AddInfo = mongoose.model("AddInfo", AddInfoSchema)