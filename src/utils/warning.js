/* eslint-disable */
export default function warning(message) {
  /* istanbul ignore else  */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  try {
    throw new Error(message)
  } catch (e) {}
}
/* eslint-enable */
