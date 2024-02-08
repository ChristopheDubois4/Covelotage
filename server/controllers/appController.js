import RouteModel from "../model/Route.model.js";
import UserModel from "../model/User.model.js";
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


/**
 * POST: http://localhost:8080/api/findMatches
 * @param: {
 *   "name": "Route1",
 *   "route": ["[6.149824,48.650483]", "[6.150334,48.650811]", ...],
 *   "planning": {
 *       "dates": [2023-12-07, ...],
 *       "periodic": [{"dayOfWeek": 1, "time": "08:35"}, ...]
 *   }
 * }
 */
export async function findMatches(req, res) {
    try {

        await getRevelentsRoutes(req)
            .then((revelentsRoutes) => {
                // if (!revelentsRoutes || revelentsRoutes.length === 0) {
                //     return res.status(404).send({ error: "Aucunes corresopondaces trouvée!" });
                // }

                // Déclaration de la liste de routes
                const routes = [];

                // Parcours de chaque élément de la liste et extraction de la propriété "route"
                revelentsRoutes.forEach(item => {
                    routes.push(item.route);
                });
                console.log(routes)

                res.status(201).send(revelentsRoutes);


                // axios.post('/findMatches', routes)
                //     .then((response) => {
                //         console.log(response);
                //         res.status(201).send("OK");
                //     })
                // .catch(error => {
                //     // Gestion des erreurs
                //     console.error("Erreur lors de l\'envoi des données à l\'API Python :", error);
                //   });
            })
            .catch(error => {
                // Gestion des erreurs
                console.error("Erreur lors de l\'envoi des données à l\'API Python :", error);
              });


    } catch (error) {
        res.status(500).json({ error });
    }
}


async function getRevelentsRoutes(req) {

    try {
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const {planning } = req.body;
        // Extract dates and periodic details
        const { dates: user_dates, periodic: user_periodic } = planning;
        
        // Time difference to search for matches (in minutes)
        const dt = 10;
        // number of days to search for matches 
        const nbDays = 30;

        let revelentsRoutes = [];

        if (user_dates.length > 0) {

            // Condition between user_dates and dates
            let dateDate = user_dates.map(date => {
                // convert the date string to a date object
                let dateObj = new Date(date);
                // set the start date
                let startDate = new Date(dateObj); 
                startDate.setMinutes(startDate.getMinutes() - dt);
                // set the end date
                let endDate = new Date(dateObj); 
                endDate.setMinutes(endDate.getMinutes() + dt); 
                // return the date range
                return {
                    'planning.dates': {
                        $elemMatch: {
                            $gte: startDate,
                            $lte: endDate 
                        }
                    }
                };
            });

            // Condition between user_periodic and periodic
            // ...
            // Condition between user_periodic and dates
            // ...
            // Condition between user_dates and periodic
            // ...
        
            
            const dateMatches = await RouteModel.find({
                username: { $ne: username }, 
                $or: dateDate
            });
            
            revelentsRoutes.push(...dateMatches);
        }
        
        return revelentsRoutes;
    } catch (error) {
        throw error;
    }

}
