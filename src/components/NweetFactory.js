import { useRef, useState } from "react";
import { dbService, storageService } from "fBase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInputRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (attachment === "" && nweet === "") return
    // if (attachment === "" && fileInputRef.current.value === false) return;
    let attachmentURL = "";
    if (attachment !== "") {
      // 파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // 참조 경로로 파일 업로드하기
      await uploadString(attachmentRef, attachment, "data_url");
      // storage에 있는 파일 URL로 다운로드 받기
      attachmentURL = await getDownloadURL(attachmentRef).then();
    }
    const nweetObj = {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentURL, // storage 에 저장한 파일URL 또한 nweet 할때 firestore 에 저장
    };
    // nweet 포스팅한 것 저장하기
    await addDoc(collection(dbService, "nweet"), nweetObj)
      .then()
      .catch((err) => console.log(err.resultMessage));
    setNweet("");
    setAttachment("");
    fileInputRef.current.value = "";
  };

  const onChange = (event) => setNweet(event.target.value);

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); // MDN FileReader API
    reader.onloadend = (finishedEvent) =>
      setAttachment(finishedEvent.currentTarget.result);
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    const ok = window.confirm("사진 첨부를 취소하시겠습니까>");
    if (ok === false) return;
    setAttachment("");
    fileInputRef.current.value = null;
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add Photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
      <input
        id="attach-file"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div className="factoryFrom__atachment">
          <img
            src={attachment}
            alt="myUploadedImg"
            style={{ backgroundImage: attachment }}
          />
          <div className="factoryFrom__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
}

export default NweetFactory;
