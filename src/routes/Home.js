import { useEffect, useState } from "react";
import { dbService } from "fBase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

function Home({ userObj }) {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    let unsubscribe;
    // realtime 으로 nweet 받아오기
    const collectDocRef = collection(dbService, "nweet"); // firestore 컬렉션 레퍼런스 생성
    const queryInstance = query(collectDocRef, orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(queryInstance, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id, // doc.id 는 한개 문서의 id 를 말함
        ...doc.data(), // doc.data() 에는 text, creatorId, createdAt 과 같은 필드정보가 담김
      }));
      setNweets(nweetArray);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} userObjUid={userObj.uid} />
        ))}
      </div>
    </div>
  );
}

export default Home;
