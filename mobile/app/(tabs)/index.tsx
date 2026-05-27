import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, RADIUS } from '../../src/constants/theme';

const STATS = [
  { label: 'Total Leads', value: '248', icon: 'people' as const, color: COLORS.primary, bg: '#1e3a5f' },
  { label: 'Pending Tasks', value: '3', icon: 'checkmark-circle' as const, color: COLORS.yellow, bg: '#3d2e00' },
  { label: 'Emails Today', value: '12', icon: 'mail' as const, color: COLORS.primary, bg: '#1e3a5f' },
  { label: 'Follow-ups', value: '7', icon: 'time' as const, color: COLORS.green, bg: '#0f3320' },
];

const ACTIVITY = [
  { action: 'Lead Detected', detail: 'Alice Freeman · TechCorp', time: '5m ago', color: COLORS.primary },
  { action: 'Draft Response Generated', detail: 'For Alice Freeman', time: '5m ago', color: COLORS.yellow },
  { action: 'Email Sent', detail: 'To Bob Smith · Acme Inc', time: '1h ago', color: COLORS.green },
  { action: 'Follow-up Scheduled', detail: 'BigCorp Partnership', time: '2h ago', color: COLORS.purple },
  { action: 'Lead Detected', detail: 'Charlie Davis · Startup.co', time: '3h ago', color: COLORS.primary },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.title}>SalesHub AI</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FA</Text>
          </View>
        </View>


        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: COLORS.card }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/approvals')}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.yellow} />
            <Text style={styles.actionText}>Review Tasks</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/leads')}>
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>View Leads</Text>
          </TouchableOpacity>
        </View>

        {/* Activity feed */}
        <Text style={styles.sectionTitle}>Recent AI Activity</Text>
        <View style={styles.card}>
          {ACTIVITY.map((item, i) => (
            <View key={i} style={[styles.activityItem, i < ACTIVITY.length - 1 && styles.activityBorder]}>
              <View style={[styles.activityDot, { backgroundColor: item.color }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{item.action}</Text>
                <Text style={styles.activityDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  greeting: { fontSize: 13, color: COLORS.muted, marginBottom: 2 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.foreground },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d2a1a', borderRadius: RADIUS.md, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#1a4a2e' },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.green, marginRight: 8 },
  statusText: { color: COLORS.green, fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: '47%', borderRadius: RADIUS.lg, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12, color: COLORS.muted },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.foreground, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  actionText: { flex: 1, color: COLORS.foreground, fontWeight: '600', fontSize: 13 },
  badge: { backgroundColor: COLORS.yellow, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#000', fontSize: 11, fontWeight: '800' },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityContent: { flex: 1 },
  activityAction: { fontSize: 13, fontWeight: '600', color: COLORS.foreground },
  activityDetail: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  activityTime: { fontSize: 11, color: COLORS.muted },
});
