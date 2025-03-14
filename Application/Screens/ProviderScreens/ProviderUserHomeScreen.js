import React from "react";
import TabScreens from "../CommonScreens/TabScreens";

function ProviderUserHomeScreen({ route }) {
  return (
    <TabScreens
      setSkip={route.params.setSkip}
      loggedin={route.params.loggedin}
      setLoginClicked={route.params.setLoginClicked}
      setLoggedIn={route.params.setLoggedIn}
      userType={route.params.userType}
    />
  );
}

export default ProviderUserHomeScreen;
