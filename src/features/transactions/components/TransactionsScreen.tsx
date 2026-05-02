import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetTransactions } from '../hooks/useGetTransactions';

// Dados de exemplo impressionantes para caso a sua API ainda não tenha dados ou esteja offline
const MOCK_TRANSACTIONS = [
  { id: 1, description: 'Salário', amount: 8500.00, type: 'CREDIT', date: 'Hoje, 08:30', category_name: 'Receitas' },
  { id: 2, description: 'Mercado', amount: 450.90, type: 'DEBIT', date: 'Hoje, 10:15', category_name: 'Alimentação' },
  { id: 3, description: 'Uber', amount: 35.50, type: 'DEBIT', date: 'Ontem, 19:20', category_name: 'Transporte' },
  { id: 4, description: 'Netflix', amount: 39.90, type: 'DEBIT', date: '01/05/2026', category_name: 'Assinaturas' },
];

export function TransactionsScreen() {
  const { transactions, isLoading, isError } = useGetTransactions();

  // Mágica para o WOW Effect: Se a API falhar (isError) ou não trouxer nada, usamos o mock!
  const displayData = (transactions && transactions.length > 0 && !isError) ? transactions : MOCK_TRANSACTIONS;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>Olá, Davi</Text>
      <Text style={styles.balanceLabel}>Saldo Atual</Text>
      <Text style={styles.balanceValue}>R$ 12.450,00</Text>
      <View style={styles.quickActions}>
        <View style={styles.actionButton}>
          <Ionicons name="arrow-up" size={24} color="#10B981" />
        </View>
        <View style={styles.actionButton}>
          <Ionicons name="arrow-down" size={24} color="#EF4444" />
        </View>
        <View style={styles.actionButton}>
          <Ionicons name="add" size={24} color="#3B82F6" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Transações Recentes</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={displayData}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.type === 'CREDIT' ? '#10B98120' : '#EF444420' }]}>
                    <Ionicons 
                      name={item.type === 'CREDIT' ? 'arrow-down' : 'arrow-up'} 
                      size={20} 
                      color={item.type === 'CREDIT' ? '#10B981' : '#EF4444'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionDesc}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{item.category_name} • {item.date}</Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, { color: item.type === 'CREDIT' ? '#10B981' : '#F87171' }]}>
                  {item.type === 'CREDIT' ? '+' : '-'} R$ {item.amount.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' }, // Slate 900 (Dark Mode Premium)
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: '#1E293B', // Slate 800
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { color: '#94A3B8', fontSize: 16, marginBottom: 20 },
  balanceLabel: { color: '#CBD5E1', fontSize: 14, marginBottom: 4 },
  balanceValue: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', letterSpacing: -1 },
  quickActions: { flexDirection: 'row', gap: 16, marginTop: 24 },
  actionButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#334155',
    justifyContent: 'center', alignItems: 'center',
  },
  listContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  transactionCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B'
  },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  transactionDesc: { color: '#F1F5F9', fontSize: 16, fontWeight: '500', marginBottom: 2 },
  transactionDate: { color: '#64748B', fontSize: 13 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
});
