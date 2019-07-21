# 최저가 알리미
네이버 최저가 기준으로 컴퓨터 부품(타 상품 또한 가능)을 사용자가 지정한 시간마다 가져와서<br>
사용자가 입력한 가격까지 내려올경우 알림해주는 서비스입니다.<br>
특정 상품의 스팟을 걱정할 필요 없이 일에 집중하다 알림이 뜨면 빠르게 구매하시면 됩니다.

### 사용권유자
- 젠2 가격이 너무 비싸서 가격이 떨어지길 기다리고 있는 사람.
- 램값이 떡락하길 기다리고 있는 사람.
- 가격이 떨어질만한 상품을 기다리는 사람.

알림지원은 다음과 같은 채팅앱에서 지원됩니다. 
### 알림 지원
- 잔디
- 네이트온 웹훅

### 사용방법

최상위 경로에 있는 .env을 여신다음 네이버에서 발급받은 api 키를 (CLIENT_ID , CLUENT_SECRET) 입력해줍니다.
사용하시는 웹훅api (네이트온 / 잔디URL)의 수신URL을 NATEONURL , JANDIURL에 입력해줍니다.

```
  # 정상적으로 입력하셨을시 다음과 같은 내용으로 입력됩니다.
  CLIENT_ID=N7kv~~~~
  CLIENT_SECRET=3u3X~~~~
  
  TIMESET=2000
  
  NATEONURL=https://teamroom.nate.com/api/webhook/8a13~~~~
  JANDIURL=https://wh.jandi.com/connect-api/webhook/1738~~~~
  
```

```
  #node가 설치된 상태를 전제로 합니다.
  > npm install
  ### 설치완료
  > npm start
 ```

끝.
