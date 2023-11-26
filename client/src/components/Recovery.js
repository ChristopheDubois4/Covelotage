import React, { useEffect, useState, useRef } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom'

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);

  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  const isMounted = useRef(true);

  /** 
   * Skip the initial render and then every time the value of username changes, 
   * the code inside useEffect will be re-executed. 
   */
  useEffect(() => {
    // Skip the initial render
    if (!isMounted.current) {
      generateOTP(username).then((status) => {
        if (status === 200) return toast.success('OTP has been sent to your email!');
        return toast.error('Problem while generating OTP!');
      }).catch(error => { console.log(error)});
    } else {
      // Set isMounted to false after the initial render
      isMounted.current = false;
    }
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

    <div className="">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className=''>
        <div className="">

          <div className="">
            <h4 className=''>Recovery</h4>
            <span className=''>
              Enter OTP to recover password.
            </span>
          </div>

          <form className='' onSubmit={onSubmit}>
             
              <div className="">

                  <div className="">
                    <span className=''>
                      Enter 6 digits OTP sent to your emial address.
                    </span>
                    <input onChange={(e) => setOTP(e.target.value)} type="pascsword" className="" placeholder='OTP' />
                  </div>

                  <button type='submit' className="">Recover</button>

              </div>
              
          </form>

            <div className="">
              <span>Can't get OPT? <button onClick={resendOTP} className=''>Resent</button></span>
            </div>

        </div>
      </div>
      <div className="background-section"></div>
    </div>
         

  )
}
