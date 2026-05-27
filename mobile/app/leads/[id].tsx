import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../src/constants/theme';
import { getLeadById } from '../../src/services/api';

const STATUS_COLOR: Record<string, string> = {
  NEW: COLORS.primary,
  CONTACTED: COLORS.yellow,
  QUALIFIED: COLORS.green,
  LOST: COLORS.red,
};

// AI-generated insights (dummy per lead for MVP)
const AI_INSIGHTS: Record<string, { summary: string; nextAction: string; priority: string; sentiment: string }> = {
  '1': {
    summary: 'Alice is actively looking for a demo and appears highly interested. She mentioned a 50-person team which signals a mid-market deal.',
    nextAction: 'Schedule a product demo call within 24 hours to capitalize on their high intent.',
    priority: 'High',
    sentiment: 'Very Positive 🟢',
  },
  '2': {
    summary: 'Bob has a specific pricing question. This is a comparison-stage prospect. Sending a personalized pricing sheet can accelerate the decision.',
    nextAction: 'Send a customized pricing deck with enterprise options highlighted.',
    priority: 'Medium',
    sentiment: 'Neutral 🟡',
  },
  '3': {
    summary: 'Charlie is a technical decision-maker hitting integration blockers. Solving this directly positions the product as developer-friendly.',
    nextAction: 'Connect them with a solutions engineer within 48 hours.',
    priority: 'High',
    sentiment: 'Positive 🟢',
  },
  '4': {
    summary: 'BigCorp serves 10,000+ SMBs, representing a potential high-value partnership channel. This requires senior stakeholder involvement.',
    nextAction: 'Route to the Partnerships team and schedule a discovery call.',
    priority: 'High',
    sentiment: 'Positive 🟢',
  },
  '5': {
    summary: 'Diana is looking for enterprise-grade features and compliance. This deal size is likely $50K+.',
    nextAction: 'Send an enterprise case study and request a security/compliance call.',
    priority: 'High',
    sentiment: 'Positive 🟢',
  },
};

const TIMELINE = [
  { event: 'Lead created from email', time: 'May 11 at 1:30 PM', icon: 'mail-outline' as const },
  { event: 'AI analyzed intent', time: 'May 11 at 1:30 PM', icon: 'sparkles-outline' as const },
  { event: 'Draft response generated', time: 'May 11 at 1:31 PM', icon: 'create-outline' as const },
  { event: 'Task queued for approval', time: 'May 11 at 1:31 PM', icon: 'timer-outline' as const },
];

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lead = getLeadById(id);

  if (!lead) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.muted} />
        <Text style={styles.notFound}>Lead not found</Text>
      </View>
    );
  }

  const insight = AI_INSIGHTS[id] || {
    summary: 'No AI insight available for this lead yet.',
    nextAction: 'Await the next email monitoring cycle.',
    priority: 'Low',
    sentiment: 'Neutral 🟡',
  };

  const statusColor = STATUS_COLOR[lead.status] || COLORS.muted;

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Hero profile */}
      <View style={styles.hero}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{lead.name.charAt(0)}</Text>
        </View>
        <Text style={styles.leadName}>{lead.name}</Text>
        <Text style={styles.leadCompany}>{lead.company}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{lead.status}</Text>
        </View>
      </View>

      {/* Contact info */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Contact Details</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${lead.email}`)}>
            <Ionicons name="mail" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{lead.email}</Text>
            <Ionicons name="open-outline" size={13} color={COLORS.muted} />
          </TouchableOpacity>
          <View style={[styles.infoRow, styles.infoBorder]}>
            <Ionicons name="business" size={16} color={COLORS.muted} />
            <Text style={styles.infoText}>{lead.company}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoBorder]}>
            <Ionicons name="calendar" size={16} color={COLORS.muted} />
            <Text style={styles.infoText}>Added {lead.createdAt}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoBorder]}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.muted} />
            <Text style={styles.infoText}>{lead.tasks} AI task{lead.tasks !== 1 ? 's' : ''} generated</Text>
          </View>
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>AI-Generated Insights</Text>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={11} color={COLORS.primary} />
            <Text style={styles.aiBadgeText}>Powered by Llama 3.3</Text>
          </View>
        </View>
        <View style={[styles.card, styles.insightCard]}>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Summary</Text>
            <Text style={styles.insightValue}>{insight.summary}</Text>
          </View>
          <View style={[styles.insightRow, styles.insightBorder]}>
            <Text style={styles.insightLabel}>Recommended Next Action</Text>
            <View style={styles.nextActionBox}>
              <Ionicons name="arrow-forward-circle" size={14} color={COLORS.primary} />
              <Text style={styles.nextActionText}>{insight.nextAction}</Text>
            </View>
          </View>
          <View style={[styles.insightRow, styles.insightBorder]}>
            <Text style={styles.insightLabel}>Priority</Text>
            <Text style={[styles.priorityText, { color: insight.priority === 'High' ? COLORS.red : COLORS.yellow }]}>
              {insight.priority}
            </Text>
          </View>
          <View style={[styles.insightRow, styles.insightBorder]}>
            <Text style={styles.insightLabel}>Sentiment</Text>
            <Text style={styles.insightValue}>{insight.sentiment}</Text>
          </View>
          <View style={[styles.insightRow, styles.insightBorder]}>
            <Text style={styles.insightLabel}>Detected Intent</Text>
            <Text style={styles.insightValue}>{lead.intent}</Text>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Activity Timeline</Text>
        <View style={styles.card}>
          {TIMELINE.map((item, i) => (
            <View key={i} style={[styles.timelineRow, i < TIMELINE.length - 1 && styles.timelineBorder]}>
              <View style={styles.timelineIconWrap}>
                <Ionicons name={item.icon} size={14} color={COLORS.primary} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineEvent}>{item.event}</Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.primaryAction} onPress={() => Linking.openURL(`mailto:${lead.email}`)}>
          <Ionicons name="mail" size={16} color="#fff" />
          <Text style={styles.primaryActionText}>Send Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction}>
          <Ionicons name="time-outline" size={16} color={COLORS.foreground} />
          <Text style={styles.secondaryActionText}>Schedule Follow-up</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background, gap: 12 },
  notFound: { color: COLORS.muted, fontSize: 15 },
  hero: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  leadName: { fontSize: 22, fontWeight: '800', color: COLORS.foreground, marginBottom: 4 },
  leadCompany: { fontSize: 14, color: COLORS.muted, marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e3a5f', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  aiBadgeText: { fontSize: 10, color: COLORS.primary, fontWeight: '600' },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  insightCard: {},
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  infoBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  infoText: { flex: 1, color: COLORS.foreground, fontSize: 13 },
  insightRow: { padding: 14 },
  insightBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  insightLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  insightValue: { fontSize: 13, color: COLORS.foreground, lineHeight: 19 },
  nextActionBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#1e3a5f', borderRadius: RADIUS.sm, padding: 10 },
  nextActionText: { flex: 1, color: COLORS.primary, fontSize: 13, lineHeight: 19 },
  priorityText: { fontSize: 14, fontWeight: '800' },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  timelineBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  timelineIconWrap: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1e3a5f', alignItems: 'center', justifyContent: 'center' },
  timelineContent: { flex: 1 },
  timelineEvent: { fontSize: 13, fontWeight: '600', color: COLORS.foreground },
  timelineTime: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  primaryAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, marginBottom: 10 },
  primaryActionText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: 15, borderWidth: 1, borderColor: COLORS.border },
  secondaryActionText: { color: COLORS.foreground, fontWeight: '600', fontSize: 15 },
});
