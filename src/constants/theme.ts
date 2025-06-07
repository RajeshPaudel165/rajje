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

export const theme: Theme = {
  colors: {
    primary: "#003893", // Reverted to original blue color for buttons
    secondary: "#f83d3d", // Red from logo
    accent: "#3C1DFF", // Darker purple for emphasis
    text: "#333333", // Dark text
    subText: "#666666", // Lighter text for secondary information
    background: "#f6f8fa", // Light gray background
    cardBg: "#ffffff", // White card background
    lightBg: "#F0F2FF", // Very light purple background
    border: "#e1e4e8", // Light gray for borders
    error: "#d32f2f", // Red for error messages
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
    width: 120,
    height: 130,
  },
  logoForm: {
    width: 150,
    height: 130,
  },
  logoDashboard: {
    width: 120,
    height: 80,
  },
};
