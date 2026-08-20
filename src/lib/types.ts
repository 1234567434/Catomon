export interface CatmonCard {
  id: number;
  name: string;
  type: string;
  description: string | null;
  imageData: string;
  originalImageData: string | null;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  isShiny: boolean;
  createdAt: string;
}
