import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper';

export default function Profile() {

  const navigate = useNavigate();

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch()


  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || ''
    },
    enableReinitialize : true,
    validate : profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      // < || '' > <=> If the file is empty return nothing
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})

      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading : 'Updating ...',
        success : <b>Update Succesfully</b>,
        error : <b>Could not Update!</b>
      });
      
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    // < e.target.files[0] > collect image just upload
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if (isLoading) {
    return <h1>isLoading</h1>
  };
  if (serverError) {
    return <h1 className="">{serverError}</h1>
  }

  return (
    <div className="">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="" style={{ width: "45%", paddingTop: '3em'}}>

          <div className="">
            <h4 className=''>Profile</h4>
            <span className=''>
                You can update the details.
            </span>
          </div>

          <form className='' onSubmit={formik.handleSubmit}>
              <div className=''>
                  <label htmlFor="">
                    <img src={file || apiData?.profile || avatar} className="" alt="avatar" />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="">
                <div className="">
                  <input {...formik.getFieldProps('firstName')} className="" type="text" placeholder='FirstName' />
                  <input {...formik.getFieldProps('lastName')} className="" type="text" placeholder='LastName' />
                </div>

                <div className="">
                  <input {...formik.getFieldProps('mobile')} className="" type="text" placeholder='Mobile No.' />
                  <input {...formik.getFieldProps('email')} className="" type="text" placeholder='Email*' />
                </div>

               
                  <input {...formik.getFieldProps('address')} className="" type="text" placeholder='Address' />
                  <button className="" type='submit'>Update</button>
               
                  
              </div>

              <div className="">
                <span className=''>come back later? <button onClick={userLogout} className=''>Logout</button></span>
              </div>

          </form>

        </div>
      </div>
      <div className="background-section"></div>
    </div>
  )
}