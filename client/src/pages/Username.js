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

    <div className="">

      <Toaster position='' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="">

          <div className="">
            <h4 className=''>Hello Again!</h4>
            <span className=''>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='' onSubmit={formik.handleSubmit}>
 
               <div className="">
                  <input {...formik.getFieldProps('username')} type="text" className="" placeholder='Username' />
                  <button type='submit' className="" >Let's Go</button>
              </div>
              

              <div className="">
                <span>Not a Member <Link className='' to="/register">Register Now</Link></span>
              </div>

          </form>

        </div>
      </div>

      <div className="background-section"></div>
    </div>        

  )
}
