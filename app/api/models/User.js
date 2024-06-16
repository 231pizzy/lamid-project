import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    avatar:{type: String, default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="},
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: '' },
    birthday: { type: String, required: true },
    team: { type: Array, required: false, default: [] },
    projectGroup: { type: String, required: false, default: '' },
    projectGroupRole: { type: String, required: false, default: '' },
    projectColor: { type: String, required: false, default: '' },
    workExperience: { type: Array, required: false, default: [] },
    education: { type: Array, required: false, default: [] },
    languages: { type: Array, required: false, default: [] },
    fullName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    designation: { type: String, required: true },
    privileges: { type: Array, required: false, default: [] },
    skills: { type: Array, required: false, default: [] },
});

const User = mongoose.models?.Users || model('Users', userSchema)

const adminEmail = 'ikenna.isineyi@brilloconnetz.com'
const adminPassword = 'admin';

//Create admin acceount if it doesnt exist
User.find({ designation: 'admin' }).then(data => {
    if (!data?.length) {
        bcrypt.hash(adminPassword, Number(process.env.SALT), (err, hash) => {
            if (err) {
                console.log('hash err', err)
            }
            else {
                const admin = new User({
                    email: 'ikenna.isineyi@brilloconnetz.com',
                    password: hash,
                    role: 'Admin',
                    team: ['Management'],
                    designation: 'admin',
                    fullName: 'Admin Admin',
                    phone: '08124323223',
                    profilePicture: 'default.png',
                    birthday: '12/09/1950'
                })

                admin.save();
            }

        })
    }
})

export default User