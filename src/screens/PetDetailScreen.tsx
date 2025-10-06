import React from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, 
  Dimensions, SafeAreaView, StatusBar 
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

const { width, height } = Dimensions.get('window');

type PetDetailScreenRouteProp = RouteProp<HomeStackParamList, 'PetDetail'>;

interface Props {
  route: PetDetailScreenRouteProp;
  navigation: any;
}

export const PetDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pet } = route.params;

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Pet não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getSexIcon = () => 'paw';
  const getSexColor = () => '#3B82F6';
  const getLocationDisplay = () => pet.location || 'Não informada';
  const getSizeDisplay = () => pet.size || 'Não informado';

  return (
    <View style={styles.fullContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF3C7" />
      
      {/* Imagem principal */}
      <Image 
        source={{ uri: pet.photos?.[0] || 'https://via.placeholder.com/300' }} 
        style={styles.image} 
        resizeMode="cover" 
      />

      {/* Botão voltar */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nome do pet */}
          <Text style={styles.name}>{pet.name}</Text>

          {/* Grid de atributos */}
          <View style={styles.attributesGrid}>
            {/** Idade */}
            <View style={styles.attributeItem}>
              <View style={styles.attributeIcon}>
                <Feather name="calendar" size={16} color="#3B82F6" />
              </View>
              <View style={styles.attributeText}>
                <Text style={styles.attributeLabel}>Idade</Text>
                <Text style={styles.attributeValue}>
                  {pet.age} {pet.ageUnit}
                </Text>
              </View>
            </View>

            {/** Porte */}
            <View style={styles.attributeItem}>
              <View style={styles.attributeIcon}>
                <FontAwesome5 name="ruler" size={16} color="#3B82F6" />
              </View>
              <View style={styles.attributeText}>
                <Text style={styles.attributeLabel}>Porte</Text>
                <Text style={styles.attributeValue}>{getSizeDisplay()}</Text>
              </View>
            </View>

            {/** Tipo */}
            <View style={styles.attributeItem}>
              <View style={styles.attributeIcon}>
                <FontAwesome5 name={getSexIcon()} size={16} color={getSexColor()} />
              </View>
              <View style={styles.attributeText}>
                <Text style={styles.attributeLabel}>Tipo</Text>
                <Text style={styles.attributeValue}>{pet.type}</Text>
              </View>
            </View>

            {/** Localização */}
            <View style={styles.attributeItem}>
              <View style={styles.attributeIcon}>
                <Feather name="map-pin" size={16} color="#3B82F6" />
              </View>
              <View style={styles.attributeText}>
                <Text style={styles.attributeLabel}>Localização</Text>
                <Text style={styles.attributeValue}>{getLocationDisplay()}</Text>
              </View>
            </View>
          </View>

          {/* Raça (se disponível) */}
          {pet.breed && (
            <View style={styles.attributeRow}>
              <View style={styles.attributeIcon}>
                <FontAwesome5 name="paw" size={16} color="#3B82F6" />
              </View>
              <View style={styles.attributeText}>
                <Text style={styles.attributeLabel}>Raça</Text>
                <Text style={styles.attributeValue}>{pet.breed}</Text>
              </View>
            </View>
          )}

          {/* Sobre mim */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>Sobre mim</Text>
            <Text style={styles.aboutText}>
              {pet.description || 'Sem descrição disponível.'}
            </Text>
          </View>

          {/* Informações de saúde */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informações de saúde</Text>
            <View>
              <View style={styles.infoItem}>
                <Feather name="shield" size={20} color={pet.vaccinated ? "#10B981" : "#6B7280"} />
                <Text style={styles.infoText}>
                  {pet.vaccinated ? 'Vacinado' : 'Vacinação não informada'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="scissors" size={20} color={pet.neutered ? "#10B981" : "#6B7280"} />
                <Text style={styles.infoText}>
                  {pet.neutered ? 'Castrado' : 'Castração não informada'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Botão fixo */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Chat', { petId: pet.id, petName: pet.name })}
          >
            <Text style={styles.ctaButtonText}>Quero Adotar!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#FEF3C7' },
  container: { flex: 1, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  image: { width: width, height: height * 0.4 },
  backButton: {
    position: 'absolute', top: 40, left: 16, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.1, shadowRadius:4, elevation:3, zIndex:10,
  },
  contentContainer: { flex: 1, marginTop: -20 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal:16, paddingTop:20, paddingBottom:100 },
  name: { fontSize: 32, fontWeight: 'bold', color:'#1F2937', marginBottom:20, textAlign:'center' },
  attributesGrid: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginBottom:20 },
  attributeItem: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFFFFF', borderRadius:16, borderWidth:1, borderColor:'#E5E7EB', padding:16, width:'48%', marginBottom:12, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  attributeRow: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFFFFF', borderRadius:16, borderWidth:1, borderColor:'#E5E7EB', padding:16, marginBottom:20, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  attributeIcon: { width:32, height:32, borderRadius:16, backgroundColor:'rgba(59,130,246,0.1)', justifyContent:'center', alignItems:'center', marginRight:12 },
  attributeText: { flex:1 },
  attributeLabel: { fontSize:12, color:'#6B7280', marginBottom:4 },
  attributeValue: { fontSize:16, fontWeight:'600', color:'#1F2937' },
  aboutSection: { backgroundColor:'#FFFFFF', borderRadius:16, borderWidth:1, borderColor:'#E5E7EB', padding:20, marginBottom:20, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  aboutTitle: { fontSize:20, fontWeight:'bold', color:'#1F2937', marginBottom:12 },
  aboutText: { fontSize:16, color:'#4B5563', lineHeight:24 },
  infoSection: { backgroundColor:'#FFFFFF', borderRadius:16, borderWidth:1, borderColor:'#E5E7EB', padding:20, marginBottom:20, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  infoTitle: { fontSize:20, fontWeight:'bold', color:'#1F2937', marginBottom:12 },
  infoItem: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  infoText: { fontSize:16, color:'#4B5563', marginLeft:12 },
  spacer: { height: 80 },
  ctaContainer: { position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#FFFFFF', borderTopWidth:1, borderTopColor:'#E5E7EB', paddingHorizontal:16, paddingTop:16, paddingBottom:34, shadowColor:'#000', shadowOffset:{width:0,height:-2}, shadowOpacity:0.1, shadowRadius:4, elevation:5 },
  ctaButton: { backgroundColor:'#3B82F6', borderRadius:24, paddingVertical:16, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:4, elevation:3 },
  ctaButtonText: { color:'#FFFFFF', fontSize:18, fontWeight:'600' },
});

export default PetDetailScreen;
