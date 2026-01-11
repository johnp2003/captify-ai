# Captify AI 🚀

> **Stop staring at a blank screen. Generate platform-perfect social content in seconds.**

![Captify AI Banner](https://via.placeholder.com/1200x600/10b981/ffffff?text=Captify+AI+Preview)

## The Problem 🛑

Every creator knows the struggle: You have an idea, but turning it into a specialized post for X (Twitter), Instagram, and LinkedIn takes hours. 

Generic AI chat interfaces (like ChatGPT) give you raw text, but they completely fail at:
- **Visual Context**: How will this actually look in the feed?
- **Platform Constraints**: Is this thread formatted correctly? Is the LinkedIn post too long?
- **Workflow**: You spend more time "prompt engineering" and editing the output than you saved using it.

## The Solution ✨

**Captify AI** is not just a wrapper around an LLM. It's a **workflow engine** designed specifically for content creators. We bridge the gap between raw AI intelligence and publish-ready social content.

We've built a system that understands the *structure* of social media, not just the words.

## Key Features 🔑

### 1. Visual Validation (WYSIWYG)
**"Don't just tell me, show me."** 
Unlike standard chatbots, Captify renders live, realistic mockups of your content. Users see exactly how their X thread, Instagram caption, or LinkedIn post will look *before* they post it. This reduces anxiety and increases shipping speed.

### 2. Platform-Optimized Workflow
**We abstracted the "Prompt Engineering".**
Users shouldn't need a PhD in AI to get good results. We've baked complex, tuned prompts into the application layer. The user simply provides a topic or an image, and our system handles the nuance of tone, structure, and hashtag strategy.

### 3. Integrated History & Context
Content is saved not just as a flat text file, but as structured data tied to the specific platform it was generated for. This allows creators to build a library of high-performing assets they can revisit.

## Tech Stack 🛠️

Built with a focus on performance, type safety, and modern UX patterns.

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (for that premium SaaS feel)
- **AI Model**: [Google Gemini 2.5 Flash-Lite](https://deepmind.google/technologies/gemini/)
- **Authentication**: [Clerk](https://clerk.com/)

## Getting Started ⚡

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/captify-ai.git
   cd captify-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your API keys:
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
