import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { User } from "firebase/auth";
import AuthScreen from "../screens/auth/AuthScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import HistoryScreen from "../screens/main/HistoryScreen";
import ProfileScreen from "../screens/settings/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import FAQsScreen from "../screens/main/FAQsScreen";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface AppNavigatorProps {
  user: User | null;
}

// Define our types
type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  FAQs: undefined;
};

type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom tab navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "History") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: t("dashboard"),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t("history"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t("profile"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t("settings"),
        }}
      />
    </Tab.Navigator>
  );
};

// Root stack navigator
const AppNavigator: React.FC<AppNavigatorProps> = ({ user }) => {
  // Determine which screen to show first based on authentication status
  const initialRouteName = user ? "MainApp" : "Auth";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
      <Stack.Screen
        name="FAQs"
        component={FAQsScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: " ",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
