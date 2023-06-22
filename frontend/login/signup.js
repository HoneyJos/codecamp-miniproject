// 휴대폰 인증 토큰 전송API를 요청해주세요.
const getValidationNumber = async () => {
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
};

// 핸드폰 인증 완료 API를 요청해주세요.
const submitToken = async () => {
  console.log("핸드폰 인증 완료");
};

// 회원 가입 API를 요청해주세요.
const submitSignup = async () => {
  console.log("회원 가입 완료");
};
