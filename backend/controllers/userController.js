import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

import userModel from "../models/userModel.js";

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: `User ${user.email} doesn't exist!` })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: `Invalid credentials` })
        }

        const token = createToken(user._id)
        return res.json({ success: true, token: token, message: `Login successfully!` })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        // checking is user already registered
        const exist = await userModel.findOne({ email: email })
        if (exist) {
            return res.json({ success: false, message: `User already exists!` })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: `Please enter a valid email!` })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: `Please enter a strong password!` })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: `Error` });
    }
}




export { loginUser, registerUser }