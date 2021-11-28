const MODEL_URL = '/js/models/model.json';


async function predDynamicGesture(angles) {
    const model = await tf.loadLayersModel(MODEL_URL);
    pred = model.predict(tf.tensor([angles]));
    let result = pred.arraySync()[0][0];

    // [0, 1] -> 1 -> click
    // [1, 0] -> 0 -> none 

    if (result == 0) {
        console.log('click!');
    } else {
        console.log('none!');
    }
}