
import './App.css'
import HeaderNav from './compoenents/HeaderNav'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './compoenents/HomePage'
import LoginRegister from './compoenents/LoginRegister'
import AuthProvider from './contexts/AuthProvider'
import GenerateStudy from './compoenents/GenerateStudy'
import Dashboard from './compoenents/dashboard/Dashboard'
import UserDataProvider from './contexts/UserDataProvider'
import DisplayStudyProgram from './compoenents/DisplayStudyProgram'
import RerouteLoginReq from './compoenents/RerouteLoginReq'

function App() {

  return (
    <>
    <div className='d-flex flex-column' style={{minHeight:"100vh"}}>
      <BrowserRouter>
      <AuthProvider>
      <UserDataProvider>
      
      <HeaderNav />
        <div className='container mt-5 mb-3'>
        <Routes>
          <Route path='/' element={ <HomePage /> } />
          <Route path='/LoginRegister' element={ <RerouteLoginReq shouldBeLoggedIn={false}><LoginRegister /></RerouteLoginReq> } />
          <Route path='/Dashboard' element={ <RerouteLoginReq shouldBeLoggedIn={true}><Dashboard/></RerouteLoginReq> } />
          <Route path='/generateStudy/:pk' element={ <RerouteLoginReq shouldBeLoggedIn={true}><GenerateStudy /></RerouteLoginReq>  } />
          {/* <Route path='/generateStudy' element={ <GenerateStudy /> } /> */}
          <Route path='/displayStudy/:pk' element={ <DisplayStudyProgram /> } />
        </Routes>
        </div>

      </UserDataProvider>
      </AuthProvider>
      </BrowserRouter>

      <footer className='mt-auto d-flex p-3 border-top'>
          <p className='m-auto'>Study Club ©</p>   {/* alt+0169 */}
      </footer>
    </div>
    
      

      
    </>
  )
}

export default App
