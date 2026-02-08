// ═══════════════════════════════════════════════════════════════════════════
// TEDDY DAY - "Hug the Teddy" Interactive Love Site Template Data
// All content is customizable through this single data object
// ═══════════════════════════════════════════════════════════════════════════

export interface TeddyTemplateData {
  // Meta
  metaTitle: string;
  metaDescription: string;

  // Entry Screen
  entry: {
    question: string;
    yesButtonText: string;
    noButtonText: string;
  };

  // Background
  background: {
    imageUrl: string;
    overlayOpacity: number;
  };

  // Teddy Centerpiece
  teddy: {
    imageUrl: string;
    altText: string;
  };

  // Sticker Animation
  stickerAnimation: {
    stickerImageUrl: string;
    typingText: string;
  };

  // Reveal Stickers (max 8-10)
  revealStickers: Array<{
    id: string;
    imageUrl: string;
    rotation: number;
    scale: number;
    zIndex: number;
  }>;

  // Hug Interaction
  hugInteraction: {
    promptText: string;
    finalMessage: string;
    hugsRequired: number;
  };

  // Letter Content
  letter: {
    title: string;
    body: string;
    signoff: string;
  };

  // Scrapbook Photos (4 photos)
  photos: Array<{
    id: string;
    imageUrl: string;
    caption: string;
    rotation: number;
  }>;

  // Theme
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT TEMPLATE DATA - With sample images from public/couple
// ═══════════════════════════════════════════════════════════════════════════

export const defaultTemplateData: TeddyTemplateData = {
  metaTitle: "Happy Teddy Day 🧸",
  metaDescription: "A special surprise I made just for you, with all my love.",

  entry: {
    question: "Are you ready to see the surprise I made for you?",
    yesButtonText: "Yes, show me!",
    noButtonText: "Not yet...",
  },

  background: {
    imageUrl: "/couple/Fall Couples Engagement Photos _ Romantic Neutral….jpg",
    overlayOpacity: 0.35,
  },

  teddy: {
    imageUrl: "/teddy.png",
    altText: "Your special teddy bear",
  },

  stickerAnimation: {
    stickerImageUrl: "/heart.png",
    typingText: "Happy Teddy Day 🧸",
  },

  revealStickers: [
    { id: "sticker-1", imageUrl: "/heart.png", rotation: -10, scale: 0.8, zIndex: 5 },
    { id: "sticker-2", imageUrl: "/love.png", rotation: 15, scale: 0.9, zIndex: 15 },
    { id: "sticker-3", imageUrl: "/balloon.png", rotation: -5, scale: 0.7, zIndex: 5 },
    { id: "sticker-4", imageUrl: "/cute.png", rotation: 8, scale: 0.85, zIndex: 15 },
  ],

  hugInteraction: {
    promptText: "Tap the teddy for a hug 🤍",
    finalMessage: "This is how safe I feel with you.",
    hugsRequired: 3,
  },

  letter: {
    title: "My Dearest...",
    body: "Every memory we make together is my favorite. Looking at these photos reminds me of how lucky I am to have you.\n\nYou're the best part of every day!",
    signoff: "- With love 🤍",
  },

  photos: [
    {
      id: "photo-1",
      imageUrl: "/couple/c1.jpg",
      caption: "Our favorite memory together",
      rotation: -3,
    },
    {
      id: "photo-2",
      imageUrl: "/couple/c2.jpg",
      caption: "That moment I knew",
      rotation: 2,
    },
    {
      id: "photo-3",
      imageUrl: "/couple/c3.jpg",
      caption: "When we laughed the hardest",
      rotation: -2,
    },
    {
      id: "photo-4",
      imageUrl: "/couple/c4.jpg",
      caption: "Forever grateful for you",
      rotation: 4,
    },
  ],

  theme: {
    primaryColor: "#D4A574",
    secondaryColor: "#FFECD2",
    accentColor: "#F8B4B4",
  },
};

export default defaultTemplateData;
