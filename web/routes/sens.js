// naver sms api

const CryptoJS = require('crypto-js');
const request = require('request');
const axios = require('axios');
require('dotenv').config();

function sendOrderMsg(req, res) {

    const phone = req.body.phone;
    const orderNo = req.body.orderNo;

    const finErrCode = 404;
    const date = Date.now().toString();
    
    // 환경변수에 저장된 키값

    // const serviceId = process.env.SENS_SERVICE_ID; 
    // const secretKey = process.env.SENS_SECRET_ID; 
    // const accessKey = process.env.SENS_ACCESS_ID; 
    // const my_number = process.env.SENS_MYNUM; 
    
    // crypto-js 모듈 이용하여 정보 암호화
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:274650391224:airosk/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;
		
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    axios({
        method: method,
        url: url,
        headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: {
            type: "SMS",
            countryCode: "82",
            from: my_number, 
            content : `주문이 완료되었습니다. 주문번호는 ${orderNo} 입니다.`,
            messages: [
                { to: `${phone}`, },],
        },
    }).then(response => {
        console.log('send message success');
        return res.status(200).end();
    }).catch(err => {
        console.log('send message err');
        return res.status(404).end();
    });
}

module.exports = {
    sendOrderMsg: sendOrderMsg,
}