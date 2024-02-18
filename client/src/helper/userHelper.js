import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Requests */

/** 
 * Manage user 
 */

/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwtDecode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/** register user function */
export async function registerUser(credentials){

    try {
        const { data : { msg, error }, status } = await axios.post(`/api/register`, credentials);
        // If the username or the email are already registered
        if (status !== 201) {
            return Promise.reject({ error  :'Fail to request the register mail'})
        }      
        if (error) {
            return Promise.reject({ error  : error, msg : msg})
        }
        return Promise.resolve()

    } catch (error) {
        return Promise.reject({ error })
    }
}

/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}



/** generate OTP */
export async function generateOTP(username){
    try {
        const { status } = await axios.post('/api/generateOTP', { username });
        if(status === 201){
            return Promise.resolve(status);
        }
        return Promise.reject({ error : 'Problem while generating OTP!' });
    } catch (error) {
        return Promise.reject({ error });
    }
}



/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }});
        return Promise.resolve({ data, status});
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}
