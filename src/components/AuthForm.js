import { useState } from "react";
import { authService } from "fBase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function AuthForm() {
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

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required // form 데이터가 submit 되기 전 꼭 채워져야할 입력 필드임을 명시
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
          className="authInput authSubmit"
        />
        {error ? (
          <div className="authError">
            <h4>Error Message</h4>
            <span>{error}</span>
          </div>
        ) : null}
      </form>
      <button onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </button>
    </>
  );
}

export default AuthForm;
