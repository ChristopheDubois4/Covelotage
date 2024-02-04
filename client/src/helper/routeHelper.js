import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// function to add a route via the API
export async function addRouteToServer(routeData) {
    try {
        // get the token from the local storage
        const token = await localStorage.getItem('token');
        // send the route data to the server for storage in the database
        const { status } = await axios.post('/api/addroute', routeData, { headers : { "Authorization" : `Bearer ${token}`}});
        // If the route failed to be added
        if (status !== 201) {
            return Promise.reject({ error  :'Fail to add the route'})
        }      
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}
