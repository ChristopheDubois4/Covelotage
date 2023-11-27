import React, { useState, useRef} from 'react';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getShortestPath } from '../helper/helper'
import { pointsValidate } from '../helper/validate'


export default function TestMapApi() {

    const [isStartPointSelected, setStartPointSelected] = useState(true);
    const firstSelection = useRef(true);

    const formik = useFormik({
        initialValues: {
            startingPoint: '',
            arrivalPoint: '',
        },
    validate : pointsValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit: async (values) => {

      // Handle form submission, e.g., call getShortestPath
        const getPathPromise = getShortestPath([values.startingPoint, values.arrivalPoint]);

        toast.promise(getPathPromise, {
            loading: 'Calculating path...',
            success: <b>Path calculated</b>,
            error: <b>Path calculation failed</b>,
        });

        getPathPromise.then((res) => {
        console.log('Points received from the server : \n', res);
        }).catch((error) => {});
    }
  });

  const handleMapClick = (event) => {
    const clickedPoint = [event.clientX, event.clientY];

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

  return (
    <div>
        
    <Toaster position='top-center' reverseOrder={false}></Toaster>

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
      </form>

      <div>
        <p>Coordonnées du point de départ : {formik.values.startingPoint}</p>
        <p>Coordonnées du point d'arrivée : {formik.values.arrivalPoint}</p>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          width: '300px',
          margin: '10px',
          position: 'relative',
        }}
        onClick={handleMapClick}
      />
    </div>
  );
};
