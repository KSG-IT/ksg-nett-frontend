export function clamp(input: number, min: number, max: number) {
  /**
   * Clamps an input value between to values
   * Ex.
   *  clamp(50, 25, 70) -> 50
   *  clamp(10, 25, 70) -> 25
   *  clamp(100, 25, 70) -> 70
   * @param  {number} input Value to be clamped
   * @param  {number} min   Minimum return value for input
   * @param  {number} max   Maximum return value for input
   * @return {number}       Clamped value
   */
  return Math.min(Math.max(input, min), max)
}
