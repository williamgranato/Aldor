// Centraliza o caminho das imagens de itens.
export function getItemImagePath(image?: string): string {
  if (!image) return "/images/items/placeholder.png";
  const cleaned = image
    .replace(/^\/?public\//, "")
    .replace(/^\/?images\//, "")
    .replace(/^\/?items\//, "")
    .replace(/^\/?images\/items\//, "");
  return `/images/items/${cleaned}`;
}
