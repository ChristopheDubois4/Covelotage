import ENV from '../config.js'
import axios from 'axios';

axios.defaults.baseURL = ENV.MAP_API_URI;


/** POST: http://localhost:7777/shortestPath 
 * @body : {
    points: [ '[133,295]', '[121,252]' ]
}
*/
export async function shortestPath(req, res) {

    try {
        console.log("req points : ",req.body.points)
        const { data } = await axios.post('/shortestPath', req.body);
        console.log("response : ",data)
        return res.status(201).send(data)

    } catch (error) {
        return res.status(500).send(error);
    }
}