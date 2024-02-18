import React, { useEffect } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { resetPasswordValidate } from '../helper/validate'
import { resetPassword } from '../helper/userHelper'
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
      confirm_pwd : 'admin@15'
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

    <div
    className="container-fluid d-flex align-items-center justify-content-center vh-100 position-relative"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/Background.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}
  >
    <Toaster position="top-center" reverseOrder={false}></Toaster>

    <div
      className="position-absolute top-0 end-0 bottom-0 start-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
      }}
    ></div>

    <div
      className="rounded p-4"
      style={{
        width: '40%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="text-center">
        <h4 className="">Reset</h4>
        <span>Enter new password.</span>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="mb-3">
          <input
            {...formik.getFieldProps('password')}
            type="text"
            className="form-control"
            placeholder="New Password"
          />
          <input
            {...formik.getFieldProps('confirm_pwd')}
            type="password"
            className="form-control mt-2"
            placeholder="Repeat Password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Reset
        </button>
      </form>
    </div>
  </div>
  )
}
