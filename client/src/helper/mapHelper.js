import axios from 'axios';
// library tfo advanced geospatial analysis 
import * as turf from '@turf/turf';

/** 
 * Manage map 
 */

/** get the shortest path between 2 points */
export async function getShortestPath(userPoints) {
    try {

        // formate the points
        const formatedPoints = userPoints.map(point => JSON.stringify([point.lng, point.lat]));
        // send the points to the server
        const { data : { points }} =  await axios.post(`/api/shortestPath`, { points : formatedPoints })
        // transform the points to a list of points [lat, lng]
        const transformedPoints = points.map(point => {
            const [lng, lat] = JSON.parse(point);
            return [lat, lng];
        });

        return Promise.resolve(transformedPoints);
    } catch (error) {
        return Promise.reject({ error : "Servor error : distance could not be calculated"});
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