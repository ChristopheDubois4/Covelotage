import React, { useState, useEffect } from 'react';
import { getAllRoutes, getDayOfWeek } from '../helper/routeHelper';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

const ListRoute = ({ refresh, onSelectRoute, deleteRoute}) => {

  // state to store the list of routes
  const [routes, setRoutes] = useState([]);
  // state to store the selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  // refresh the list of routes 
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const userRoutes = await getAllRoutes();
        // format the periodic times into date objects
        const routes = userRoutes.map((route) => {
          return {
            ...route,
            planning: {
              ...route.planning,
              periodic: route.planning.periodic.map((periodic) => {
                return {
                  ...periodic,
                  time: new Date(periodic.time)
                }
              }),
              dates: route.planning.dates.map((date) => new Date(date))
            }
          };
        });
        setRoutes(routes);
      } catch (error) {
        console.error('Erreur lors du chargement des routes :', error);
      }
    };

    fetchRoutes();
  }, [refresh]);

  // function to handle the click on a route
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    onSelectRoute(route);
  };


  return (
    <div>
      <h2>Mes Trajets</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <ul>
          {routes.map((route, index) => (
            <li key={route.name} onClick={() => handleRouteClick(route)} style={{ cursor: 'pointer', border: selectedRoute === route ? '2px solid blue' : 'none' }}>
              <p>{route.name}</p>
              <ul> Dates :
                {route.planning.dates.map((date, index) => {
                    // create a new date object from the date string
                    const d = new Date(date);
                    // formated the date
                    const formattedDate = `${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                    return <li key={index}>{formattedDate}</li>
                })}
              </ul>

              <ul> Horaires hebdomadaires :
                {route.planning.periodic.map((periodic, index) => (
                  <li key={index}>
                    {getDayOfWeek(periodic.dayOfWeek)+" "} 
                    {periodic.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: false
                    })}
                  </li>
                ))}
              </ul>
               {/* Bouton de suppression */}
               <button type="button" onClick={() => deleteRoute(route.name)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListRoute;
