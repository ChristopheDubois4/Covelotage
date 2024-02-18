import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import toast from 'react-hot-toast';


import { getDayOfWeek } from '../helper/routeHelper';


export const CreateRoute = ({ createRoute, selectedRoute, selectionUpdate, updateRoute, handleFindMatches}) => {
  const [routeName, setRouteName] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const periodicDateRef = new Date(1970, 0, 1);

  // Check if the hour is valid
  const isValidHour = (date) => {
    const hour = date.getHours();
    return hour >= 0 && hour <= 23;
  };

  // Add a date
  const handleAddDate = () => {
    if (selectedDate && isValidHour(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);
      setSelectedDate(null);
    } else {
      console.error('Heure invalide');
    }
  };

  // Remove a date
  const handleRemoveDate = (index) => {
    const updatedDates = [...selectedDates];
    updatedDates.splice(index, 1);
    setSelectedDates(updatedDates);
  };

  // Add a periodic time
  const handleAddPeriodicTime = () => {
    // Check that the time and day of the week are selected
    if (selectedTime == null || selectedDayOfWeek == null) {
      console.error('Heure invalide ou jour non sélectionné');
      return;
    }
    // Create a new date object with a fixed date (1st January 1970) 
    const selectedDateTime = periodicDateRef;
    // set the time to the selected time 
    selectedDateTime.setHours(selectedTime.hours(), selectedTime.minutes(), 0);
    // assenble the day of the week and the time
    const newPeriodicTime = {
      dayOfWeek: selectedDayOfWeek,
      time: selectedDateTime,
    };
    // update the selectedPeriodicTimes array
    setSelectedPeriodicTimes([...selectedPeriodicTimes, newPeriodicTime]);
  };

  // Remove a periodic time
  const handleRemovePeriodicTime = (index) => {
    const updatedPeriodicTimes = [...selectedPeriodicTimes];
    updatedPeriodicTimes.splice(index, 1);
    setSelectedPeriodicTimes(updatedPeriodicTimes);
  };

  function getValideRouteInfos() {
    // Verify that the name is filled
    if (!routeName.trim()) {
      toast.error('Veuillez entrer un nom pour le chemin.');
      return;
    }
    // Verify that at least one date OR one periodic time is selected
    if (selectedDates.length === 0 && selectedPeriodicTimes.length === 0) {
      toast.error('Veuillez sélectionner au moins une date ou un horaire périodique.');
      return;
    }
    // structure the route information
    const routeInfos = { 
      "name": routeName, 
      "planning": { 
        "dates": selectedDates, 
        "periodic": selectedPeriodicTimes 
      }
    }
    console.log('routeInfos', routeInfos);
    return routeInfos;
  }

  // Submit the form to create a new route
  const handleCreateRoute = (e) => {
    e.preventDefault();
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      createRoute(routeInfos);
    }
  };

   // Submit the form
  const handleUpdateRoute = (e) => {
    e.preventDefault();
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      updateRoute(routeInfos);
    }
  };

  // find matches for a route button
  const handleFindMatchesBtn = () => {
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      handleFindMatches(routeInfos);
    }
    console.log('handleFindMatchesBtn OK');
  }
  
  // Formated the selected date
  const formatSelectedDate = (date) => {

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',periodicDateRef
    }).format(date);

    return formattedDate;
  };

  // update the form when a route is selected
  useEffect(() => {
    // if no route is selected, return
    if (!selectedRoute) return;
    // update the name of the route
    setRouteName(selectedRoute.name);
    // update the selected dates
    setSelectedDates(selectedRoute.planning.dates);
    // update the selected periodic times
    setSelectedPeriodicTimes(selectedRoute.planning.periodic);
  }, [selectedRoute, selectionUpdate]);

  return (
    <div>

      <form onSubmit={handleCreateRoute}>
        <h2>Trajet courant</h2>
  
        <div>
          <label>Nom du chemin : </label>
          <input required={true} type="text" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
        </div>
  
        <div>
          <label>Dates de départ : </label>
          <DatePicker
            selected={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
            timeCaption="Time"
            dateFormat="dd/MM/yyyy HH:mm"
            isClearable
            placeholderText="Sélectionnez une date"
          />
          <button type="button" onClick={handleAddDate}>
            +
          </button>
        </div>
  
        <div>
          <ul>
            {selectedDates.map((date, index) => (
              <li key={index}>
                {formatSelectedDate(date)}
                <button type="button" onClick={() => handleRemoveDate(index)}>
                  -
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        <div>
          <label>Horaires périodiques : </label>
          <div>
            <label>Jour de la semaine : </label>
            <select
              value={selectedDayOfWeek}
              onChange={(e) => setSelectedDayOfWeek(parseInt(e.target.value, 10))}
            >
              <option value={1}>Lundi</option>
              <option value={2}>Mardi</option>
              <option value={3}>Mercredi</option>
              <option value={4}>Jeudi</option>
              <option value={5}>Vendredi</option>
              <option value={6}>Samedi</option>
              <option value={0}>Dimanche</option>
            </select>
          </div>
          <div>
            <label>Heure : </label>
            <TimePicker
              showSecond={false}
              defaultValue={selectedTime}
              onChange={(value) => {setSelectedTime(value)}}
            />
            <button type="button" onClick={handleAddPeriodicTime}>
              +
            </button>
          </div>
  
          <ul>
            {selectedPeriodicTimes.map((periodicTime, index) => (
              <li key={index}>
                {`
                  ${getDayOfWeek(periodicTime.dayOfWeek)} 
                  ${periodicTime.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: false
                    })}
                `}
                <button type="button" onClick={() => handleRemovePeriodicTime(index)}>
                  -
                </button>
              </li>
            ))}
          </ul>
  
        </div>
  
        <button type="submit">Créer trajet</button>

      </form>
     
      <button onClick={handleFindMatchesBtn}>
        Trouver les correspondances
      </button>

      {/* Bouton pour mettre à jour le trajet */}
      {selectedRoute && (
        <button type="button" onClick={handleUpdateRoute}>
          Modifier le trajet
        </button>
      )}

    </div>
  );
};


