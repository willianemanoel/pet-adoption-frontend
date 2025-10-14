// src/screens/MatchesScreen.tsx
import React, { useState, useEffect } from 'react';
// ✅ CORREÇÃO: Adicionada a importação do Alert
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../config/api';

interface Match {
  id: string;
  petName: string;
  petImage: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  userId: string; 
  userName: string;
  userAvatar: string;
}

type MatchesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<MatchesScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Simulação de chamada de API
      setTimeout(() => {
        setMatches([
          { id: 'chat1', petName: 'Luna', petImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400', lastMessage: 'Oi! Luna parece perfeita para nossa família!', timestamp: '2h atrás', unread: true, userId: 'user2', userName: 'Ana', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
          { id: 'chat2', petName: 'Thor', petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400', lastMessage: 'Gostaríamos de marcar uma visita para conhecê-lo.', timestamp: '1d atrás', unread: false, userId: 'user3', userName: 'Marcos', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao buscar matches:", error);
      Alert.alert("Erro", "Não foi possível carregar suas conversas.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchMatches();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Conversas</Text>
          <Text style={styles.subtitle}>Seus matches e conversas sobre adoção</Text>
        </View>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.matchItem} 
              onPress={() => navigation.navigate('Chat', { 
                chatId: item.id, 
                petName: item.petName, 
                petImage: item.petImage 
              })}
            >
              <Image source={{ uri: item.petImage }} style={styles.petImage} />
              <View style={styles.matchInfo}>
                <Text style={styles.petName}>{item.petName}</Text>
                <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              <View style={styles.matchMeta}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="message-square" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhum match por aqui</Text>
              <Text style={styles.emptySubtitle}>Quando você e uma ONG se curtirem, a conversa aparecerá aqui.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 24 },
  matchItem: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', 
    borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  petImage: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  matchInfo: { flex: 1, marginRight: 12 },
  petName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280' },
  unreadMessage: { color: '#1F2937', fontWeight: 'bold' },
  matchMeta: { alignItems: 'flex-end', justifyContent: 'center' },
  timestamp: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  unreadDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF6B6B', borderWidth: 2, borderColor: '#FFFFFF' },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginTop: 16 },
  emptySubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});

export default MatchesScreen;