import React from 'react';
import { Link } from 'react-router-dom'

/** logout button component */
export default function Home() {

  return (

    <div>
    {/* Navigation Bar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Covélotage</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Accueil</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Parcours</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Communauté</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Profile">Profil</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-4">Covélotage : Votre Communauté Cycliste</h1>
        <p className="lead">Connectez-vous avec des cyclistes expérimentés, trouvez des itinéraires sûrs et profitez d'une expérience de vélo confiante dans la métropole du Grand Nancy.</p>
        
        <Link to="/login"><button className="btn btn-primary btn-lg" role="button">Commencer</button></Link>
      </div>
    </div>

    {/* Features Section */}
    <div className="container mt-5">
    <div className="row">
        <div className="col-md-4">
          <h2>Trouver un Compagnon</h2>
          <p>Connectez-vous avec des cyclistes expérimentés partageant des itinéraires similaires. Améliorez la sécurité et renforcez la confiance en tant que cycliste novice.</p>
        </div>
        <div className="col-md-4">
          <h2>Découvrir des Parcours</h2>
          <p>Explorez des itinéraires de vélo sûrs et populaires dans le Grand Nancy. Obtenez des informations sur les lieux de stationnement, les points d'eau et plus encore.</p>
        </div>
        <div className="col-md-4">
          <h2>Soutien de la Communauté</h2>
          <p>Rejoignez une communauté cycliste dynamique. Interagissez avec d'autres utilisateurs, partagez des expériences et contribuez à un environnement de vélo urbain plus sûr.</p>
        </div>
      </div>
    </div>
    </div>

  );
};