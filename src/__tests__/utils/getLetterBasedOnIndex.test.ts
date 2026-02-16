import {describe, expect, it} from 'vitest'

import {getLetterBasedOnIndex} from '../../utils/getLetterBasedOnIndex'

describe('getLetterBasedOnIndex', () => {
  it('returns A for index 0', () => {
    expect(getLetterBasedOnIndex(0)).toBe('A')
  })

  it('returns B for index 1', () => {
    expect(getLetterBasedOnIndex(1)).toBe('B')
  })

  it('returns Z for index 25', () => {
    expect(getLetterBasedOnIndex(25)).toBe('Z')
  })

  it('returns AA for index 26', () => {
    expect(getLetterBasedOnIndex(26)).toBe('AA')
  })

  it('returns AB for index 27', () => {
    expect(getLetterBasedOnIndex(27)).toBe('AB')
  })

  it('returns AZ for index 51', () => {
    expect(getLetterBasedOnIndex(51)).toBe('AZ')
  })

  it('returns BA for index 52', () => {
    expect(getLetterBasedOnIndex(52)).toBe('BA')
  })

  it('returns AAA for index 702', () => {
    // 26 + 26*26 = 26 + 676 = 702
    expect(getLetterBasedOnIndex(702)).toBe('AAA')
  })

  it('handles sequential letters correctly', () => {
    const letters = []
    for (let i = 0; i < 30; i++) {
      letters.push(getLetterBasedOnIndex(i))
    }
    expect(letters).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'AA',
      'AB',
      'AC',
      'AD',
    ])
  })
})
