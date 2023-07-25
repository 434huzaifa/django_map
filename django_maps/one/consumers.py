import json
from channels.generic.websocket import WebsocketConsumer

class LocationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()#connectiona accept
        self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':'Connected',
        }))
    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json=json.loads(text_data)
        
        self.send(text_data=json.dumps({
            'lat':text_data_json['lat'],
            'lng':text_data_json['lng'],
            'accuracy':text_data_json['accuracy'],
        }))
        print(text_data_json)
    
    def disconnect(self, code):
        return super().disconnect(code)