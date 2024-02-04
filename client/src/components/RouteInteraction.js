// RouteInteraction.js

import React, { useState, useEffect } from 'react';
import { getRoutes, updateRoute } from '../helper/routeHelper'; // Assurez-vous d'importer les fonctions nécessaires depuis votre API

export const RouteInteraction = ({ onSelectChemin }) => {

  // const [chemins, setChemins] = useState([]);
  // const [selectedChemin, setSelectedChemin] = useState(null);

  // useEffect(() => {
  //   // Charger les chemins depuis l'API lors du montage du composant
  //   // const fetchChemins = async () => {
  //   //   try {
  //   //     const routes = await getRoutes(); // Utilisez la fonction pour récupérer les chemins depuis votre API
  //   //     setChemins(routes);
  //   //   } catch (error) {
  //   //     console.error('Erreur lors du chargement des chemins :', error);
  //   //   }
  //   // };

  //   // fetchChemins();
  // }, []); // L'effet s'exécute une seule fois au montage du composant

  // const handleCheminClick = (chemin) => {
  //   // Sélectionner un chemin et déclencher une action (par exemple, passer le chemin à un autre composant)
  //   setSelectedChemin(chemin);
  //   onSelectChemin(chemin);
  // };

  // const handleCheminUpdate = async () => {
  //   try {
  //     if (selectedChemin) {
  //       // Mettre à jour le chemin sélectionné
  //       const updatedChemin = await updateRoute(selectedChemin);
  //       // Mettre à jour la liste des chemins
  //       setChemins((prevChemins) =>
  //         prevChemins.map((c) => (c.name === updatedChemin.name ? updatedChemin : c))
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour du chemin :', error);
  //   }
  // };

  return (
    <div>
      {/* <h2>Liste des chemins</h2>
      <ul>
        {chemins.map((chemin) => (
          <li key={chemin.name} onClick={() => handleCheminClick(chemin)}>
            {chemin.name}
          </li>
        ))}
      </ul>
      <button onClick={handleCheminUpdate}>Mettre à jour le chemin sélectionné</button> */}
    </div>
  );
};

