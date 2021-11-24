/**
 * TODO 파이썬 모델 통과 코드 진행 중
 */

const { spawn } = require('child_process');

var process = spawn("python", ["test.py"]);

process.stdout.on("data", function (data) {
    console.log(data.toString());
}); 
