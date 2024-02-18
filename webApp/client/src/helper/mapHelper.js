import axios from 'axios';
// library tfo advanced geospatial analysis 
import * as turf from '@turf/turf';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** 
 * Manage map 
 */

/** get the shortest path between 2 points */
export async function getShortestPath(userPoints) {
    try {
        // formate the points
        const formatedPoints = userPoints.map(point => JSON.stringify([point.lng, point.lat]));
        // send the points to the server
        // const { data : { points }} =  await axios.post(`/api/shortestPath`, { points : formatedPoints })

        const r =  await axios.post(`/api/shortestPath`, { points : formatedPoints })
        const { data : { data }} = r;

        console.log('\n\n r', r);

        // transform the points to a list of points [lat, lng]
        const transformedPoints = data.map(point => {
            const [lng, lat] = JSON.parse(point);
            return [lat, lng];
        });

        return Promise.resolve(transformedPoints);
    } catch (error) {
        return Promise.reject({ error : "Servor error : distance could not be calculated"});
    }
}

// function to find matches for a route
export async function findMatches(routeData) {
    try {
        // get the token from the local storage
        const token = await localStorage.getItem('token');

        // send the route data to the server to find matches
        const { data : {similarities}} = await axios.post('/api/findMatches', routeData, { headers : { "Authorization" : `Bearer ${token}`}});

        console.log('similarities', similarities);

        const routes = [];
        similarities.forEach((similaritie) => {
            routes.push(similaritie.route);
        });

        return Promise.resolve(routes);
        // return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

/** update the index of the intermediate points */
export async function updateIndex(receivedPoints, intermediatePoints) {
    try {
        // transform the points to a list of points [lat, lng]
        const formatedIntermediatePoints = intermediatePoints.map(point => {
            return [point.latlng.lat, point.latlng.lng];
        });
        
        const newIntermediatePoints = formatedIntermediatePoints.map((point) => {
            // find the index of the nearest point
            const nearestIndex = findClosestPointIndex(point, receivedPoints);    
            // create a new point with the new index
            const modifiedPoint = {
                latlng: {
                    lat: point[0],
                    lng: point[1],
                },
                index: nearestIndex,
            };
            return modifiedPoint;
        });
        // return the updated list of intermediate points
        return Promise.resolve(newIntermediatePoints);
    } catch (error) {
        return Promise.reject({ error : "Servor error : distance could not be calculated"});
    } 
}

/** find the index of the nearest point in a list*/
function findClosestPointIndex(point, pointsList) {

  // Convertir les points reçus en une ligne
  const pointsListLine = turf.lineString(pointsList);
  // Utiliser la fonction nearestPointOnLine de Turf.js
  const nearestPoint = turf.nearestPointOnLine(pointsListLine, point);
  // Renvoyer l'index du point le plus proche
  return nearestPoint.properties.index;
}