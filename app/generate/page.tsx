'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import {
  Clock,
  Copy,
  Instagram,
  Linkedin,
  Loader2,
  Upload,
  Zap,
  Sparkles,
  ChevronRight,
  History,
  ArrowRight,
  Rocket,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { SignInButton, useUser } from '@clerk/nextjs';
import { createOrUpdateUser, getGeneratedContentHistory, getUserPoints, saveGeneratedContent, updateUserPoints } from '@/utils/db/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { XMock } from '@/components/social-mocks/XMock';
import { InstagramMock } from '@/components/social-mocks/InstagramMock';
import { LinkedInMock } from '@/components/social-mocks/LinkedInMock';
import { GeminiBackground } from '@/components/GeminiBackground';
import { motion, AnimatePresence } from 'framer-motion';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;


const contentTypes = [
  { label: 'X', value: 'x' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
];

interface HistoryItem {
    id: number;
    contentType: string;
    prompt: string;
    content: string;
    createdAt: Date;
}

const POINTS_PER_GENERATION = 5;
const MAX_X_LENGTH = 280;


export default function GenerateContent() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [contentType, setContentType] = useState(contentTypes[0].value);
    const [tone, setTone] = useState('professional');
    const [audience, setAudience] = useState('Everyone');
    const [length, setLength] = useState('Medium');
    const [language, setLanguage] = useState('English');
    const [emojis, setEmojis] = useState('Minimal');
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userPoints, setUserPoints] = useState<number | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
    const [sidebarView, setSidebarView] = useState<'create' | 'history'>('create');

    const router = useRouter();

    useEffect(() => {
      if (!apiKey) {
        console.error('Gemini API key is not set');
      }
    }, []);

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push('/');
      } else if (isSignedIn && user) {
        console.log('User loaded:', user);
        fetchUserPoints();
        fetchContentHistory();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, isSignedIn, user, router]);

    const fetchUserPoints = async () => {
      if (user?.id) {
        console.log('Fetching points for user:', user.id);
        const points = await getUserPoints(user.id);
        console.log('Fetched points:', points);
        setUserPoints(points);
        if (points === 0) {
          console.log('User has 0 points. Attempting to create/update user.');
          const updatedUser = await createOrUpdateUser(
            user.id,
            user.emailAddresses[0].emailAddress,
            user.fullName || ''
          );
          console.log('Updated user:', updatedUser);
          if (updatedUser) {
            setUserPoints(updatedUser.points);
          }
        }
      }
    };

    const fetchContentHistory = async () => {
      if (user?.id) {
        const contentHistory = await getGeneratedContentHistory(user.id);
        setHistory(contentHistory);
      }
    };


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files[0]) {
           setImage(event.target.files[0]);
        }
    };

    const handleGenerate = async () => {
    console.log('Generating content...');
    if (
        !genAI ||
        !user?.id ||
        userPoints === null ||
        userPoints < POINTS_PER_GENERATION
    ) {
        alert('Not enough points or API key not set.');
        return;
    }

    setIsLoading(true);
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        let promptText = '';
        switch (contentType) {
          case 'x':
          case 'twitter':
             promptText = `You are a viral social media expert. Create a thread of 5 tweets about "${prompt}". \n\nRules:\n1. Tone: ${tone}. \n2. Hook the reader in the first tweet.\n3. Use short, punchy sentences.\n4. Include 2-3 relevant hashtags in the last tweet only.\n5. Each tweet must be under 280 characters.\n6. Return the result strictly as a valid JSON array of strings. Example: ["Tweet 1", "Tweet 2"]. Do not include any markdown formatting like \`\`\`json.`;
            break;
          case 'instagram':
            promptText = `You are an Instagram growth strategist. Write a captivating caption for a post about "${prompt}". \n\nRules:\n1. Tone: ${tone}.\n2. Start with a strong hook or question.\n3. Use a conversational, authentic tone.\n4. Include line breaks for readability.\n5. Include a 'call to action' at the end.\n6. Add a curated list of 15-20 relevant hashtags at the very bottom.`;
            break;
          case 'linkedin':
            promptText = `You are a LinkedIn Top Voice. Write a professional yet personal post about "${prompt}". \n\nRules:\n1. Tone: ${tone}.\n2. Use a strong opening line (hook) to grab attention.\n3. Share a valuable insight, story, or lesson.\n4. Use short paragraphs for readability (white space).\n5. End with a thought-provoking question to encourage comments.\n6. Use 3-5 broad, industry-relevant hashtags.`;
            break;
          default:
            promptText = `Generate ${contentType} content about "${prompt}". Tone: ${tone}`;
        }

        let imagePart: Part | null = null;
        if (contentType === 'instagram' && image) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
            reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
                resolve(e.target.result);
            } else {
                resolve('');
            }
            };
            reader.readAsDataURL(image);
        });

        const base64Data = imageData.split(',')[1];
        if (base64Data) {
            imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: image.type,
            },
            };
        }
        promptText +=
            ' \n\n[IMAGE CONTEXT]: The user has provided an image. Analyze it and incorporate a natural description into the caption.';
        }

        const parts: (string | Part)[] = [promptText];
        if (imagePart) parts.push(imagePart);

        // Add Advanced Options to Prompt
        promptText += `\n\nAdditional Requirements:\n- Target Audience: ${audience}\n- Content Length: ${length}\n- Output Language: ${language} (Translate naturally if not English)\n- Emoji Usage: ${emojis}`;

        const result = await model.generateContent(parts);
        const generatedText = result.response.text();

        let content: string[] = [];
        if (contentType === 'x' || contentType === 'twitter') {
          try {
            // Clean the text of markdown code blocks if present
            const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
            // Attempt to parse JSON
            const parsed = JSON.parse(cleanedText);
            if (Array.isArray(parsed)) {
              content = parsed.map(String);
            } else {
               // If valid JSON but not array, fallback
               content = [cleanedText];
            }
          } catch (e) {
            console.warn("Failed to parse JSON for X content, falling back to split:", e);
             content = generatedText
            .split('\n\n')
            .filter((post) => post.trim() !== '');
          }
        } else {
          content = [generatedText];
        }

        setGeneratedContent(content);

        // Update points
        const updatedUser = await updateUserPoints(
        user.id,
        -POINTS_PER_GENERATION
        );
        if (updatedUser) {
        setUserPoints(updatedUser.points);
        }

        // Save generated content
        const savedContent = await saveGeneratedContent(
        user.id,
        content.join('\n\n'),
        prompt,
        contentType
        );

        if (savedContent) {
        setHistory((prevHistory) => [savedContent, ...prevHistory]);
        }
    } catch (error) {
        console.error('Error generating content:', error);
        setGeneratedContent(['An error occurred while generating content.']);
    } finally {
        setIsLoading(false);
    }
    };

    const handleHistoryItemClick = (item: HistoryItem) => {
      setSelectedHistoryItem(item);
      setContentType(item.contentType);
      setPrompt(item.prompt);
      setGeneratedContent(
        (item.contentType === "x" || item.contentType === "twitter")
          ? item.content.split("\n\n")
          : [item.content]
      );
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      });
    };

    const renderContentMock = () => {
      if (generatedContent.length === 0) return null;

      switch (contentType) {
        case 'x':
        case 'twitter':
          return <XMock content={generatedContent} />;
        case 'instagram':
          return <InstagramMock content={generatedContent[0]} />;
        case 'linkedin':
          return <LinkedInMock content={generatedContent[0]} />;
        default:
          return null;
      }
    };

    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
      );
    }

    if (!isSignedIn) {
      return (
        <div className="min-h-screen text-gray-100 overflow-hidden relative selection:bg-emerald-500/30">
          <GeminiBackground />
          <Navbar />
          <div className="flex items-center justify-center min-h-screen pt-20">
            <div className="text-center bg-gray-900/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-gray-800 max-w-lg mx-4">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                <Sparkles className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Unlock the Magic
              </h1>
              <p className="text-gray-400 mb-10 leading-relaxed">
                Join our community of creators and start generating amazing AI content in seconds.
              </p>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                  Sign In to Start
                </Button>
              </SignInButton>
              <p className="text-gray-600 mt-8 text-xs font-medium uppercase tracking-widest">
                FREE CREDITS INCLUDED
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen text-gray-100 overflow-hidden pt-20 relative selection:bg-emerald-500/30">
        <GeminiBackground />
        <Navbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b border-gray-800/50"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Content Studio
              </h1>
              <p className="text-gray-400 text-lg">
                Create engaging social media content in seconds.
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-6 md:mt-0 p-2 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex flex-col px-4">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Available Credits</span>
                <div className="flex items-center">
                   <Zap className="w-4 h-4 text-emerald-400 mr-2" />
                   <span className="text-2xl font-bold text-white leading-none">
                    {userPoints !== null ? userPoints : '...'}
                   </span>
                </div>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 h-12 font-bold transition-all shadow-lg shadow-emerald-500/20">
                <Link href="/pricing">Add Credits</Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar: Config */}
            <div className="lg:col-span-4 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-gray-900/40 p-1.5 rounded-2xl border border-gray-800/50 flex items-center gap-1 mb-2">
                <button
                  onClick={() => setSidebarView('create')}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    sidebarView === 'create'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create
                </button>
                <button
                  onClick={() => setSidebarView('history')}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    sidebarView === 'history'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </button>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {sidebarView === 'create' ? (
                    <motion.div 
                      key="create"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                      
                      <h2 className="text-sm font-bold mb-8 text-gray-400 uppercase tracking-widest flex items-center">
                         <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
                         Post Configuration
                      </h2>

                      <div className="space-y-8">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">Select Platform</label>
                          <div className="grid grid-cols-3 gap-3">
                            {contentTypes.map((type) => (
                              <button
                                key={type.value}
                                onClick={() => setContentType(type.value)}
                                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-300 ${
                                  contentType === type.value
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-105'
                                    : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                                }`}
                              >
                                {(type.value === 'x' || type.value === 'twitter') && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-2">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                )}
                                {type.value === 'instagram' && <Instagram className="h-5 w-5 mb-2" />}
                                {type.value === 'linkedin' && <Linkedin className="h-5 w-5 mb-2" />}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">Select Tone</label>
                          <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-14 rounded-2xl px-5 hover:border-emerald-500/50 transition-all">
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 rounded-2xl">
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                              <SelectItem value="witty">Witty</SelectItem>
                              <SelectItem value="controversial">Controversial</SelectItem>
                              <SelectItem value="empathetic">Empathetic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Audience</label>
                            <Select value={audience} onValueChange={setAudience}>
                              <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-12 rounded-xl px-4 text-xs">
                                <SelectValue placeholder="Audience" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 rounded-xl">
                                <SelectItem value="Everyone">Everyone</SelectItem>
                                <SelectItem value="Beginners">Beginners</SelectItem>
                                <SelectItem value="Experts">Experts</SelectItem>
                                <SelectItem value="Investors">Investors</SelectItem>
                                <SelectItem value="Gen Z">Gen Z</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Length</label>
                            <Select value={length} onValueChange={setLength}>
                              <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-12 rounded-xl px-4 text-xs">
                                <SelectValue placeholder="Length" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 rounded-xl">
                                <SelectItem value="Short">Short</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Long">Long</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                             <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Language</label>
                             <Select value={language} onValueChange={setLanguage}>
                              <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-12 rounded-xl px-4 text-xs">
                                <SelectValue placeholder="Language" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 rounded-xl">
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Japanese">Japanese</SelectItem>
                                <SelectItem value="Portuguese">Portuguese</SelectItem>
                                <SelectItem value="Indonesian">Indonesian</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Emojis</label>
                            <Select value={emojis} onValueChange={setEmojis}>
                              <SelectTrigger className="w-full bg-gray-800/50 border-gray-700/50 text-gray-200 h-12 rounded-xl px-4 text-xs">
                                <SelectValue placeholder="Emojis" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700 text-gray-200 rounded-xl">
                                <SelectItem value="None">None 🚫</SelectItem>
                                <SelectItem value="Minimal">Minimal 🙂</SelectItem>
                                <SelectItem value="Standard">Standard 😃</SelectItem>
                                <SelectItem value="Heavy">Heavy 🚀🔥</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">What's the topic?</label>
                          <Textarea
                            placeholder="e.g. 5 productivity tips for developers..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="bg-gray-800/50 border-gray-700/50 focus:border-emerald-500/50 focus:ring-0 rounded-2xl min-h-[160px] transition-all resize-none text-base placeholder:text-gray-600 p-5"
                          />
                        </div>

                        {contentType === 'instagram' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Reference Image (Optional)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className={`group flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                                image
                                  ? 'border-emerald-500/50 bg-emerald-500/10'
                                  : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${image ? 'bg-emerald-500/20' : 'bg-gray-700/50'}`}>
                                <Upload className={`h-5 w-5 ${image ? 'text-emerald-400' : 'text-gray-400'}`} />
                              </div>
                              <span className="text-sm text-gray-400 truncate flex-1 font-medium">
                                {image ? image.name : 'Upload reference image'}
                              </span>
                            </label>
                          </motion.div>
                        )}

                        <Button
                          onClick={handleGenerate}
                          disabled={isLoading || !prompt || (userPoints !== null && userPoints < POINTS_PER_GENERATION)}
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                              <span>Creating Magic...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Sparkles className="mr-3 h-5 w-5" />
                              <span>Generate Content</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="history"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 min-h-[500px] flex flex-col shadow-2xl"
                    >
                      <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        Recent Activity
                      </h2>
                      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {history.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center px-4">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-4">
                               <History className="w-6 h-6 text-gray-600" />
                            </div>
                            <p className="text-xs font-medium">History is empty.</p>
                            <p className="text-[10px] text-gray-600 mt-1">Your generations will appear here.</p>
                          </div>
                        ) : (
                          history.map((item, index) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              onClick={() => handleHistoryItemClick(item)}
                              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                                selectedHistoryItem?.id === item.id 
                                ? 'bg-emerald-500/10 border-emerald-500/30' 
                                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center mb-2">
                                 {(item.contentType === 'x' || item.contentType === 'twitter') && (
                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mr-2 text-white">
                                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                   </svg>
                                 )}
                                 {item.contentType === 'instagram' && <Instagram className="h-3 w-3 text-pink-400 mr-2" />}
                                 {item.contentType === 'linkedin' && <Linkedin className="h-3 w-3 text-blue-400 mr-2" />}
                                 <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                                   {item.contentType === 'twitter' ? 'x' : item.contentType}
                                 </span>
                                 <span className="text-[9px] text-gray-600 ml-auto">{new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-300 line-clamp-1 font-medium">{item.prompt}</p>
                            </motion.button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Content: Preview Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {(selectedHistoryItem || generatedContent.length > 0) ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-900/60 backdrop-blur-xl border border-gray-800 px-8 py-6 rounded-[2rem] shadow-2xl gap-4">
                       <div className="flex items-center space-x-5">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                             <Sparkles className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                             <h2 className="text-lg font-bold text-white leading-tight">Your Masterpiece</h2>
                             <p className="text-sm text-gray-500 font-medium tracking-wide">AI-Generated with Gemini 2.5</p>
                          </div>
                       </div>
                       <Button 
                          onClick={() => copyToClipboard(generatedContent.join('\n\n'))}
                          className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm h-12 px-6 border border-gray-700 shadow-lg transition-all"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      {/* Raw Content Display */}
                      <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 shadow-2xl">
                         <div className="space-y-6">
                          {(contentType === 'x' || contentType === 'twitter') ? (
                            <div className="space-y-6">
                              {(selectedHistoryItem
                                ? selectedHistoryItem.content.split('\n\n')
                                : generatedContent
                              ).map((post, index) => (
                                <motion.div 
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 hover:border-emerald-500/30 transition-all group"
                                >
                                  <div className="flex justify-between items-center mb-4">
                                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Part {index + 1}</div>
                                     <button onClick={() => copyToClipboard(post)} className="text-gray-500 hover:text-emerald-400 transition-colors">
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <div className="text-gray-200 text-sm leading-relaxed prose prose-invert max-w-none">
                                    <ReactMarkdown>{post}</ReactMarkdown>
                                  </div>
                                  <div className="mt-6 pt-4 border-t border-gray-700/50 text-[10px] text-gray-600 font-medium">
                                    {post.length} / 280 characters
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50">
                              <div className="text-gray-200 text-base leading-relaxed prose prose-invert max-w-none">
                                <ReactMarkdown>
                                  {selectedHistoryItem ? selectedHistoryItem.content : generatedContent[0]}
                                </ReactMarkdown>
                              </div>
                              <div className="mt-10 pt-8 border-t border-gray-700/50 flex justify-end">
                                <Button 
                                  onClick={() => copyToClipboard(selectedHistoryItem ? selectedHistoryItem.content : generatedContent[0])}
                                  variant="outline"
                                  className="border-gray-700 bg-gray-800/50 text-gray-300 hover:text-white hover:border-emerald-500/50 rounded-xl h-12 px-8 transition-all"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Content
                                </Button>
                              </div>
                            </div>
                          )}
                         </div>
                      </div>

                      {/* Preview Section */}
                      <div className="flex flex-col">
                         <div className="flex items-center justify-center mb-8">
                            <div className="h-[1px] flex-1 bg-gray-800/50" />
                            <span className="px-6 text-[11px] uppercase tracking-widest font-bold text-gray-500">Live Preview</span>
                            <div className="h-[1px] flex-1 bg-gray-800/50" />
                         </div>
                         <div className="flex-1 flex items-start justify-center">
                            <motion.div 
                              initial={{ opacity: 0, rotateY: -10 }}
                              animate={{ opacity: 1, rotateY: 0 }}
                              className="w-full max-w-[380px] shadow-2xl rounded-[3rem] overflow-hidden border border-gray-800 bg-black/80 backdrop-blur-2xl"
                            >
                               {renderContentMock()}
                            </motion.div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[650px] flex flex-col items-center justify-start pt-20 border-2 border-dashed border-gray-800/50 rounded-[3rem] bg-gray-900/20 backdrop-blur-sm group"
                  >
                    <div className="w-24 h-24 bg-gray-800/50 rounded-3xl flex items-center justify-center border border-gray-700 mb-8 group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                      <Sparkles className="w-10 h-10 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Ready to Create?</h3>
                    <p className="text-gray-500 max-w-sm text-center text-lg leading-relaxed">
                      Provide a prompt on the left to start generating high-quality content for your social media.
                    </p>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    );
}
