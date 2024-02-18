import React, { useEffect, useState, useRef } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/userHelper';
import { useNavigate } from 'react-router-dom'

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);

  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  /** 
   * Skip the initial render and then every time the value of username changes, 
   * the code inside useEffect will be re-executed. 
   */
  useEffect(() => {
    // Skip the initial render
    generateOTP(username).then((status) => {
      if (status === 200) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!');
    }).catch(error => { console.log(error)});
    
  }, [username]);

  async function onSubmit(e){
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
  }

  // handler of resend OTP
  function resendOTP(){
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise ,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );      
  }


  return (

    <div
    className="container-fluid d-flex align-items-center justify-content-center vh-100 position-relative"
    style={{
      backgroundImage: `url(/Background.jpg)`, // Update the path to your image in the public folder
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
        boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1, // Ensure the card is above the blurred background
      }}
    >
      <div className="text-center">
        <h4 className="mb-0">Recovery</h4>
        <span>Enter OTP to recover password.</span>
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <div className="mb-3">
          <span>Enter 6 digits OTP sent to your email address.</span>
          <input
            onChange={(e) => setOTP(e.target.value)}
            type="password"
            className="form-control"
            placeholder="OTP"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Recover
        </button>
      </form>

      <div className="text-center mt-3">
        <span>
          Can't get OTP? <button onClick={resendOTP} className="btn btn-link">Resend</button>
        </span>
      </div>
    </div>
  </div>
         

  )
}
