import { Router } from "express";

const router = Router();

/**
 *  FRONTEND <-> BACKEND
 */

/** import all controllers */
import * as controller from '../controllers/userController.js'
import * as mapController from '../controllers/mapApiController.js'
import * as appController from '../controllers/appController.js';
import Auth, {localVariables} from '../middleware/auth.js';
import {registerMail} from '../controllers/mailer.js'

/** POST Methods for Users*/
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app
/** POST Methods for Routes */
router.route('/addroute').post(Auth, appController.addRoute); // add route

/** GET Methods for Users */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
/** GET Methods for Routes */
router.route('/getroutes').get(Auth, appController.getRoutes); // get user routes

/** PUT Methods for Users */
router.route('/updateUser').put(Auth, controller.updateUser); // update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); //  reset the password
/** PUT Methods for Routes */
router.route('/updateRoute').put(Auth, appController.updateRoute); // update route

/** DELETE Methods for Routes */
router.route('/deleteRoute').delete(Auth, appController.deleteRoute); // delete route


/**
 * BACKEND <-> MAP API PYTHON
 */

/** call the python API */
router.route('/shortestPath').post(mapController.shortestPath)


export default router;