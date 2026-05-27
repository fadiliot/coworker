import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../src/constants/theme';

const DUMMY_FOLLOWUPS = [
  {
    id: '1',
    lead: 'Alice Freeman',
    company: 'TechCorp',
    email: 'alice.freeman@techcorp.io',
    subject: 'Re: Demo Request for Your AI Platform',
    scheduledFor: '2026-05-13T10:00:00Z',
    scheduledLabel: 'May 13 at 10:00 AM',
    draftText: 'Hi Alice,\n\nJust following up on my previous email about the demo. I\'d love to connect and show you how our platform can help TechCorp.\n\nAre you available for a 30-minute call this week?\n\nBest regards',
    status: 'PENDING_APPROVAL',
  },
  {
    id: '2',
    lead: 'Bob Smith',
    company: 'Acme Inc',
    email: 'bob.smith@acme.com',
    subject: 'Pricing Information Follow-up',
    scheduledFor: '2026-05-14T14:00:00Z',
    scheduledLabel: 'May 14 at 2:00 PM',
    draftText: 'Hi Bob,\n\nI wanted to follow up on your pricing inquiry. I\'ve attached our latest pricing guide.\n\nLet me know if you have any questions!\n\nBest',
    status: 'PENDING_APPROVAL',
  },
  {
    id: '3',
    lead: 'BigCorp Marketing',
    company: 'BigCorp',
    email: 'marketing@bigcorp.com',
    subject: 'Partnership Opportunity - Next Steps',
    scheduledFor: '2026-05-16T09:00:00Z',
    scheduledLabel: 'May 16 at 9:00 AM',
    draftText: 'Hi,\n\nThank you for reaching out about a potential partnership! I\'d love to explore this further.\n\nWould you be available for an introductory call next week?',
    status: 'APPROVED',
  },
];

export default function FollowupsScreen() {
  const [followups, setFollowups] = useState(DUMMY_FOLLOWUPS);

  const handleApprove = (id: string) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'APPROVED' } : f))
    );
  };

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Follow-up', 'Remove this scheduled follow-up?', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setFollowups((prev) => prev.filter((f) => f.id !== id)) },
    ]);
  };

  const pending = followups.filter((f) => f.status === 'PENDING_APPROVAL');
  const approved = followups.filter((f) => f.status === 'APPROVED');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Follow-ups</Text>
        <Text style={styles.subtitle}>AI-scheduled follow-ups awaiting your approval.</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#3d2e00' }]}>
            <Text style={[styles.statNum, { color: COLORS.yellow }]}>{pending.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#0f3320' }]}>
            <Text style={[styles.statNum, { color: COLORS.green }]}>{approved.length}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{followups.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Pending */}
        {pending.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={15} color={COLORS.yellow} />
              <Text style={styles.sectionTitle}>Awaiting Approval</Text>
            </View>
            {pending.map((f) => (
              <View key={f.id} style={[styles.card, styles.cardPending]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarText}>{f.lead.charAt(0)}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardLead}>{f.lead}
                      {f.company ? <Text style={styles.cardCompany}> · {f.company}</Text> : null}
                    </Text>
                    <Text style={styles.cardSubject} numberOfLines={1}>{f.subject}</Text>
                    <View style={styles.scheduleRow}>
                      <Ionicons name="calendar-outline" size={12} color={COLORS.muted} />
                      <Text style={styles.scheduleText}>{f.scheduledLabel}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.draftBox}>
                  <Text style={styles.draftText} numberOfLines={3}>{f.draftText}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(f.id)}>
                    <Ionicons name="close" size={14} color={COLORS.red} />
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(f.id)}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Approved */}
        {approved.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={15} color={COLORS.green} />
              <Text style={styles.sectionTitle}>Approved & Scheduled</Text>
            </View>
            {approved.map((f) => (
              <View key={f.id} style={[styles.card, { opacity: 0.7 }]}>
                <View style={styles.cardTop}>
                  <View style={[styles.cardAvatar, { backgroundColor: COLORS.mutedBg }]}>
                    <Text style={styles.cardAvatarText}>{f.lead.charAt(0)}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={styles.approvedRow}>
                      <Text style={styles.cardLead}>{f.lead}</Text>
                      <View style={styles.approvedBadge}>
                        <Text style={styles.approvedBadgeText}>Scheduled</Text>
                      </View>
                    </View>
                    <Text style={styles.cardSubject} numberOfLines={1}>{f.subject}</Text>
                    <View style={styles.scheduleRow}>
                      <Ionicons name="calendar" size={12} color={COLORS.green} />
                      <Text style={[styles.scheduleText, { color: COLORS.green }]}>Sends {f.scheduledLabel}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {followups.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color={COLORS.muted} />
            <Text style={styles.emptyText}>No follow-ups scheduled</Text>
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.foreground, paddingTop: 20, marginBottom: 4 },
  subtitle: { color: COLORS.muted, fontSize: 13, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  statNum: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.foreground },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12, overflow: 'hidden' },
  cardPending: { borderColor: '#3d2e00' },
  cardTop: { flexDirection: 'row', gap: 12, padding: 14 },
  cardAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  cardAvatarText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardMeta: { flex: 1 },
  cardLead: { fontSize: 14, fontWeight: '700', color: COLORS.foreground },
  cardCompany: { fontSize: 13, color: COLORS.muted, fontWeight: '400' },
  cardSubject: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  scheduleText: { fontSize: 11, color: COLORS.muted },
  draftBox: { backgroundColor: COLORS.mutedBg, marginHorizontal: 14, marginBottom: 12, borderRadius: RADIUS.sm, padding: 10 },
  draftText: { fontSize: 12, color: '#a1a1aa', lineHeight: 18, fontFamily: 'Courier' },
  cardActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  cancelBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#3d1515', paddingVertical: 9 },
  cancelText: { color: COLORS.red, fontWeight: '600', fontSize: 13 },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary, paddingVertical: 9 },
  approveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  approvedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  approvedBadge: { backgroundColor: '#0f3320', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  approvedBadgeText: { color: COLORS.green, fontSize: 10, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: COLORS.muted, fontSize: 14 },
});
