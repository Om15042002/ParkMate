# -*- coding: utf-8 -*-
"""
Created on Tue Aug 16 20:00:51 2022

@author: om siddhapura
"""

import cv2
import pickle

count=0
width=58;height=93

try:
    with open("ParkingSlots","rb") as file:
        slotList=pickle.load(file)    
except Exception as exception:
    slotList=[]
    count=0

def takeCoordinates(events,x,y,flags,params):
    global count
    if events == cv2.EVENT_LBUTTONDOWN:
        count= count+1
        slotList.append((x, y, count))

    if events == cv2.EVENT_RBUTTONDOWN:
        for i,slot in enumerate(slotList):
            x1,y1,count=slot
            if x1<x<x1+width and y1<y<y1+height:
                slotList.pop(i)

    with open("ParkingSlots","wb") as file:
        pickle.dump(slotList,file)

while True:
        
    img=cv2.imread('ParkingImage.png')
    for slot in slotList:
        x,y,counts=slot
        cv2.rectangle(img, (x,y), (x + width, y + height), (255, 0, 255), 2)
    cv2.imshow("Image", img)
    cv2.setMouseCallback("Image", takeCoordinates)
    cv2.waitKey(1)
    