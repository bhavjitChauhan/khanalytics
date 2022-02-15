module.exports = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            'primary': '#14bf95',
            'primary-focus': '#11A681',
            'secondary': '#0a2a66',
            'secondary-focus': '#071F4A',
        }
    },
    variants: {
        extend: {}
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                'light': {
                    'primary': '#14bf95',
                    'primary-focus': '#11a681',
                    'primary-content': '#ffffff',
                    'secondary': '#0a2a66',
                    'secondary-focus': '#071f4a',
                    'secondary-content': '#ffffff',
                    'accent': '#0b49bb',
                    'accent-focus': '#093c9a',
                    'accent-content': '#ffffff',
                    'neutral': '#3d4451',
                    'neutral-focus': '#2a2e37',
                    'neutral-content': '#ffffff',
                    'base-100': '#ffffff',
                    'base-200': '#f9fafb',
                    'base-300': '#d1d5db',
                    'base-content': '#1f2937',
                    'info': '#2094f3',
                    'success': '#12A581',
                    'warning': '#ff9900',
                    'error': '#ff5724',
                },
            },
            {
                'dark': {
                    'primary': '#11a681',
                    'primary-focus': '#0e8164',
                    'primary-content': '#ffffff',
                    'secondary': '#0f3e95',
                    'secondary-focus': '#0a2a66',
                    'secondary-content': '#ffffff',
                    'accent': '#0b49bb',
                    'accent-focus': '#093c9a',
                    'accent-content': '#ffffff',
                    'neutral': '#1f1f1f',
                    'neutral-focus': '#141414',
                    'neutral-content': '#ffffff',
                    'base-100': '#292929',
                    'base-200': '#1f1f1f',
                    'base-300': '#3d3d3d',
                    'base-content': '#ffffff',
                    'info': '#0c85e9',
                    'success': '#14B88F',
                    'warning': '#e08700',
                    'error': '#ff430a',
                },
            },
        ]
    }
};
