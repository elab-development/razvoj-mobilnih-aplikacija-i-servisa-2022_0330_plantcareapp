import { Colors } from "@/constants/theme";
import { hp, moderateScale, wp } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

const colors = Colors.light;

function CenterLogoTab({ focused }: { focused: boolean }) {
  return (
    <View
      style={{
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(32),
        backgroundColor: focused ? colors.accent : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{
          width: moderateScale(35),
          height: moderateScale(35),
        }}
        resizeMode="contain"
      />
    </View>
  );
}

function TabIcon({
  focused,
  color,
  name,
}: {
  focused: boolean;
  color: string;
  name: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      style={{
        width: moderateScale(44),
        height: moderateScale(40),
        borderRadius: moderateScale(40),
        backgroundColor: focused ? colors.accent : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name={name} size={moderateScale(25)} color={color} />
    </View>
  );
}

export default function TabLayout() {
  // useEffect(() => {
  //   setupDailyWateringReminder();
  // }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          left: wp(10),
          right: wp(10),
          height: hp(12),
          backgroundColor: colors.white,
          borderRadius: moderateScale(10),
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: hp(1),
        },

        tabBarActiveTintColor: colors.textDarkest,
        tabBarInactiveTintColor: colors.textDarkest,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Početna",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifikacije",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="calendar" />
          ),
        }}
      />

      <Tabs.Screen
        name="add-plant"
        options={{
          title: "Biljke",
          tabBarIcon: ({ color, focused }) => (
            <CenterLogoTab focused={focused} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="add-plant"
        options={{
          href: null,
        }}
      /> */}
      <Tabs.Screen
        name="add-sensor"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="sensor-details/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="sensors"
        options={{
          title: "Senzori",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="hardware-chip" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} name="person" />
          ),
        }}
      />
    </Tabs>
  );
}
