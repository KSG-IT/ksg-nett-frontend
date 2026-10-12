import { Typography } from '@mantine/core'

interface RichTextContentProps {
  html: string
}

/**
 * Shows HTML that the rich text editor made, with the same typography as the
 * editor. The SPA does not clean the HTML. The backend resolver cleans it with
 * `bleach.clean` before it reaches the client.
 */
export const RichTextContent: React.FC<RichTextContentProps> = ({ html }) => (
  <Typography dangerouslySetInnerHTML={{ __html: html }} />
)
