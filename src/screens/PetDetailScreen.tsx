import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, FlatList, Image } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Storage } from '../utils/storage';
import { Pet } from '../types/types';
import PetCard from '../components/PetCard'; // ✅ 1. Importa o componente PetCard

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetail'>;

// Simulação de outros pets para a nova seção
const similarPets: Pet[] = [
    { id: 2, name: 'Luna', location: 'Rio de Janeiro, RJ', photos: ['https://cdn2.thecatapi.com/images/5g5.jpg'] },
    { id: 4, name: 'Thor', location: 'Curitiba, PR', photos: ['https://images.dog.ceo/breeds/labrador/n02099712_5088.jpg'] },
    { id: 1, name: 'Rex', location: 'São Paulo, SP', photos: ['https://images.dog.ceo/breeds/retriever-golden/n02099601_3332.jpg'] },
];

const PetDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pet } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favoritesJSON = await Storage.getItem('favoritePets');
        const favorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
        setIsFavorite(favorites.some(fav => fav.id === pet.id));
      } catch (e) {
        console.error("Failed to check favorites", e);
      }
    };
    checkFavorite();
  }, [pet.id]);

  const toggleFavorite = async () => {
    try {
      const favoritesJSON = await Storage.getItem('favoritePets');
      let favorites: Pet[] = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== pet.id);
      } else {
        favorites.push(pet);
      }
      await Storage.setItem('favoritePets', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Failed to toggle favorite", e);
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FlatList
            data={petImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
          />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
              <Feather name="heart" size={24} color={isFavorite ? '#EF4444' : '#1F2937'} fill={isFavorite ? '#EF4444' : 'none'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color="#6B7280" />
            <Text style={styles.locationText}>{pet.location}</Text>
          </View>

          <View style={styles.attributesGrid}>
            <AttributeCard label="Idade" value={`${pet.age} ${pet.ageUnit}`} icon="calendar" />
            <AttributeCard label="Porte" value={pet.size || 'N/A'} icon="maximize-2" />
            <AttributeCard label="Raça" value={pet.breed || 'SRD'} icon="git-merge" />
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

          {/* ✅ 2. Seção "Você também pode gostar" com o PetCard integrado */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Você também pode gostar</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={similarPets.filter(p => p.id !== pet.id)} // Não mostra o pet atual na lista de sugestões
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: width / 2, marginRight: 16 }}>
                  <PetCard 
                    pet={item} 
                    // Usa navigation.push para empilhar uma nova tela de detalhes
                    onPress={() => navigation.push('PetDetail', { pet: item })}
                  />
                </View>
              )}
            />
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

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: height * 0.45 },
  image: { width: width, height: '100%' },
  headerActions: { position: 'absolute', top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center' },
  contentContainer: { paddingHorizontal: 24, paddingTop: 24, marginTop: -30, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  petName: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  locationText: { fontSize: 16, color: '#6B7280', marginLeft: 8 },
  attributesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, marginHorizontal: -6 },
  attributeCard: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 6 },
  attributeLabel: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  attributeValue: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  sectionText: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  healthItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 8 },
  healthLabel: { flex: 1, fontSize: 16, color: '#374151', marginLeft: 12 },
  healthValue: { fontSize: 16, fontWeight: '600' },
  ctaContainer: { paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  ctaButton: { backgroundColor: '#FF6B6B', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  ctaButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default PetDetailScreen;