import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

function AppRouter({ refreshUser, isLoggedIn, userObj }) {
  return (
    <div style={{
      maxWidth: 890,
      width: "100%",
      margin: "0 auto",
      marginTop: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <BrowserRouter>
        {isLoggedIn && <Navigation userObj={userObj} />}
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <Home userObj={userObj} /> : <Auth />} />
          <Route exact path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRouter