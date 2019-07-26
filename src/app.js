let urlencode = require('urlencode');
let request = require('request');
let fs = require('fs');
let cheerio = require('cheerio');
var smslib = require('./smslib');

require('dotenv').config();

console.log("확인::" + process.env.CLIENT_ID);
console.log("확인::" + process.env.CLIENT_SECRET);

if (!process.env.CLIENT_ID || 
    !process.env.CLIENT_SECRET || 
    !process.env.TIMESET || 
    !process.env.NATEONURL || 
    !process.env.JANDIURL){
    throw new Error('evn 설정을 확인해주세요.');
}


/*** 환경 설정 ***/
let client_id = process.env.CLIENT_ID; //naver Client_id Key
let client_secret = process.env.CLIENT_SECRET; //naver Client_secrey Key
let timeSet = process.env.TIMESET; //반복 시간


jsonobj = fileRefresh();
var returnCk = 0;

playAlert = setInterval(function() {
    console.log("실행확인");
    //getItem (제품명 , 목표금액)
    if(returnCk == 0){
        returnCk = 1;
        for(var i=0; i < jsonobj.item.length; i++){
            getItem(jsonobj.item[i].itemname , jsonobj.item[i].target);
            
            /*if(jsonobj.item[i].itemname === "라이젠3900x"){
                getDanawaItem(jsonobj.item[i].itemname , jsonobj.item[i].target);
            }*/
        }
    }else{
        console.log("아직 이전 데이터 작업이 끝나지 않았어요.");
    }
}, timeSet);


//파일갱신
function fileRefresh(){
    var text = fs.readFileSync('./files/setting.json', 'utf8');
    var jsonobj = JSON.parse(text);
    return jsonobj;
}


function getDanawaItem(itemName , target){
    var danawaUrl = `http://prod.danawa.com/info/?pcode=8457111`;
    console.log("다나와 가격 파싱시작 ** ");
    request(danawaUrl, function(error, response, html){
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(html);
            let colArr = $(".prc_c , em");
            console.log("라이젠3900x 가격 : " + colArr[1].children[0].data);
            var itemLprice = colArr[1].children[0].data;
            itemLprice = itemLprice.replace(/,/g, '');

            console.log("itemLprice ::" + itemLprice);
            console.log("target ::" + target);

            if(Number(target) >= Number(itemLprice)){ //숫자 변환 
                //message(itemTitle , target , itemLprice); //네이트온 기준 message공통함수 적용, 
                //smslib.messageSent(itemTitle , target , itemLprice , 'jandi');
                smslib.messageSent(itemName , target , itemLprice , 'nateon');
            }else{
                console.log("** 제품이 아직 설정된 가격까지 내려오지 않았습니다. (라이젠)");
            }
            
        }else{
            console.log('error = ' + response.statusCode);
            console.log('error2 = ' + response.body);
            console.log('다나와 기능에 문제가 발생했습니다');
        }
        
    })
}


//getItem (제품명 , 목표금액)
function getItem(itemName , target){
    var urlitem = urlencode(itemName);
    var api_url = `https://openapi.naver.com/v1/search/shop.json?query=${urlitem}&display=1&start=1&sort=sim`;    
    var options = {
        url: api_url,
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret
        }
    };
    
    request.get(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);

            var itemTitle = jsonBody.items[0].title;
            var itemLprice = jsonBody.items[0].lprice;

            if(Number(target) >= Number(itemLprice)){ //숫자 변환 
                //message(itemTitle , target , itemLprice); //네이트온 기준 message공통함수 적용, 
                smslib.messageSent(itemTitle , target , itemLprice , 'jandi');
                smslib.messageSent(itemTitle , target , itemLprice , 'nateon');
            }else{
                console.log("** 제품이 아직 설정된 가격까지 내려오지 않았습니다.");
                returnCk = 0;
            }
        } else {
            console.log('error = ' + response.statusCode);
            console.log('error2 = ' + response.body);
        }
    }); 
}

