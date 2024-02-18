import ENV from '../config.js'
import axios from 'axios';
import { getRevelentsRoutes } from '../database/req.js';
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


// Convert coordinates from strings to numbers
function parseCoordinates(coordinates) {
    return coordinates.map(coordinate => {
        const [lng, lat] = coordinate.replace('[', '').replace(']', '').split(',');
        return [parseFloat(lng), parseFloat(lat)];
    });
}

// Convert coordinates to strings 
function formatCoordinates(coordinates) {
    return coordinates.map(coord => `[${coord[0]},${coord[1]}]`);
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

        getRevelentsRoutes(req)
            .then((revelentsRoutes) => {
                console.log(" REEEEEEEEEEEEEEEEEEVELENTS ROUTES :");
                // if (!revelentsRoutes || revelentsRoutes.length === 0) {
                //     return res.status(404).send({ error: "Aucunes corresopondaces trouvée!" });
                // }

                console.log("revelentsRoutes : ", revelentsRoutes);

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

