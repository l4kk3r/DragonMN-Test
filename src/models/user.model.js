const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const saltRounds = 10

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        select: false,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(user.password, saltRounds)
    user.password = hashedPassword
    next();
});

userSchema.methods.comparePassword = async function(password) {
    const hashedPassword = this.password
    const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword)
    return isPasswordCorrect
};

mongoose.model("User", userSchema)