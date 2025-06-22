import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, Download, Copy, FileText, Zap, Users, Star } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [formatMode, setFormatMode] = useState("manuscript");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      toast.error("Please upload a .txt, .docx, or .pdf file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (file.name.endsWith('.txt')) {
        setInputText(text);
        toast.success("File uploaded successfully!");
      } else if (file.name.endsWith('.pdf')) {
        // For PDFs, we'll extract what we can as plain text
        // Note: This is a simplified approach - in production you'd want a proper PDF parser
        setInputText(text);
        toast.success("PDF uploaded! Note: PDF content has been simplified to plain text.");
      } else {
        // For .docx files, we'll extract what we can as plain text
        // Note: This is a simplified approach - in production you'd want a proper .docx parser
        setInputText(text);
        toast.success("File uploaded! Note: .docx formatting has been simplified to plain text.");
      }
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For .docx and .pdf, read as text (simplified approach)
      reader.readAsText(file);
    }
  };

  const cleanText = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to clean or upload a file");
      return;
    }

    // Basic text cleaning simulation
    let cleaned = inputText
      .replace(/[""]/g, '"') // Replace smart quotes
      .replace(/['']/g, "'") // Replace smart apostrophes
      .replace(/—/g, "--") // Replace em dashes
      .replace(/–/g, "-") // Replace en dashes
      .replace(/\s+/g, " ") // Normalize spaces
      .replace(/\n\s*\n/g, "\n\n") // Fix line breaks
      .trim();

    setCleanedText(cleaned);
    toast.success("Text cleaned successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanedText);
    toast.success("Copied to clipboard!");
  };

  const downloadText = () => {
    const blob = new Blob([cleanedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detoxed-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold">TEXT DETOX™</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-red-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-red-400 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-red-400 transition-colors">About</a>
          </nav>
          <Button className="bg-red-600 hover:bg-red-700">SIGN UP</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            TEXT DETOX™
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            CLEAN. FORMAT. EXPORT.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your messy text into clean, publishing-ready content.
          </p>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-xl px-8 py-4 rounded-none font-bold"
            onClick={() => document.getElementById('app-demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            PASTE YOUR TEXT
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Text Clean-Up</h3>
              </div>
              <p className="text-gray-300">Remove smart quotes, fix line breaks, and strip out junk characters</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Auto Formatting</h3>
              </div>
              <p className="text-gray-300">Instantly format for manuscripts, PDFs, blogs, and more</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Quick Export</h3>
              </div>
              <p className="text-gray-300">Copy or download your cleaned text in seconds</p>
            </Card>
          </div>
        </div>
      </section>

      {/* App Demo */}
      <section id="app-demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Try Text Detox™ Now</h2>
              <p className="text-xl text-gray-300">Paste your messy text or upload a file and watch it transform</p>
            </div>

            {/* Format Mode Selector */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'manuscript', label: 'Manuscript' },
                  { id: 'caption', label: 'Caption' },
                  { id: 'email', label: 'Email' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setFormatMode(mode.id)}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      formatMode === mode.id 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <Card className="bg-gray-900 border-gray-700 p-6 mb-8">
              {/* File Upload Section */}
              <div className="mb-6">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">.TXT, .DOCX, or .PDF files</p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".txt,.docx,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              {/* Text Area */}
              <Textarea
                placeholder="Paste your raw text here... (broken quotes, weird formatting, messy line breaks - we'll fix it all)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
              />
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={cleanText}
                  className="bg-red-600 hover:bg-red-700 px-8 py-3 font-bold"
                >
                  DETOX TEXT
                </Button>
              </div>
            </Card>

            {cleanedText && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cleaned Text</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      COPY
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadText}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      DOWNLOAD
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm">
                    {cleanedText}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Paste or Upload</h3>
                <p className="text-gray-300">Drop in raw text or upload your .docx/.txt file</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Pick Your Style</h3>
                <p className="text-gray-300">Choose from presets like KDP, IG Caption, Blog Post, or PDF Export</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Get Clean Copy</h3>
                <p className="text-gray-300">Your content is detoxed, formatted, and ready to go</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Who It's For</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>Self-publishing authors (KDP/Canva/Word)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>TikTok & IG creators</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>Course + content creators</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>Coaches, ghostwriters, and VAs</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>Web writers & marketers</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-600">✓</Badge>
                <span>Anyone tired of formatting stress</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What Creators Say</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"I used Text Detox before uploading to KDP. Saved me HOURS. It's now my first step for every project."</p>
              <p className="text-red-400 font-semibold">– Indie Author</p>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"I didn't realize how broken my captions were 'til this cleaned them. Game changer."</p>
              <p className="text-red-400 font-semibold">– IG Coach</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Start Free. Upgrade When You're Ready.</h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Free</h3>
              <p className="text-3xl font-bold mb-4">$0</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>Basic text cleanup</li>
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>Export to TXT</li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600">Get Started</Button>
            </Card>
            
            <Card className="bg-red-900 border-red-600 p-6 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-600">POPULAR</Badge>
              <h3 className="text-xl font-bold mb-4">Pro</h3>
              <p className="text-3xl font-bold mb-4">$9.99<span className="text-base">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>AI rewrite & tone adjust</li>
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>All format templates</li>
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>PDF & DOCX export</li>
              </ul>
              <Button className="w-full bg-red-600 hover:bg-red-700">START DETOXING</Button>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Lifetime</h3>
              <p className="text-3xl font-bold mb-4">$29<span className="text-base"> once</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>Everything in Pro</li>
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>Lifetime access</li>
                <li className="flex items-center"><Badge className="bg-green-600 mr-2">✓</Badge>Priority support</li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600">Limited Offer</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-20 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About the Founder</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Amber Yaghi is the visionary behind Text Detox™, a street scholar and manifestation architect who flipped her pain into publishing and now builds tools for the underdog creative.
            </p>
            <p className="text-red-400 mt-4">Follow her journey @hushlaoftheyear</p>
          </div>
          
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Text Detox™. Built by creators, for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
