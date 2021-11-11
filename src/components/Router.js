import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

function AppRouter({ isLoggedIn, userObj }) {
  return (
    <>
      <BrowserRouter>
        {isLoggedIn && <Navigation />}
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <Home userObj={userObj} /> : <Auth />} />
          <Route exact path="/profile" element={<Profile userObj={userObj} />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter