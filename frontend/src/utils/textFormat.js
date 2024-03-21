export function formatCamelCaseToNormalText(input) {
  console.log(input)
  const words = input.split(/(?=[A-Z])|_/);
  const formattedText = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formattedText;
}