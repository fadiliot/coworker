import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../src/constants/theme';

const DUMMY_EMAILS = [
  {
    id: '1',
    from: 'alice.freeman@techcorp.io',
    name: 'Alice Freeman',
    subject: 'Demo Request for Your AI Platform',
    preview: 'I came across your platform and would love to schedule a demo.',
    body: 'Hi there,\n\nI came across your platform and would love to schedule a demo. We\'re a 50-person tech company looking for a better way to manage our sales pipeline.\n\nLet me know your availability this week!\n\nBest,\nAlice Freeman\nHead of Growth, TechCorp',
    time: '1:30 PM',
    isProcessed: true,
    intent: 'Demo Request',
    taskGenerated: true,
  },
  {
    id: '2',
    from: 'bob.smith@acme.com',
    name: 'Bob Smith',
    subject: 'Pricing Inquiry',
    preview: 'Can you send over your pricing plans? We\'re evaluating vendors.',
    body: 'Hello,\n\nCan you send over your pricing plans? We\'re currently evaluating vendors and your product looks promising.\n\nBest,\nBob Smith',
    time: '11:00 AM',
    isProcessed: true,
    intent: 'Pricing Inquiry',
    taskGenerated: true,
  },
  {
    id: '3',
    from: 'cdavis@startup.co',
    name: 'Charlie Davis',
    subject: 'API Integration Help',
    preview: 'Running into issues with the authentication flow.',
    body: 'Hey team,\n\nWe\'re trying to integrate your API into our existing system but running into some issues with the authentication flow. Can someone help?\n\nThanks,\nCharlie',
    time: '9:00 AM',
    isProcessed: false,
    intent: null,
    taskGenerated: false,
  },
  {
    id: '4',
    from: 'marketing@bigcorp.com',
    name: 'BigCorp Marketing',
    subject: 'Partnership Opportunity',
    preview: 'Our company serves 10,000+ SMBs and we believe there\'s synergy.',
    body: 'We\'re interested in exploring a potential partnership. Our company serves 10,000+ SMBs and we believe there\'s a strong synergy between our products.',
    time: 'Yesterday',
    isProcessed: true,
    intent: 'Partnership',
    taskGenerated: true,
  },
];

export default function InboxScreen() {
  const [selected, setSelected] = useState<typeof DUMMY_EMAILS[0] | null>(null);

  if (selected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={COLORS.foreground} />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>{selected.subject}</Text>
        </View>
        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.emailMeta}>
            <View style={styles.senderAvatar}>
              <Text style={styles.senderAvatarText}>{selected.name.charAt(0)}</Text>
            </View>
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>{selected.name}</Text>
              <Text style={styles.senderEmail}>{selected.from}</Text>
              <Text style={styles.emailTime}>{selected.time}</Text>
            </View>
          </View>

          {selected.isProcessed && selected.intent && (
            <View style={styles.aiPanel}>
              <View style={styles.aiPanelRow}>
                <Ionicons name="sparkles" size={13} color={COLORS.primary} />
                <Text style={styles.aiPanelLabel}>AI Analysis</Text>
              </View>
              <Text style={styles.aiPanelText}>
                <Text style={styles.aiPanelKey}>Lead Detected · </Text>
                Intent: {selected.intent}
              </Text>
              {selected.taskGenerated && (
                <View style={styles.taskQueued}>
                  <Ionicons name="checkmark-circle" size={13} color={COLORS.yellow} />
                  <Text style={styles.taskQueuedText}>Draft response task queued for approval</Text>
                </View>
              )}
            </View>
          )}

          {!selected.isProcessed && (
            <View style={[styles.aiPanel, styles.aiPanelPending]}>
              <View style={styles.aiPanelRow}>
                <Ionicons name="time-outline" size={13} color={COLORS.muted} />
                <Text style={[styles.aiPanelLabel, { color: COLORS.muted }]}>Pending AI Processing</Text>
              </View>
            </View>
          )}

          <Text style={styles.emailBody}>{selected.body}</Text>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox Monitor</Text>
        <TouchableOpacity style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color={COLORS.muted} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Emails monitored by the AI engine.</Text>

      <FlatList
        data={DUMMY_EMAILS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.emailCard} activeOpacity={0.75} onPress={() => setSelected(item)}>
            <View style={styles.emailAvatar}>
              <Text style={styles.emailAvatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.emailContent}>
              <View style={styles.emailTopRow}>
                <Text style={styles.emailName}>{item.name}</Text>
                <Text style={styles.emailTime}>{item.time}</Text>
              </View>
              <Text style={styles.emailSubject} numberOfLines={1}>{item.subject}</Text>
              <Text style={styles.emailPreview} numberOfLines={1}>{item.preview}</Text>
              <View style={styles.badgeRow}>
                {item.isProcessed ? (
                  <View style={styles.badgeProcessed}>
                    <Ionicons name="sparkles" size={10} color={COLORS.primary} />
                    <Text style={styles.badgeProcessedText}>AI Processed</Text>
                  </View>
                ) : (
                  <View style={styles.badgePending}>
                    <Text style={styles.badgePendingText}>Pending</Text>
                  </View>
                )}
                {item.taskGenerated && (
                  <View style={styles.badgeTask}>
                    <Text style={styles.badgeTaskText}>Task Queued</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.foreground },
  subtitle: { color: COLORS.muted, fontSize: 13, paddingHorizontal: 16, marginBottom: 14 },
  refreshBtn: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  emailCard: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  emailAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.mutedBg, alignItems: 'center', justifyContent: 'center', shrink: 0 } as any,
  emailAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.foreground },
  emailContent: { flex: 1 },
  emailTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  emailName: { fontSize: 14, fontWeight: '700', color: COLORS.foreground },
  emailTime: { fontSize: 11, color: COLORS.muted },
  emailSubject: { fontSize: 13, fontWeight: '600', color: COLORS.foreground, marginBottom: 2 },
  emailPreview: { fontSize: 12, color: COLORS.muted, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badgeProcessed: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e3a5f', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeProcessedText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  badgePending: { backgroundColor: COLORS.mutedBg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgePendingText: { color: COLORS.muted, fontSize: 10, fontWeight: '700' },
  badgeTask: { backgroundColor: '#3d2e00', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeTaskText: { color: COLORS.yellow, fontSize: 10, fontWeight: '700' },
  // Detail view
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.foreground },
  detailScroll: { flex: 1, padding: 16 },
  emailMeta: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  senderAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  senderAvatarText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  senderInfo: { flex: 1 },
  senderName: { fontSize: 15, fontWeight: '700', color: COLORS.foreground },
  senderEmail: { fontSize: 12, color: COLORS.muted },
  aiPanel: { backgroundColor: '#0d1f3c', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#1e3a5f', padding: 12, marginBottom: 16 },
  aiPanelPending: { backgroundColor: COLORS.card, borderColor: COLORS.border },
  aiPanelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiPanelLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  aiPanelText: { fontSize: 13, color: COLORS.foreground },
  aiPanelKey: { fontWeight: '700' },
  taskQueued: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  taskQueuedText: { fontSize: 12, color: COLORS.yellow },
  emailBody: { fontSize: 14, color: COLORS.foreground, lineHeight: 22 },
});
