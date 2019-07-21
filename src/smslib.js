//message (제품명 , 설정금액 , 실제 판매중인 금액 , 타입정보)
let request = require('request');
require('dotenv').config();


var nateonURL = process.env.NATEONURL; //네이트온 Webhook
var jandiURL = process.env.JANDIURL; //잔디 Webhook

var message = {};

//쉼표 추가
function numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

message.messageSent = function(title , target , defaultPay , type){
    var newTitle = title.replace(/(<([^>]+)>)/ig,""); //태그제거

    if(type == "nateon"){
        var options2 = {
            url: nateonURL, //네이트온 후킹으로 받을 예정으로 이렇게 처리.
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            form:{
                'content' : `${newTitle}\n제품이 설정한 가격까지 내려왔어요!!\n\n판매금액 : ${numberWithCommas(defaultPay)} / 설정금액 : ${numberWithCommas(target)}\n-----------------------------------`
            }
        };
    }else if (type == "jandi"){
        var options2 = {
            url: jandiURL, //잔디 후킹으로 받을 예정으로 이렇게 처리.
            headers:{
                'Content-Type' : 'application/json',
                'Accept' : 'application/vnd.tosslab.jandi-v2+json'
            },
            json:{
                'body' : `[${newTitle}] 제품이 설정한 가격까지 내려왔어요!\n\n판매금액 : ${numberWithCommas(defaultPay)} / 설정금액 : ${numberWithCommas(target)}\n`
            }
        };
    }else{
        error.error();
    }
    request.post(options2, function(error, response, body) {
        returnCk = 0; // 실행완료시에 동작하도록 구성 완료!
        if (!error && response.statusCode == 200) {
            console.log("알림톡이 실행되었습니다.");
        }else{
            console.log("알림톡이 실패하였습니다.");
        }
    })
}


module.exports = message;