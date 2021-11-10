import { dbService } from "fBase"
import { deleteDoc, updateDoc, doc } from "firebase/firestore"
import { useState } from "react"

function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false)
  const [newNweet, setNewNweet] = useState(nweetObj.text)
  const onDeleteClick = async() => {
    const ok = window.confirm("이 nweet 을 정말 삭제하시겠습니까?")
    if (ok) {
      // delete nweet
      await deleteDoc(doc(dbService, "nweet", nweetObj.id))
    } else {
      alert("nweet 을 삭제하지 않겠습니다.")
    }
  }
  const toggleEditing = () => setEditing(prev => !prev)
  const onChange = event => {
    setNewNweet(event.target.value)
  }
  const onSubmit = async(event) => {
    event.preventDefault()
    // 해당 글 id 를 통해 "nweet" 컬렉션에 저장되어 있는 docRef 를 가져옴
    const docNweetRef = doc(dbService, "nweet", nweetObj.id)
    // 해당 document 를 수정
    await updateDoc(docNweetRef, {
      text: newNweet
    })
    setEditing(prev => !prev)
  }
  return (
    <div>
      <div>
        {editing ? // 'editing' 즉 수정기능이 true 일 때만 새로운 form 을 보여줌
          <>
            {isOwner && ( // 해당 nweet 의 유저가 로그인 상태일 때만 수정권한 부여
              <>
                <form onSubmit={onSubmit}>
                  <input type="text" placeholder="Edit your nweet" value={newNweet} onChange={onChange} required  />
                  <input type="submit" value="Update Nweet" />
                </form> 
                <button onClick={toggleEditing}>cancel</button>
              </>
            )}
          </>
        : <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit Nweet</button>
              <button onClick={onDeleteClick}>Delete Nweet</button>
            </>
          )}
        </> }
      </div>
    </div>
  );
}

export default Nweet;
