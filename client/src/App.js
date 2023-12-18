import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';


/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import TestMapApi from './components/TestMapApi';
import PageNotFound from './components/PageNotFound';

import TestMapApiOld from './components/TestMapApiOld';


/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

/** roor routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <h1>ACCEUIL</h1>
  },
  {
    path : '/login',
    element : <Username/>
  },
  {
    path : '/register',
    element : <Register/>
  },
  {
    path : '/password',
    element : <ProtectRoute> <Password /> </ProtectRoute> 
  },
  {
    path : '/Profile',
    element : <AuthorizeUser> <Profile /> </AuthorizeUser> 
  },
  {
    path : '/Recovery',
    element : <ProtectRoute> <Recovery/></ProtectRoute>
  },
  {
    path : '/Reset',
    element : <Reset/>
  },
  {
    path : '/TestMapAPi',
    element : <TestMapApi/>
  },
  {
    path : '/TestMapAPiOld',
    element : <TestMapApiOld/>
  },
  {
    path : '/PageNotFound',
    element : <PageNotFound/>
  }
])



function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
        
    </main>
  );
}

export default App;
