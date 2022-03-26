import { parseDurationString } from './parsing'

describe('Parse duration helper', () => {
  it('Should only return numbers or colon', () => {
    const input = '2abc:30:2k'
    expect(parseDurationString(input)).toEqual('2:30:2')
  })
})
