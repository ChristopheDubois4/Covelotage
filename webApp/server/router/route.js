import { Router } from "express";

const router = Router();

/**
 *  FRONTEND <-> BACKEND
 */

/** import all controllers */
import * as controller from '../controllers/userController.js'
import * as mapController from '../controllers/mapController.js'
import * as routeController from '../controllers/routeController.js';
import Auth, {localVariables} from '../middleware/auth.js';

/** POST Methods for Users*/
router.route('/register').post(controller.register); // register user
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app
router.route('/generateOTP').post(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
/** POST Methods for Routes */
router.route('/addroute').post(Auth, routeController.addRoute); // add route
router.route('/findMatches').post(Auth, mapController.findMatches); // find matches


/** GET Methods for Users */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
/** GET Methods for Routes */
router.route('/getroutes').get(Auth, routeController.getRoutes); // get user routes

/** PUT Methods for Users */
router.route('/updateUser').put(Auth, controller.updateUser); // update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); //  reset the password
/** PUT Methods for Routes */
router.route('/updateRoute').put(Auth, routeController.updateRoute); // update route

/** DELETE Methods for Routes */
router.route('/deleteRoute').delete(Auth, routeController.deleteRoute); // delete route


/**
 * BACKEND <-> MAP API PYTHON
 */

/** call the python API */
router.route('/shortestPath').post(mapController.shortestPath)


export default router;