import { authService } from "fBase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Auth() {
  const onSocialClick = (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider(); // 구글계정 인증 인스턴스 생성
      signInWithPopup(authService, provider) // 구글계정으로 로그인 인증
        .then()
        .catch((error) => console.log(error.message));
    } else if (name === "github") {
      provider = new GithubAuthProvider(); // 깃헙계정 인증 인스턴스 생성
      signInWithPopup(authService, provider) // 깃헙계정으로 로그인 인증
        .then()
        .catch((error) => console.log(error.message));
    }
  };
  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04aaff"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
}

export default Auth;
