export default (x: number, y: number): number => {
  const min = Math.ceil(Math.min(x, y))
  const max = Math.floor(Math.max(x, y))
  return Math.floor(Math.random() * (max - min + 1)) + min
}
