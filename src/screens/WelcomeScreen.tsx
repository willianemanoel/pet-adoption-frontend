// src/screens/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  StatusBar,
  Animated,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    setRole('user');
    
    // Animação de entrada
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

  const handleNavigation = (authMethod: 'google' | 'email') => {
    // Adicione lógica de autenticação aqui se necessário
    if (role === 'admin') {
      navigation.navigate('AdminLogin');
    } else {
      navigation.navigate('Main');
    }
  };

  const RoleButton = ({ title, value, icon }: { title: string; value: 'user' | 'admin'; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        role === value ? styles.roleButtonActive : styles.roleButtonInactive
      ]}
      onPress={() => setRole(value)}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={role === value ? '#3B82F6' : '#6B7280'} 
        style={styles.roleIcon}
      />
      <Text style={[
        styles.roleButtonText,
        role === value ? styles.roleButtonTextActive : styles.roleButtonTextInactive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const AuthButton = ({ 
    title, 
    method, 
    icon, 
    backgroundColor, 
    textColor,
    borderColor 
  }: { 
    title: string; 
    method: 'google' | 'email';
    icon: string;
    backgroundColor: string;
    textColor: string;
    borderColor?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.authButton,
        { backgroundColor, borderColor: borderColor || backgroundColor }
      ]}
      onPress={() => handleNavigation(method)}
    >
      <Ionicons name={icon as any} size={20} color={textColor} />
      <Text style={[styles.authButtonText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF3C7" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Logo e título animados */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: '/logo-aconchego.svg' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Encontre seu novo melhor amigo</Text>
              <Text style={styles.subtitle}>
                Adoção responsável com carinho e segurança. Conectamos animais 
                que precisam de um lar a pessoas dispostas a dar amor.
              </Text>
            </View>
          </View>

          {/* Seletor de papel */}
          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>Como você quer acessar?</Text>
            <View style={styles.roleSelector}>
              <RoleButton 
                title="Sou Adotante" 
                value="user" 
                icon="heart-outline" 
              />
              <RoleButton 
                title="Sou ONG/Admin" 
                value="admin" 
                icon="business-outline" 
              />
            </View>
          </View>

          {/* Botões de autenticação */}
          <View style={styles.authSection}>
            <AuthButton
              title="Continuar com Google"
              method="google"
              icon="logo-google"
              backgroundColor="#FFFFFF"
              textColor="#1F2937"
              borderColor="#D1D5DB"
            />
            
            <AuthButton
              title="Continuar com E-mail"
              method="email"
              icon="mail-outline"
              backgroundColor="#3B82F6"
              textColor="#FFFFFF"
            />

            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.skipButtonText}>
                Explorar sem fazer login
              </Text>
            </TouchableOpacity>
          </View>

          {/* Termos e condições */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao continuar, você concorda com nossos {' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e {' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  roleSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 140,
    justifyContent: 'center',
  },
  roleButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  roleButtonInactive: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  roleIcon: {
    marginRight: 8,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#3B82F6',
  },
  roleButtonTextInactive: {
    color: '#6B7280',
  },
  authSection: {
    gap: 16,
    marginBottom: 24,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  termsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default WelcomeScreen;