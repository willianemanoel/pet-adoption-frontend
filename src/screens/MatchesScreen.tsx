import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const mockMatches = [
  {
    id: '1',
    petName: 'Luna',
    petImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop',
    lastMessage: 'Oi! Luna parece perfeita para nossa família!',
    timestamp: '2 horas atrás',
    unread: true
  },
  {
    id: '2',
    petName: 'Thor',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1600&auto=format&fit=crop',
    lastMessage: 'Gostaríamos de marcar uma visita',
    timestamp: '1 dia atrás',
    unread: false
  }
];

export const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>Conversas sobre adoção</Text>
      </View>

      <FlatList
        data={mockMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.matchItem}
            onPress={() => navigation.navigate('Chat', { match: item })}
          >
            <Image source={{ uri: item.petImage }} style={styles.petImage} />
            <View style={styles.matchInfo}>
              <Text style={styles.petName}>{item.petName}</Text>
              <Text 
                style={[styles.lastMessage, item.unread && styles.unreadMessage]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
            <View style={styles.matchMeta}>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
            <Feather name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
    marginRight: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadMessage: {
    color: '#1F2937',
    fontWeight: '500',
  },
  matchMeta: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
});

export default MatchesScreen;