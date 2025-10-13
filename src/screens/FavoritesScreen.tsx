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
  SafeAreaView,
  StatusBar,
  Share
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Pet } from '../types/types';
import { Storage } from '../utils/storage';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const saveLikedPet = async (pet: Pet): Promise<void> => {
  try {
    const favoritesJSON = await Storage.getItem('favoritePets');
    const currentFavorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
    const alreadyExists = currentFavorites.some(fav => fav.id === pet.id);
    
    if (!alreadyExists) {
      const updatedFavorites = [...currentFavorites, pet];
      await Storage.setItem('favoritePets', JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Erro ao salvar pet nos favoritos:', error);
    throw error;
  }
};

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const fetchFavorites = async (): Promise<void> => {
    try {
      setLoading(true);
      const favoritesJSON = await Storage.getItem('favoritePets');
      const favoritesData: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (petId: number): Promise<void> => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== petId);
      await Storage.setItem('favoritePets', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert('Erro', 'Não foi possível remover o pet');
    }
  };

  const sharePet = async (pet: Pet) => {
    try {
      await Share.share({
        message: `Conheça ${pet.name}! Um lindo ${pet.type} para adoção. Veja no App PetMatch!`,
        url: pet.photos?.[0] || ''
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar este pet');
    }
  };

  const renderFavoriteItem = ({ item }: { item: Pet }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('PetDetail', { pet: item })}
    >
      <Image 
        source={{ uri: item.photos?.[0] || 'https://placehold.co/120x120/EFEFEF/3B82F6?text=Pet' }} 
        style={styles.petImage} 
      />
      
      <View style={styles.cardContent}>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{item.name}</Text>
          <Text style={styles.petBreed}>{item.breed || 'Sem raça definida'}</Text>
          
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text style={styles.locationText}>{item.location || 'Não informado'}</Text>
          </View>

          <View style={styles.badgesContainer}>
            {item.vaccinated && (
              <View style={styles.badge}>
                <MaterialIcons name="verified" size={14} color="#FFFFFF" />
                <Text style={styles.badgeText}>Vacinado</Text>
              </View>
            )}
            {item.neutered && (
              <View style={styles.badge}>
                <FontAwesome5 name="clinic-medical" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>Castrado</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => sharePet(item)} style={styles.iconButton}>
            <Feather name="share-2" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={[styles.iconButton, styles.removeButton]}>
            <Feather name="heart" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seus Favoritos</Text>
          <Text style={styles.subtitle}>
            {favorites.length} pet{favorites.length !== 1 ? 's' : ''} que você curtiu
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={styles.loading} />
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[styles.listContent, favorites.length === 0 && styles.emptyListContent]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="heart" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>Nenhum pet favoritado.</Text>
                <Text style={styles.emptySubtext}>Dê like em um pet para vê-lo aqui.</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  loading: { marginTop: 20 },
  listContent: { padding: 24 },
  emptyListContent: { flexGrow: 1 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4
  },
  petImage: { width: 120, height: 120, borderRadius: 16 },
  cardContent: { flex: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petInfo: { flex: 1 },
  petName: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  petBreed: { fontSize: 14, color: '#6B7280', marginVertical: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 12, color: '#6B7280' },
  badgesContainer: { flexDirection: 'row', gap: 6, marginTop: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 12 },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  removeButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EF4444' },
  emptyState: { alignItems: 'center', paddingVertical: 60, flex: 1, justifyContent: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }
});

export default FavoritesScreen;
