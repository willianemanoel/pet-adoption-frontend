import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, PanResponder, Animated, Dimensions,
  ActivityIndicator, Image, TouchableOpacity, StatusBar, SafeAreaView,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { FilterBar } from '../components/FilterBar';
import { AnimalFilter, Pet } from '../types/types';
import { saveLikedPet } from './FavoritesScreen';
import { AppTabParamList, RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_BASE_URL } from '../config/api';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

const mapApiPetToLocalPet = (apiPet: any): Pet => ({
    id: apiPet.id,
    name: apiPet.name,
    type: apiPet.type, 
    age: apiPet.age,
    ageUnit: apiPet.ageUnit,
    description: apiPet.description,
    photos: apiPet.photos,
    breed: apiPet.breed,
    location: apiPet.location,
    vaccinated: apiPet.vaccinated, 
    neutered: apiPet.neutered, 
    size: apiPet.size,
    sex: apiPet.sex,
    temperament: apiPet.temperament, 
    needs: apiPet.needs,
    status: apiPet.status,
    matches: apiPet.matches,
    views: apiPet.views
});

export const HomeScreen: React.FC = () => {
  const tabNavigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<AnimalFilter>('all');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);

  const position = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => { position.setValue({ x: gesture.dx, y: gesture.dy }); },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) forceSwipe('right');
        else if (gesture.dx < -SWIPE_THRESHOLD) forceSwipe('left');
        else resetPosition();
      },
    })
  ).current;

  useEffect(() => { fetchPets(); }, []);

  const fetchPets = async () => {
    setLoading(true);
    setCurrentIndex(0);
    try {
      // ✅ CORREÇÃO APLICADA AQUI: URL ajustada para /api/animals
      const response = await fetch(`${API_BASE_URL}/animals`);
      if (!response.ok) throw new Error('A resposta da rede não foi bem-sucedida');
      const data = await response.json();
      setPets(data.success && data.animals ? data.animals.map(mapApiPetToLocalPet) : []);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      Alert.alert('Erro de Conexão', 'Não foi possível buscar os pets no momento. Verifique sua conexão e o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => selectedFilter === 'all' || (pet.type && pet.type.toLowerCase() === selectedFilter.toLowerCase()));

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width : -width;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const pet = filteredPets[currentIndex];
    if (direction === 'right' && pet) {
      await handleLike(pet);
    }
    
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setCurrentIndex((prev: number) => prev + 1);
      position.setValue({ x: 0, y: 0 });
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  const handleLike = async (pet: Pet) => {
    await saveLikedPet(pet);
    if (Math.random() < 0.3) { 
      setMatchedPet(pet);
      setShowMatchModal(true);
    }
  };

  const resetPosition = () => {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: true }).start();
  };
  
  const getCardStyle = () => {
    const rotate = position.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: ['-10deg', '0deg', '10deg'], extrapolate: 'clamp' });
    return { transform: [...position.getTranslateTransform(), { rotate }], opacity: fadeAnim };
  };

  const likeOpacity = position.x.interpolate({ inputRange: [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2], outputRange: [1, 0], extrapolate: 'clamp' });

  const renderLoader = () => (
    <View style={styles.centered}><ActivityIndicator size="large" color="#FF6B6B" /><Text style={styles.loaderText}>Procurando amigos...</Text></View>
  );

  const renderEmptyState = () => (
    <View style={styles.centered}>
      <Feather name="moon" size={width * 0.2} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>Não há mais pets por aqui</Text>
      <Text style={styles.emptySubtitle}>Tente novamente mais tarde.</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchPets}>
        <Feather name="refresh-cw" size={20} color="#FFFFFF"/><Text style={styles.refreshButtonText}>Buscar de Novo</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPetCard = (pet: Pet, isTopCard: boolean) => (
    <Animated.View 
      key={pet.id}
      style={[ styles.card, isTopCard ? getCardStyle() : { transform: [{ scale: 0.95 }], top: -15, opacity: 0.7 } ]}
      {...(isTopCard ? panResponder.panHandlers : {})}
    >
      <Image source={{ uri: pet.photos?.[0] || 'https://placehold.co/600x800' }} style={styles.cardImage} />
      <View style={styles.gradientOverlay} />
      
      {isTopCard && (
        <>
          <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}><Text style={styles.stampText}>LIKE</Text></Animated.View>
          <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}><Text style={styles.stampText}>NOPE</Text></Animated.View>
        </>
      )}

      <View style={styles.cardContent}>
        <View style={styles.petInfo}>
          <Text style={styles.cardName}>{pet.name}, {pet.age} {pet.ageUnit}</Text>
          <View style={styles.locationContainer}><Feather name="map-pin" size={16} color="#FFFFFF" /><Text style={styles.cardLocation}>{pet.location}</Text></View>
        </View>
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => {
           rootNavigation.navigate('PetDetail', { pet });
          }}
        >
          <Feather name="info" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMatchModal = () => (
    <Modal visible={showMatchModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>É um Match! 🎉</Text>
          <Text style={styles.modalText}>Você e {matchedPet?.name} se curtiram!</Text>
          <View style={styles.modalImages}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }} style={styles.modalAvatar} />
            <Feather name="heart" size={24} color="#FF6B6B" style={styles.modalHeart} />
            <Image source={{ uri: matchedPet?.photos?.[0] }} style={styles.modalAvatar} />
          </View>
          <TouchableOpacity 
            style={styles.modalButtonPrimary}
            onPress={() => {
              setShowMatchModal(false);
              rootNavigation.navigate('Chat', { chatId: 'new', petName: matchedPet?.name });
            }}
          >
            <Text style={styles.modalButtonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowMatchModal(false)}>
            <Text style={styles.modalButtonTextSecondary}>Continuar Procurando</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aconchego</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => tabNavigation.navigate("Profile")}>
          <Feather name="user" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
      
      <FilterBar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      
      <View style={styles.swipeArea}>
        {loading ? renderLoader() : (
          filteredPets.length > 0 && currentIndex < filteredPets.length ? (
            <>
              {filteredPets.slice(currentIndex, currentIndex + 2).reverse().map((pet: Pet, index: number) => {
                const isTopCard = index === filteredPets.slice(currentIndex, currentIndex + 2).length - 1;
                return renderPetCard(pet, isTopCard);
              })}
            </>
          ) : renderEmptyState()
        )}
      </View>
      
      <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={() => forceSwipe('left')}>
            <Feather name="x" size={32} color="#F87171"/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => forceSwipe('right')}>
            <Feather name="heart" size={32} color="#34D399"/>
          </TouchableOpacity>
      </View>
      {renderMatchModal()}
    </SafeAreaView>
  );
};

// Seus estilos originais completos
const styles = StyleSheet.create({
  // ... (todos os seus estilos permanecem aqui, sem alterações)
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  profileButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20
  },
  swipeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '90%',
    height: height * 0.6,
    borderRadius: 24,
    position: 'absolute',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardImage: { width: '100%', height: '100%', borderRadius: 24 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.3)' },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    padding: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  petInfo: { flex: 1 },
  cardName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardLocation: { fontSize: 16, color: '#FFFFFF', marginLeft: 6, fontWeight: '500' },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  likeButton: {},
  dislikeButton: {},
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loaderText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#374151', textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 24,
    alignItems: 'center'
  },
  refreshButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, marginLeft: 8 },
  stamp: {
    position: 'absolute',
    top: 40,
    borderWidth: 5,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  likeStamp: {
    left: 20,
    borderColor: '#34D399',
    transform: [{ rotate: '-15deg' }]
  },
  nopeStamp: {
    right: 20,
    borderColor: '#F87171',
    transform: [{ rotate: '15deg' }]
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, alignItems: 'center', width: '100%' },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  modalText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  modalImages: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  modalAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFFFFF' },
  modalHeart: { marginHorizontal: -15, zIndex: 1 },
  modalButtonPrimary: { width: '100%', backgroundColor: '#FF6B6B', paddingVertical: 16, borderRadius: 16, marginBottom: 12 },
  modalButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  modalButtonSecondary: { width: '100%', paddingVertical: 16 },
  modalButtonTextSecondary: { color: '#6B7280', fontWeight: '600', fontSize: 16, textAlign: 'center' },
});

export default HomeScreen;