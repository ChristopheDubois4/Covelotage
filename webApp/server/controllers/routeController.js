import RouteModel from "../model/Route.model.js";
import ENV from '../config.js'
import axios from 'axios';

axios.defaults.baseURL = ENV.MAP_API_URI;

/**
 * POST: http://localhost:8080/api/addroute
 * @param: {
 *   "name": "Route1",
 *   "route": ["[6.149824,48.650483]", "[6.150334,48.650811]", ...],
 *   "planning": {
 *       "dates": [2023-12-07, ...],
 *       "periodic": [{"dayOfWeek": 1, "time": "08:35"}, ...]
 *   }
 * }
 */
export async function addRoute(req, res) {
    try {
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const {name, route, planning } = req.body;
        // verify if the route don't exist
        const exitingRoute = await RouteModel.findOne({ username, name });
        if (exitingRoute) {
            return res.status(401).send({ error: "Choisissez un nom unique" });
        }
        // Create a new route object using the RouteModel schema
        const newRoute = new RouteModel({
            username,
            name,
            route,
            planning,
        });
        // Save the new route to the database
        newRoute.save()
            .then(() => {res.status(201).send({ msg: "Route added successfully!" })})
            .catch((error) => {res.status(500).send({ error });});
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * PUT: http://localhost:8080/api/updateRoute
 * @param: {
 *   "name": "Route1",
 *   "newRoute": ["[updated coordinates]", ...],
 *   "newPlanning": {
 *       "dates": ["updated date", ...],
 *       "periodic": [{"dayOfWeek": 1, "time": "updated time"}, ...]
 *   }
 * }
 */
export async function updateRoute(req, res) {
    try {
              
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const {name, route, planning } = req.body;

        // verify if the route exist
        const exitingRoute = await RouteModel.findOne({ username, name });

        if (!exitingRoute) {
            return res.status(404).send({ error: "Route non trouvée!" });
        }

        exitingRoute.route = route;
        exitingRoute.planning = planning;

        exitingRoute.save()
            .then(() => res.status(201).send({ msg: "Route updated successfully!" }))
            .catch((error) => res.status(500).send({ error }));
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * DELETE: http://localhost:8080/api/deleteRoute
 * @param: {
 *   "name": "Route1"
 * }
 */
export async function deleteRoute(req, res) {
    try {

        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body              
        const name = req.body.name;
        // delete the route from the database 
        const route = await RouteModel.findOneAndDelete({ username, name });
        if (!route) {
            return res.status(404).send({ error: "Route non trouvée" });
        }

        return res.status(201).send({ msg: "Route deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * GET: http://localhost:8080/api/getroutes
 */
export async function getRoutes(req, res) {
    try {

        // Get the username from the token
        const username = req.user.username;
        // get all the routes for the user
        const routes = await RouteModel.find({ username });
        if (!routes || routes.length === 0) {
            return res.status(404).send({ error: "No routes found for the user!" });
        }

        return res.status(200).send(routes);
    } catch (error) {
        return res.status(500).send({ error });
    }
}

