import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Pet } from '../types/types';

interface PetCardProps {
  pet: Pet;
  onLike: () => void;
  onDislike: () => void;
  onShowDetails: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  animation: Animated.Value;
}

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onLike,
  onDislike,
  onShowDetails,
  onToggleFavorite,
  isFavorite,
  animation
}) => {
  const getPetEmoji = (type: string): string => {
    switch (type) {
      case 'Cachorro': return '🐕';
      case 'Gato': return '🐈';
      case 'Coelho': return '🐇';
      default: return '🐾';
    }
  };

  const getSizeColor = (size: string): string => {
    switch (size) {
      case 'Pequeno': return '#4CAF50';
      case 'Médio': return '#FF9800';
      case 'Grande': return '#F44336';
      default: return '#757575';
    }
  };

  const cardStyle = {
    transform: [
      { 
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        }) 
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1]
        })
      }
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Botão de Favorito */}
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      {/* Imagem/Emoji do Pet */}
      <TouchableOpacity onPress={onShowDetails}>
        <View style={styles.petImage}>
          <Text style={styles.emoji}>
            {getPetEmoji(pet.type)}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Informações do Pet */}
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDetails}>
        {pet.breed} • {pet.age} {pet.age === 1 ? 'ano' : 'anos'} • {pet.location}
      </Text>
      
      {/* Tags de Informação */}
      <View style={styles.petInfo}>
        <Text style={styles.infoItem}>🏥 {pet.vaccinated ? 'Vacinado' : 'Não vacinado'}</Text>
        <Text style={styles.infoItem}>✂️ {pet.neutered ? 'Castrado' : 'Não castrado'}</Text>
        {pet.size && (
          <Text style={[styles.infoItem, { backgroundColor: getSizeColor(pet.size) }]}>
            📏 {pet.size}
          </Text>
        )}
      </View>
      
      {/* Descrição */}
      <Text style={styles.petDescription} numberOfLines={3}>
        {pet.description}
      </Text>
      
      {/* Botões de Ação */}
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]}
          onPress={onDislike}
        >
          <Text style={styles.buttonText}>👎 Não</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.likeButton]}
          onPress={onLike}
        >
          <Text style={styles.buttonText}>💖 Sim!</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  petImage: {
    backgroundColor: '#4CAF50',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  emoji: {
    fontSize: 60,
  },
  petName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2d3436',
    textAlign: 'center',
  },
  petDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  petInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  infoItem: {
    fontSize: 12,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    color: '#666',
    fontWeight: '600',
  },
  petDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  dislikeButton: {
    backgroundColor: '#ff6b6b',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PetCard;