import UserModel from "../model/User.model.js"
// https://en.wikipedia.org/wiki/Bcrypt
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// Secret variable
import ENV from '../config.js'
// One time password
import otpGenerator from 'otp-generator';
// Mailer function to send the email 
import { sendMail } from '../utils/mailer.js';


/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error : "Can't find User!"});
        }
        next();

    } catch (error) {
        return res.status(404).send({ error : "Authentification Error"})
    }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {

    try {
        const {username, password, profile, email} = req.body;

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then(user => {
                    if(user) {
                        reject({ error : "AlreadyExisting", msg : "Username already exists"});
                    }
                    resolve();
            }).catch(err => reject({ error : "error", msg: "exist username findone error"}));
        });        

         // check the existing user
         const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email })
                .then(email => {
                    if(email) {
                        reject({ error : "AlreadyExisting", msg : "Email already exists"});
                    }
                    resolve();
            }).catch(err => reject({ error : "error", msg: "exist email findone error"}));
        });    

        Promise.all([existUsername, existEmail])
            .then(() => {  
                // check if the password in not empty
                if (!password)  {
                    return res.status(400).send({ error : "Don't have Password"})
                }
                bcrypt.hash(password, 10)
                    .then( hashedPassword => {
                        // create new user 
                        const user = new UserModel({
                            username,
                            password : hashedPassword,
                            profile : profile || '',
                            email
                        });
                        // save the user in the database
                        user.save()
                            .then(async result => {
                                // Create the email message to confirm the registration
                                const message = {
                                    body: {
                                        name: username,
                                        intro: 'Welcome to our service!',
                                        outro: 'Need help, or have questions? Placeholder'
                                    }
                                }
                                // Create the email subject
                                const subject = "Signup Successful";
                                // Send the email to the user
                                await sendMail(email, subject, message)
                                // Send the response to the client with a success message
                                res.status(201).send({ msg : "User register Successfully"});
                            })
                            .catch(error => res.status(500).send({error}))
        
                    }).catch(error => {
                        return res.status(500).send({
                            error : "Unable to hash password"
                        });
                    })       
        
            }).catch(err => {
                if (err.error === "AlreadyExisting") {
                    return res.status(201).send({ error : err.error, msg: err.msg });
                }
                return res.status(500).send({ err});
            })

    } catch (error) {
        return res.status(500).send(error);
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {

    const { username, password} = req.body;

    if(!password) {
        return res.status(400).send({ error : "Don't have Password"})
    }

    try {
        UserModel.findOne({ username })
            .then( user => {

                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) {
                            return res.status(401).send({
                                error: "Unauthorized",
                                message: "Invalid password."
                              });
                        }
                        
                        // create jwt token
                        const token = jwt.sign({
                            userId : user._id,
                            username : user.username
                        }, ENV.JWT_SECRET, {expiresIn : "24h"});

                        return res.status(200).send({
                            msg : "Login Successful...!",
                            username : user.username,
                            token
                        });
                    })
                    .catch(err => {
                        console.error("Error during password comparison:", err);
                        return res.status(500).send({
                            error: "Internal Server Error",
                            message: "An unexpected error occurred during login."
                        });
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"})
            })
        
    } catch (error) {
        return res.status(500).send({ error })
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    
    const { username } = req.params;
    // console.log(`username : ${username}`);
    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username })
        .then( user => {
                if(!user) return res.status(501).send({ error : "Couldn't Find the User"});
                
                /** remove password from user */
                // mongoose return unnecessary data with object so convert it into json
                const { password, ...rest } = Object.assign({}, user.toJSON());

                return res.status(201).send(rest);
            })
            .catch(err => {
                return res.status(500).send({ error : "exist username findone error"});
            });


    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "id" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    try {
        // Get the user ID from the request
        const { userId } = req.user;
        // If the user ID is not found, return an error
        if(!userId){ 
            return res.status(401).send({ error : "User Not Found...!"});
        }

        const body = req.body;

        UserModel.updateOne({ _id : userId }, body)
            .then( data => {                                    
                return res.status(201).send({ msg : "Record Updated...!"});
            })
            .catch(err => {
                return res.status(401).send({ error : "User Not Found...!"});
            });    

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** POST: http://localhost:8080/api/generateOTP 
 * @param: {
  "username" : "example123"
}
*/
export async function generateOTP(req, res) {

    try {
        /** MANAGE THE OPT */
        var otp = null;
        // generate an OTP only with numbers
        otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        // store the OTP in the app.locals
        req.app.locals.OTP = otp;

        /** SEND AN EMAIL */
        // get the username from the request
        const { username } = req.body;
        // If the username is not set, return an error
        if(!username) return res.status(501).send({ error: "Invalid Username"});
        // Find the user with the username for the email
        UserModel.findOne({ username })
            .then( async user => {
                // If the user is not found, return an error
                if(!user) return res.status(501).send({ error : "Couldn't Find the User"}); 
                // get the email from the user
                const { email } = Object.assign({}, user.toJSON());
                // Create the email message with the OTP
                const message = {
                    body : {
                        name: username,
                        intro : `Your Password Recovery OTP is ${otp}. Verify and recover your password.`,
                        outro: 'Need help, or have questions? Placeholder'
                    }
                }
                // Create the email subject
                const subject = "Password Recovery OTP";
                // Send the email with the OTP
                await sendMail(email, subject, message);
                // Send the response to the client with a success message
                res.status(201).send({})
            })
            .catch(err => {
                return res.status(500).send({ error : err});
            });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    // check the OTP is valid or not
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        // reset the OTP value
        req.app.locals.OTP = null;
        // start session for reset password
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

/** GET: http://localhost:8080/api/createResetSession 
 *  successfully redirect user when OTP is valid
*/
export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}

/** PUT: http://localhost:8080/api/resetPassword
 *  update the password when we have valid session
 */
export async function resetPassword(req, res) {
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username }, { password: hashedPassword})
                                .then( data => {
                                    req.app.locals.resetSession = false; // reset session
                                    return res.status(201).send({ msg : "Record Updated...!"})
                                });                                
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}