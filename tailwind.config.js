import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                 heading: ['Poppins', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
            },
       colors: {
        background: "var(--background)", // Hapus hsl(...)
        foreground: "var(--foreground)",
        primary:"#C9A834",
        user:"#FBFAF5",
        sidebar: {
          DEFAULT: "#C9A834", 
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          accent: "#B38F1E",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
        },
    },

    plugins: [forms],
};
