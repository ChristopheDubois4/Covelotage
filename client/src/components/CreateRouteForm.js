import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';


export const CreateRouteForm = ({ onSubmit }) => {
  const [routeName, setRouteName] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // Récupérer le jour de la semaine
  const getDayOfWeek = (dayOfWeek) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[dayOfWeek];
  };

  // Vérifier que l'heure est valide
  const isValidHour = (date) => {
    const hour = date.getHours();
    return hour >= 0 && hour <= 23;
  };

  // Ajouter une date 
  const handleAddDate = () => {
    if (selectedDate && isValidHour(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);
      setSelectedDate(null);
    } else {
      console.error('Heure invalide');
    }
  };

  // Supprimer une date 
  const handleRemoveDate = (index) => {
    const updatedDates = [...selectedDates];
    updatedDates.splice(index, 1);
    setSelectedDates(updatedDates);
  };

  // Ajouter un horaire périodique
  const handleAddPeriodicTime = () => {
    // Vérifier que l'heure et le jour de la semaine sont sélectionnés
    if (selectedTime == null || selectedDayOfWeek == null) {
      console.error('Heure invalide ou jour non sélectionné');
      return;
    }
    // Créer un nouvel objet pour l'horaire périodique
    const selectedDateTime = new Date(selectedDate);
    // set the time to the selected time 
    selectedDateTime.setHours(selectedTime.hours(), selectedTime.minutes(), 0);
    // format the time to 24h format 
    const formattedTime = selectedDateTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false
    });
    // assenble the day of the week and the time
    const newPeriodicTime = {
      dayOfWeek: selectedDayOfWeek,
      time: formattedTime,
    };
    // update the selectedPeriodicTimes array
    setSelectedPeriodicTimes([...selectedPeriodicTimes, newPeriodicTime]);
  };

  // Supprimer un horaire périodique
  const handleRemovePeriodicTime = (index) => {
    const updatedPeriodicTimes = [...selectedPeriodicTimes];
    updatedPeriodicTimes.splice(index, 1);
    setSelectedPeriodicTimes(updatedPeriodicTimes);
  };

  // Soumettre le formulaire 
  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifier que le nom est rempli
    if (!routeName.trim()) {
      console.error('Veuillez entrer un nom pour le chemin.');
      return;
    }
    // Vérifier que au moins une date OU un horaire périodique est sélectionné
    if (selectedDates.length === 0 && selectedPeriodicTimes.length === 0) {
      console.error('Veuillez sélectionner au moins une date ou un horaire périodique.');
      return;
    }
    // Si les conditions sont remplies, soumettre le formulaire
    onSubmit({ 
      "name": routeName, 
      "planning": { 
        "dates": selectedDates, 
        "periodic": selectedPeriodicTimes 
      }
    });
  };

  // Formater la date sélectionnée 
  const formatSelectedDate = (date) => {
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

    return formattedDate;
  };

  return (
    <form onSubmit={handleSubmit}>
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
          timeIntervals={15}
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
        <label>Dates sélectionnées : </label>
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
            <option value={0}>Lundi</option>
            <option value={1}>Mardi</option>
            <option value={2}>Mercredi</option>
            <option value={3}>Jeudi</option>
            <option value={4}>Vendredi</option>
            <option value={5}>Samedi</option>
            <option value={6}>Dimanche</option>
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
              {`${getDayOfWeek(periodicTime.dayOfWeek)} ${periodicTime.time}`}
              <button type="button" onClick={() => handleRemovePeriodicTime(index)}>
                -
              </button>
            </li>
          ))}
        </ul>

      </div>


      <button type="submit">Enregistrer le chemin</button>
    </form>
  );
};
