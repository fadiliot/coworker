import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../src/constants/theme';
import { fetchPendingTasks, performTaskAction } from '../../src/services/api';

export default function ApprovalsScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModal, setEditModal] = useState<{ visible: boolean; task: any | null }>({ visible: false, task: null });
  const [editText, setEditText] = useState('');

  const load = useCallback(async () => {
    const data = await fetchPendingTasks();
    setTasks(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (taskId: string, action: string, editedText?: string) => {
    const editedPayload = editedText ? { draftText: editedText } : undefined;
    await performTaskAction(taskId, action, editedPayload);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setEditModal({ visible: false, task: null });
  };

  const openEdit = (task: any) => {
    setEditText(task.payload?.draftText || '');
    setEditModal({ visible: true, task });
  };

  const confirmReject = (taskId: string) => {
    Alert.alert('Reject Task', 'Are you sure you want to reject this AI-generated action?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => handleAction(taskId, 'REJECT') },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Edit Modal */}
      <Modal visible={editModal.visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit AI Draft</Text>
            <TouchableOpacity onPress={() => setEditModal({ visible: false, task: null })}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            placeholderTextColor={COLORS.muted}
            placeholder="Edit the draft..."
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModal({ visible: false, task: null })}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalApprove}
              onPress={() => handleAction(editModal.task?.id, 'EDIT_AND_APPROVE', editText)}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.modalApproveText}>Approve & Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Task Approvals</Text>
          {tasks.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{tasks.length} pending</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>Review and approve AI-generated actions before execution.</Text>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-circle" size={40} color={COLORS.green} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>No pending tasks right now. Pull to refresh.</Text>
          </View>
        ) : (
          tasks.map((task) => {
            const lead = task.emailMessage?.leads?.[0];
            const leadName = lead?.name || task.emailMessage?.from || 'Unknown';
            const company = lead?.company;
            const typeLabel = task.type?.replace(/_/g, ' ') || 'Task';

            return (
              <View key={task.id} style={styles.taskCard}>
                {/* Task header */}
                <View style={styles.taskHeader}>
                  <View style={styles.taskIconWrap}>
                    <Ionicons name="mail" size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.taskMeta}>
                    <Text style={styles.taskType}>{typeLabel}</Text>
                    <Text style={styles.taskLead}>{leadName}{company ? ` · ${company}` : ''}</Text>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                </View>

                {/* Draft preview */}
                <View style={styles.draftBox}>
                  <Text style={styles.draftText}>{task.payload?.draftText || JSON.stringify(task.payload)}</Text>
                </View>

                {/* Actions */}
                <View style={styles.taskActions}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => confirmReject(task.id)}>
                    <Ionicons name="close" size={15} color={COLORS.red} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(task)}>
                    <Ionicons name="create-outline" size={15} color={COLORS.muted} />
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleAction(task.id, 'APPROVE')}>
                    <Ionicons name="checkmark" size={15} color="#fff" />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: COLORS.muted, fontSize: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.foreground },
  countBadge: { backgroundColor: '#3d2e00', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  countBadgeText: { color: COLORS.yellow, fontSize: 12, fontWeight: '700' },
  subtitle: { color: COLORS.muted, fontSize: 13, marginBottom: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0f3320', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.foreground, marginBottom: 6 },
  emptySubtitle: { color: COLORS.muted, fontSize: 13, textAlign: 'center' },
  taskCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, overflow: 'hidden' },
  taskHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  taskIconWrap: { width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: '#1e3a5f', alignItems: 'center', justifyContent: 'center' },
  taskMeta: { flex: 1 },
  taskType: { fontSize: 13, fontWeight: '700', color: COLORS.foreground, textTransform: 'capitalize' },
  taskLead: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  pendingBadge: { backgroundColor: '#3d2e00', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  pendingText: { color: COLORS.yellow, fontSize: 11, fontWeight: '700' },
  draftBox: { padding: 14, maxHeight: 160, overflow: 'hidden' },
  draftText: { color: '#a1a1aa', fontSize: 13, lineHeight: 20, fontFamily: 'Courier' },
  taskActions: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#3d1515', paddingVertical: 9 },
  rejectText: { color: COLORS.red, fontWeight: '600', fontSize: 13 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 9 },
  editText: { color: COLORS.muted, fontWeight: '600', fontSize: 13 },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary, paddingVertical: 9 },
  approveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  // Modal
  modal: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.foreground },
  textInput: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, color: COLORS.foreground, fontSize: 14, padding: 14, lineHeight: 22, textAlignVertical: 'top', fontFamily: 'Courier' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalCancel: { flex: 1, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 14, alignItems: 'center' },
  modalCancelText: { color: COLORS.muted, fontWeight: '600' },
  modalApprove: { flex: 2, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  modalApproveText: { color: '#fff', fontWeight: '700' },
});
