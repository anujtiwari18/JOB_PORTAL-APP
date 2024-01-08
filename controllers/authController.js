//import userModel from "../models/userModel";

import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    //(req res) call back func
    //  try {
    // destructure
    const { name, email, password } = req.body
    // validate means check if dta is matching or not
    //if (!name) {
    //  return res.status(400).send({ success: false, message: 'please provide name' })
    // }
    if (!name) {
        next("name is required");
    }
    if (!email) {
        //    return res.status(400).send({ success: false, message: 'please provide emailname' })
        next("email is required");
    }
    if (!password) {
        //  return res.status(400).send({ success: false, message: 'please provide password' })
        next("password is required more than 6 character");
    }
    // same email again register then 
    const exisitingUser = await userModel.findOne({ email })
    if (exisitingUser) {
        return res.status(200).send({
            success: false,
            message: 'email is already ragister Please login'
        })
    }
    const user = await userModel.create({ name, email, password })
    //token
    const token = user.createJWT()
    res.status(201).send({
        sucess: true,
        message: 'user created succefully',
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        },
        token
    });

    //}// catch (error) {
    //console.log(error)
    //res.status(400).send({
    //  message: 'Error In Register Conntroler',
    //success: false,
    //error,
    //  })
    // next(error);
    //}


};
export const loginController = async (req, res, next) => {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
        next('Please provide All Fields')
    }
    // find user by email
    const user = await userModel.findOne({ email }).select("+password")
    //+password use for hiding password
    if (!user) {
        next('Invalid username or password')

    }
    // compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        next('Invalid username and password')
    }
    // hiding for password
    user.password = undefined;

    const token = user.createJWT()
    res.status(200).json({
        sucess: true,
        message: 'Login Sucessfully',
        user,
        token,

    });


};
