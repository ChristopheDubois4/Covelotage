import UserModel from "../model/User.model.js"
// https://en.wikipedia.org/wiki/Bcrypt
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// Secret variable
import ENV from '../config.js'
// One time password
import otpGenerator from 'otp-generator';


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
        // console.log(`username : ${username}`);
        // console.log(`password : ${password}`);
        // console.log(`email : ${email}`);

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
        
                        const user = new UserModel({
                            username,
                            password : hashedPassword,
                            profile : profile || '',
                            email
                        });
        
                        // return save result as a response
                        user.save()
                            .then(result => res.status(201).send({ msg : "User register Successfully"}))
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
    // console.log(`username : ${username}`);
    // console.log(`password : ${password}`);

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

        const { userId } = req.user;

        if(userId){
            const body = req.body;

            UserModel.updateOne({ _id : userId }, body)
                .then( data => {                                    
                    return res.status(201).send({ msg : "Record Updated...!"});
                })
                .catch(err => {
                    return res.status(401).send({ error : "User Not Found...!"});
                });

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    // generate an OTP only with numbers
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        console.log("OTP : ", req.app.locals.OTP )
        res.status(201).send({})
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
  
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
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