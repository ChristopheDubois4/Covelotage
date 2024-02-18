import ENV from '../config.js'
import axios from 'axios';
import { getRevelentsRoutes } from '../database/req.js';

import { 
    parseCoordinates, 
    formatCoordinates, 
    compareUserRouteWithRelevantRoutes 
} from '../utils/algorithm.js';

axios.defaults.baseURL = ENV.MAP_API_URI;


/** POST: http://localhost:7777/shortestPath 
 * @body : {
    points: [ '[133,295]', '[121,252]' ]
}
*/
export async function shortestPath(req, res) {

    try {
        // Parse the coordinates from the request body
        const points = parseCoordinates(req.body.points);
        // Call openrouteservice API to get the shortest path
        const response = await axios.post(
            `/v2/directions/cycling-regular/geojson`, {
                coordinates: points
            }, {
                headers: {
                    'Authorization': `Bearer ${ENV.APIKey}`
                }
            }); 
        // Format the coordinates to strings
        const routeCoordinates = formatCoordinates(response.data.features[0].geometry.coordinates);
        // Send the response back to the client
        return res.status(201).send({data : routeCoordinates})

    } catch (error) {
        return res.status(500).send(error);
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
        // Get the user route from the request body
        const userRoute = req.body; 

        // Get the relevant routes from the database 
        const relevantRoutes = await getRevelentsRoutes(req);

        // Calcilate the similarities between the user route and the relevant routes
        const similarities = await compareUserRouteWithRelevantRoutes(userRoute, relevantRoutes,0);

        //console.log("SIMILARITIES : ", similarities);
        // Return the similarities to the client
        res.status(200).json({ similarities });     

    } catch (error) {
        return res.status(500).send(error);
    }
}


