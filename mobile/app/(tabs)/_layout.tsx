import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ITEMS: { name: string; label: string; icon: IconName; activeIcon: IconName }[] = [
  { name: 'index', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'inbox', label: 'Inbox', icon: 'mail-outline', activeIcon: 'mail' },
  { name: 'approvals', label: 'Approvals', icon: 'checkmark-circle-outline', activeIcon: 'checkmark-circle' },
  { name: 'leads', label: 'Leads', icon: 'people-outline', activeIcon: 'people' },
  { name: 'followups', label: 'Follow-ups', icon: 'time-outline', activeIcon: 'time' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: styles.label,
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={22}
                color={focused ? COLORS.primary : COLORS.muted}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
