import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Pet } from '../types/types';
import { Storage } from '../utils/storage';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Esta função é exportada para ser usada na HomeScreen.
export const saveLikedPet = async (pet: Pet): Promise<void> => {
  try {
    const favoritesJSON = await Storage.getItem('favoritePets');
    const currentFavorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
    if (!currentFavorites.some(fav => fav.id === pet.id)) {
      const updatedFavorites = [...currentFavorites, pet];
      await Storage.setItem('favoritePets', JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Erro ao salvar pet nos favoritos:', error);
  }
};

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const favoritesJSON = await Storage.getItem('favoritePets');
      setFavorites(favoritesJSON ? JSON.parse(favoritesJSON) : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  // Esta é a função que remove o pet dos favoritos.
  const handleRemoveFavorite = (petId: number) => {
    Alert.alert(
      "Remover Favorito",
      "Tem certeza de que deseja remover este pet dos seus favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(fav => fav.id !== petId);
              await Storage.setItem('favoritePets', JSON.stringify(updatedFavorites));
              setFavorites(updatedFavorites); // Atualiza a tela
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o pet dos favoritos.');
            }
          }
        }
      ]
    );
  };

  const sharePet = async (pet: Pet) => {
    try {
      await Share.share({ message: `Conheça ${pet.name}! Um lindo pet para adoção no app Aconchego.` });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar este pet.');
    }
  };

  const renderFavoriteItem = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('PetDetail', { pet: item })}>
        <Image
          source={{ uri: item.photos?.[0] || 'https://placehold.co/600x400/E5E7EB/6B7280?text=Pet' }}
          style={styles.petImage}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.petName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text style={styles.locationText}>{item.location || 'Não informado'}</Text>
          </View>
        </View>
        {/* ✅ ESTE É O BOTÃO DE REMOVER */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Feather name="heart" size={20} color="#FFFFFF" fill="#FF6B6B" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.adoptButton}
        onPress={() => navigation.navigate('Chat', { chatId: `new_${item.id}`, petId: item.id, petName: item.name })}
      >
        <Text style={styles.adoptButtonText}>Iniciar Adoção</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seus Favoritos</Text>
          <Text style={styles.subtitle}>{favorites.length} pet{favorites.length !== 1 ? 's' : ''} que você curtiu</Text>
        </View>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={favorites.length === 0 ? styles.centeredContent : styles.listContent}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Feather name="archive" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>Sua lista está vazia</Text>
                <Text style={styles.emptySubtitle}>Curta um pet para adicioná-lo aqui.</Text>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  centeredContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
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
  listContent: { padding: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6'
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  locationText: { fontSize: 14, color: '#6B7280' },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adoptButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    alignItems: 'center',
  },
  adoptButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginTop: 16 },
  emptySubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});

export default FavoritesScreen;