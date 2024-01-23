import React, { useState, useRef, useEffect} from 'react';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getShortestPath, updateIndex } from '../helper/mapHelper'
import { pointsValidate } from '../helper/validate'

/** Display OpenSteetMap with leaflet module */
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker_1 from '../assets/map-marker-icon-1.png';
import marker_2 from '../assets/map-marker-icon-2.png';
import marker_dynamic from '../assets/map-marker-icon-dynamic.png';
import { Toast } from 'bootstrap';


// TODO

/**
 * 
 * OK - Passer au format json ({lat : , lng : }) puis Object.map(({ lat, lng }) => [lat, lng]) ou [lng, lat]
 * OK - enlever formik (sert à rien / alourdi la chose)
 * OK - vérifier que start et stop => chemin (ts les point draggabled)
 * OK - tester chemin avec juste start et stop
 * OK - Faire en sort d update le chemin quand on déplace un point intermédiaire
 * OK - ajouter le déplacement / sauvegarde des points intermédiares
 * 
 * - ? Localisation / coordonnées manuelles ?
 * - ajouter la partie utilisateur
 * - sauvegarde dans la base de donnée (utiliser un form avec formik ?)
 */


export default function TestMapApi() {

  // ergonomics variable for the first selection
  const firstSelection = useRef(true);
  // Manage the behavior of the starting and arrival points
  const [isStartPointSelected, setIsStartPointSelected] = useState(true);
  // allow to avoid multiple calls of the function handlePathSubmit
  const [shouldUpdatePath, setShouldUpdatePath] = useState(false);
  // prevent the mutilple calls of the function handleMapClick
  const [isDragEndEvent, setIsDragEndEvent] = useState(false);
  
  // starting point and arrival point
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // received points from the server
  const [receivedPoints, setReceivedPoints] = useState([]);

  // points manually modified by the user
  const [intermediatePoints, setIntermediatePoints] = useState([]);

  // Path color
  const blueOptions = { fillColor: 'blue' }

  /** Updates the path */
  const handlePathSubmit = async (values) => {

    // verify that the starting point and the arrival point are defined
    if (!startPoint || !endPoint) return;

    // formate the points
    const formatedPoints = [startPoint, ...intermediatePoints.map(point => point.latlng) ,endPoint];
    // Handle form submission, e.g., call getShortestPath
    const getPathPromise = getShortestPath(formatedPoints);

    toast.promise(getPathPromise, {
        loading: 'Calculating path...',
        success: <b>Path calculated</b>,
        error: <b>Path calculation failed</b>,
    });

    getPathPromise.then((points) => {
      // update the path
      setReceivedPoints(points);
      // if there are intermediate points
      if (intermediatePoints.length > 0) {
        // update the list of intermediate points 
        const updatedIntermediatePoints = updateIndex(points, [...intermediatePoints]);
        updatedIntermediatePoints.then((res) => {  
          setIntermediatePoints(res);
        }).catch((error) => {"fail to update the index of the intermediate points"});
      }
    }).catch((error) => {"fail to get the path from the server"});
  }

   /** Updates the path when modifying points of the path */
  useEffect(() => {
    // allow to avoid the first call of the function
    if (firstSelection.current) return;
    // if the update of the path is not allowed, return
    if (!shouldUpdatePath) return;

    // updtae the path
    handlePathSubmit();
    // disable the update of the path
    setShouldUpdatePath(false);
  },
  // call the function when a point is modified
  [startPoint, endPoint, intermediatePoints]);

  /** Use the useMapEvents function to handle map events */
  function MapClickHandler() {
    useMapEvents({
      click: (event) => {
        // avoid multiple calls of the function handleMapClick when dragend event is triggered
        if (isDragEndEvent) {
          // reset the drag end event flag
          setIsDragEndEvent(false);
          return;
        }
        // reset the list of intermediate points
        setIntermediatePoints([]);
        // handle the click
        handleMapClick(event, isStartPointSelected);
      },
    });
    // No element to render here
    return null;
  }

  /** Handle map click (set startPoint and EndPoint) */
  const handleMapClick = (event, isStart) => {

    // ergonomics operations for the first selection
    if (firstSelection.current) {
      firstSelection.current = false;
      // change the selection of the point (start or end)
      setIsStartPointSelected(!isStartPointSelected)
    } else {
      // update the selection of the point (start or end)
      setIsStartPointSelected(isStart);
    }

    const { latlng } = event;
    // set the starting point or the arrival point
    if (isStart) {
      setStartPoint(latlng)
    } else {
      setEndPoint(latlng)
    }
    // enable the update of the path
    setShouldUpdatePath(true);
  };

  function handleDragEnd(event, isStart) {
    // set the drag end event flag
    setIsDragEndEvent(true);
    // reformat the event
    const e = { latlng: event.target._latlng };
    // change the arrival point 
    handleMapClick(e, isStart);
  }

  return (
    <div>
        
    <Toaster position='top-center' reverseOrder={false}></Toaster>


        {/** start point selection button */}
        <div>
            <label>
                <input
                    type="checkbox"
                    name="startingPointCheckbox"
                    checked={isStartPointSelected}
                    onChange={() => {
                      setIsStartPointSelected(!isStartPointSelected)}
                    }
                />
                Point de départ
            </label>
        </div>
        
        {/** arrival point selection button */}
        <div>
          <label>
            <input
                type="checkbox"
                name="arrivalPointCheckbox"
                checked={!isStartPointSelected}
                onChange={() => setIsStartPointSelected(!isStartPointSelected)}
            />
            Point d'arrivée
          </label>
        </div>


      <MapContainer
        center={[48.65, 6.15]}
        zoom={17}
        style={{
          border: '1px solid #ccc',
          height: '900px',
          width: '900px',
          margin: '10px',
          position: 'relative',
        }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        { /** Starting point */
          startPoint && (
            <Marker
              position={[startPoint.lat, startPoint.lng]}
              icon={L.icon({ iconUrl: marker_1, iconSize: [40, 40] })}
              draggable={true}
              eventHandlers={{
                dragend: (event) => { handleDragEnd(event, true) }
              }}
            >          
            </Marker>
        )}

        { /** End point */
          endPoint && (
            <Marker
              position={[endPoint.lat, endPoint.lng]}
              icon={L.icon({ iconUrl: marker_2, iconSize: [40, 40] })}
              draggable={true}
              eventHandlers={{
                dragend: (event) => { handleDragEnd(event, false) }
              }}
            >
            </Marker>
        )}
        

         {/** Path */
         receivedPoints && (
           <Polyline pathOptions={blueOptions} positions={[receivedPoints]} />
         )}
        
        {/** Dynamics points */
          receivedPoints.map((point, index) => (
          <Marker 
            key={index}
            position={point}
            icon={L.icon({ iconUrl: marker_dynamic, iconSize: [10, 10] })}
            // draggable only if not start or end point
            draggable={(index !== 0) && (index !== receivedPoints.length - 1)}
            
            eventHandlers={{
              dragend: (event) => {
                // set the drag end event flag
                setIsDragEndEvent(true);

                // reformat the event
                const modifiedPoint = {
                  latlng: event.target._latlng,
                  index: index,
                };

                // retrieve the list of points previously moved manually
                const points = [...intermediatePoints];
                               
                // Check if the index already exists.
                const existingIndex = points.findIndex(
                  (point) => point.index === index
                );

                // update the temporary list
                if (existingIndex !== -1) {
                  // update the existing point
                  points[existingIndex] = modifiedPoint;
                } else {
                  // add the new point
                  points.push(modifiedPoint);
                  // sort the list of points
                  points.sort((a, b) => a.index - b.index);
                }

                // update the list of intermediate points
                setIntermediatePoints(points);
                // enable the update of the path
                setShouldUpdatePath(true);                
              }
            }}
          >

            { false && (<Popup>Point dynamique {index + 1} // lat {point}</Popup>)}
          </Marker>
        ))}

                

        <MapClickHandler />
      </MapContainer>
      
    </div>
  );
};

