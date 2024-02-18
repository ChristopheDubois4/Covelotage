
// importation de tous les librairies et composants necessaires
import React, { useState } from 'react';

// exportation d'un composant représentant une page du site web
export default function page() {
  // Sauvegarde un etat dans une variable
  const[state, setState] = useState();
  // ... autres états

  const onClick = async e => {
    // ... faire quelque chose
  }

  // retourne le code HTML qui sera affiché dans le navigateur
  return (
    <div>
      {/** ... code HTML  */}
    </div>
  )
}



// importation de tous les librairies et composants necessaires
import React from 'react';

// exportation d'un composant
export default function nom_du_composant() {

  // comportaement de la page :
  // ... code JavaScript qui sera exécuté dans le navigateur

  // retourne le code HTML qui sera affiché dans le navigateur
  return (
    <div>
      {/** ... code HTML  */}
    </div>
  )
}



import React from 'react';
import { useNavigate } from 'react-router-dom';

/** logout button component */
export const LogoutButton = () => {

  // déconnexion de l'utilisateur et redirection vers la page d'accueil 
  // lorsqu'on clique sur le bouton

  return (
    <div>
      {/** Bouton de déconnexion  */}
    </div>
  );
};


// importattion du bouton de déconnexion
import { LogoutButton } from '.../LogoutButton'

/** Une page du site */
export const page = () => {

  // déconnexion de l'utilisateur et redirection vers la page d'accueil 
  // lorsqu'on clique sur le bouton

  return (
    <div>
      {/** Bouton de déconnexion  */}
      <LogoutButton />
    </div>
  );
};




export function Composant() {
  // Déclaration d'une nouvelle variable d'état
  // pour le compteur de clics
  const [count, setCount] = useState(0);

  return (
    <div>
      {/** Affiche le nombre de clics sur le bouton */}
      <p>Vous avez cliqué {count} fois</p>

      {/** Un bouton pour ajouter 1 au compteur */}
      <button 
        // Mise à jour de la variable d'état lorsqu'on clique sur le bouton
        onClick={() => setCount(count + 1)}
        >
        Ajouter 1 au compteur
      </button>
    </div>
  );
}




import { useFormik } from 'formik';

export default function MyForm() {
  // Utilisation de formik pour gérer le formulaire
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: ''
    },
    validate : donneesValides,
    onSubmit: values => {
      // Envoi des données du formulaire
    }
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <input {...formik.getFieldProps('firstName')} type="text" />
      <input {...formik.getFieldProps('lastName')} type="text" />     
      <button type="submit">Envoyer</button>
    </form>
  );
};

export const UserSchema = new mongoose.Schema({
  username : {
      type : String,
      required : [true, "Please provide unique Username"],
      unique : [true, "Username Exist"]
  },
  password : {
      type : String,
      required : [true, "Please provide a password"],
      unique : false
  },
  email : {
      type: String,
      required : [true, "Please provide a unique email"],
      unique: true
  },
  firstName : { type: String},
  lastName : { type: String},
  mobile : { type : Number},
  address : { type: String},
  profile : { type: String}
});

const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});


