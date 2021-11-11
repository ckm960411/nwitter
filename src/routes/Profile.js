import { collection, getDocs, orderBy, query, where } from "@firebase/firestore"
import { authService, dbService } from "fBase"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Profile({ userObj }) {
  const navigate = useNavigate()
  const onLogOutClick = () => {
    authService.signOut()
    navigate("/")
  }
  const getMyNweets = async() => {
    const queryInstance = query(collection(dbService, "nweet"), orderBy("createdAt", "desc"), where("creatorId", "==", userObj.uid))
    const querySnapshot = await getDocs(queryInstance)
    console.log(querySnapshot.docs.map(doc => doc.data()))
  }
  useEffect(() => {
    getMyNweets()
  })
  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile