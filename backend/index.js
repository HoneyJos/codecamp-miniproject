import express from "express";
import connect from "./models/index.js";
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';

import { User } from "./models/user.model.js";
import { Token } from "./models/token.model.js";

connect();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/tokens/phone', async (req, res) => {
  const token = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  const phone = req.body.phone;
  const isNewUser = (await Token.find({ phone })).length === 0;
  if (isNewUser) {
    const result = await Token.create({
      phone: phone,
      token: token,
    })
    return res.send(`핸드폰 인증 문자는 ${token}입니다`);
  }
  const result = await Token.updateOne({ phone }, { token })
  res.send(`핸드폰 인증 문자는 ${token}입니다`)
});

app.post('/users', async (req, res) => {

  const phone = req.body.phone;
  const findToken = await Token.find({ phone })
  const isNotPhone = findToken.length === 0;
  const isAuth = findToken[0].isAuth;
  if (isNotPhone || !isAuth) {
    return res.status(422).send('에러!! 핸드폰 번호가 인증되지 않았습니다');
  }

  const createMessage = async () => {
    // 입력된 메시지: "안녕하세요~ https://www.naver.com 에 방문해 주세요!"

    // 1. 입력된 메시지에서 http로 시작하는 문장이 있는지 먼저 찾기!(.find() 등의 알고리즘 사용하기)
    const url = req.body.prefer;

    // 2. axios.get으로 요청해서 html코드 받아오기 => 스크래핑
    const result = await axios.get(url);

    const og = {};

    // 3. 스크래핑 결과에서 OG(오픈그래프) 코드를 골라내서 변수에 담기 => cheerio 도움 받기
    const $ = cheerio.load(result.data);
    $("meta").each((index, el) => {
      if ($(el).attr("property") && $(el).attr("property").includes("og:") && !$(el).attr("property").includes("og:url")) {
        const key = $(el).attr("property").substring(3); // og:title, og:description ...
        const value = $(el).attr("content"); // 네이버, 네이버 메인에서 ~~~
        og[key] = value // 이부분 수정 필요, 계속 not defined 또는 promis뜨네
      }
    })
    return og
  }
  const og = await createMessage();

  try {
    const personal = req.body.personal.substring(0, 7) + "*******"
    const result = await User.create({
      name: req.body.name,
      email: req.body.email,
      personal: personal,
      prefer: req.body.prefer,
      pwd: req.body.pwd,
      phone,
      og: og
    })
    res.send(true)
  } catch (err) {
    res.send('이미 등록된 사용자 입니다');
  }


});

app.patch('/tokens/phone', async (req, res) => {
  const phone = req.body.phone;
  const result = await Token.find({ phone })
  const isNotExist = result.length === 0;
  const isValid = result[0]?.token === req.body.token;
  if (isNotExist) {
    return res.send(false)
  } else if (!isValid) {
    return res.send(false)
  }
  const isAuth = await Token.updateOne({ phone }, { isAuth: true });
  res.send(true);
});


app.listen(3000, () => {
  console.log("3000번 포트에서 대기 중");
});