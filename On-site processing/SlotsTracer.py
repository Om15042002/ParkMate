# -*- coding: utf-8 -*-


import cv2
import cvzone
import numpy as np
import pickle


video = cv2.VideoCapture('ParkingArea.mp4')

width=58;height=93

try:
    with open("ParkingSlots","rb") as file:
        slotList=pickle.load(file)
    with open('EmptySlots', 'rb') as fl:
        emptyslots = pickle.load(fl)
except Exception as exception:
    emptyslots=[]


def checkParkingSpace(imgPro):
    spaceCounter = 0
    global emptyslots

    for slot in slotList:
        x, y,counts = slot

        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)


        if count < 650:
            color = (0, 255, 0)
            thickness = 2
            spaceCounter += 1
            if counts not in emptyslots:
                emptyslots.append(counts)
        else:
            color = (0, 0, 255)
            thickness = 2
            if counts in emptyslots:
                emptyslots.remove(counts)


        with open('EmptySlots', 'wb') as fl:
            pickle.dump(emptyslots, fl)
        

        cv2.rectangle(img, (x,y), (x + width, y + height), color, thickness)
        cvzone.putTextRect(img, str(count), (x, y + height - 3), scale=1,
                           thickness=2, offset=0, colorR=color)

    cvzone.putTextRect(img, f'Free: {spaceCounter}/{len(slotList)}', (415, 30), scale=2,
                           thickness=1, offset=10, colorR=(0,200,0))


while True:

    if video.get(cv2.CAP_PROP_POS_FRAMES) == video.get(cv2.CAP_PROP_FRAME_COUNT):
        video.set(cv2.CAP_PROP_POS_FRAMES, 0)
    success, img = video.read()
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV,25,16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((2, 2), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel=kernel, iterations=1)
    for slot in slotList:
        x,y,counts=slot
        cv2.rectangle(img, (x,y), (x + width, y + height), (255, 0, 255), 2)
    checkParkingSpace(imgDilate)
    cv2.imshow("Video", img)
    cv2.waitKey(10)
    
    
    