import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getShortestPath } from '../helper/helper';
import { pointsValidate } from '../helper/validate';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker_1 from '../assets/map-marker-icon-1.png';
import marker_2 from '../assets/map-marker-icon-2.png';
import marker_dynamic from '../assets/map-marker-icon-dynamic.png';
import axios from 'axios';

export default function TestMapApi() {
  // Points received by the server
  const [dynamicPoints, setDynamicPoints] = useState([]);
  // Path color
  const blueOptions = { color: 'blue' };

  const [isStartPointSelected, setStartPointSelected] = useState(true);
  const firstSelection = useRef(true);

  const formik = useFormik({
    initialValues: {
      startingPoint: '',
      arrivalPoint: '',
    },
    validate: pointsValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Handle form submission, e.g., call getShortestPath
      const getPathPromise = getShortestPath([
        values.startingPoint,
        values.arrivalPoint,
        ...dynamicPoints.map(JSON.stringify),
      ]);

      toast.promise(getPathPromise, {
        loading: 'Calculating path...',
        success: <b>Path calculated</b>,
        error: <b>Path calculation failed</b>,
      });

      getPathPromise
        .then((res) => {
          // Convert JSON to array
          const points = res.map((pointStr) => JSON.parse(pointStr));
          console.log('Points received from the server : \n', points);
          setDynamicPoints(points.slice(2)); // Exclure les points de départ et d'arrivée
        })
        .catch((error) => {});
    },
  });

  useEffect(() => {
    // Mise à jour des points sur le serveur lorsqu'ils changent
    updatePointsOnServer();
  }, [dynamicPoints]);

  /** Utilisez la fonction useMapEvents pour gérer les événements de la carte */
  function MapClickHandler() {
    useMapEvents({
      click: (event) => {
        handleMapClick(event);
      },
    });
    // Aucun élément à rendre ici
    return null;
  }

  const handleMapClick = (event) => {
    console.log(event.latlng);
    const clickedPoint = [event.latlng.lat, event.latlng.lng];

    if (isStartPointSelected) {
      formik.setFieldValue('startingPoint', JSON.stringify(clickedPoint));
      if (firstSelection.current) {
        setStartPointSelected(false);
        firstSelection.current = false;
      }
    } else {
      formik.setFieldValue('arrivalPoint', JSON.stringify(clickedPoint));
    }
  };

  /** Format coordinates with 2 digits after the decimal point */
  function formatCoordinates(coordinates) {
    if (!coordinates) {
      // Handle the case where coordinates are null or undefined
      return '';
    }
    // Parse coordinates in JSON format
    const parsedCoordinates = JSON.parse(coordinates);
    // Extract the first two digits after the decimal point
    const formattedCoordinates = parsedCoordinates.map((coord) =>
      coord.toFixed(2)
    );
    // Return the formatted coordinates as a string
    return `[${formattedCoordinates.join(', ')}]`;
  }

  const updatePointsOnServer = async () => {
    try {
      // Envoyez les points mis à jour au serveur
      const response = await axios.post('http://localhost:8000/updatePoints', {
        points: dynamicPoints,
      });
      console.log('Points mis à jour sur le serveur :', response.data.points);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des points :', error);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>
            <input
              type="checkbox"
              name="startingPointCheckbox"
              checked={isStartPointSelected}
              onChange={() => setStartPointSelected(!isStartPointSelected)}
            />
            Point de départ
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="arrivalPointCheckbox"
              checked={!isStartPointSelected}
              onChange={() => setStartPointSelected(!isStartPointSelected)}
            />
            Point d'arrivée
          </label>
        </div>

        <button type="submit">Créer le chemin</button>
        <button type="button" onClick={updatePointsOnServer}>
          Mettre à jour les points sur le serveur
        </button>
      </form>

      <div>
        <p>
          Coordonnée du point de départ :{' '}
          {formatCoordinates(formik.values.startingPoint)}
        </p>
        <p>
          Coordonnées du point d'arrivée :{' '}
          {formatCoordinates(formik.values.arrivalPoint)}
        </p>
      </div>

      <MapContainer
        center={[48.65, -353.85]}
        zoom={17}
        style={{
          border: '1px solid #ccc',
          height: '900px',
          width: '900px',
          margin: '10px',
          position: 'relative',
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/** Point de départ */}
        {formik.values.startingPoint && (
          <Marker
            position={JSON.parse(formik.values.startingPoint)}
            icon={L.icon({ iconUrl: marker_1, iconSize: [40, 40] })}
            draggable
            eventHandlers={{
              dragend: (event) => {
                formik.setFieldValue(
                  'startingPoint',
                  JSON.stringify([
                    event.target._latlng.lat,
                    event.target._latlng.lng,
                  ])
                );
              },
            }}
          >
            <Popup>Point de départ</Popup>
          </Marker>
        )}

        {/** Point d'arrivée */}
        {formik.values.arrivalPoint && (
          <Marker
            position={JSON.parse(formik.values.arrivalPoint)}
            icon={L.icon({ iconUrl: marker_2, iconSize: [40, 40] })}
            draggable
            eventHandlers={{
              dragend: (event) => {
                formik.setFieldValue(
                  'arrivalPoint',
                  JSON.stringify([
                    event.target._latlng.lat,
                    event.target._latlng.lng,
                  ])
                );
              },
            }}
          >
            <Popup>Point d'arrivée</Popup>
          </Marker>
        )}

        {/** Points dynamiques */}
        <Polyline pathOptions={blueOptions} positions={[dynamicPoints]} />
        {dynamicPoints.map((point, index) => (
          <Marker
            key={index}
            position={point}
            icon={L.icon({
              iconUrl: marker_dynamic,
              iconSize: [40, 40],
            })}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const updatedPoints = [...dynamicPoints];
                updatedPoints[index] = [
                  event.target._latlng.lat,
                  event.target._latlng.lng,
                ];
                setDynamicPoints(updatedPoints);
              },
            }}
          >
          </Marker>
        ))}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
