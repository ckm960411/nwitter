import { authService } from "fBase"
import { useNavigate } from "react-router-dom"

function Profile() {
  const navigate = useNavigate()
  const onLogOutClick = () => {
    authService.signOut()
    navigate("/")
  }
  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile