// code for creating server.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/userSchema');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

// connect to express app:
const app = express();


// middleware:
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// connect to mongodb database:
const port = process.env.PORT || 3001;

mongoose.connect(process.env.DB_URL)
.then(() => {
    app.listen(port, () => {
        console.log(`Server and mongodb is connected, ${port}!`)
    })
})
.catch((error) => {
    console.log('unable to connect!', error);
});


// load Routes:
app.use('/api', userRoutes);


// register user
app.post('/register', async (req, res) => {
    try{
        const {email, username, password} = req.body;
        // hash password to protect route:
        const hashPassword = await bcrypt.hash(password, 10);
        const isUserEmailExists = await User.findOne({email})
        const isUserNameExists = await User.findOne({username})
        if(isUserNameExists){
            return res.status(400).json({message: 'Username already exists!'});
        }
        if(isUserEmailExists){
            return res.status(400).json({message: 'Email already exists!'});
        }
        const newUser = new User({ email, username, password: hashPassword});
        await newUser.save();
        res.status(201).json({message: 'User created successfully!', value: newUser})
    }catch(err){
        res.status(500).json({error: 'Error signing up'})
    }
});

// get registered user:

app.get('/register', async(req, res) => {
    try{
        const users = await User.find(); // to get everything in User collection
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({error: 'Unable to get the users'})
    }
})

// post login user:

app.post('/login', async(req, res) => {
    try{
        const {username, password} = req.body;
        console.log(username);
        const user = await User.findOne({username});
        // if don't find the user
        if(!user){
           return res.status(401).json({ error: "User doesn't exists!"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ error: "invalid credentials"});
        }

        // if username and password is correct, then we'll make token:
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1hr'});
        res.status(200).json({ message: 'Login successful!', token})
    }catch(err){
        res.status(500).json({ error: 'Unable to sign in!'});
    }
})

// send email - nodemailer
// verify email with otp - pending 
// resend otp verification
// verified otp  - valid/success

