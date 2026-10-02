import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  Slider,
  Stack,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCrop, IconPhoto } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { cropImage } from './cropImage'

interface ImageCropInputProps {
  value: File | null
  onChange: (file: File | null) => void
  label?: string
  placeholder?: string
  error?: string
  /** Width / height of the crop area. */
  aspect?: number
  /** The cropped image is scaled down to this width in pixels. */
  maxWidth?: number
}

export const ImageCropInput: React.FC<ImageCropInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Trykk her',
  error,
  aspect = 1,
  maxWidth = 800,
}) => {
  const [source, setSource] = useState<{ url: string; name: string } | null>(
    null
  )
  const [opened, setOpened] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)

  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value]
  )
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])
  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
    }
  }, [source])

  function handleSelectFile(file: File | null) {
    if (!file) {
      setSource(null)
      onChange(null)
      return
    }
    setSource({ url: URL.createObjectURL(file), name: file.name })
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setOpened(true)
  }

  function handleCancel() {
    setOpened(false)
    if (!value) setSource(null)
  }

  async function handleConfirm() {
    if (!source || !area) return
    setCropping(true)
    try {
      const blob = await cropImage(source.url, area, maxWidth)
      const name = source.name.replace(/\.[^.]+$/, '') + '.jpg'
      onChange(new File([blob], name, { type: 'image/jpeg' }))
      setOpened(false)
    } catch {
      showNotification({
        title: 'Noe gikk galt',
        message: 'Kunne ikke beskjære bildet. Prøv et annet bilde.',
        color: 'red',
      })
    } finally {
      setCropping(false)
    }
  }

  return (
    <Stack gap="xs">
      <FileInput
        value={value}
        onChange={handleSelectFile}
        label={label}
        placeholder={placeholder}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        leftSection={<IconPhoto size={16} />}
        error={error}
        clearable
      />
      {previewUrl && (
        <Group align="flex-end">
          <Image
            src={previewUrl}
            radius="md"
            w={200}
            h={200 / aspect}
            alt="Forhåndsvisning av bildet"
          />
          {source && (
            <Button
              variant="subtle"
              leftSection={<IconCrop size={16} />}
              onClick={() => setOpened(true)}
            >
              Juster utsnitt
            </Button>
          )}
        </Group>
      )}

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Velg utsnitt"
        size="lg"
      >
        <Stack>
          <Box pos="relative" h={360} bg="dark.7">
            {source && (
              <Cropper
                image={source.url}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setArea(pixels)}
              />
            )}
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
            <Button variant="default" onClick={handleCancel}>
              Avbryt
            </Button>
            <Button loading={cropping} onClick={handleConfirm}>
              Bruk bilde
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
