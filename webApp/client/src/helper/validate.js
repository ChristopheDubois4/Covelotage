import toast from "react-hot-toast";
import { authenticate } from "./userHelper";

/** validate login page username */
export async function usernameValidate(values) {

    const errors = usernameVerify({}, values);
    if (values.username) {
        // check user existance
        const { status } = await authenticate(values.username);
        // 200 <=> the request was successful
        if (status !== 200) {
            errors.exist = toast.error('User does not exist');
        }
    }
    return errors;
}

/** validate password page */
export async function passwordValidate(values) {

    const errors = passwordVerify({}, values);
    return errors;
}

/** validate reset form */
export async function resetPasswordValidate(values) {
    
    const errors = resetPasswordVerify({}, values);
    return errors;
}

/** validate register page */
export async function registerValidate(values) {

    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
}

/** validate profile page */
export async function profileValidate(values) {

    const errors = emailVerify({}, values);
    return errors;
}


/** ************************************************************************************** */

/** Validate reset password */
function resetPasswordVerify(errors = {}, values) {

    if(values.password !== values.confirm_pwd){
        errors.password = toast.error('Password not match...!');
    }
    // if (passwordVerify({}, values).password) {
    //     errors.password = passwordVerify({}, values).password;
    // }

    return errors;
}

/** Verify password */
function passwordVerify(errors = {}, values) {

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error('Password required...!');
    }
    else if(values.password.includes(" ")) {
        errors.password = toast.error('Wrong Password...!');
    } 
    else if(values.password.length < 4 ) {
        errors.password = toast.error('Password must be more than 4 characters long');
    } 
    else if(!specialChars.test(values.password) ) {
        errors.password = toast.error('Password must have special character');
    }
    return errors;
}

/** Verify username */
function usernameVerify(errors = {}, values) {

    if(!values.username){
        errors.username = toast.error('Usename required...!');
    } 
    else if(values.username.includes(" ")) {
        errors.username = toast.error('Invalide Username...!');
    }
    return errors;
}

/** Verify email */
function emailVerify(errors = {}, values) {

    if(!values.email){
        errors.email = toast.error('Email required...!');
    } 
    else if(values.email.includes(" ")) {
        errors.email = toast.error('Wrong Email...!');
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = toast.error('Invalide email adress...!');
    }
    return errors;
}
