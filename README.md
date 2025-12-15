# Love Shooter Game (Next.js Version)

A romantic and cute interactive shooting game where your partner (a cute bunny) sends kisses to you (a cute bear). Perfect for anniversaries, Valentine's Day, or just to say "I love you!" 💕

## 🎮 How to Play

1.  **Shoot Kisses**: Tap your character (the bunny on the left) or the designated "Kiss" button.
2.  **Hit the Target**: Aim for your partner (the bear on the right).
3.  **Win**: Successfully land **10 kisses** to trigger the grand celebration!
4.  **Celebrate**: Enjoy a "I LOVE YOU" message with music and a cute animation.

## 🛠️ How to Customize (Make it Your Own!)

We have made it super easy to customize the game with your own names and images using a single configuration file.

### 1. Edit Names and Texts

Open the file `app/game.config.ts`. You will see settings like this:

```typescript
export const gameConfig = {
  // Player 1 (Left Side)
  player1: {
    name: "Your Name", // Change this!
    image: "/cute_bunny.png",
    emoji: "🐰",
  },

  // Player 2 (Right Side - Target)
  player2: {
    name: "Partner Name", // Change this!
    image: "/cute_bear.png",
    emoji: "🐻",
  },

  // Celebration Messages
  celebration: {
    title: "HAPPY BIRTHDAY!", // Change to whatever you want!
    message: "You are my world!",
    coupleImage: "/cute_couple.png",
  },

  // ...
};
```

Simply change the text inside the quotes to whatever you like!

### 2. Change Images

To use your own photos or different characters:

1.  Place your image files (e.g., `my-photo.jpg`) inside the `public/` folder.
2.  Update the `image` path in `app/game.config.ts`:
    ```typescript
    player1: {
      name: "Me",
      image: "/my-photo.jpg", // Make sure to include the leading slash "/"
      // ...
    }
    ```

## 🚀 Getting Started (For Developers)

To run this project locally on your machine:

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Visit `http://localhost:3000` to see your game in action!

## 📱 Mobile Friendly

This game is optimized for mobile devices with touch controls and responsive text sizing.

Enjoy spreadling the love! 💖
