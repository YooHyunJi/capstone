// order 테스트코드
const app = require('../../app.js');
const request = require('supertest');
const should = require('should');
const config = require('../../config/db_config');
const connection = config.init();


// 주문 추가
describe('POST /api/order/add', () => {
    const data = {
        'customerTel': '010-1818-1918',
        'totalPrice': 11111,
        'storeNo': 1
    }
    before(() => { // it 실행 전 먼저 실행
        connection.connect();
    });

    describe('성공 시', () => {
        before(done => { // 중복되는 코드
            request(app)
                .post('/api/order/add')
                .send(data)
                .expect(200)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        it('등록된 주문 번호를 1개를 반환한다.', () => {
            body.should.have.length(1);
        })
    });
});