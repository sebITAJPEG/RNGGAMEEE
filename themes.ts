export interface Theme {
    id: string;
    name: string;
    colors: {
        background: string;
        surface: string;
        surfaceHighlight: string;
        text: string;
        textDim: string;
        border: string;
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
    };
}

export const THEMES: Theme[] = [
    {
        id: 'default',
        name: 'VOID (Default)',
        colors: {
            background: '#000000',
            surface: '#171717', // neutral-900
            surfaceHighlight: '#262626', // neutral-800
            text: '#ffffff',
            textDim: '#a3a3a3', // neutral-400
            border: '#404040', // neutral-700
            primary: '#ffffff',
            secondary: '#525252', // neutral-600
            accent: '#eab308', // yellow-500
            success: '#22c55e', // green-500
            warning: '#f59e0b', // amber-500
            error: '#ef4444', // red-500
        }
    },
    {
        id: 'matrix',
        name: 'MATRIX',
        colors: {
            background: '#000000',
            surface: '#001a00',
            surfaceHighlight: '#003300',
            text: '#00ff00',
            textDim: '#008f00',
            border: '#004400',
            primary: '#00ff00',
            secondary: '#003300',
            accent: '#ccffcc',
            success: '#00ff00',
            warning: '#ffff00',
            error: '#ff0000',
        }
    },
    {
        id: 'cyberpunk',
        name: 'CYBERPUNK',
        colors: {
            background: '#0f0e17',
            surface: '#2e2f3e',
            surfaceHighlight: '#4a4e69',
            text: '#fffffe',
            textDim: '#a7a9be',
            border: '#ff0054',
            primary: '#ff0054',
            secondary: '#ffbd00',
            accent: '#00f5d4',
            success: '#00f5d4',
            warning: '#ffbd00',
            error: '#ff0054',
        }
    },
    {
        id: 'paper',
        name: 'PAPER',
        colors: {
            background: '#f5f5f5',
            surface: '#ffffff',
            surfaceHighlight: '#e5e5e5',
            text: '#1a1a1a',
            textDim: '#666666',
            border: '#cccccc',
            primary: '#000000',
            secondary: '#999999',
            accent: '#3b82f6', // blue-500
            success: '#16a34a', // green-600
            warning: '#d97706', // amber-600
            error: '#dc2626', // red-600
        }
    }
];

export const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });
};
