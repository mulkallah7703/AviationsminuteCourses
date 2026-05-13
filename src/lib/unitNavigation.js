/** Central unit → route mapping for course navigation. */
export function getUnitPath(unitKey) {
  switch (unitKey) {
    case 'chemical':
      return '/course/program/lesson/1'
    case 'extreme-temperature':
      return '/course/extreme-temperature/1'
    case 'vibration':
      return '/course/vibration-risks/1'
    case 'electricity':
      return '/course/electrical-risks/1'
    case 'xray':
      return '/course/radiation-risks/1'
    default:
      return `/course/learn?unit=${unitKey}`
  }
}
