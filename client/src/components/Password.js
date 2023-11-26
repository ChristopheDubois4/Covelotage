import React, {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'

export default function Password() {

  const navigate = useNavigate();

  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues : {
      password : 'admin@12'
    },
    validate : passwordValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      let loginPromise = verifyPassword({ username, password : values.password});
      toast.promise(loginPromise, {
        loading : 'Checking ...',
        success : <b>Login Succesfully</b>,
        error : <b>Password not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
      }).catch(error => { });
    }
  });

  if (isLoading) {
    return <h1>isLoading</h1>
  };
  if (serverError) {
    return <h1 className="">{serverError}</h1>
  }

  return (

    <div className="">

      <Toaster position='' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="">

          <div className="">
            <h4 className=''>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className=''>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='' onSubmit={formik.handleSubmit}>
              <div className=''>
                  <img src={apiData?.profile || avatar} className="" alt="avatar" />
              </div>

              <div className="">
                  <input {...formik.getFieldProps('password')} type="password" className="" placeholder='Password' />
                  <button type='submit' className="">Sign in</button>
              </div>
              

              <div className="">
                <span>Forgot Password? <Link className='' to="/Recovery">Recover Now</Link></span>
              </div>

          </form>

        </div>
      </div>
      <div className="background-section"></div>
    </div>
         

  );
}
