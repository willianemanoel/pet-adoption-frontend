import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, FlatList, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/types';
import PetCard from '../components/PetCard';
import { API_BASE_URL } from '../config/api'; // ✅ 1. Importa a base da URL da API

const { width, height } = Dimensions.get('window');

// ========================================================================
// HOOK CUSTOMIZADO PARA GERENCIAR FAVORITOS (mantido no arquivo)
// ========================================================================

const FAVORITES_KEY = 'favoritePets';

const useFavorites = (petId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoritesJSON = await AsyncStorage.getItem(FAVORITES_KEY);
        const favorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
        setIsFavorite(favorites.some(fav => fav.id === petId));
      } catch (e) {
        console.error("Failed to check favorite status", e);
      }
    };
    checkFavoriteStatus();
  }, [petId]);

  const toggleFavorite = useCallback(async (pet: Pet) => {
    try {
      const favoritesJSON = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      
      const isCurrentlyFavorite = favorites.some(fav => fav.id === pet.id);
      
      if (isCurrentlyFavorite) {
        favorites = favorites.filter(fav => fav.id !== pet.id);
      } else {
        favorites.push(pet);
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      setIsFavorite(!isCurrentlyFavorite);
    } catch (e) {
      console.error("Failed to toggle favorite", e);
    }
  }, []);

  return { isFavorite, toggleFavorite };
};

// ========================================================================
// COMPONENTES DE UI (mantidos no arquivo)
// ========================================================================

const AttributeCard = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
  <View style={styles.attributeCard}>
    <Feather name={icon} size={20} color="#3B82F6" />
    <Text style={styles.attributeLabel}>{label}</Text>
    <Text style={styles.attributeValue}>{value}</Text>
  </View>
);

const HealthInfoItem = ({ label, value }: { label: string, value?: boolean }) => (
  <View style={styles.healthItem}>
    <Feather name={value ? "check-circle" : "x-circle"} size={20} color={value ? "#10B981" : "#EF4444"} />
    <Text style={styles.healthLabel}>{label}</Text>
    <Text style={[styles.healthValue, { color: value ? "#10B981" : "#EF4444" }]}>{value ? "Sim" : "Não"}</Text>
  </View>
);

// ========================================================================
// COMPONENTE PRINCIPAL DA TELA
// ========================================================================

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetail'>;

const PetDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pet } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites(pet.id);

  // ✅ 2. Estados para carregar e armazenar os pets similares da API
  const [similarPets, setSimilarPets] = useState<Pet[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  // ✅ 3. Efeito para buscar os pets da API quando a tela é carregada
  useEffect(() => {
    const fetchSimilarPets = async () => {
      try {
        setIsLoadingSimilar(true);
        const response = await fetch(`${API_BASE_URL}/animals`);
        const data = await response.json();
        if (data.success && Array.isArray(data.animals)) {
          // Filtra o pet atual da lista de sugestões
          const otherPets = data.animals.filter((p: Pet) => p.id !== pet.id);
          setSimilarPets(otherPets);
        }
      } catch (error) {
        console.error("Falha ao buscar pets similares:", error);
      } finally {
        setIsLoadingSimilar(false);
      }
    };
    
    fetchSimilarPets();
  }, [pet.id]); // Recarrega se o usuário navegar para outro pet a partir desta tela

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Pet não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const petImages = (pet.photos && pet.photos.length > 0)
    ? pet.photos
    : ['https://placehold.co/600x400/E5E7EB/6B7280?text=Pet'];

  return (
    <SafeAreaView style={styles.fullContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* A galeria de imagens agora fica FORA do ScrollView */}
      <View style={styles.imageContainer}>
        <FlatList
          data={petImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => toggleFavorite(pet)}>
            <Feather name="heart" size={24} color={isFavorite ? '#EF4444' : '#1F2937'} fill={isFavorite ? '#EF4444' : 'none'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color="#6B7280" />
            <Text style={styles.locationText}>{pet.location}</Text>
          </View>

          <View style={styles.attributesGrid}>
            <AttributeCard label="Idade" value={`${pet.age} ${pet.ageUnit}`} icon="calendar" />
            <AttributeCard label="Porte" value={pet.size || 'N/A'} icon="maximize-2" />
            <AttributeCard label="Sexo" value={pet.sex || 'N/A'} icon="user" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre mim</Text>
            <Text style={styles.sectionText}>{pet.description || 'Nenhuma descrição disponível.'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saúde</Text>
            <HealthInfoItem label="Vacinado" value={pet.vaccinated} />
            <HealthInfoItem label="Castrado" value={pet.neutered} />
          </View>

          {/* ✅ 4. SEÇÃO DE PETS SIMILARES CONECTADA À API */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Você também pode gostar</Text>
            {isLoadingSimilar ? (
              <ActivityIndicator size="large" color="#FF6B6B" style={{ marginVertical: 40 }}/>
            ) : (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarPets} // Usa os dados do estado
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                  <View style={{ width: width / 2, marginRight: 16 }}>
                    <PetCard 
                      pet={item} 
                      onPress={() => navigation.push('PetDetail', { pet: item })}
                    />
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.noSimilarPetsText}>Nenhum outro pet encontrado.</Text>}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Chat', { chatId: `user_${pet.id}`, petId: pet.id, petName: pet.name, petImage: pet.photos?.[0] })}>
          <Text style={styles.ctaButtonText}>Quero Adotar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: height * 0.45, backgroundColor: '#E5E7EB' },
  image: { width: width, height: '100%' },
  headerActions: { position: 'absolute', top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { flex: 1 },
  contentContainer: { paddingTop: 24, marginTop: -30, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: height * 0.55 },
  petName: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 8, paddingHorizontal: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingHorizontal: 24 },
  locationText: { fontSize: 16, color: '#6B7280', marginLeft: 8 },
  attributesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 18 },
  attributeCard: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 6 },
  attributeLabel: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  attributeValue: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16, paddingHorizontal: 24 },
  sectionText: { fontSize: 16, color: '#4B5563', lineHeight: 24, paddingHorizontal: 24 },
  healthItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 8, marginHorizontal: 24 },
  healthLabel: { flex: 1, fontSize: 16, color: '#374151', marginLeft: 12 },
  healthValue: { fontSize: 16, fontWeight: '600' },
  noSimilarPetsText: { paddingHorizontal: 24, color: '#6B7280' },
  ctaContainer: { paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  ctaButton: { backgroundColor: '#FF6B6B', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  ctaButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default PetDetailScreen;