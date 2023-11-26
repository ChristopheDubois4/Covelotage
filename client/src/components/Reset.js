import React, { useEffect } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { resetPasswordValidate } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store'
import {useNavigate, Navigate} from 'react-router-dom'
import useFetch from '../hooks/fetch.hook'

export default function Reset() {

  const { username } = useAuthStore(state => state.auth)
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');

  const formik = useFormik({
    initialValues : {
      password : 'admin@15',
      confirm_pwd : 'admin'
    },
    validate : resetPasswordValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });

      resetPromise.then(function(){ 
        navigate('/password')
      }).catch(error => { })
    }
  });

  if (isLoading) return <h1>isLoading</h1>;
  if (serverError) return <h1 className="">{serverError}</h1>;
  if (status && status !== 201) return <Navigate to={'/password'} replace={true} ></Navigate>;

  return (

    <div className="">

      <Toaster position='' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="" style={{width : "50%"}}>

          <div className="">
            <h4 className=''>Reset</h4>
            <span className=''>
              Enter new password.
            </span>
          </div>

          <form className='' onSubmit={formik.handleSubmit}>
              
              <div className="">
                  <input {...formik.getFieldProps('password')} type="passwordd" className="" placeholder='New Password' />
                  <input {...formik.getFieldProps('confirm_pwd')} type="passwordd" className="" placeholder='Repeat Password' />
                  <button type='submit' className=" ">Reset</button>
              </div>

          </form>

        </div>
      </div>
      <div className="background-section"></div>
    </div>
  )
}
