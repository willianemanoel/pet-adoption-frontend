import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { PetsStackParamList, RootStackParamList } from '../types/navigation';
import { Pet } from '../types/types';
import { API_BASE_URL } from '../config/api';

type DashboardPetsScreenNavigationProp = NativeStackNavigationProp<PetsStackParamList>;

const DashboardPetsScreen: React.FC = () => {
  const navigation = useNavigation<DashboardPetsScreenNavigationProp>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/animals`);
      const data = await response.json();
      if (data.success && data.animals) {
        setPets(data.animals);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os pets.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPets();
    }
  }, [isFocused]);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair do painel de controle?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => rootNavigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }) }
    ]);
  };
  
  const handleDeletePet = (petId: number) => {
    Alert.alert("Excluir Pet", "Tem certeza? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/animals/${petId}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error('Falha ao excluir o pet no servidor.');
            }
            setPets(prev => prev.filter(p => p.id !== petId));
            Alert.alert('Sucesso', 'Pet excluído com sucesso!');
          } catch (error) {
            console.error('Erro ao excluir pet:', error);
            Alert.alert('Erro', 'Não foi possível excluir o pet.');
          }
        }
      }
    ]);
  };

  const getStatusStyle = (status: string = 'Disponível') => {
    switch (status) {
      case 'Disponível': return styles.statusAvailable;
      case 'Em processo': return styles.statusPending;
      case 'Adotado': return styles.statusAdopted;
      default: return styles.statusAdopted;
    }
  };

  const handleAddPet = () => navigation.navigate('AddEditPet', {});
  const handleEditPet = (pet: Pet) => navigation.navigate('AddEditPet', { pet });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Painel de Pets</Text>
            <Text style={styles.subtitle}>Gerenciar animais para adoção</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
              <Feather name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handleEditPet(item)}>
                <Image
                  source={{ uri: item.photos?.[0] || 'https://placehold.co/100x100/E5E7EB/6B7280?text=Pet' }}
                  style={styles.petImage}
                />
                <View style={styles.petInfo}>
                  <View style={styles.petHeader}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                      <Text style={styles.statusText}>{item.status || 'Disponível'}</Text>
                    </View>
                  </View>
                  <Text style={styles.petDetails}>{item.breed} • {item.age} {item.ageUnit}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePet(item.id)}>
                  <Feather name="trash-2" size={20} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Feather name="archive" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
                <Text style={styles.emptySubtitle}>Clique no '+' para adicionar o primeiro pet.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#F3F4F6'
  },
  petInfo: {
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  petDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  statusAvailable: { backgroundColor: '#10B981' },
  statusPending: { backgroundColor: '#F59E0B' },
  statusAdopted: { backgroundColor: '#6B7280' },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8
  },
});

export default DashboardPetsScreen;