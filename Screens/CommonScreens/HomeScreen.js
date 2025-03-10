import React from 'react'
import HomeAndLoggin from './HomeAndLoggin'

function HomeScreen({ skip, setSkip, loggedin, setLoginClicked, setLoggedIn }) {
  return (
    <HomeAndLoggin skip={skip} setSkip={setSkip} loggedin={loggedin} setLoginClicked={setLoginClicked} setLoggedIn={setLoggedIn} />
  )
}

export default HomeScreen