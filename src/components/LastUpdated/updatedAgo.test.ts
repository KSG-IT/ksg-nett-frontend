import { updatedAgo } from './updatedAgo'

const updatedAt = new Date('2026-10-10T12:00:00')
const after = (seconds: number) =>
  new Date(updatedAt.getTime() + seconds * 1000)

describe('updatedAgo', () => {
  it('says "akkurat nå" for the first seconds', () => {
    expect(updatedAgo(updatedAt, after(0))).toBe('akkurat nå')
    expect(updatedAgo(updatedAt, after(4))).toBe('akkurat nå')
  })

  it('counts seconds up to a minute', () => {
    expect(updatedAgo(updatedAt, after(5))).toBe('5 sekunder siden')
    expect(updatedAgo(updatedAt, after(42))).toBe('42 sekunder siden')
  })

  it('counts minutes after that', () => {
    expect(updatedAgo(updatedAt, after(60))).toBe('ett minutt siden')
    expect(updatedAgo(updatedAt, after(150))).toBe('3 minutter siden')
  })
})
