// [0, 1] -> 1 -> click
// [1, 0] -> 0 -> none 

async function predDynamicGestureV2(angles) {
    const model = await tf.loadLayersModel('/js/models/ver2/model.json');
    pred = model.predict(tf.tensor([angles]));
    let result = pred.arraySync()[0][0];

    if (result < 1) {
        console.log('click!');
        sleep(100);
    }
}

async function predDynamicGestureV3(angles) {
    const model = await tf.loadLayersModel('/js/models/ver3_1/model.json');
    pred = model.predict(tf.tensor([angles]));
    let result = pred.arraySync()[0][0];

    if (result == 0) {
        console.log('click!');
        sleep(100);
    }
}

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }