import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header"
import Home from './Home'
import Checkout from './Checkout'
import Login from './Login'
import Payment from './Payment'
import Orders from './Orders'
import './App.css'
import { useEffect } from "react";
import { auth } from "./BaseFire";
import { useStateValue } from "./StateProvider";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const promise = loadStripe("pk_test_51O440wSGkCgHBrFZjBmp0Ka2u9KUYCTpqBihkx9z4vhHvztRQy8JnBigPj23QqHLd6yFaoNkNda8aDaqoDNcbCFz00VRiQDXh5")

function App(){

  const [{}, dispatch] = useStateValue()

  useEffect(()=>{

    auth.onAuthStateChanged (authUser => {
      console.log('USER IS ', authUser)

      if(authUser){
        //user logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else{
        //user not logged in
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  },[])
  return(
    <BrowserRouter>
      <div className="app">
        <Routes>
        <Route path='/login' element={[<Login/>]}/>
          <Route path='/' element={[<Header/>,<Home/>]}/>
          <Route path='/checkout' element={[<Header/>,<Checkout/>]}/>
          <Route path='/payment' element={[<Header/>,<Elements stripe={promise}><Payment /></Elements>]}/>
          <Route path='/orders' element={[<Header/>,<Orders/>]}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App