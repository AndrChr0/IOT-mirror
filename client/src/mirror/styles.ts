export interface Style {
    id: number;
    name: string;
    img: string[];
    description: string;
    style_prompt: string;
    characteristics: string[];
    famous_paintings?: string[];
    ai_examples?: string[];
  }

  
  export const styles: Style[] = [
    {
      id: 1,
      name: "Post-Impressionism",
      img: ["https://magazine.artland.com/wp-content/uploads/2022/07/van-gogh-starry-night-min.jpg","https://cdn.britannica.com/89/196489-138-8770A1D5/Vincent-van-Gogh-life-work.jpg?w=800&h=450&c=crop", "https://www.theartstory.org/images20/works/post_impressionism_1.jpg","https://images.squarespace-cdn.com/content/v1/585caf95b8a79b1e4b00d643/1524228141696-2KOHIU0LRAC6GW7JVMCI/DSC_0194.jpg?format=1000w" ],
      description:
        "Post-Impressionists both extended Impressionism while rejecting its limitations: the artists continued using vivid colors, a thick application of paint and real-life subject matter, but were more inclined to emphasize geometric forms, distort forms for an expressive effect and use unnatural and seemingly random colors." ,
      style_prompt: "Impressionist painting with vivid, expressive colors and bold, visible brushstrokes. The scene captures a landscape or still life, but with a more abstract, personal interpretation. The forms are slightly distorted, and the colors are exaggerated to create emotional intensity. The painting emphasizes texture and the artist's individual style, with less focus on naturalism and more on the expressive qualities of color and composition. The influence of artists like Van Gogh and Cézanne is evident.",
      characteristics: ["Focus on conveying emotions rather than realism.","Use of vivid, unnatural colors for dramatic effect.", "Unique, often exaggerated, styles and textures."],
      famous_paintings: ["assets/loadingArt/postIm-1.png", "The Starry Night (1889)", "Vincent van Gogh", "assets/loadingArt/postIm-2.png", "A Sunday Afternoon on La Grande Jatte (1884)", "Georges Seurat", "assets/loadingArt/postIm-3.png", "Montagne Saint-Victoire (1890)", "Paul Cezanne"],
      ai_examples: ["assets/AIexamples/pos1.png", "assets/AIexamples/pos2.png", "assets/AIexamples/pos3.png"]
    },
    {
      id: 2,
      name: "Renaissance",
      img: ["https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg", "https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg", "https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg", "https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg"],
      description:
        "Characterized by a focus on realism, proportion, and humanism, Renaissance art emphasizes detail, perspective, and lifelike representations of figures.",
      style_prompt: "A highly detailed and realistic painting of a serene scene from the Renaissance period, featuring harmonious composition, precise human anatomy, soft shading, and balanced proportions. The setting is a lush landscape with classical architecture in the background, and the characters are dressed in flowing robes, engaging in a calm, religious or mythological scene. The painting exudes a sense of calm and intellectualism, with an emphasis on natural light and subtle, warm colors.",
      characteristics: ["Focus on lifelike representation and perspective.","Emphasis on human experience and emotion.", "Symmetry and harmony in artwork."],
      famous_paintings:["assets/loadingArt/ren-1.png", "The birt of venus (1485)", "Sandro Botticelli", "assets/loadingArt/ren-2.png", "Mona Lisa (1503)", "Leonaro da Vici", "assets/loadingArt/ren-3.png", "Venus and cupid (1520s)", "Lorenzo Lotto" ],
      ai_examples: ["assets/AIexamples/ren1.png", "assets/AIexamples/ren2.png", "assets/AIexamples/ren3.png"]  
    },
      
    {
      id: 3,
      name: "Cubism",
      img: ["https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg", "https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg", "https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg", "https://theartiz.ai/wp-content/uploads/2024/06/ec4-scaled.jpg"],
      description:
        "An avant-garde movement that fragments objects into geometric shapes, presenting multiple viewpoints simultaneously. Developed by Picasso and Braque.",
      style_prompt: "A fragmented, geometric representation of a subject in the style of Cubism, with sharp angles and overlapping shapes. The image breaks the subject into abstract planes and uses multiple perspectives, with distorted proportions and bold lines. The colors are muted earth tones and primary colors, creating a sense of both movement and dissonance. The image challenges traditional perspectives by flattening depth and form, reminiscent of Picasso and Braque.",
      characteristics: ["Geometric shapes dominate visual composition.","Shows multiple perspectives simultaneously.", "Muted color palettes emphasize abstraction."],
      famous_paintings:["assets/loadingArt/cub-1.png", "Football Players (1912-13)", "Albert gleizes", "assets/loadingArt/cub-2.png", "The Street Pavers (1914)", "Umberto Boccioni", "assets/loadingArt/cub-3.png", "Card Player (1913)", "Pablo Picasso"],
      ai_examples: ["assets/AIexamples/cub1.png", "assets/AIexamples/cub2.png", "assets/AIexamples/cub3.png"]  
    },
    {
      id: 4,
      name: "Surrealism",
      img: ["https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original", "https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original", "https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original", "https://media.cnn.com/api/v1/images/stellar/prod/rene-magritte-le-double.jpg?c=original"],
      description:
        "A movement that merges the dream world with reality, Surrealism features strange, dreamlike scenes and symbolic imagery that challenges logic.",
      style_prompt: "A dreamlike, surreal scene that defies logic and blends reality with fantasy. The painting features impossible, bizarre elements like melting clocks, floating objects, and unnatural landscapes. The scene is filled with strange, imaginative juxtapositions, with elements that provoke a sense of wonder and confusion. The colors are vivid, with a focus on strange, unexpected objects placed in a hyperrealistic or distorted environment, creating an eerie and fantastical atmosphere.",
      characteristics: ["Scenes inspired by dreams and the unconscious mind.","Unusual combinations of objects and ideas.", "Use of abstract symbols to convey deeper meanings."],
      famous_paintings:["assets/loadingArt/sur-1.png", "Guernica (1937)", "Pablo Picasso", "assets/loadingArt/sur-2.png", "Great Masturbator (1929)", "Salvador Dali", "assets/loadingArt/sur-3.png", "The Sun of man (1964)", "Rene Magritte"],
      ai_examples: ["assets/AIexamples/sur1.png", "assets/AIexamples/sur2.png", "assets/AIexamples/sur3.png"]  
    },
    {
      id: 5,
      name: "Baroque",
      img: ["https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg", "https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg", "https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg", "https://cdn.thecollector.com/wp-content/uploads/2023/12/important-baroque-paintings.jpg"],
      description:
        "Known for its dramatic lighting, intense emotions, and ornate details, Baroque art is characterized by grandeur, movement, and opulence.",
      style_prompt: "A dramatic and ornate Baroque-style painting with dynamic movement and intense contrasts of light and shadow (chiaroscuro). The scene is full of action, with rich, deep colors and strong emotional expressions on the characters’ faces. The composition is busy and dramatic, featuring religious or historical scenes with detailed costumes, flowing drapery, and luxurious textures. The use of lighting emphasizes the theatrical mood and depth.",
      characteristics: ["Dramatic lighting and intense contrasts.","Movement and emotional expression.", "Ornate details and elaborate compositions."],
      famous_paintings:["assets/loadingArt/bar-1.png", "Gypsy Girl (1628-30)", "Frans Hals", "assets/loadingArt/bar-2.png", "The Night Watch (1642)", "Rembrandt van Rijn", "assets/loadingArt/bar-3.png", "Milkmaid (1660)", "Johannes Vermeer" ],
      ai_examples: ["assets/AIexamples/bar1.png", "assets/AIexamples/bar2.png", "assets/AIexamples/bar3.png"]  
    },
    {
      id: 6,
      name: "Abstract",
      img: ["https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg", "https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg", "https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg", "https://www.meisterdrucke.ie/kunstwerke/1260px/fachtali_abderrahim_-_Abstract_painting_silhouette_of_dancing_woman_Printable_digital_Art_-_%28MeisterDrucke-1469538%29.jpg"],
      description:
        "Abstract art breaks away from traditional representation, focusing on color, form, and line to create compositions that are non-representational and subjective.",
      style_prompt: "A vibrant and non-representational abstract painting, with bold shapes, dynamic lines, and splashes of color. The composition is fluid, featuring geometric or organic forms in a way that evokes emotions without depicting a clear subject. The colors are bright and contrasting, with spontaneous brushstrokes or carefully constructed patterns. The focus is on the interplay of forms, textures, and colors, evoking an emotional or expressive response rather than depicting real-world imagery.",
      characteristics: ["Focus on shapes over realism.","Emphasis on emotion and interpretation.", "Non-representational forms and colors."],
      famous_paintings:["assets/loadingArt/ab-1.png", "Le Premier Disque (1961)", "Robert Delaunay", "assets/loadingArt/ab-2.png", "Das Unbild (1919)", "Kurt Schwitters", "assets/loadingArt/ab-3.png", "Composition VII (1939-42)", "Piet Mondrian"],
      ai_examples : ["assets/AIexamples/abs1.png", "assets/AIexamples/abs2.png", "assets/AIexamples/abs3.png"]  
    },
  ];
  