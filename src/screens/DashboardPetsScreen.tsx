import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList, PetsStackParamList } from '../types/navigation'

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  ageUnit: string;
  size: string;
  sex: string;
  description: string;
  photos: string[];
  status: string;
  matches: number;
  views: number;
}

// Tipagem da navegação - CORRIGIDA
// Usamos o tipo combinado para acessar ambas as stacks
type DashboardPetsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList & PetsStackParamList, // Combina ambos os tipos
  'DashboardPets'
>;

const DashboardPetsScreen: React.FC = () => {
  const navigation = useNavigation<DashboardPetsScreenNavigationProp>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.107:3000/api/animals');
      const data = await response.json();

      if (data.success && data.animals) {
        setPets(data.animals);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os pets');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return '#10B981';
      case 'Em processo': return '#F59E0B';
      case 'Adotado': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleAddPet = () => {
    navigation.navigate('AddEditPet', { pet: undefined }); // Criar novo pet
  };

  const handleEditPet = (pet: Pet) => {
    navigation.navigate('AddEditPet', { pet }); // Editar pet existente
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Carregando pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Painel de Controle</Text>
          <Text style={styles.subtitle}>Gerenciar animais para adoção</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPet}
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pets.length}</Text>
          <Text style={styles.statLabel}>Animais</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pets.filter(p => p.status === 'Disponível').length}</Text>
          <Text style={styles.statLabel}>Disponíveis</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {pets.reduce((total, pet) => total + (pet.matches || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
      </View>

      {/* Pets List */}
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.petCard}
            onPress={() => handleEditPet(item)}
          >
            <Image 
              source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/100' }} 
              style={styles.petImage} 
            />
            <View style={styles.petInfo}>
              <View style={styles.petHeader}>
                <Text style={styles.petName}>{item.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status || 'Disponível'}</Text>
                </View>
              </View>
              <Text style={styles.petDetails}>{item.breed} • {item.age} {item.ageUnit}</Text>
              <View style={styles.petStats}>
                <View style={styles.stat}>
                  <Feather name="heart" size={14} color="#EF4444" />
                  <Text style={styles.statText}>{item.matches || 0} matches</Text>
                </View>
                <View style={styles.stat}>
                  <Feather name="eye" size={14} color="#6B7280" />
                  <Text style={styles.statText}>{item.views || 0} visualizações</Text>
                </View>
              </View>
            </View>
            <Feather name="edit-2" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="heart" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptySubtext}>Adicione seu primeiro pet para começar</Text>
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
  addButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 16, paddingTop: 0, flexGrow: 1 },
  petCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  petImage: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  petInfo: { flex: 1, marginRight: 12 },
  petHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  petName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  petDetails: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  petStats: { flexDirection: 'row', gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: '#6B7280' },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#6B7280', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
});

export default DashboardPetsScreen;