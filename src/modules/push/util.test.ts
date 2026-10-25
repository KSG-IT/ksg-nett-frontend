import {
  isIos,
  isStandalone,
  pushStatus,
  subscriptionVariables,
  urlBase64ToUint8Array,
} from './util'

describe('urlBase64ToUint8Array', () => {
  it('decodes base64url without padding', () => {
    // 0xfb 0xff 0xbf is "-_-_" in base64url and "+/+/" in base64
    expect(Array.from(urlBase64ToUint8Array('-_-_'))).toEqual([
      0xfb, 0xff, 0xbf,
    ])
  })

  it('adds the missing padding', () => {
    expect(Array.from(urlBase64ToUint8Array('AQ'))).toEqual([1])
    expect(Array.from(urlBase64ToUint8Array('AQI'))).toEqual([1, 2])
  })

  it('decodes a 65-byte VAPID public key', () => {
    const key =
      'BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8'
    const bytes = urlBase64ToUint8Array(key)
    expect(bytes.length).toBe(65)
    expect(bytes[0]).toBe(4)
  })
})

describe('isIos', () => {
  const iphone =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15'
  const mac =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'

  it('is true on an iPhone', () => {
    expect(isIos(iphone, 5)).toBe(true)
  })

  it('is true on an iPad that says it is a Mac', () => {
    expect(isIos(mac, 5)).toBe(true)
  })

  it('is false on a Mac without touch', () => {
    expect(isIos(mac, 0)).toBe(false)
  })

  it('is false on Android', () => {
    expect(isIos('Mozilla/5.0 (Linux; Android 15; Pixel 9)', 5)).toBe(false)
  })
})

describe('isStandalone', () => {
  function fakeWindow(displayModeStandalone: boolean, standalone?: boolean) {
    return {
      matchMedia: () => ({ matches: displayModeStandalone }),
      navigator: { standalone },
    } as unknown as Window
  }

  it('is true when the display mode is standalone', () => {
    expect(isStandalone(fakeWindow(true))).toBe(true)
  })

  it('is true in the iOS Home Screen app', () => {
    expect(isStandalone(fakeWindow(false, true))).toBe(true)
  })

  it('is false in a browser tab', () => {
    expect(isStandalone(fakeWindow(false))).toBe(false)
  })
})

describe('pushStatus', () => {
  const base = {
    supported: true,
    ios: false,
    standalone: false,
    permission: 'default' as NotificationPermission,
    subscribed: false,
  }

  it('asks an iPhone in Safari to install the app', () => {
    expect(pushStatus({ ...base, supported: false, ios: true })).toBe(
      'needs-install'
    )
  })

  it('is unsupported in the installed app on an old iOS', () => {
    expect(
      pushStatus({ ...base, supported: false, ios: true, standalone: true })
    ).toBe('unsupported')
  })

  it('is unsupported in a browser without push', () => {
    expect(pushStatus({ ...base, supported: false, permission: null })).toBe(
      'unsupported'
    )
  })

  it('is denied when notifications are blocked', () => {
    expect(pushStatus({ ...base, permission: 'denied' })).toBe('denied')
  })

  it('is on with a subscription and off without one', () => {
    expect(pushStatus({ ...base, subscribed: true })).toBe('on')
    expect(pushStatus(base)).toBe('off')
  })
})

describe('subscriptionVariables', () => {
  it('takes the endpoint and keys from the subscription', () => {
    const subscription = {
      toJSON: () => ({
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
        keys: { p256dh: 'pub', auth: 'secret' },
      }),
    }

    expect(subscriptionVariables(subscription, 'Firefox')).toEqual({
      endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
      p256dh: 'pub',
      auth: 'secret',
      userAgent: 'Firefox',
    })
  })
})
