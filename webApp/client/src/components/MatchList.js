import React, { useState, useEffect } from 'react';
import { getDayOfWeek } from '../helper/routeHelper';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

export const MatchList = ({ routes, onSelectMatchingRoute, handleFindMatches}) => {

  // state to store the selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  // wait to process the request to find matches
  const [loading, setLoading] = useState(false);


  // function to handle the click on a route
  const handleRouteClick = (route, index) => {
    setSelectedRoute(route);
    onSelectMatchingRoute(index);
    // onSelectRoute(route);
  };

  const handleFindMatchesBtn = async (route) => {
    // before sending the request, set the loading state to true
    setLoading(true);
    try {
        await handleFindMatches(route);
        console.log('handleFindMatchesBtn OK');
      // const userRoutes = await getAllRoutes();
      // setRoutes(userRoutes);
      // console.log('userRoutes', userRoutes);
    } catch (error) {
      console.error('Erreur lors du chargement des routes :', error);
    }
    // once the request is processed, set the loading state to false
    setLoading(false);
  }


  return (
    <div>
      <h2>Trajets correspondant</h2>

      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <ul>
          {routes.map((route, index) => (
            <li key={route.name} onClick={() => handleRouteClick(route, index)} style={{ cursor: 'pointer', border: selectedRoute === route ? '2px solid blue' : 'none' }}>
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
                  <li key={index}>{getDayOfWeek(periodic.dayOfWeek)} {periodic.time}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
