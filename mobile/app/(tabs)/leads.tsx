import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, RADIUS } from '../../src/constants/theme';
import { fetchLeads } from '../../src/services/api';
import { useFocusEffect } from '@react-navigation/native';

const STATUS_COLOR: Record<string, string> = {
  NEW: COLORS.primary,
  CONTACTED: COLORS.yellow,
  QUALIFIED: COLORS.green,
  LOST: COLORS.red,
};

const FILTERS = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

export default function LeadsScreen() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useFocusEffect(
    useCallback(() => {
      fetchLeads().then(setLeads);
    }, [])
  );

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Lead Tracking</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length} leads</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>AI-extracted leads from monitored emails.</Text>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={COLORS.muted} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search leads..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.filtersWrap}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.leadCard}
            activeOpacity={0.75}
            onPress={() => router.push(`/leads/${item.id}`)}
          >
            <View style={styles.leadAvatar}>
              <Text style={styles.leadAvatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.leadInfo}>
              <View style={styles.leadNameRow}>
                <Text style={styles.leadName}>{item.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] || COLORS.muted }]} />
              </View>
              <Text style={styles.leadCompany}>{item.company}</Text>
              <Text style={styles.leadIntent} numberOfLines={1}>{item.intent}</Text>
            </View>
            <View style={styles.leadRight}>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
              </View>
              <Text style={styles.taskCount}>{item.tasks} tasks</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.muted} style={{ marginTop: 4 }} />
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={COLORS.muted} />
            <Text style={styles.emptyText}>No leads found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 20, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.foreground },
  countBadge: { backgroundColor: COLORS.secondary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  countText: { color: COLORS.muted, fontSize: 12, fontWeight: '600' },
  subtitle: { color: COLORS.muted, fontSize: 13, paddingHorizontal: 16, marginBottom: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: 16, marginBottom: 12 },
  searchInput: { flex: 1, color: COLORS.foreground, fontSize: 14, padding: 12 },
  filtersWrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 14, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  filterTextActive: { color: '#fff' },
  leadCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  leadAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.mutedBg, alignItems: 'center', justifyContent: 'center' },
  leadAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.foreground },
  leadInfo: { flex: 1 },
  leadNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leadName: { fontSize: 14, fontWeight: '700', color: COLORS.foreground },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  leadCompany: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  leadIntent: { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  leadRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '700' },
  taskCount: { fontSize: 11, color: COLORS.muted },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: COLORS.muted, fontSize: 14 },
});
