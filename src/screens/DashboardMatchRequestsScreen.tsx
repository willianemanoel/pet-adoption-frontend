// src/screens/DashboardMatchRequestsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';

interface MatchRequest {
  id: string;
  userName: string;
  userImage: string;
  petName: string;
  petImage: string;
  timestamp: string;
}

const DashboardMatchRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/match-requests`);
      const data = await response.json();

      if (data.success && data.requests) {
        setRequests(data.requests);
      } else {
        throw new Error(data.message || "Não foi possível carregar as solicitações.");
      }
    } catch (error: any) {
      console.error("Erro ao buscar solicitações:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchRequests();
    }
  }, [isFocused]);

  const handleAction = async (requestId: string, action: 'accept' | 'decline') => {
    const actionText = action === 'accept' ? 'aprovar' : 'recusar';
    
    Alert.alert(
      `Confirmar Ação`,
      `Você tem certeza de que deseja ${actionText} esta solicitação?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: action === 'decline' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setRequests(prev => prev.filter(req => req.id !== requestId));
              Alert.alert('Sucesso', `Solicitação ${action === 'accept' ? 'aprovada' : 'recusada'} com sucesso!`);
            } catch (error) {
              Alert.alert('Erro', `Não foi possível ${actionText} a solicitação.`);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Solicitações</Text>
            <Text style={styles.subtitle}>Aprove ou recuse os pedidos</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={fetchRequests}>
            <Feather name="refresh-cw" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{requests.length}</Text><Text style={styles.statLabel}>Pendentes</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>12</Text><Text style={styles.statLabel}>Aprovados</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>4</Text><Text style={styles.statLabel}>Recusados</Text></View>
        </View>

        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.userImage }} style={styles.userImage} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.requestTime}>{item.timestamp}</Text>
                </View>
                <View style={styles.petInfo}>
                  <Image source={{ uri: item.petImage }} style={styles.petImage} />
                  <Text style={styles.petName}>{item.petName}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => handleAction(item.id, 'decline')}>
                  <Feather name="x" size={20} color="#DC2626" />
                  <Text style={[styles.buttonText, styles.declineButtonText]}>Recusar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAction(item.id, 'accept')}>
                  <Feather name="check" size={20} color="#059669" />
                  <Text style={[styles.buttonText, styles.acceptButtonText]}>Aprovar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="inbox" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhuma solicitação pendente</Text>
              <Text style={styles.emptySubtitle}>Quando houver um novo pedido de adoção, ele aparecerá aqui.</Text>
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 20, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  headerButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  statsContainer: { flexDirection: 'row', padding: 24, gap: 12 },
  statCard: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    marginBottom: 16, 
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden'
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  userImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  requestTime: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  petInfo: { alignItems: 'center' },
  petImage: { width: 50, height: 50, borderRadius: 8, marginBottom: 4 },
  petName: { fontSize: 12, color: '#1F2937', fontWeight: '500' },
  actions: { 
    flexDirection: 'row', 
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  button: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 14, 
    gap: 8 
  },
  declineButton: {},
  acceptButton: {},
  buttonText: { fontWeight: '600', fontSize: 14 },
  declineButtonText: { color: '#DC2626' },
  acceptButtonText: { color: '#059669' },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginTop: 16, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});

export default DashboardMatchRequestsScreen;