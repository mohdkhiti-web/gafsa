# Internationalization (i18n) Implementation Guide

## Overview
This document explains the internationalization (i18n) system implemented for the InvestFarm frontend application, supporting both English and French languages.

## Features Implemented

### 1. Language Support
- **English (en)**: Default language
- **French (fr)**: Secondary language
- **Automatic language detection**: Based on browser settings
- **Persistent language selection**: Saved in localStorage

### 2. Components Translated
- ✅ **Navbar**: All navigation items, login/logout buttons
- ✅ **Home Page**: Complete translation including hero section, features, services, testimonials, benefits, and call-to-action
- ✅ **AuthDialog**: Login/register forms with all field labels
- ✅ **Contact Page**: Contact form and information sections
- ✅ **Language Switcher**: Interactive component for changing languages

### 3. Translation Files Structure
```
frontend/src/locales/
├── en.json (English translations)
└── fr.json (French translations)
```

## Technical Implementation

### 1. Dependencies Installed
```bash
yarn add react-i18next i18next i18next-browser-languagedetector
```

### 2. Core Files Created/Modified

#### `src/i18n.js`
- Main i18n configuration
- Language detection setup
- Translation resources loading

#### `src/context/LanguageContext.jsx`
- Language state management
- Language switching functionality
- Persistent language storage

#### `src/components/LanguageSwitcher.jsx`
- Interactive language selector component
- Dropdown menu with flag icons
- Supports both icon and chip variants

#### `src/main.jsx`
- i18n initialization import

#### `src/App.jsx`
- LanguageProvider wrapper added

### 3. Translation Keys Structure

The translation files follow a hierarchical structure:

```json
{
  "navbar": {
    "home": "Home",
    "products": "Products",
    "services": "Services",
    "farms": "Farms",
    "cart": "Cart",
    "contact": "Contact",
    "login": "Login",
    "logout": "Logout",
    "language": "Language"
  },
  "home": {
    "hero": {
      "badge": "Leading Smart Farming in Tunisia",
      "title": "Transform Your Farm with Smart Technology",
      "subtitle": "Join the agricultural revolution...",
      "exploreProducts": "Explore Products",
      "watchDemo": "Watch Demo",
      "quickContact": "Quick Contact",
      "getFreeConsultation": "Get Free Consultation"
    },
    "features": {
      "title": "Why Choose InvestFarm?",
      "subtitle": "Comprehensive smart farming solutions...",
      "smartFarming": {
        "title": "Smart Farming Solutions",
        "description": "IoT sensors, automated irrigation..."
      }
    }
  }
}
```

## Usage Guide

### 1. Using Translations in Components

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
    </div>
  );
};
```

### 2. Using Language Context

```jsx
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { currentLanguage, changeLanguage, toggleLanguage } = useLanguage();
  
  return (
    <button onClick={toggleLanguage}>
      Current: {currentLanguage}
    </button>
  );
};
```

### 3. Adding Language Switcher

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher';

// Icon variant (default)
<LanguageSwitcher />

// Chip variant
<LanguageSwitcher variant="chip" />
```

### 4. Adding New Translations

1. **Add to English file** (`src/locales/en.json`):
```json
{
  "newSection": {
    "title": "New Section Title",
    "description": "New section description"
  }
}
```

2. **Add to French file** (`src/locales/fr.json`):
```json
{
  "newSection": {
    "title": "Titre de la Nouvelle Section",
    "description": "Description de la nouvelle section"
  }
}
```

3. **Use in component**:
```jsx
const { t } = useTranslation();
return <h1>{t('newSection.title')}</h1>;
```

## Language Detection Priority

1. **localStorage**: Previously selected language
2. **Browser settings**: Navigator language
3. **HTML tag**: Language attribute
4. **Fallback**: English (en)

## Language Persistence

- Selected language is automatically saved to localStorage
- Language preference persists across browser sessions
- Users don't need to reselect their preferred language

## Adding New Languages

To add a new language (e.g., Arabic):

1. **Create translation file**:
```bash
touch src/locales/ar.json
```

2. **Add translations**:
```json
{
  "navbar": {
    "home": "الرئيسية",
    "products": "المنتجات"
  }
}
```

3. **Update i18n.js**:
```javascript
import arTranslations from './locales/ar.json';

const resources = {
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
  ar: { translation: arTranslations }, // Add new language
};
```

4. **Update LanguageSwitcher**:
```javascript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇹🇳' }, // Add new language
];
```

## Best Practices

### 1. Translation Keys
- Use descriptive, hierarchical keys
- Keep keys consistent between languages
- Use camelCase for key names

### 2. Text Content
- Avoid hardcoded strings in components
- Use translation keys for all user-facing text
- Consider text length differences between languages

### 3. Component Structure
- Wrap components with LanguageProvider
- Use useTranslation hook for text
- Use useLanguage hook for language state

### 4. Testing
- Test both languages thoroughly
- Verify text doesn't overflow in different languages
- Check language switching functionality

## Current Status

✅ **Completed**:
- Core i18n setup and configuration
- Language detection and persistence
- Navbar translation
- Home page complete translation
- AuthDialog translation
- Contact page translation
- Language switcher component
- Language context management

🔄 **In Progress**:
- Other pages (Products, Services, Farms, Cart) can be translated following the same pattern

📋 **Next Steps**:
1. Translate remaining pages
2. Add more languages if needed
3. Implement RTL support for Arabic
4. Add language-specific date/number formatting

## Troubleshooting

### Common Issues

1. **Translation not showing**:
   - Check if translation key exists in both language files
   - Verify i18n is properly initialized
   - Check browser console for errors

2. **Language not persisting**:
   - Check localStorage permissions
   - Verify LanguageContext is properly wrapped

3. **Missing translations**:
   - Add missing keys to both language files
   - Use fallback language (English) for missing keys

### Debug Mode

Enable debug mode in `src/i18n.js`:
```javascript
i18n.init({
  // ... other options
  debug: true, // Enable debug logging
});
```

This will log translation key lookups and missing translations to the console.

## Performance Considerations

- Translation files are loaded on app initialization
- Language switching is instant (no API calls)
- Translations are cached in memory
- Minimal bundle size impact

## Browser Support

- Modern browsers with ES6+ support
- localStorage support required
- No additional polyfills needed
