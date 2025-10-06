// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Alert, PanResponder, Animated, Dimensions, 
  ActivityIndicator, Image, TouchableOpacity, StatusBar, SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { FilterBar } from '../components/FilterBar';
import { AnimalFilter, Pet } from '../types/types';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { saveLikedPet } from './FavoritesScreen'; // Mude para saveLikedPet

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.2;
const SWIPE_OUT_DURATION = 300;

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const mapApiPetToLocalPet = (apiPet: any): Pet => {
  return {
    id: apiPet.id,
    name: apiPet.name,
    type: apiPet.species === 'cachorro' ? 'Cachorro' : 
          apiPet.species === 'gato' ? 'Gato' : 
          apiPet.species === 'coelho' ? 'Coelho' : 'Outro',
    age: apiPet.age,
    ageUnit: apiPet.ageUnit || 'anos',
    description: apiPet.description || 'Sem descrição disponível',
    photos: apiPet.photos || [],
    breed: apiPet.breed,
    location: apiPet.location,
    vaccinated: apiPet.vaccinated,
    neutered: apiPet.neutered,
    size: apiPet.size as 'Pequeno' | 'Médio' | 'Grande' | undefined,
    temperament: apiPet.temperament,
    needs: apiPet.needs
  };
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLikeIndicator, setShowLikeIndicator] = useState(false);
  const [showDislikeIndicator, setShowDislikeIndicator] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<AnimalFilter>('all');
  
  const position = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    fetchPets();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.107:3000/api/animals');
      
      if (!response.ok) throw new Error('Erro ao carregar pets');
      
      const data = await response.json();
      
      if (data.success && data.animals) {
        const mappedPets = data.animals.map(mapApiPetToLocalPet);
        setPets(mappedPets);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os pets');
        setPets([]);
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPets = () => {
    return pets.filter(pet => 
      selectedFilter === 'all' ? true : pet.type === selectedFilter
    );
  };

  const filteredPets = getFilteredPets();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,
    onPanResponderGrant: () => {
      position.setValue({ x: 0, y: 0 });
      Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true }).start();
    },
    onPanResponderMove: (e, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy * 0.3 });
      
      if (gesture.dx > 40) {
        setShowLikeIndicator(true);
        setShowDislikeIndicator(false);
      } else if (gesture.dx < -40) {
        setShowDislikeIndicator(true);
        setShowLikeIndicator(false);
      } else {
        setShowLikeIndicator(false);
        setShowDislikeIndicator(false);
      }
    },
    onPanResponderRelease: (e, gesture) => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
      setShowLikeIndicator(false);
      setShowDislikeIndicator(false);
      
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
    onPanResponderTerminate: () => {
      resetPosition();
      setShowLikeIndicator(false);
      setShowDislikeIndicator(false);
    }
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width : -width;
    Animated.timing(position, { 
      toValue: { x: x * 1.5, y: 0 }, 
      duration: SWIPE_OUT_DURATION, 
      useNativeDriver: true 
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const pet = filteredPets[currentIndex];
    if (direction === 'right') {
      handleLike(pet.id);
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, { 
      toValue: { x: 0, y: 0 }, 
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  };

 const handleLike = async (petId: number) => {
  try {
    const response = await fetch(`http://192.168.0.107:3000/api/animals/${petId}/like`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ userId: 1 })
    });
    const data = await response.json();
    if (data.success) {
      // ✅ AGORA SALVA O PET COMPLETO!
      const currentPet = pets.find(p => p.id === petId);
      if (currentPet) {
        await saveLikedPet(currentPet); // Use saveLikedPet em vez de saveLikedPetId
      }
      console.log('❤️ Pet adicionado aos favoritos');
    }
  } catch (error) {
    console.error('Erro ao curtir pet:', error);
  }
};

  const handleManualLike = () => { 
    if (currentIndex < filteredPets.length) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
      
      setTimeout(() => {
        forceSwipe('right');
      }, 150);
    }
  };

  const handleManualDislike = () => { 
    if (currentIndex < filteredPets.length) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
      
      setTimeout(() => {
        forceSwipe('left');
      }, 150);
    }
  };

  const handleCardPress = () => {
    navigation.navigate('PetDetail', { pet: filteredPets[currentIndex] });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({ 
      inputRange: [-width/2, 0, width/2], 
      outputRange: ['-15deg', '0deg', '15deg'], 
      extrapolate: 'clamp' 
    });
    
    return { 
      transform: [
        { translateX: position.x }, 
        { translateY: position.y },
        { rotate },
        { scale: scaleAnim }
      ] 
    };
  };

  const handleRefresh = () => { 
    setCurrentIndex(0); 
    fetchPets(); 
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F59E0B"/>
          <Text style={styles.loadingText}>Procurando pets fofinhos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= filteredPets.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="search" size={60} color="#F59E0B"/>
          </View>
          <Text style={styles.emptyTitle}>Não há mais pets por aqui</Text>
          <Text style={styles.emptySubtitle}>
            Todos os pets disponíveis foram mostrados. Volte mais tarde para novos amigos!
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Feather name="refresh-cw" size={20} color="#FFFFFF"/>
            <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentPet = filteredPets[currentIndex];
  const nextPets = filteredPets.slice(currentIndex + 1, currentIndex + 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF3C7"/>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Encontrar Pets</Text>
          <Text style={styles.headerSubtitle}>Deslize para descobrir novos amigos</Text>
        </View>
      </View>

      {/* FilterBar */}
      <View style={styles.filterContainer}>
        <FilterBar
          selectedFilter={selectedFilter}
          onFilterChange={(filter) => {
            setSelectedFilter(filter);
            setCurrentIndex(0);
          }}
        />
      </View>

      {/* Área dos Cards */}
      <View style={styles.swipeArea}>
        <View style={styles.swipeContainer}>
          {/* Cards de Fundo */}
          {nextPets.map((pet, index) => (
            <View 
              key={pet.id} 
              style={[
                styles.card, 
                styles.nextCard, 
                { 
                  zIndex: nextPets.length - index,
                  top: 20 + (index * 15),
                  opacity: 0.9 - index * 0.4
                }
              ]}
            >
              <Image 
                source={{ uri: pet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400' }} 
                style={styles.cardImage}
                blurRadius={2}
              />
            </View>
          ))}

          {/* Card Principal */}
          {currentPet && (
            <Animated.View 
              style={[styles.card, styles.mainCard, getCardStyle()]} 
              {...panResponder.panHandlers}
            >
              {/* Indicadores de Swipe */}
              {showLikeIndicator && (
                <Animated.View style={[styles.indicator, styles.likeIndicator]}>
                  <Feather name="heart" size={50} color="#10B981"/>
                  <Text style={styles.indicatorText}>Gostei!</Text>
                </Animated.View>
              )}
              {showDislikeIndicator && (
                <Animated.View style={[styles.indicator, styles.dislikeIndicator]}>
                  <Feather name="x" size={50} color="#EF4444"/>
                  <Text style={styles.indicatorText}>Não</Text>
                </Animated.View>
              )}

              {/* Imagem do Pet */}
              <Image 
                source={{ uri: currentPet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400' }} 
                style={styles.cardImage}
                resizeMode="cover"
              />
              
              {/* Botão de Detalhes */}
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={handleCardPress}
              >
                <Feather name="info" size={18} color="#FFFFFF" />
                <Text style={styles.detailButtonText}>Detalhes</Text>
              </TouchableOpacity>

              {/* Informações do Pet */}
              <View style={styles.cardContent}>
                <View style={styles.petHeader}>
                  <Text style={styles.cardName}>{currentPet.name}</Text>
                  <View style={[
                    styles.petTypeBadge,
                    currentPet.type === 'Cachorro' && styles.dogBadge,
                    currentPet.type === 'Gato' && styles.catBadge,
                    currentPet.type === 'Coelho' && styles.rabbitBadge
                  ]}>
                    <Text style={styles.petTypeText}>{currentPet.type}</Text>
                  </View>
                </View>
                
                <Text style={styles.cardBreed}>{currentPet.breed || 'Sem raça definida'}</Text>
                
                <View style={styles.petInfo}>
                  <View style={styles.infoItem}>
                    <Feather name="calendar" size={14} color="#78350F"/>
                    <Text style={styles.infoText}>{currentPet.age} {currentPet.ageUnit}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Feather name="maximize" size={14} color="#78350F"/>
                    <Text style={styles.infoText}>{currentPet.size}</Text>
                  </View>
                </View>

                {currentPet.description && (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {currentPet.description}
                  </Text>
                )}
              </View>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dislikeButton]} 
          onPress={handleManualDislike}
          activeOpacity={0.7}
        >
          <Feather name="x" size={32} color="#EF4444"/>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]} 
          onPress={handleManualLike}
          activeOpacity={0.7}
        >
          <Feather name="heart" size={32} color="#10B981"/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FEF3C7' 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FEF3C7'
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#78350F',
    fontFamily: 'System'
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40,
    backgroundColor: '#FEF3C7'
  },
  emptyIcon: {
    backgroundColor: '#FEF3C7',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#78350F', 
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#92400E', 
    textAlign: 'center', 
    lineHeight: 22
  },
  refreshButton: { 
    flexDirection: 'row', 
    backgroundColor: '#F59E0B', 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  refreshButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600',
    marginLeft: 8 
  },
  header: { 
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 8,
    backgroundColor: '#FEF3C7'
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#78350F',
    fontFamily: 'System'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#92400E',
    marginTop: 4
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#FEF3C7'
  },
  swipeArea: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  swipeContainer: { 
    flex: 1,
    position: 'relative'
  },
  card: { 
    position: 'absolute', 
    width: '100%', 
    height: 500,
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4
  },
  mainCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  nextCard: { 
    marginHorizontal: 8 
  },
  cardImage: { 
    width: '100%', 
    height: 350 
  },
  cardContent: { 
    padding: 20,
    flex: 1
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  cardName: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1F2937',
    fontFamily: 'System',
    flex: 1
  },
  petTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8
  },
  dogBadge: {
    backgroundColor: '#FEF3C7',
  },
  catBadge: {
    backgroundColor: '#E0E7FF',
  },
  rabbitBadge: {
    backgroundColor: '#FCE7F3',
  },
  petTypeText: {
    color: '#78350F',
    fontSize: 12,
    fontWeight: '700'
  },
  cardBreed: { 
    fontSize: 16, 
    color: '#6B7280', 
    marginBottom: 12 
  },
  petInfo: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  infoText: {
    fontSize: 12,
    color: '#78350F',
    marginLeft: 4,
    fontWeight: '600'
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20
  },
  indicator: { 
    position: 'absolute', 
    top: 30, 
    zIndex: 100, 
    padding: 12, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  likeIndicator: { 
    left: 20,
    borderWidth: 3,
    borderColor: '#10B981'
  },
  dislikeIndicator: { 
    right: 20,
    borderWidth: 3,
    borderColor: '#EF4444'
  },
  indicatorText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937'
  },
  buttonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: '#FEF3C7'
  },
  actionButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6
  },
  likeButton: {
    shadowColor: '#10B981',
  },
  dislikeButton: {
    shadowColor: '#EF4444',
  },
  detailButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 20
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  }
});

export default HomeScreen;