import { Router } from "express";

const router = Router();

/**
 *  FRONTEND - BACKEND
 */

/** import all controllers */
import * as controller from '../controllers/appController.js'
import * as mapController from '../controllers/mapApiController.js'
import Auth, {localVariables} from '../middleware/auth.js';
import {registerMail} from '../controllers/mailer.js'

/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app

/** GET Methods */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

/** PUT Methods */
router.route('/updateUser').put(Auth, controller.updateUser); // update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); //  reset the password


/**
 *  BACKEND - MAP API PYTHON
 */

/** test the python API */
router.route('/shortestPath').post(mapController.shortestPath)


export default router;