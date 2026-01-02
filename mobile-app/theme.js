import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export const lightTheme = {
    colors: {
        primary: '#1F88E5',
        primaryDark: '#0D47A1',
        primaryLight: '#BBDEFB',
        secondary: '#00BCD4',
        secondaryDark: '#0097A7',
        secondaryLight: '#B2EBF2',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        errorSurface: '#FFEBEE',
        text: '#1C1B1F',
        textSecondary: '#79747E',
        textTertiary: '#B0B0B0',
        border: '#E0E0E0',
        divider: '#E0E0E0',
        gradientStart: '#1F88E5',
        gradientEnd: '#0D47A1',
        chartColors: ['#1F88E5', '#00BCD4', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#673AB7', '#795548']
    },
    fonts: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
        extraBold: 'Poppins_800ExtraBold'
    }
};

export const darkTheme = {
    colors: {
        primary: '#42A5F5',
        primaryDark: '#1F88E5',
        primaryLight: '#0D47A1',
        secondary: '#4DD0E1',
        secondaryDark: '#00BCD4',
        secondaryLight: '#006064',
        success: '#81C784',
        warning: '#FFB74D',
        error: '#E57373',
        info: '#64B5F6',
        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2C2C2C',
        errorSurface: '#3F2C2C',
        text: '#E1E1E1',
        textSecondary: '#A0A0A0',
        textTertiary: '#666666',
        border: '#333333',
        divider: '#333333',
        gradientStart: '#1E1E1E',
        gradientEnd: '#121212',
        chartColors: ['#90CAF9', '#80DEEA', '#81C784', '#FFB74D', '#E57373', '#CE93D8', '#B39DDB', '#A1887F']
    },
    fonts: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
        extraBold: 'Poppins_800ExtraBold'
    }
};

export const theme = lightTheme;

export const useAppTheme = () => {
    const { themeMode } = useContext(AuthContext);
    return themeMode === 'dark' ? darkTheme : lightTheme;
};
