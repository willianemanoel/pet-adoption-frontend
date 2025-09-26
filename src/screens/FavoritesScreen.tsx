// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { Pet } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface FavoriteAnimal extends Pet {
  likedAt: string;
  // Adicionando propriedades que podem vir da API mas não estão na interface Pet
  gender?: string; // Adicione como opcional
}

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<FavoriteAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      
      console.log('📦 Buscando favoritos do AsyncStorage...');
      const favoritesJSON = await AsyncStorage.getItem('favoritePets');
      const savedFavorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      
      console.log('✅ Favoritos encontrados:', savedFavorites.length);
      setFavorites(savedFavorites);
      
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os favoritos');
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const handleRemoveFavorite = async (animalId: number, petName: string) => {
    try {
      Alert.alert(
        'Remover dos Favoritos',
        `Tem certeza que deseja remover ${petName} dos favoritos?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                // Remove da API (se necessário)
                await fetch(`http://192.168.0.107:3000/api/animals/${animalId}/dislike`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: 1 })
                });

                // Remove do AsyncStorage
                const favoritesJSON = await AsyncStorage.getItem('favoritePets');
                const currentFavorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
                const updatedFavorites = currentFavorites.filter((fav: FavoriteAnimal) => fav.id !== animalId);
                
                await AsyncStorage.setItem('favoritePets', JSON.stringify(updatedFavorites));
                
                // Remove da lista local
                setFavorites(updatedFavorites);
                console.log(`✅ ${petName} removido dos favoritos`);
                
              } catch (error) {
                console.error('Erro ao remover favorito:', error);
                Alert.alert('Erro', 'Não foi possível remover o pet');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert('Erro', 'Não foi possível remover o pet');
    }
  };

  const handlePetPress = (pet: FavoriteAnimal) => {
    navigation.navigate('PetDetail', { pet });
  };

  const getPetTypeColor = (type: string) => {
    const localType = type?.toLowerCase();
    if (localType === 'cachorro') return '#FEF3C7';
    if (localType === 'gato') return '#E0E7FF';
    if (localType === 'coelho') return '#FCE7F3';
    return '#F3F4F6';
  };

  const getPetTypeTextColor = (type: string) => {
    const localType = type?.toLowerCase();
    if (localType === 'cachorro') return '#78350F';
    if (localType === 'gato') return '#3730A3';
    if (localType === 'coelho') return '#831843';
    return '#6B7280';
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteAnimal }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity 
        style={styles.petImageContainer}
        onPress={() => handlePetPress(item)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ 
            uri: item.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300' 
          }} 
          style={styles.petImage}
        />
        <View style={styles.imageOverlay}>
          <Feather name="eye" size={16} color="#FFFFFF" />
        </View>
        
        <View style={[
          styles.typeBadge,
          { backgroundColor: getPetTypeColor(item.type) }
        ]}>
          <Text style={[
            styles.typeText,
            { color: getPetTypeTextColor(item.type) }
          ]}>
            {item.type}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.petInfo}>
        <View style={styles.petHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.petName}>{item.name}</Text>
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>
                {/* CORREÇÃO: Use uma propriedade existente ou remova o gênero */}
                {item.gender === 'M' ? '♂ Macho' : '♀ Fêmea'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item.id, item.name)}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={20} color="#EF4444" fill="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.petBreed}>{item.breed}</Text>
        
        <View style={styles.petDetails}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={14} color="#78350F" />
            <Text style={styles.detailText}>
              {item.age} {item.ageUnit}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Feather name="maximize" size={14} color="#78350F" />
            <Text style={styles.detailText}>Porte {item.size}</Text>
          </View>
          
          {item.location && (
            <View style={styles.detailItem}>
              <Feather name="map-pin" size={14} color="#78350F" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          )}
        </View>
        
        {item.description && (
          <Text style={styles.petDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.favoriteDateContainer}>
          <Feather name="heart" size={12} color="#F59E0B" />
          <Text style={styles.favoriteDate}>Favoritado recentemente</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Carregando seus favoritos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF3C7" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Seus Favoritos</Text>
            <Feather name="heart" size={28} color="#DC2626" />
          </View>
          <Text style={styles.subtitle}>
            {favorites.length} pet{favorites.length !== 1 ? 's' : ''} que você curtiu
          </Text>
        </View>
        
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="heart" size={80} color="#F59E0B" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum pet favoritado</Text>
            <Text style={styles.emptySubtext}>
              Dê like nos pets na tela inicial para vê-los aqui!
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="search" size={20} color="#FFFFFF" />
              <Text style={styles.exploreButtonText}>Voltar para Explorar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#F59E0B']}
                tintColor="#F59E0B"
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// FUNÇÃO PARA SALVAR O PET COMPLETO QUANDO DER LIKE
export const saveLikedPet = async (pet: Pet) => {
  try {
    console.log('💾 Salvando pet nos favoritos:', pet.name);
    
    const favoritesJSON = await AsyncStorage.getItem('favoritePets');
    const currentFavorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
    
    // Verifica se o pet já está nos favoritos
    const alreadyExists = currentFavorites.some((fav: FavoriteAnimal) => fav.id === pet.id);
    
    if (!alreadyExists) {
      // Adiciona data de curtida
      const petWithDate: FavoriteAnimal = {
        ...pet,
        likedAt: new Date().toISOString(),
        gender: 'M' // Valor padrão, já que a interface Pet não tem gender
      };
      
      const updatedFavorites = [...currentFavorites, petWithDate];
      await AsyncStorage.setItem('favoritePets', JSON.stringify(updatedFavorites));
      console.log('✅ Pet salvo nos favoritos. Total:', updatedFavorites.length);
    } else {
      console.log('ℹ️ Pet já está nos favoritos');
    }
  } catch (error) {
    console.error('❌ Erro ao salvar pet nos favoritos:', error);
  }
};

// ... (styles permanecem os mesmos)

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FEF3C7' 
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FEF3C7',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#78350F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#78350F',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 24,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'flex-start',
  },
  petImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  petInfo: {
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  genderBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    marginLeft: 8,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  petDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#78350F',
    marginLeft: 4,
    fontWeight: '600',
  },
  petDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  favoriteDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  emptyIcon: {
    backgroundColor: '#FEF3C7',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FavoritesScreen;