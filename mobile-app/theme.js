import { Platform } from 'react-native';

export const theme = {
    colors: {
        // Primary Colors
        primary: '#1F88E5',       // Professional Blue
        primaryDark: '#0D47A1',
        primaryLight: '#42A5F5',

        // Secondary Colors
        secondary: '#00BCD4',     // Teal Accent
        secondaryDark: '#0097A7',
        secondaryLight: '#4DD0E1',

        // Success/Alert Colors
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',         // Error Red
        info: '#2196F3',

        // Neutral Colors
        background: '#FAFAFA',    // Almost White
        surface: '#FFFFFF',       // Pure White
        surfaceVariant: '#F5F5F5',
        errorSurface: '#FFEBEE',

        // Text Colors
        text: '#1C1B1F',          // Dark Gray for primary text
        textSecondary: '#79747E', // Medium Gray
        textTertiary: '#B0B0B0',  // Light Gray for hints

        // UI Elements
        border: '#E0E0E0',
        divider: '#E0E0E0',

        // Gradients (Material 3 style is flatter, but we'll keep these compatible)
        gradientStart: '#1F88E5',
        gradientEnd: '#0D47A1',

        // Chart Palette (Material 3 Compliant)
        chartColors: [
            '#1F88E5', // Blue
            '#00BCD4', // Teal
            '#4CAF50', // Green
            '#FF9800', // Orange
            '#F44336', // Red
            '#9C27B0', // Purple
            '#673AB7', // Deep Purple
            '#795548'  // Brown
        ]
    },
    fonts: {
        // Using Poppins matches the "Google Sans" feel reasonably well if we don't have the proprietary font
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
        extraBold: 'Poppins_800ExtraBold'
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        xxxl: 48
    },
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 50
    },
    shadows: {
        flat: { elevation: 0 },
        sm: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
        md: { elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62 },
        lg: { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65 }
    }
};
