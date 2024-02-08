import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

export default function Username() { 

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : 'example123'
    },
    validate : usernameValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/password')
    }
  });

  return (

    <div
    className="container-fluid d-flex align-items-center justify-content-center vh-100"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/Background.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      position: 'relative',
    }}
  >
    <Toaster position="bottom-center" reverseOrder={false}></Toaster>

    <div
      className="card p-4"
      style={{
        position: 'relative',
        zIndex: '1', 
      }}
    >
      <div className="text-center mb-4">
        <h4 className="mb-0">Hello Again!</h4>
        <span>Explore More by connecting with us.</span>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <input
            {...formik.getFieldProps('username')}
            type="text"
            className="form-control"
            placeholder="Username"
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary w-100">
            Let's Go
          </button>
        </div>

        <div className="text-center">
          <span>
            Not a Member? <Link to="/register">Register Now</Link>
          </span>
        </div>
      </form>
    </div>

    {/* The following div creates the blurred overlay */}
    <div
      className="position-absolute top-0 end-0 bottom-0 start-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
      }}
    ></div>
  </div>

  )
}
