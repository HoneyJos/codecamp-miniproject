// 휴대폰 인증 토큰 전송API를 요청해주세요.
const getValidationNumber = async () => {
  const phone = "010" + document.getElementById("PhoneNumber02").value + document.getElementById("PhoneNumber03").value

  const req = await axios.post('http://localhost:3000/tokens/phone', { phone });
  console.log(req.data);
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
};

// 핸드폰 인증 완료 API를 요청해주세요.
const submitToken = async () => {
  const phone = "010" + document.getElementById("PhoneNumber02").value + document.getElementById("PhoneNumber03").value
  const req = await axios.patch('http://localhost:3000/tokens/phone', { phone, token: document.getElementById("TokenInput").value })
  console.log("핸드폰 인증 완료");
};

// 회원 가입 API를 요청해주세요.
const submitSignup = async () => {
  const phone = "010" + document.getElementById("PhoneNumber02").value + document.getElementById("PhoneNumber03").value
  const userInfo = {
    name: document.getElementById("SignupName").value,
    email: document.getElementById("SignupEmail").value,
    personal: document.getElementById("SignupPersonal1").value + '-' + document.getElementById("SignupPersonal2").value,
    prefer: document.getElementById("SignupPrefer").value,
    phone
  }
  const signUp = await axios.post('http://localhost:3000/users', userInfo);
  console.log(signUp);
  console.log("회원 가입 완료");
};
