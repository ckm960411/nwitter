import { updateProfile } from "@firebase/auth"
import { collection, getDocs, orderBy, query, where } from "@firebase/firestore"
import { authService, dbService } from "fBase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile({ refreshUser, userObj }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const navigate = useNavigate()
  const onLogOutClick = () => {
    authService.signOut()
    navigate("/")
  }
  const getMyNweets = async() => {
    const queryInstance = query(
      collection(dbService, "nweet"), 
      orderBy("createdAt", "desc"), 
      where("creatorId", "==", userObj.uid)
    )
    await getDocs(queryInstance)
  }
  useEffect(() => {
    getMyNweets()
  })
  const onChange = (event) => {
    const {target: { value }} = event
    setNewDisplayName(value)
  }
  const onSubmit = async(event) => {
    event.preventDefault()
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      })
      refreshUser()
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder={newDisplayName} onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile