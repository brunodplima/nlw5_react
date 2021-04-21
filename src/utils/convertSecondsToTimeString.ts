export const convertSecondsToTimeString = (seconds: number) => {
  const parts = [
    Math.floor(seconds / 3600), // horas
    Math.floor((seconds % 3600) / 60), // minutos
    Math.floor(seconds / 60), // segundos
  ];

  return parts.map(part => String(part).padStart(2, '0')).join(':');
}
