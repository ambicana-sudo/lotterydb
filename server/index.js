const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const reqFilter = require('./middleware/middleware.js')
const { resourceLimits } = require('worker_threads')
const port = 4000

app.use(bodyParser.json())
app.use(cors())

const uri = 'mongodb://localhost:27017/lotterydb'
const connect = async()=>{
	try{
		mongoose.connect(uri)
		console.log('Connected to mongodb')
	}
	catch(error){
		console.log('error')
	}
}
connect();

// userSchema
const userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	isWinner: {type: Boolean, default: false},
	lotteryNo: {type: Number, require: true}
},{
  	collection: 'users'
})

const User = mongoose.model('UserModel',userSchema)

// routes
// app.get('/participant', async(req, res)=>{
// 	try{
// 		console.log(req.body)
// 	}catch(error){
// 		console.log(error)
// 	}
// }) 

// user register route
app.post('/register', async(req, res)=>{
  try{
		console.log(req.body)
		const user = await User.create(req.body)

		// if you want to delete password form tha response
		// user = user.toObject()
		// delete user.password

		res.send(user)
  }catch(error){
		res.send(error)
  }
})

app.post('/login', async(req, res)=>{
	try{
		console.log(req.body) 
		if(req.body.email && req.body.password && req.body.lotteryNo){ // check if all the login field are filled
			let registerdUser = await User.findOne(req.body).select("-password") // use .select if you want to remove password fro the respond

			if(registerdUser){
				res.send(registerdUser)
			}else{
				res.json({message: "No user found"})
			}
		}else{
			res.json({message: "All fields are required. Complete the form!!"})
		}
		
	}catch(error){
		console.log(error)
	}
})

app.listen(port, () => {
  console.log(`Lottery app running on port ${port}`)
})