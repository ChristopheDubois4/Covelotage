import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// Obtenir toutes les routes d'un utilisateur
export async function getAllRoutes() {
    try {
        // get the token from the local storage
        const token = await localStorage.getItem('token');
        // send the username to the server to get the routes
        const response = await axios.get(`/api/getroutes`, { headers : { "Authorization" : `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        throw error;
    }
}

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

// Mettre à jour une route
export async function updateRoute(routeData) {
    try {
        // get the token from the local storage
        const token = await localStorage.getItem('token');
        // send the route data to the server for storage in the database
        const { status } = await axios.put('/api/updateRoute', routeData, { headers : { "Authorization" : `Bearer ${token}`}});
        // If the route failed to be added
        if (status !== 201) {
            return Promise.reject({ error  :'Fail to update the route'})
        }      
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

// function to add a route via the API
export async function deleteRoute(routeName) {
    try {
        // get the token from the local storage
        const token = await localStorage.getItem('token');

        // delete the route from the server database
        const { status } = await axios.delete('/api/deleteRoute', { 
            headers : { "Authorization" : `Bearer ${token}`},
            data: { name : routeName }
        });
        // If the route failed to be deleted
        if (status !== 201) {
            return Promise.reject({ error  :'Fail to add the route'})
        }      
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

// Récupérer le jour de la semaine
export const getDayOfWeek = (dayOfWeek) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek];
};

