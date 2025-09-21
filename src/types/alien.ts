export interface Alien {
  id: string; // Unique identifier (e.g., "heatblast", "fourarms")
  name: string; // Display name (e.g., "Heatblast", "Four Arms")
  description: string; // Short description of the alien's abilities
  image: string; // Path to the alien's image (e.g., "/aliens/heatblast.png")
  abilities: string[]; // List of key abilities
  species: string; // Alien species (e.g., "Pyronite", "Tetramand")
  homeworld: string; // Alien homeworld
  transformationDuration: number; // Duration in seconds for transformation
}
