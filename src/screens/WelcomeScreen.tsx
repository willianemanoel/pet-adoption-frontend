// src/screens/WelcomeScreen.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleNavigation = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      navigation.navigate('AdminLogin');
    } else {
      // Navega para o Tab Navigator 'Main' e seleciona a aba 'Home'
      navigation.navigate('Main', { screen: 'Home' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="heart" size={48} color="#EF4444" />
          </View>
          <Text style={styles.title}>Bem-vindo ao Aconchego</Text>
          <Text style={styles.subtitle}>
            Conectamos corações. Encontre seu novo melhor amigo para uma jornada de amor e companheirismo.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => handleNavigation('user')}
          >
            <Feather name="home" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Quero Adotar um Pet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={() => handleNavigation('admin')}
          >
            <Feather name="shield" size={20} color="#3B82F6" />
            <Text style={[styles.buttonText, styles.adminButtonText]}>Sou uma ONG / Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 60 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#1F2937', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  buttonContainer: { gap: 16 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 16, gap: 12 },
  userButton: { backgroundColor: '#3B82F6' },
  adminButton: { backgroundColor: '#EFF6FF' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  adminButtonText: { color: '#3B82F6' },
  termsContainer: { padding: 20, marginTop: 60, alignItems: 'center' },
  termsText: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18 },
  termsLink: { color: '#3B82F6', fontWeight: '500' },
});

export default WelcomeScreen;
