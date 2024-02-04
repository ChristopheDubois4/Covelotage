import RouteModel from "../model/Route.model.js";
import UserModel from "../model/User.model.js";

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
 *   "username": "example123",
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
              
        const { username, name, newRoute, newPlanning } = req.body;

        const route = await RouteModel.findOne({ username, name });
        if (!route) {
            return res.status(404).send({ error: "Route not found!" });
        }

        route.route = newRoute || route.route;
        route.planning = newPlanning || route.planning;

        route.save()
            .then(() => res.status(201).send({ msg: "Route updated successfully!" }))
            .catch((error) => res.status(500).send({ error }));
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * DELETE: http://localhost:8080/api/deleteRoute
 * @param: {
 *   "username": "example123",
 *   "name": "Route1"
 * }
 */
export async function deleteRoute(req, res) {
    try {
              
        const { username, name } = req.body;

        const route = await RouteModel.findOneAndDelete({ username, name });
        if (!route) {
            return res.status(404).send({ error: "Route not found!" });
        }

        return res.status(201).send({ msg: "Route deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * GET: http://localhost:8080/api/getroutes/example123
 */
export async function getRoutes(req, res) {
    try {
              
        const { username } = req.params;

        const routes = await RouteModel.find({ username });
        if (!routes || routes.length === 0) {
            return res.status(404).send({ error: "No routes found for the user!" });
        }

        const routeCoordinates = routes.map((route) => route.route);
        return res.status(200).send(routeCoordinates);
    } catch (error) {
        return res.status(500).send({ error });
    }
}
