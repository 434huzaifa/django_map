import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class LocationConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name='location'#channel name. usually there are multiple channel. but here all the use will connect to this room
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name #this will create automatically
        )
        
        self.accept()#connectiona accept
        self.send(text_data=json.dumps({
            'name':self.channel_name
        }))

    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json=json.loads(text_data)
        
        # self.send(text_data=json.dumps({
        #     'lat':text_data_json['lat'],
        #     'lng':text_data_json['lng'],
        #     'accuracy':text_data_json['accuracy'],
        # }))
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'location_forward',
                'lat':text_data_json['lat'],
                'lng':text_data_json['lng'],
                'accuracy':text_data_json['accuracy'],
                'name':self.channel_name

            }
        )
        print(text_data_json)
    

    def location_forward(self,event):
        lat=event['lat']
        lng=event['lng']
        accuracy=event['accuracy']
        self.send(text_data=json.dumps({
            'type':'location',
            'lat':lat,
            'lng':lng,
            'accuracy':accuracy,
            'name':self.channel_name
        }))


    def disconnect(self, code):
        return super().disconnect(code)