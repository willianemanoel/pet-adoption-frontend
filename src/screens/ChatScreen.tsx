import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const mockMessages = [
  { id: '1', text: 'Oi! Luna parece perfeita para nossa família!', sender: 'user', timestamp: '10:30' },
  { id: '2', text: 'Olá! Fico feliz em saber! Luna é muito carinhosa e se dá bem com crianças.', sender: 'other', timestamp: '10:32' },
  { id: '3', text: 'Gostaríamos de marcar uma visita para conhecê-la melhor.', sender: 'user', timestamp: '10:33' },
];

export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { petId, petName } = route.params as { petId: string; petName: string };
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Scroll automático para última mensagem
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  useEffect(() => {
    // Scroll inicial para última mensagem
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.status}>ONG - Respondendo agora</Text>
        </View>
      </View>

      {/* Mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.otherMessageText]}>
              {item.text}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
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
  container: { flex: 1, backgroundColor: '#FEF3C7' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB' 
  },
  backButton: { padding: 4 },
  headerTextContainer: { marginLeft: 12 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  status: { fontSize: 14, color: '#10B981', marginTop: 2 },
  messagesContainer: { padding: 16, paddingBottom: 80 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#3B82F6', borderBottomRightRadius: 4 },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  messageText: { fontSize: 16, lineHeight: 20 },
  userMessageText: { color: '#FFFFFF' },
  otherMessageText: { color: '#1F2937' },
  timestamp: { fontSize: 12, color: '#9CA3AF', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB' 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    marginRight: 12, 
    maxHeight: 100 
  },
  sendButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#3B82F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default ChatScreen;
