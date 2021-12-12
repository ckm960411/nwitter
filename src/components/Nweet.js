import { ref, deleteObject, uploadString, getDownloadURL, } from "@firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fBase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Nweet({ nweetObj, isOwner, userObjUid }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newAttachment, setNewAttachment] = useState("");
  const fileInputRef = useRef();
  const { attachmentURL } = nweetObj;

  const onDeletePhotoURL = async() => {
    const urlRef = ref(storageService, attachmentURL);
    await deleteObject(urlRef)
      .then()
      .catch((err) => console.log(err));
  }

  // Nweet 전체 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("이 nweet 을 정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "nweet", nweetObj.id));
      if (attachmentURL) onDeletePhotoURL()
    } else {
      alert("nweet 을 삭제하지 않겠습니다.");
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    setNewNweet(event.target.value);
  };

  // onSubmit 이벤트 핸들러
  const onSubmit = async (event) => {
    event.preventDefault();

    let newAttachmentURL = "";
    if (attachmentURL) {
      // 기존의 사진 파일이 있다면 기존 파일을 지우고 새로운 파일 첨부
      if (attachmentURL) onDeletePhotoURL()
      const newAttachmentRef = ref(storageService, `${userObjUid}/${uuidv4()}`);
      await uploadString(newAttachmentRef, newAttachment, "data_url");
      newAttachmentURL = await getDownloadURL(newAttachmentRef);
    } else if (newAttachment) {
      // 새로운 파일이 있다면 바로 첨부
      const newAttachmentRef = ref(storageService, `${userObjUid}/${uuidv4()}`);
      await uploadString(newAttachmentRef, newAttachment, "data_url");
      newAttachmentURL = await getDownloadURL(newAttachmentRef);
    }

    // 해당 글 id 를 통해 "nweet" 컬렉션에 저장되어 있는 docRef 를 가져옴
    const docNweetRef = doc(dbService, "nweet", nweetObj.id);
    // 해당 document 를 수정
    if (newAttachmentURL !== "") { // 새 파일 URL 이 있다면 기존 파일URL 에 덮어씀
      await updateDoc(docNweetRef, {
        text: newNweet,
        attachmentURL: newAttachmentURL,
      });
    } else { // 새 파일 URL 이 없다면 텍스트만 수정
      await updateDoc(docNweetRef, {
        text: newNweet,
      });
    }
    setEditing((prev) => !prev);
  };

  // 새로 파일을 첨부하게 되면 파일dataURL 을 읽어서 newAttachment 에 담음
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); // MDN FileReader API
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  // 기존 사진을 storage 에서 지우고, collection 에서도 해당 사진을 지우는 함수
  const clearAttachment = async () => {
    if (attachmentURL) onDeletePhotoURL()
    const docNweetRef = doc(dbService, "nweet", nweetObj.id);
    await updateDoc(docNweetRef, {
      text: newNweet,
      attachmentURL: "",
    });
  };
  // 첨부파일을 지우면 storage 와 collection 양쪽에서 모두 지워짐
  const onClearAttachment = () => {
    if (attachmentURL !== "") clearAttachment();
    setNewAttachment("");
    fileInputRef.current.value = null;
  };
  return (
    <div>
      <div className="nweet">
        {editing ? ( // 'editing' 즉 수정기능이 true 일 때만 새로운 form 을 보여줌
          <>
            {isOwner && ( // 해당 nweet 의 유저가 로그인 상태일 때만 수정권한 부여
              <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                  <input type="text" placeholder="Edit your nweet" value={newNweet} onChange={onChange} required />
                  <input type="submit" value="Update Nweet" className="formBtn" />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">cancel</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} />

                {newAttachment ? ( // 새 첨부파일이 있으면 새 첨부파일을 띄움
                  <div>
                    <img src={newAttachment} width="50px" height="50px" alt="myUploadedImg" />
                    <button onClick={onClearAttachment}>Clear Photo</button>
                  </div>
                ) : attachmentURL ? ( // 기존 첨부파일이 있으면 기존 첨부파일을 띄움
                  <div>
                    <img src={attachmentURL} width="50px" height="50px" alt="myUploadedImg" />
                    <button onClick={onClearAttachment}>Clear Photo</button>
                  </div>
                ) : null}  {/* 아무것도 없으면 아무것도 띄우지 않음 */}
              </>
            )}
          </>
        ) : (
          <>
            <h4>{nweetObj.text}</h4>
            {attachmentURL && <img src={attachmentURL} alt="myNweetImg" />}
            {isOwner && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Nweet;
