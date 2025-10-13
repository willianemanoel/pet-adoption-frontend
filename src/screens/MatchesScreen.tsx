import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const mockMatches = [
  { id: '1', petName: 'Luna', petImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop', lastMessage: 'Oi! Luna parece perfeita para nossa família!', timestamp: '2h', unread: true },
  { id: '2', petName: 'Thor', petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1600&auto=format&fit=crop', lastMessage: 'Gostaríamos de marcar uma visita', timestamp: '1d', unread: false },
];

export const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
          <Text style={styles.subtitle}>Conversas sobre adoção</Text>
        </View>

        <FlatList
          data={mockMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.matchItem} onPress={() => navigation.navigate('Chat', { petName: item.petName })}>
              <Image source={{ uri: item.petImage }} style={styles.petImage} />
              <View style={styles.matchInfo}>
                <Text style={styles.petName}>{item.petName}</Text>
                <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              <View style={styles.matchMeta}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Nenhum match ainda.</Text>
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
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 24 },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  petImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  matchInfo: { flex: 1, marginRight: 12 },
  petName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280' },
  unreadMessage: { color: '#1F2937', fontWeight: '600' },
  matchMeta: { alignItems: 'flex-end', justifyContent: 'center' },
  timestamp: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 16 },
});

export default MatchesScreen;