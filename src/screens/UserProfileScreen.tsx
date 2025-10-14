import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const MenuItem = ({ icon, text, onPress, isLast }: { icon: any; text: string; onPress?: () => void; isLast?: boolean }) => (
  <TouchableOpacity style={[styles.menuItem, isLast && styles.menuItemLast]} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color="#3B82F6" />
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <Feather name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

interface User {
  name: string;
  email: string;
  avatar: string;
}

export const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de chamada de API para buscar dados do usuário
    const fetchUser = async () => {
      setLoading(true);
      setTimeout(() => {
        setUser({
          name: 'Maria Silva',
          email: 'maria.silva@email.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        });
        setLoading(false);
      }, 1000);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Você tem certeza de que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }) }
      ]
    );
  };

  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: user?.avatar }} 
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Minha Conta</Text>
            <View style={styles.menuSection}>
                <MenuItem icon="user" text="Dados Pessoais" />
                <MenuItem icon="settings" text="Preferências de Adoção" isLast />
            </View>

            <Text style={styles.sectionTitle}>App</Text>
            <View style={styles.menuSection}>
                <MenuItem icon="bell" text="Notificações" />
                <MenuItem icon="help-circle" text="Ajuda e Suporte" isLast />
            </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF6B6B'
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#6B7280' },
  menuContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 16
  },
  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600'
  },
});

export default UserProfileScreen;