/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      keyframes: {
        'slide-up': {
          '0%': {  transform: 'translateY(30px)' },
          '100%': {  transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(0)' },
          '100%': {  transform: 'translateY(30px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': {  opacity: '1' },
        },
         fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
       'fade-out': {
          '0%': { opacity: '1', visibility: 'visible' },
          '100%': { opacity: '0', visibility: 'hidden' }, // No display here
        },
      },
      animation: {
         'fadeIn': 'fadeIn 0.2s ease-out',
        'fade-in':'fade-in 0.6s ease forwards',
        'fade-out':'fade-in 0.6s ease-in-out forwards',
        'slide-up': 'slide-up 0.6s ease forwards',
        'slide-down': 'slide-down 0.6s ease forwards',
      },

      colors:{
        light: {
    background: '#FFFFFF',
    sidebar: '#F3F4F6',
    topbar: '#3B82F6',
    chatHeader: '#F1F5F9',
    chatBg: '#FFFFFF',
    profileBg: '#F9FAFB',
    chatBubble: '#A7F3D0',
    chatText: '#111827',
    inputBar: '#E5E7EB',
    chatProfileBg: '#E5E7EB',
    smallTextButton: '#D1D5DB',
    border: '#D1D5DB',
    textPrimary: '#1F2937',
    textSecondary: '#4B5563',
    buttonRed: '#DC2626',
    chatBubbleOutgoing: '#BBF7D0',
    chatBubbleIncoming: '#DBEAFE',
    chatText: '#111827',
  },

  dark: {
    background: '#0F172A',
    sidebar: '#1F2937',
    topbar: '#2563EB',
    chatHeader: '#1E293B',
    chatBg: '#0F172A',
    profileBg: '#111827',
    chatBubble: '#34D399',
    chatText: '#E5E7EB',
    inputBar: '#4B5563',
    chatProfileBg: '#1E293B',
    smallTextButton: '#4B5563',
    border: '#475569',
    textPrimary: '#F3F4F6',
    textSecondary: '#D1D5DB',
    buttonRed: '#F87171',
    chatBubbleOutgoing: '#34D399',
    chatBubbleIncoming: '#3B82F6',
    chatText: '#F9FAFB',
  }
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
        addVariant('child', '& > *');
        addVariant('child-hover', '& > *:hover');
    }
  ],
}

