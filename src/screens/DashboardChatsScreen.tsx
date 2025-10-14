import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../config/api';

interface Chat {
  id: string;
  petName: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'active' | 'pending' | 'completed';
}

type DashboardChatsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;

const DashboardChatsScreen: React.FC = () => {
  const navigation = useNavigation<DashboardChatsScreenNavigationProp>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchChats(); }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats/admin`);
      const data = await response.json();
      if (data.success && data.chats) setChats(data.chats);
      else Alert.alert('Erro', 'Não foi possível carregar as conversas');
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'pending': return styles.statusPending;
      default: return styles.statusCompleted;
    }
  };
  
  const getStatusTextStyle = (status: string) => {
    switch (status) {
        case 'active': return styles.statusTextActive;
        case 'pending': return styles.statusTextPending;
        default: return styles.statusTextCompleted;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      default: return 'Finalizado';
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Conversas</Text>
            <Text style={styles.subtitle}>Gerenciar adoções em andamento</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={fetchChats}>
            <Feather name="refresh-cw" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{chats.length}</Text><Text style={styles.statLabel}>Total</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{chats.filter(c => c.status === 'active').length}</Text><Text style={styles.statLabel}>Ativas</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{chats.filter(c => c.status === 'pending').length}</Text><Text style={styles.statLabel}>Pendentes</Text></View>
        </View>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatCard} onPress={() => navigation.navigate('Chat', { chatId: item.id })}>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.petName}>{item.petName}</Text>
                  <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{getStatusText(item.status)}</Text>
                  </View>
                </View>
                <Text style={styles.userName}>Com: {item.userName}</Text>
                <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>{item.lastMessage}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Nenhuma conversa encontrada.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  headerButton: { padding: 8 },
  statsContainer: { flexDirection: 'row', padding: 24, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  chatInfo: { flex: 1, marginRight: 12 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  petName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '600' },
  statusActive: { backgroundColor: '#F0FDF4' },
  statusPending: { backgroundColor: '#FFFBEB' },
  statusCompleted: { backgroundColor: '#F3F4F6' },
  statusTextActive: { color: '#10B981' },
  statusTextPending: { color: '#F59E0B' },
  statusTextCompleted: { color: '#6B7280' },
  userName: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  unreadMessage: { color: '#1F2937', fontWeight: '600' },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 16 },
});

export default DashboardChatsScreen;