// styles.ts
export interface Style {
    id: number;
    name: string;
    img: string;
    description: string;
  }
  
  export const styles: Style[] = [
    {
      id: 1,
      name: "Post-Impressionism",
      img: "https://magazine.artland.com/wp-content/uploads/2022/07/van-gogh-starry-night-min.jpg",
      description:
        "Post-Impressionism is an art movement that emerged in the late 19th century as a reaction to Impressionism. While Impressionists focused on capturing fleeting moments and the effects of light, Post-Impressionist artists sought to express deeper emotions and explore symbolic content. This movement, led by artists like Vincent van Gogh, Paul Cézanne, Paul Gauguin, and Georges Seurat, emphasized bold colors, distinctive brushstrokes, and a more abstract approach to form.",
    },
    {
      id: 2,
      name: "Renaissance",
      img: "https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg",
      description:
        "Characterized by a focus on realism, proportion, and humanism, Renaissance art emphasizes detail, perspective, and lifelike representations of figures.",
    },
    {
      id: 3,
      name: "Cubism",
      img: "https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg",
      description:
        "An avant-garde movement that fragments objects into geometric shapes, presenting multiple viewpoints simultaneously. Developed by Picasso and Braque.",
    },
    {
      id: 4,
      name: "Surrealism",
      img: "https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original",
      description:
        "A movement that merges the dream world with reality, Surrealism features strange, dreamlike scenes and symbolic imagery that challenges logic.",
    },
    {
      id: 5,
      name: "Baroque",
      img: "https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg",
      description:
        "Known for its dramatic lighting, intense emotions, and ornate details, Baroque art is characterized by grandeur, movement, and opulence.",
    },
    {
      id: 6,
      name: "Abstract",
      img: "https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg",
      description:
        "Abstract art breaks away from traditional representation, focusing on color, form, and line to create compositions that are non-representational and subjective.",
    },
  ];
  