import { useState } from "react";
import { authService } from "fBase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (newAccount) {
      // 계정 생성
      createUserWithEmailAndPassword(authService, email, password)
        .then()
        .catch((error) => setError(error.message));
    } else {
      // 로그인
      signInWithEmailAndPassword(authService, email, password)
        .then()
        .catch((error) => setError(error.message));
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider(); // 구글계정 인증 인스턴스 생성
      signInWithPopup(authService, provider) // 구글계정으로 로그인 인증
        .then()
        .catch((error) => setError(error.message));
    } else if (name === "github") {
      provider = new GithubAuthProvider(); // 깃헙계정 인증 인스턴스 생성
      signInWithPopup(authService, provider) // 깃헙계정으로 로그인 인증
        .then()
        .catch((error) => setError(error.message));
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required // form 데이터가 submit 되기 전 꼭 채워져야할 입력 필드임을 명시
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error ? (
          <>
            <h4>Error Message</h4>
            <span>{error}</span>
          </>
        ) : null}
      </form>
      <button onClick={toggleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </button>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
}

export default Auth;
