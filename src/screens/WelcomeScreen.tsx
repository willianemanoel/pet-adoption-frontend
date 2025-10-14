import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [agreed, setAgreed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleNavigation = (role: 'user' | 'admin') => {
    if (!agreed) {
      Alert.alert("Termos de Uso", "Você precisa concordar com os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }
    if (role === 'admin') {
      navigation.navigate('AdminLogin');
    } else {
      navigation.navigate('Main', { screen: 'HomeStack' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}><Feather name="heart" size={48} color="#EF4444" /></View>
          <Text style={styles.title}>Bem-vindo ao Aconchego</Text>
          <Text style={styles.subtitle}>Conectamos corações. Encontre seu novo melhor amigo.</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('user')}>
            <Text style={styles.buttonText}>Quero Adotar um Pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => handleNavigation('admin')}>
            <Text style={[styles.buttonText, styles.adminButtonText]}>Sou uma ONG / Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Feather name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              Eu concordo com os <Text style={styles.termsLink}>Termos de Uso</Text> e a <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </TouchableOpacity>
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
  button: { backgroundColor: '#3B82F6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  adminButton: { backgroundColor: '#EFF6FF' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  adminButtonText: { color: '#3B82F6' },
  termsContainer: { marginTop: 40, alignItems: 'center' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  termsText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },
  termsLink: { color: '#3B82F6', fontWeight: '500', textDecorationLine: 'underline' },
});

export default WelcomeScreen;