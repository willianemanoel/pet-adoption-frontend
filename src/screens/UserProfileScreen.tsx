//src\screens\UserProfileScreen.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MenuItem = ({ icon, text }: { icon: any; text: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color="#3B82F6" />
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <Feather name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export const UserProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }} 
            style={styles.avatar}
          />
          <Text style={styles.userName}>Maria Silva</Text>
          <Text style={styles.userEmail}>maria.silva@email.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          <MenuItem icon="user" text="Dados Pessoais" />
          <MenuItem icon="home" text="Informações da Casa" />
          <MenuItem icon="settings" text="Preferências de Adoção" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoções</Text>
          <MenuItem icon="list" text="Processos em Andamento" />
          <MenuItem icon="check-circle" text="Adoções Concluídas" />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <MenuItem icon="bell" text="Notificações" />
          <MenuItem icon="help-circle" text="Ajuda e Suporte" />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  container: { flex: 1 },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#6B7280' },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { flex: 1, fontSize: 16, color: '#1F2937', marginLeft: 16 },
  logoutButton: { margin: 24, padding: 16, backgroundColor: '#FEF2F2', borderRadius: 16, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});

export default UserProfileScreen;