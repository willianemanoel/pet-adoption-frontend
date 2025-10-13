import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const mockRequests = [
  { id: 'req1', userName: 'Ana Carolina', userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', petName: 'Bolinha', petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop', timestamp: '2 horas atrás' },
  { id: 'req2', userName: 'Marcos Paulo', userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', petName: 'Frajola', petImage: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=100&h=100&fit=crop', timestamp: '5 horas atrás' },
];

const DashboardMatchRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };
  
  const handleDecline = (requestId: string) => {
     setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <div>
            <h1>Solicitações</h1>
            <p>Aprove ou recuse os pedidos</p>
          </div>
          <TouchableOpacity style={styles.headerButton}>
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
                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => handleDecline(item.id)}>
                  <Feather name="x" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Recusar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.id)}>
                  <Feather name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Aprovar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="git-pull-request" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  headerButton: { padding: 8 },
  statsContainer: { flexDirection: 'row', padding: 24, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  userImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  requestTime: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  petInfo: { alignItems: 'center' },
  petImage: { width: 50, height: 50, borderRadius: 8, marginBottom: 4 },
  petName: { fontSize: 12, color: '#1F2937', fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
  button: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
  declineButton: { backgroundColor: '#EF4444' },
  acceptButton: { backgroundColor: '#10B981' },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 16 },
});

export default DashboardMatchRequestsScreen;