import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header"
import Home from './Home'
import Checkout from './Checkout'
import Login from './Login'
import './App.css'
import { useEffect } from "react";
import { auth } from "./BaseFire";
import { useStateValue } from "./StateProvider";


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
          <Route path='/checkout' element={[<Header/>,<Checkout />]}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App