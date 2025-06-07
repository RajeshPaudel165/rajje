export default ({ config }) => {
  return {
    ...config,
    name: "myapp",
    slug: "myapp",
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },

    version: config.version || "1.0.0",
    orientation: config.orientation || "portrait",
    icon: config.icon || "./assets/icon.png",
    userInterfaceStyle: config.userInterfaceStyle || "automatic",
    newArchEnabled:
      config.newArchEnabled !== undefined ? config.newArchEnabled : true,
    splash: config.splash || {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.nabin-777.myapp",
      supportsTablet: true,
      supportsTablet: true,
      userInterfaceStyle: "light",
      deploymentTarget: "18.5",
      config: {
        googleMapsApiKey: "YOUR_IOS_API_KEY",
      },
    },
    android: {
      package: "com.nabin_777.myapp",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMapsApiKey: "YOUR_ANDROID_API_KEY", // This should ideally also come from process.env
      },
      edgeToEdgeEnabled: true,
    },
    web: config.web || {
      favicon: "./assets/favicon.png",
    },
    plugins: config.plugins || [
      [
        "expo-font",
        {
          fonts: ["node_modules/react-native-vector-icons/Fonts/Ionicons.ttf"],
        },
      ],
    ],
  };
};
