const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect('Enter your key')



let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));




const UserSchema = new Schema({
    username: {type:String,required:true},
    firstName: {type:String,required:true},
    lastName: {type:String},
    Password: {type:String,required:true}
})
const AccountSchema = new Schema({
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    balance: {type:Number,required:true}
})
const User = mongoose.model('User',UserSchema)
const Account = mongoose.model('Account',AccountSchema)
module.exports = {
    User,
    Account
}
