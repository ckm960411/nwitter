import { useEffect, useState } from "react";
import { dbService } from "fBase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Nweet from "components/Nweet";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
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
    // 컬렉션에 새로운 nweet 을 추가
    await addDoc(collection(dbService, "nweet"), { // 여기서 쓰인 'nweet'은 컬렉션 이름
      text: nweet,
      // 밑에 onChange 함수의 setNweet 으로 바뀐 nweet state 가 "text" key 를 가진 문서에 저장이 됨
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    }).then()
      .catch((err) => console.log(err.resultMessage));
    setNweet("");
  };
  const onChange = (event) => setNweet(event.target.value);
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
        <input type="submit" value="Nweet" />
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
