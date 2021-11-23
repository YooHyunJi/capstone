var cv2 = require('cv2');
var mp = require('mediapipe');
var nj = require('numjs');
var tensorflow = require('tensorflow.keras');

actions = ['none', 'click'];
seq_length = 30;

modelete = tensorflow.keras.models.load_model('models/model_ver2.0.h5');

// MediaPipe hands model
mp_hands = mp.solutions.hands;
mp_drawing = mp.solutions.drawing_utils;
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5);

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW);

seq = [];
action_seq = [];
index_point = [[8, 7, 6], [7, 6, 5], [6, 5, 0]];
while (cap.isOpened()) {
    ret, img = cap.read();
    img0 = img.copy();
}
    img = cv2.flip(img, 1);
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB);
    result = hands.process(img);

    if (result.multi_hand_landmarks !== null) {
        for (res in result.multi_hand_landmarks) {
            point_info = nj.zeros((21, 2));

            for (j in enumerate(res.landmark) && lm in enumerate(res.landmark)) {
                point_info[j] = [lm.x, lm.y];

            angles = [];
            }
            for (point in index_point) {

                ba = point_info[point[0]] - point_info[point[1]];
                bc = point_info[point[2]] - point_info[point[1]];
                cosine_angle = nj.dot(ba,bc) / (nj.linalg.norm(ba) * nj.linalg.norm(bc));
                angle = nj.arccos(cosine_angle)
                pAngle = nj.degrees(angle);
                angles.push(pAngle);

            this_action = '?';
            }
            if (model.predict([angles])[0, 0] != 1) {
                console.log('none');
                this_action = 'none';
            } else {
                console.log('click');
                this_action = 'click';

            mp_drawing.draw_landmarks(img, res, mp_hands.HAND_CONNECTIONS);
            }
            cv2.putText(img, this_action, org=(int(res.landmark[0].x * img.shape[1]), Number(res.landmark[0].y * img.shape[0] + 20)), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(255, 255, 255), thickness=2);
        }
    cv2.imshow('img', img);
    if (cv2.waitKey(1) == ord('q')) {
        return;
    }
}
