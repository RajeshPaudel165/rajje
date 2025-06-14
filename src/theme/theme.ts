export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    subText: string;
    background: string;
    cardBg: string;
    lightBg: string;
    border: string;
    error: string;
    textSecondary: string;
    surface: string;
    card: string;
  };
  fonts: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  logo: {
    width: number;
    height: number;
  };
  logoForm: {
    width: number;
    height: number;
  };
  logoDashboard: {
    width: number;
    height: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: "#003893", // Blue color for buttons
    secondary: "#f83d3d", // Red from logo
    accent: "#3C1DFF", // Darker purple for emphasis
    text: "#333333", // Dark text
    subText: "#666666", // Lighter text for secondary information
    background: "#f6f8fa", // Light gray background
    cardBg: "#ffffff", // White card background
    lightBg: "#F0F2FF", // Very light purple background
    border: "#e1e4e8", // Light gray for borders
    error: "#f83d3d", // Red color for errors
    textSecondary: "#666666", // Secondary text color
    surface: "#f8f9fa", // Surface color
    card: "#ffffff", // Card background
  },
  fonts: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System-Bold",
  },
  borderRadius: {
    small: 6,
    medium: 10,
    large: 20,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  logo: {
    width: 150,
    height: 120,
  },
  logoDashboard: {
    width: 120,
    height: 80,
  },
  logoForm: {
    width: 150,
    height: 120,
  },
};

/* Commenting out darkTheme as per requirement to disable dark mode
export const darkTheme: Theme = {
  colors: {
    primary: "#4A90E2", // Lighter blue for dark mode
    secondary: "#ff6b6b", // Softer red for dark mode
    accent: "#6C5CE7", // Purple accent
    text: "#000000", // Black text for better contrast
    subText: "#B0B0B0", // Light gray text
    background: "#121212", // Dark background
    cardBg: "#1E1E1E", // Dark card background
    lightBg: "#2A2A2A", // Darker background variant
    border: "#333333", // Dark border
    error: "#ff6b6b", // Red for errors
    textSecondary: "#000000", // Secondary text color
    surface: "#1E1E1E", // Surface color
    card: "#1E1E1E", // Card background
  },
  fonts: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System-Bold",
  },
  borderRadius: {
    small: 6,
    medium: 10,
    large: 20,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  logo: {
    width: 150,
    height: 120,
  },
  logoDashboard: {
    width: 120,
    height: 80,
  },
  logoForm: {
    width: 150,
    height: 120,
  },
};
*/

// Default export for compatibility
export const theme = lightTheme;
