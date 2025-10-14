// src/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// Interface para mensagens
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  avatar?: string;
}

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { petName, petImage, userName, userAvatar } = route.params as { petName: string, petImage: string, userName: string, userAvatar: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Simulação de carregamento de mensagens iniciais
  useEffect(() => {
    setMessages([
      { id: '1', text: `Oi! ${petName} parece perfeito para nossa família!`, sender: 'user', timestamp: '10:30', avatar: userAvatar },
      { id: '2', text: `Olá, ${userName}! Fico feliz em saber! ${petName} é muito carinhoso(a).`, sender: 'other', timestamp: '10:32', avatar: petImage },
      { id: '3', text: 'Gostaríamos de marcar uma visita para conhecê-lo(a).', sender: 'user', timestamp: '10:33', avatar: userAvatar },
    ]);
  }, []);

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: userAvatar,
      };
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [newMessage, userAvatar]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Image source={{ uri: petImage }} style={styles.avatar} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.status}>Conversa com {userName}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.otherRow]}>
            {item.sender === 'other' && <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />}
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
              <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.otherMessageText]}>{item.text}</Text>
              <Text style={[styles.timestamp, item.sender === 'user' ? styles.userTimestamp : styles.otherTimestamp]}>{item.timestamp}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Digite sua mensagem..."
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Feather name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 12 },
  headerTextContainer: { marginLeft: 12 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  status: { fontSize: 14, color: '#10B981', marginTop: 2 },
  messagesContainer: { paddingHorizontal: 16, paddingTop: 16 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  userMessage: { backgroundColor: '#3B82F6', borderBottomRightRadius: 4 },
  otherMessage: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  userMessageText: { color: '#FFFFFF' },
  otherMessageText: { color: '#1F2937' },
  timestamp: { fontSize: 12, marginTop: 4, textAlign: 'right' },
  userTimestamp: { color: '#EFF6FF', opacity: 0.8 },
  otherTimestamp: { color: '#9CA3AF' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  textInput: { flex: 1, backgroundColor: '#F7F8FA', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 12, fontSize: 16, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
});

export default ChatScreen;