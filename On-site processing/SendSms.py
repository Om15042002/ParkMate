
import requests
import pickle
import os
from twilio.rest import Client
import pyrebase
import time
import datetime
from dateutil import parser
    
firebaseConfig = {
  "apiKey": "AIzaSyD8QDTApgOUYoZBWETWPhKaRsdJXJkvs1E",
  "authDomain": "parkingapplication-df612.firebaseapp.com",
  "databaseURL": "https://parkingapplication-df612-default-rtdb.firebaseio.com",
  "projectId": "parkingapplication-df612",
  "storageBucket": "parkingapplication-df612.appspot.com",
  "messagingSenderId": "1054528910632",
  "appId": "1:1054528910632:web:b04b6e1b859ee36a5c0c1d"
}

def sendSMS(carnumber):
    
    emptySlots=[]
    try:
        with open("EmptySlots","rb") as file:
            emptySlots=pickle.load(file)
    except Exception as error:
        pass
    
    emptySlots=[53]
    currentDateAndTime=datetime.datetime.now()
    tdate=datetime.date.today()
    timenowlist=currentDateAndTime.strftime("%H:%M").split(":")
    timenowhour=int(timenowlist[0])
    timenowminute=int(timenowlist[1])
    firebase=pyrebase.initialize_app(firebaseConfig)
    db=firebase.database()
    
    bookings=db.child("bookings").get()
    timelist=None
    cartype=None
    bookinginfo=None
    dateandtime=None
    parkingid=None
    parkinginfo=None
    userid=None
    userinfo=None
    for booking in bookings.each():
        if carnumber==booking.val()["carnumber"]:
            for date in booking.val()["dates"]:
                if tdate==parser.parse(date).date():
                    dateandtime=parser.parse(date)
                    timelist=dateandtime.strftime("%H:%M").split(':')
                    if (timelist[0]<str(currentDateAndTime.hour)):
                        if(timelist[0]+booking.val()["duration"]>str(currentDateAndTime.hour)):
                            pass
                        else:
                            if timelist[1]>str(currentDateAndTime.minute):
                                pass
                            else:
                                continue
                    elif (timelist[0]==str(currentDateAndTime.hour)):
                        if timelist[1]>str(currentDateAndTime.minute):
                            bookinginfo=booking.val()
                            userid=booking.val()["userid"]
                            parkingid=booking.val()["parkingid"]
                        else: 
                            continue
                        
    if bookinginfo!=None:
        ampm=None
        timeend=None
        timelist=dateandtime.strftime("%H:%M").split(':')
        timeend=int(timelist[0])+bookinginfo["duration"]
        timeend%=12
        if int(timelist[0])>12:
            ampm="PM"
        else:
            ampm="AM"
        
        areas=db.child("parkingAreas").get()
        
        for key in areas.val():
            if key==parkingid:
                parkinginfo=areas.val()[key]
                
        users=db.child("users").get()
        
        for key in users.val():
            if key==userid:
                userinfo=users.val()[key]
                
        # account_sid='AC4fef8f7fcb293e63517706078626e263'
        # auth_token='d7eee1b441338e4718f12a858d60cbec'
        # twilio_number='+18088622726'
        contactno="+91"+userinfo["contactno"]
        messagetobesent="Welcome to "+parkinginfo["servicename"]+".Your parking slot number is "+str(emptySlots[0])+".We are requesting you to leave the parking on or before "+str(timeend)+":"+timelist[1]+" "+ampm
        
        client=Client(account_sid,auth_token)
        message=client.messages.create(body=messagetobesent,from_=twilio_number,to=contactno)