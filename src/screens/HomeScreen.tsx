import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Alert, PanResponder, Animated, Dimensions, 
  ActivityIndicator, Image, TouchableOpacity, StatusBar, SafeAreaView,
  Modal, Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { FilterBar } from '../components/FilterBar';
import { AnimalFilter, Pet } from '../types/types';
import { saveLikedPet } from './FavoritesScreen';

// Defina os tipos para o Tab Navigator
type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Matches: undefined;
  Chats: undefined;
  Profile: undefined;
  Pets: undefined;
};

const { width, height } = Dimensions.get('window');
const IPHONE_SCREEN = {
  width: Math.min(width, 390),
  height: Math.min(height, 844)
};

const SWIPE_THRESHOLD = IPHONE_SCREEN.width * 0.25;

const mapApiPetToLocalPet = (apiPet: any): Pet => ({
  id: apiPet.id,
  name: apiPet.name,
  type: apiPet.species === 'cachorro' ? 'Cachorro' : apiPet.species === 'gato' ? 'Gato' : apiPet.species === 'coelho' ? 'Coelho' : 'Outro',
  age: apiPet.age,
  ageUnit: apiPet.ageUnit || 'anos',
  description: apiPet.description || 'Sem descrição disponível',
  photos: apiPet.photos || [],
  breed: apiPet.breed,
  location: apiPet.location ?? 'Não informado',
  vaccinated: apiPet.healthInfo?.vaccinated ?? false,
  neutered: apiPet.healthInfo?.castrated ?? false,
  size: apiPet.size as 'Pequeno' | 'Médio' | 'Grande' | undefined,
  temperament: apiPet.personality ?? [],
  needs: apiPet.requirements ?? []
});

export const HomeScreen: React.FC = () => {
  // ✅ HOOK CORRETO para Tab Navigation
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<AnimalFilter>('all');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPets();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setCurrentIndex(0);
      const response = await fetch('http://192.168.0.103:3000/api/animals');
      const data = await response.json();
      if (data.success && data.animals) {
        const mappedPets = data.animals.map(mapApiPetToLocalPet);
        setPets(mappedPets);
        animateCardIn(mappedPets);
      } else {
        setPets([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor');
      setPets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  const animateCardIn = (petList: Pet[]) => {
    if (petList.length > 0) {
      scale.setValue(0.95);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true })
      ]).start();
    }
  };

  const filteredPets = pets.filter(pet => selectedFilter === 'all' || pet.type === selectedFilter);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
      
      const rotate = gesture.dx * 0.02;
      rotateAnim.setValue(rotate);
    },
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) forceSwipe('right');
      else if (gesture.dx < -SWIPE_THRESHOLD) forceSwipe('left');
      else resetPosition();
    },
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? IPHONE_SCREEN.width : -IPHONE_SCREEN.width;
    Animated.timing(position, { toValue: { x, y: 0 }, duration: 250, useNativeDriver: true }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const pet = filteredPets[currentIndex];
    
    if (direction === 'right') {
      await handleLike(pet);
      if (Math.random() < 0.3) {
        setMatchedPet(pet);
        setShowMatchModal(true);
      }
    }
    
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      position.setValue({ x: 0, y: 0 });
      rotateAnim.setValue(0);
      if (nextIndex < filteredPets.length) animateCardIn(filteredPets);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: true }).start();
    Animated.spring(rotateAnim, { toValue: 0, friction: 5, useNativeDriver: true }).start();
  };

  const handleLike = async (pet: Pet) => {
    await saveLikedPet(pet);
  };

  const handleManualAction = (direction: 'right' | 'left') => {
    if (currentIndex < filteredPets.length) forceSwipe(direction);
  };

  const sharePet = async (pet: Pet) => {
    try {
      await Share.share({
        message: `Conheça ${pet.name}! Um lindo ${pet.type} para adoção. Veja no App PetMatch!`,
        url: pet.photos?.[0] || '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar este pet');
    }
  };

  const getCardStyle = () => {
    const rotate = rotateAnim.interpolate({
      inputRange: [-10, 0, 10],
      outputRange: ['-8deg', '0deg', '8deg'],
      extrapolate: 'clamp'
    });

    const opacity = position.x.interpolate({
      inputRange: [-IPHONE_SCREEN.width / 2, 0, IPHONE_SCREEN.width / 2],
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp'
    });

    return { 
      transform: [...position.getTranslateTransform(), { rotate }, { scale }], 
      opacity 
    };
  };

  const renderLoader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#FF6B6B"/>
      <Text style={styles.loaderText}>Procurando pets...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="heart" size={IPHONE_SCREEN.width * 0.2} color="#FF6B6B"/>
      <Text style={styles.emptyTitle}>Não há mais pets por aqui</Text>
      <Text style={styles.emptySubtitle}>Volte mais tarde para ver novos amigos</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Feather name="refresh-cw" size={20} color="#FFFFFF"/>
        <Text style={styles.refreshButtonText}>Buscar Novos Pets</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPetCard = (pet: Pet, isTopCard: boolean) => (
    <Animated.View 
      style={[
        styles.card,
        isTopCard ? getCardStyle() : { transform: [{ scale: 0.92 }], opacity: 0.7 },
      ]}
      {...(isTopCard ? panResponder.panHandlers : {})}
    >
      <Image
        source={{ uri: pet.photos?.[0] || 'https://placehold.co/400x400/EFEFEF/3B82F6?text=Pet' }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.gradientOverlay}/>
      
      <View style={styles.badgesContainer}>
        {pet.vaccinated && (
          <View style={styles.badge}>
            <MaterialIcons name="verified" size={14} color="#FFFFFF" />
            <Text style={styles.badgeText}>Vacinado</Text>
          </View>
        )}
        {pet.neutered && (
          <View style={styles.badge}>
            <FontAwesome5 name="clinic-medical" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>Castrado</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.petInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.cardName}>{pet.name}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{pet.age} {pet.ageUnit}</Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <Feather name="map-pin" size={16} color="#FFFFFF" />
            <Text style={styles.cardInfo} numberOfLines={1}>{pet.location}</Text>
          </View>
          
          <View style={styles.detailsRow}>
            <Feather name="layers" size={16} color="#FFFFFF" />
            <Text style={styles.cardInfo}>{pet.breed || 'Sem raça definida'}</Text>
          </View>

          {pet.temperament && pet.temperament.length > 0 && (
            <View style={styles.tagsContainer}>
              {pet.temperament.slice(0, 3).map((temp, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{temp}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => sharePet(pet)}
          >
            <Feather name="share-2" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, styles.infoButton]} 
            onPress={() => navigation.navigate('PetDetail', { pet } as any)}
          >
            <Feather name="info" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderMatchModal = () => (
    <Modal
      visible={showMatchModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMatchModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Feather name="heart" size={60} color="#FF6B6B" style={styles.heartIcon} />
          <Text style={styles.modalTitle}>It's a Match! 💕</Text>
          <Text style={styles.modalText}>
            Você deu like em {matchedPet?.name}! Agora podem conversar.
          </Text>
          <Image 
            source={{ uri: matchedPet?.photos?.[0] }} 
            style={styles.modalImage}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setShowMatchModal(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Continuar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => {
                setShowMatchModal(false);
                navigation.navigate('Chat', { petName: matchedPet?.name || 'Pet' } as any);
              }}
            >
              <Text style={styles.modalButtonText}>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ✅ SOLUÇÃO CORRETA - Navegação entre tabs
  const navigateToProfile = () => {
    console.log('Navegando para TAB Profile...');
   navigation.navigate("UserProfileRoot", { screen: "UserProfile" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>PetMatch</Text>
            <Text style={styles.headerSubtitle}>Encontre seu novo amigo</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Feather name="user" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <FilterBar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        </View>

        <View style={styles.swipeArea}>
          {loading ? renderLoader() : (
            <>
              {currentIndex >= filteredPets.length ? renderEmptyState() : (
                <>
                  {filteredPets[currentIndex + 1] && renderPetCard(filteredPets[currentIndex + 1], false)}
                  {filteredPets[currentIndex] && renderPetCard(filteredPets[currentIndex], true)}
                  
                  <View style={styles.swipeIndicators}>
                    <Animated.View style={[styles.swipeIndicator, styles.dislikeIndicator]}>
                      <Feather name="x" size={32} color="#EF4444" />
                    </Animated.View>
                    <Animated.View style={[styles.swipeIndicator, styles.likeIndicator]}>
                      <Feather name="heart" size={32} color="#10B981" />
                    </Animated.View>
                  </View>
                </>
              )}
            </>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.dislikeButton]} 
            onPress={() => handleManualAction('left')}
          >
            <Feather name="x" size={28} color="#EF4444"/>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.refreshButtonSmall]} 
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Feather name="refresh-cw" size={24} color="#3B82F6"/>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]} 
            onPress={() => handleManualAction('right')}
          >
            <Feather name="heart" size={28} color="#10B981"/>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {renderMatchModal()}
    </SafeAreaView>
  );
};

// ... (os styles permanecem os mesmos)

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    maxWidth: 390,
    alignSelf: 'center',
    width: '100%'
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600'
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: { 
    fontWeight: '700', 
    color: '#374151', 
    fontSize: 20,
    marginTop: 16,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  refreshButton: { 
    flexDirection: 'row', 
    backgroundColor: '#FF6B6B', 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    borderRadius: 25, 
    alignItems: 'center', 
    gap: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  refreshButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: 16
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 24, 
    paddingVertical: 16,
    paddingTop: 8
  },
  headerTitle: { 
    fontWeight: '800', 
    color: '#1F2937',
    fontSize: 28,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FEF2F2'
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 8
  },
  swipeArea: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  card: { 
    position: 'absolute', 
    width: '88%', 
    height: '65%', 
    borderRadius: 24, 
    backgroundColor: '#E5E7EB', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 20, 
    elevation: 8,
    overflow: 'hidden',
  },
  cardImage: { 
    width: '100%', 
    height: '100%', 
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  badgesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  petInfo: {
    flex: 1
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  cardName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 12
  },
  ageBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  ageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  cardInfo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    opacity: 0.9
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  actionButtons: {
    alignItems: 'flex-end',
    gap: 12
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  infoButton: {
    backgroundColor: 'rgba(255,107,107,0.8)'
  },
  buttonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 20, 
    paddingHorizontal: 40,
    marginBottom: 16
  },
  actionButton: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 8
  },
  likeButton: { 
    shadowColor: '#10B981' 
  },
  dislikeButton: { 
    shadowColor: '#EF4444' 
  },
  refreshButtonSmall: {
    shadowColor: '#3B82F6'
  },
  swipeIndicators: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  swipeIndicator: {
    opacity: 0
  },
  likeIndicator: {
    transform: [{ rotate: '-15deg' }]
  },
  dislikeIndicator: {
    transform: [{ rotate: '15deg' }]
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320
  },
  heartIcon: {
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center'
  },
  modalButtonPrimary: {
    backgroundColor: '#FF6B6B'
  },
  modalButtonSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16
  },
  modalButtonTextSecondary: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16
  }
});

export default HomeScreen;