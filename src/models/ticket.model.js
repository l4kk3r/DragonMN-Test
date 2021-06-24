const mongoose = require('mongoose')

const { Schema } = mongoose

const cellSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['opened', 'closed'],
        default: 'closed'
    },
    value: {
        type: Number,
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    _id: false,
    timestamps: false,
    versionKey: false
})

mongoose.model("Cell", cellSchema)

const ticketSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prize: {
        type: Number,
        enum: [20, 30, 50, 100, 200],
        required: true
    },
    prizeCombination: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'active', 'ended'],
        default: 'new'
    },
    cells: [cellSchema]
}, {
    timestamps: true,
    versionKey: false
})

mongoose.model("Ticket", ticketSchema)