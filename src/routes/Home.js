import { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "fBase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const fileInputRef = useRef();
  useEffect(() => {
    // realtime 으로 nweet 받아오기
    const collectDocRef = collection(dbService, "nweet"); // firestore 컬렉션 레퍼런스 생성
    const queryInstance = query(collectDocRef, orderBy("createdAt", "desc"));
    onSnapshot(queryInstance, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id, // doc.id 는 한개 문서의 id 를 말함
        ...doc.data(), // doc.data() 에는 text, creatorId, createdAt 과 같은 필드정보가 담김
      }));
      setNweets(nweetArray);
    });
  }, []);

  // 게시글 작성 후 제출(submit)하면 firestore 에 새로운 collection 추가
  const onSubmit = async (event) => {
    event.preventDefault();
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
  };
  const onChange = (event) => setNweet(event.target.value);
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
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    const ok = window.confirm("사진 첨부를 취소하시겠습니까>");
    if (ok === false) return;
    setAttachment("");
    fileInputRef.current.value = null;
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img
              src={attachment}
              width="50px"
              height="50px"
              alt="myUploadedImg"
            />
            <button onClick={onClearAttachment}>Clear Photo</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
