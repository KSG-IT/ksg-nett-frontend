import { Box, Button, Group, Modal, Slider, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'

interface CropModalProps {
  opened: boolean
  imageUrl: string
  aspect: number
  loading: boolean
  onCancel: () => void
  onConfirm: (area: Area) => void
}

// Default export so ImageCropInput can load it with React.lazy
export default function CropModal({
  opened,
  imageUrl,
  aspect,
  loading,
  onCancel,
  onConfirm,
}: CropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)

  return (
    <Modal opened={opened} onClose={onCancel} title="Velg utsnitt" size="lg">
      <Stack>
        <Box pos="relative" h={360} bg="dark.7">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </Box>
        <Text size="sm">Zoom</Text>
        <Slider
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={setZoom}
          label={null}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            loading={loading}
            disabled={!area}
            onClick={() => area && onConfirm(area)}
          >
            Bruk bilde
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
