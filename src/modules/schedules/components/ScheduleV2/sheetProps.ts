import { DrawerProps } from '@mantine/core'

// A sheet from the bottom of a phone screen, as high as its content. Mantine
// turns size="auto" into a CSS variable that does not exist, so the height is
// set here.
export const SHEET_PROPS: Partial<DrawerProps> = {
  position: 'bottom',
  withCloseButton: false,
  // Focus would open the phone keyboard over the content
  trapFocus: false,
  radius: 'md',
  padding: 'md',
  styles: { content: { height: 'auto', maxHeight: '85dvh' } },
}
