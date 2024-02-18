import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/userHelper';

export default function Register() {

  const navigate = useNavigate();
  // Profile image
  const[file, setFile] = useState();

  const formik = useFormik({
    initialValues : {
      email: 'c666@gmail.com',
      username: 'example123',
      password : 'admin@12'
    },
    validate : registerValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      // < || '' > <=> If the file is empty return nothing
      values = await Object.assign(values, {profile : file || ''});

      let registerPromise = registerUser(values)

      toast.promise(registerPromise, {
        loading : 'Creating ...',
        success : <b>Register Succesfully</b>,
        error : <b>Could not Register</b>
      });

      registerPromise.then(function() {
        navigate('/login')
      }).catch(err => { 
        
        if (err.error === "AlreadyExisting") {
          console.log("err.msg : ",err.msg)
          toast.error(err.msg);
        }        
      });
    }
  });

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async e => {
    // < e.target.files[0] > collect image just upload
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div>

      <Toaster position="top-center" reverseOrder={false}></Toaster>

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

        <div className="position-absolute top-0 end-0 bottom-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}></div>


        <div className="card p-4" style={{ width: '45%', borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <h4 className="mb-0">Register</h4>
            <span>Happy to join you!</span>
          </div>

          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="profile" className="form-label">
                <img src={file || avatar} className="img-fluid rounded-circle" alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" className="form-control" />
            </div>

            <div className="col-md-6">
              <input {...formik.getFieldProps('email')} type="text" className="form-control" placeholder="Email*" />
              <input {...formik.getFieldProps('username')} type="text" className="form-control" placeholder="Username*" />
              <input {...formik.getFieldProps('password')} type="password" className="form-control" placeholder="Password*" />
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </div>

            <div className="col-12">
              <span>
                Already registered? <Link className="text-decoration-none" to="/">
                  Login now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
         

  )
}

