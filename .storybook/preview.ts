import '../src/index.css'
import '../src/fomo/styles/tokens.css'
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        dark:  '',
        light: 'theme-light',
      },
      defaultTheme: 'dark',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /Date$/i,
      },
    },
  },
}

export default preview
