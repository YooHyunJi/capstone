import cv2
import mediapipe as mp
import numpy as np
import tensorflow.keras


actions = ['none', 'click']
seq_length = 30

model = tensorflow.keras.models.load_model('models/model.h5')

# MediaPipe hands model
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

seq = []
action_seq = []
index_point = [[8, 7, 6], [7, 6, 5], [6, 5, 0]]
while cap.isOpened():
    ret, img = cap.read()
    img0 = img.copy()

    img = cv2.flip(img, 1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(img)

    if result.multi_hand_landmarks is not None:
        for res in result.multi_hand_landmarks:
            point_info = np.zeros((21, 2))
            
            for j, lm in enumerate(res.landmark):
                point_info[j] = [lm.x, lm.y]
        
            angles = []

            for point in index_point:
                # 검지손가락 포인트 각도 게산
                ba = point_info[point[0]] - point_info[point[1]]
                bc = point_info[point[2]] - point_info[point[1]]
                cosine_angle = np.dot(ba,bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
                angle = np.arccos(cosine_angle) 
                pAngle = np.degrees(angle)
                angles.append(pAngle)
            
            # y_pred = model.predict([angles]).squeeze()    
            
            this_action = '?'
            if model.predict([angles])[0, 0] != 1:
                print('none')
                this_action = 'none'
            else:
                print('click')
                this_action = 'click'
                
            mp_drawing.draw_landmarks(img, res, mp_hands.HAND_CONNECTIONS)

            cv2.putText(img, f'{this_action.upper()}', org=(int(res.landmark[0].x * img.shape[1]), int(res.landmark[0].y * img.shape[0] + 20)), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(255, 255, 255), thickness=2)

    cv2.imshow('img', img)
    if cv2.waitKey(1) == ord('q'):
        break