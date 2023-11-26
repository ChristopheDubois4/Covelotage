import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

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
        console.log("_________ CATCH  ___________")

        console.log("err : ",err)

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

    <div className="">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="" style={{width : "45%"}}>

          <div className="">
            <h4 className=''>Register</h4>
            <span className=''>
              Happy to join you!
            </span>
          </div>

          <form className='' onSubmit={formik.handleSubmit}>
              <div className=''>
                  <label htmlFor="profile">
                    <img src={file || avatar} className="" alt="avatar" />
                  </label>

                  <input onChange={onUpload} type="file" id='profile' name='profile'/>
              </div>

              <div className="">
                  <input {...formik.getFieldProps('email')} type="text" className="" placeholder='Email*' />
                  <input {...formik.getFieldProps('username')} type="text" className="" placeholder='Username*' />
                  <input {...formik.getFieldProps('password')} type="text" className="" placeholder='Password*' />
                 
                  <button type='submit' className="">Register</button>
              </div>
              

              <div className="">
                <span>Already register? <Link className="" to="/">Login now</Link></span>
              </div>

          </form>

        </div>
      </div>
      <div className="background-section"></div>
    </div>
         

  )
}

