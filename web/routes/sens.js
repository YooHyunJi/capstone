// naver sms api

const CryptoJS = require('crypto-js');
var request = require('request');
require('dotenv').config();

function sendOrderMsg(req, res) {

    const phone = req.body.phone;
    const orderNo = req.body.orderNo;

    const finErrCode = 404;
    const date = Date.now().toString();
    
    // 환경변수에 저장된 키값
    
    
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

    request({
		method : method,
		uri : url,
        json: true,
		headers : {
			'Contenc-type': 'application/json; charset=utf-8',
			'x-ncp-iam-access-key': accessKey,
			'x-ncp-apigw-timestamp': date,
			'x-ncp-apigw-signature-v2': signature
		},
		body : {
			'type' : 'SMS',
			'countryCode' : '82',
            'from': my_number,
			'content' : `주문이 완료되었습니다. 주문번호는 ${orderNo}입니다.`,
			'messages' : [{
					'to' : `${phone}`
			}]
		}
	}, function(err) {
		if(err) {
            console.log(err);
            // return res.status(404).end();
        } else {
			console.log('success');
			// return res.status(200).end();
		}
	});
}

module.exports = {
    sendOrderMsg: sendOrderMsg,

}