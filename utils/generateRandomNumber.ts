export const generateRandomInRange = (min: number,max: number) => {
  return Math.random() * (max - min) + min;
}
