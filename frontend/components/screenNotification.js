import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

const SOCKET_URL = 'ws://192.168.2.133:5000'; // Replace with your PC's local IP

const ScreenNotification = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log('🔥 Connected to WebSocket');
      ws.send('Mobile Connected!');
    };  
   

    
    ws.onmessage = (event) => {
      const message = event.data;
      console.log('📩 Message Received:', message);
      Alert.alert('New Notification', message);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('🚫 WebSocket Disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>WebSocket Notification Example</Text>
      <Button title="Send Test Notification" onPress={() => socket.send('New Push Notification!')} />
    </View>
  );
};

export default ScreenNotification;
