// 필요한 라이브러리 로드
const { Vonage } = require('@vonage/server-sdk');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
require('dotenv').config();

const VONAGE_APPLICATION_ID = process.env.VONAGE_APPLICATION_ID;
const VONAGE_APPLICATION_PRIVATE_KEY_PATH =
  process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH;
const TO_NUMBER = process.env.TO_NUMBER;
const VONAGE_NUMBER = process.env.VONAGE_NUMBER;

// Express 앱 초기화
const app = express();
expressWs(app);
app.use(bodyParser.json());

// Vonage API 설정
const vonage = new Vonage({
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: VONAGE_APPLICATION_PRIVATE_KEY_PATH,
});

4bb000f3-9d79-4830-9dac-3917dcdb60ba

// Vonage로 전화를 걸기 위한 함수
function makeCall() {
  const ncco = [
    {
      action: 'talk',
      language: 'ko-KR',
      text: '안녕하세요? 카봇뫔입니다.',
    },
    {
      action: 'connect',
      eventType: 'synchronous',
      eventMethod: 'POST',
      endpoint: [
        {
          type: 'websocket',
          uri: 'ws://222.112.124.237:3000/websocket',
          contentType: 'audio/l16;rate=16000',
        },
      ],
    },
  ];

  vonage.voice
    .createOutboundCall({
      to: [
        {
          type: 'phone',
          number: TO_NUMBER,
        },
      ],
      from: {
        type: 'phone',
        number: VONAGE_NUMBER,
      },
      ncco: ncco,
    })
    .then((result) => console.log('Call initiated:', result))
    .catch((error) => console.error('Error initiating call:', error));
}

// 새로운 API 엔드포인트 생성
app.get('/make-call', (req, res) => {
  makeCall(); // 전화 걸기
  res.send('Call initiated');
});

// WebSocket 서버 설정 (Vonage에서 음성 데이터 스트리밍)
app.ws('/websocket', (ws, req) => {
  console.log('WebSocket connection established');

  // WebSocket으로 들어오는 음성 데이터 처리
  ws.on('message', (message) => {
    console.log('Received WebSocket message. Message length:', message.length);
  });

  // WebSocket 연결 종료 시 스트림도 종료
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  makeCall(); // 위치 변경
  console.log(`Server running on port ${PORT}`);
});
