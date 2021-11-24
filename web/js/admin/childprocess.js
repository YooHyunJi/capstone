const { spawn } = require('child_process');

var process = spawn("python", ["test_copy.py"]);

process.stdout.on("data", function (data) {
    console.log(data.toString());
}); 

process.stderr.on("data", function (data) {
    console.error(data.toString());
});