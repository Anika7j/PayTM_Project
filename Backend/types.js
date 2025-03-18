const zod = require('zod');

const userschema = zod.object({
    username: zod.string().min(1).max(50),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(8),
})
const signinbody = zod.object({
    username: zod.string(),
    password: zod.string(),
})
const updateUser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

module.exports = {
    createUser: userschema,
    signin: signinbody,
    updateUser: updateUser
}