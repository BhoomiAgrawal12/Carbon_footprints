const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware,generateToken} =require('./../jwt'); 
const User=require('./../models/user');


//Post route to add a User
router.post('/signup',async (req,res)=>{
   try{ 
    const data=req.body;  //Assuming the request body contains the User data

//create a new User document using the mongoose model
    const newUser= new User(data);

    //save the new user to the database
    const response=await newUser.save();
    console.log('data saved');

    const payload={
        id:response.id
    }
    console.log(JSON.stringify(payload));
const token= generateToken(payload);
console.log("Token is : ",token);

    res.status(200).json({response: response,token:token});
   }
   catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'})
   }
})


//Login route
router.post('/login',async(req,res)=>{
    try{
        //Extract username and password from request body
        const{AadharCardNumber,password}=req.body;

        //Find the user by AadharCardNumber
        const user =await User.findOne({AadharCardNumber:AadharCardNumber});

        //If user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        //generate token
        const payload={
            id:user.id
        }
        const token = generateToken(payload);

        //return token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal server error'});
    }
});

//Profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
const userData=req.user;
const userId = userData.id;
const user = await User.findById(userId);

res.status(200).json({user});
    }catch(err){
        res.status(500).json({error:'Internal server error'});
    }
});


//PUT operation
router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
    const userId= req.user; //Extract the Id from the token
    const {currentPassword,newPassword}=req.body //Extract current and new passwords from request body

    //Find the user by userId
    const user =await User.findById(userId);

//If password does not match, return error
if(!(await user.comparePassword(password))){
    return res.status(401).json({error: 'Invalid username or password'});
}

//Update the user's password
user.password=newPassword;
await user.save();

    console.log('Password updated');
    res.status(200).json({message: "Password Updated"});
    }catch(err){
        console.log(err);
    res.status(500).json({error: 'Internal server error'});
    }
})


 module.exports=router;