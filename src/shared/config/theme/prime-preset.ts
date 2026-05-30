import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

/**
 * Палитра surface для PrimeVue, выровненная с `src/app/styles/tokens.css`.
 *
 * Light: стандартная slate-шкала приложения.
 * Dark:  фон #0f172a, карточки/поля #1e293b, бордеры #334155, текст #f8fafc.
 */
const appSurfaceLight = {
  0: '#ffffff',
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617'
} as const

const appSurfaceDark = {
  0: '#f8fafc',
  50: '#0f172a',
  100: '#1e293b',
  200: '#334155',
  300: '#475569',
  400: '#64748b',
  500: '#94a3b8',
  600: '#cbd5e1',
  700: '#e2e8f0',
  800: '#f1f5f9',
  900: '#1e293b',
  950: '#1e293b'
} as const

const appPrimaryPalette = {
  50: '{blue.50}',
  100: '{blue.100}',
  200: '{blue.200}',
  300: '{blue.300}',
  400: '{blue.400}',
  500: '{blue.500}',
  600: '{blue.600}',
  700: '{blue.700}',
  800: '{blue.800}',
  900: '{blue.900}',
  950: '{blue.950}'
} as const

export const AppPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      md: '8px',
      lg: '12px',
      xl: '16px'
    }
  },
  semantic: {
    primary: appPrimaryPalette,
    colorScheme: {
      light: {
        surface: appSurfaceLight,
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        formField: {
          background: '{surface.0}',
          borderColor: '{surface.200}',
          hoverBorderColor: '{surface.300}',
          focusBorderColor: '{primary.color}',
          color: '{surface.700}',
          placeholderColor: '{surface.400}',
          iconColor: '{surface.400}'
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}'
        }
      },
      dark: {
        surface: appSurfaceDark,
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.50}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}'
        },
        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.900}',
          filledHoverBackground: '{surface.900}',
          filledFocusBackground: '{surface.900}',
          borderColor: '{surface.200}',
          hoverBorderColor: '{primary.color}',
          focusBorderColor: '{primary.color}',
          color: '{surface.0}',
          disabledColor: '{surface.400}',
          placeholderColor: '{surface.400}',
          iconColor: '{surface.400}'
        },
        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.400}',
          hoverMutedColor: '{surface.500}'
        },
        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.200}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}'
        },
        overlay: {
          select: {
            background: '{surface.900}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          popover: {
            background: '{surface.900}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          modal: {
            background: '{surface.900}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          }
        },
        list: {
          option: {
            focusBackground: '{surface.200}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}'
            }
          }
        },
        navigation: {
          item: {
            focusBackground: '{surface.200}',
            activeBackground: '{surface.200}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}'
            }
          }
        }
      }
    }
  }
})
