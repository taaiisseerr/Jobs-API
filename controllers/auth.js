const {StatusCodes} = require('http-status-codes')
const User = require ('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async(req, res) =>{
    //res.send('register route')
     const user = await User.create({...req.body})
     const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
}

const login = async(req, res) => {
    const {email, password} = req.body
    //console.log(req.body);  the thing is. login route when i check for true data or i make a wrong 
    // password it gives me err:{} this kind of error wherer he talked about in 7:50 idk but i will move forword
    

    if (!email || !password) {
        throw new BadRequestError('please provide email and password')
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: { name: user.name }, token})
}

module.exports = {register, login}