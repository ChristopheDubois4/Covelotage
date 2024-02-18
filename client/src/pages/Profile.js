import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/userHelper';
import { LogoutButton } from '../components/LogoutButton'

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

  if (isLoading) {
    return <h1>isLoading</h1>
  };
  if (serverError) {
    return <h1>{serverError}</h1>
  }

  return (

    <div
      className="container-fluid d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url('Background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div
        className="rounded p-4"
        style={{
          width: '40%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: '1',
        }}
      >
        <div className="text-center mb-4">
        <span> Return to the  <Link to="/map"><button>map</button></Link> </span>

          <h4 className="mb-0">Profile</h4>
          <span>You can update the details.</span>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3 text-center">
            <label htmlFor="profile">
              <img src={file || apiData?.profile || avatar} className="img-fluid rounded-circle" alt="avatar" style={{ maxWidth: '120px' }} />
            </label>

            <input onChange={onUpload} type="file" id="profile" name="profile" style={{ display: 'none' }} />
          </div>

          <div className="mb-3">
            <input {...formik.getFieldProps('firstName')} className="form-control" type="text" placeholder="First Name" />
          </div>
          <div className="mb-3">
            <input {...formik.getFieldProps('lastName')} className="form-control" type="text" placeholder="Last Name" />
          </div>
          <div className="mb-3">
            <input {...formik.getFieldProps('mobile')} className="form-control" type="text" placeholder="Mobile No." />
          </div>
          <div className="mb-3">
            <input {...formik.getFieldProps('email')} className="form-control" type="text" placeholder="Email" />
          </div>
          <div className="mb-3">
            <input {...formik.getFieldProps('address')} className="form-control" type="text" placeholder="Address" />
          </div>

          <div className="mb-3 text-center">
            <button className="btn btn-primary w-100" type="submit">
              Update
            </button>
          </div>

          <LogoutButton />

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