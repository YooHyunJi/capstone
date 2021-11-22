// NCP SENS API (juran)

const CryptoJS = require('crypto-js');
// const request = require('request');
const axios = require('axios');
require('dotenv').config();

// 주문 완료
function sendOrderMsg(req, res) {

    const phone = req.body.phone;
    const orderNo = req.body.orderNo;

    const date = Date.now().toString();
    
    // 환경변수에 저장된 키값
    // const serviceId = process.env.SENS_SERVICE_ID;
    // const secretKey = process.env.SENS_SECRET_KEY;
    // const accessKey = process.env.SENS_ACCESS_KEY;
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

    // request -> axios
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
            content : `주문이 완료되었습니다. 주문번호는 ${orderNo}번 입니다.`,
            messages: [
                { to: `${phone}`, },],
        },
    }).then(response => {
        console.log('send order message success');
        return res.status(200).end();
    }).catch(err => {
        console.log('send order message err');
        return res.status(404).end();
    });
}

// 픽업 안내
function sendPickupMsg(req, res) {

    const phone = req.body.phone;
    const orderNo = req.body.orderNo;
    
    const date = Date.now().toString();

    // const serviceId = process.env.SENS_SERVICE_ID; 
    // const secretKey = process.env.SENS_SECRET_ID; 
    // const accessKey = process.env.SENS_ACCESS_ID; 
    // const my_number = process.env.SENS_MYNUM;
    
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
            content : `${orderNo}번 주문 픽업 준비되었습니다. 픽업대에서 해당 문자를 보여주세요!`,
            messages: [
                { to: `${phone}`, },],
        },
    }).then(response => {
        console.log('send pickup message success');
        return res.status(200).end();
    }).catch(err => {
        console.log('send pickup message err');
        return res.status(404).end();
    });
}

module.exports = {
    sendOrderMsg: sendOrderMsg,
    sendPickupMsg: sendPickupMsg,
}