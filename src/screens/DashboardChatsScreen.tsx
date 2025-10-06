import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../types/navigation';// Import do Stack tipado

interface Chat {
  id: string;
  petName: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'active' | 'pending' | 'completed';
}

// Tipagem da navegação para o Dashboard
type DashboardChatsScreenNavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'DashboardChats'
>;

const DashboardChatsScreen: React.FC = () => {
  const navigation = useNavigation<DashboardChatsScreenNavigationProp>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.107:3000/api/chats/admin');
      const data = await response.json();

      if (data.success && data.chats) {
        setChats(data.chats);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as conversas');
      }
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'completed': return 'Finalizado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Conversas</Text>
          <Text style={styles.subtitle}>Gerenciar adoções em andamento</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchChats}>
          <Feather name="refresh-cw" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{chats.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{chats.filter(c => c.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Ativas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{chats.filter(c => c.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      {/* Chats List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chat', { chatId: item.id })} // Navegação tipada
          >
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.petName}>{item.petName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>
              <Text style={styles.userName}>Com: {item.userName}</Text>
              <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <Feather name="message-circle" size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Nenhuma conversa encontrada</Text>
            <Text style={styles.emptySubtext}>As conversas aparecerão aqui quando usuários demonstrarem interesse</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF3C7' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  refreshButton: { padding: 8 },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 16, paddingTop: 0, flexGrow: 1 },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  chatInfo: { flex: 1, marginRight: 12 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  petName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  userName: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  unreadMessage: { color: '#1F2937', fontWeight: '500' },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#6B7280', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
});

export default DashboardChatsScreen;
