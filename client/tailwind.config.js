module.exports = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
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
                'khan': {
                    'primary': '#14bf95',
                    'primary-focus': '#11A681',
                    'primary-content': '#ffffff',
                    'secondary': '#0a2a66',
                    'secondary-focus': '#071F4A',
                    'secondary-content': '#ffffff',
                    'accent': '#570df8',
                    'accent-focus': '#4506cb',
                    'accent-content': '#ffffff',
                    'neutral': '#3d4451',
                    'neutral-focus': '#2a2e37',
                    'neutral-content': '#ffffff',
                    'base-100': '#ffffff',
                    'base-200': '#f9fafb',
                    'base-300': '#d1d5db',
                    'base-content': '#1f2937',
                    'info': '#2094f3',
                    'success': '#009485',
                    'warning': '#ff9900',
                    'error': '#ff5724',
                },
            },]
    }
};
