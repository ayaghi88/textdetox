import { useState } from "react";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, Download, Copy, FileText, Zap, Star, Check, LogOut, User, Wand2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PLANS = {
  pro: {
    priceId: "price_1T2SfURi2xdWrtmFHO8JV1Zo",
    productId: "prod_U0Tc01diU9CMON",
    mode: "subscription" as const,
  },
  lifetime: {
    priceId: "price_1T2SfkRi2xdWrtmFS7dqSlvq",
    productId: "prod_U0Tc0zJ25dh6y9",
    mode: "payment" as const,
  },
};

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [formatMode, setFormatMode] = useState("manuscript");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("professional");
  const navigate = useNavigate();
  const { user, subscription, signOut, checkSubscription } = useAuth();

  // Allow testing Pro features with ?test_pro=true in the URL
  const searchParams = new URLSearchParams(window.location.search);
  const testProMode = searchParams.get("test_pro") === "true";
  const effectiveSubscription = testProMode
    ? { subscribed: true, lifetime: false, isSubscription: true, productId: null, subscriptionEnd: null }
    : subscription;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'docx', 'pdf'].includes(ext || '')) {
      toast.error("Please upload a .txt, .docx, or .pdf file");
      return;
    }

    try {
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInputText(result.value);
        toast.success("DOCX uploaded and text extracted!");
      } else if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n\n";
        }
        setInputText(fullText.trim());
        toast.success("PDF uploaded and text extracted!");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setInputText(text);
          toast.success("File uploaded successfully!");
        };
        reader.readAsText(file);
      }
    } catch (err) {
      toast.error("Failed to read file. Please try a different format.");
      console.error("File upload error:", err);
    }
  };

  const cleanText = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to clean or upload a file");
      return;
    }

    let cleaned = inputText
      .replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u2060\u180E]/g, "")
      .replace(/^\uFEFF/, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "")
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036""]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035'']/g, "'")
      .replace(/\u2014/g, "--")
      .replace(/\u2013/g, "-")
      .replace(/\u2015/g, "--")
      .replace(/\u2026/g, "...")
      .replace(/\.{4,}/g, "...")
      .replace(/[\u00A0\u2007\u202F\u2000-\u200A]/g, " ")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/â€™/g, "'")
      .replace(/â€œ/g, '"')
      .replace(/â€\u009D/g, '"')
      .replace(/â€"/g, "--")
      .replace(/â€"/g, "-")
      .replace(/Ã©/g, "é")
      .replace(/Ã¨/g, "è")
      .replace(/Ã¼/g, "ü")
      .replace(/Ã¶/g, "ö")
      .replace(/Ã¤/g, "ä")
      .replace(/Ã±/g, "ñ")
      .replace(/\s+([.,;:!?])/g, "$1")
      .replace(/([.,;:!?])(?=[A-Za-z])/g, "$1 ")
      .replace(/\s{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Apply format-specific adjustments
    if (formatMode === "caption") {
      // Social media caption: compact, no indentation, line breaks for readability
      cleaned = cleaned
        .replace(/\n{2,}/g, "\n\n")
        .replace(/^[ \t]+/gm, "") // remove leading whitespace per line
        .replace(/(.{300,?})\. /g, "$1.\n\n") // break long blocks into readable chunks
        .trim();
    } else if (formatMode === "email") {
      // Email: clean paragraphs, no indentation, double-spaced paragraphs
      cleaned = cleaned
        .replace(/^[ \t]+/gm, "") // remove indentation
        .replace(/\n{3,}/g, "\n\n") // normalize spacing
        .trim();
    }

    setCleanedText(cleaned);
    toast.success(`Text cleaned for ${formatMode === "manuscript" ? "manuscript" : formatMode === "caption" ? "social caption" : "email"} format!`);
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

  const exportKDP = async () => {
    if (!cleanedText) return;

    let kdp = cleanedText
      .replace(/"/g, '"').replace(/'/g, "'")
      .replace(/\n{2,}/g, "\n\n")
      .replace(/[ \t]+$/gm, "")
      .replace(/\.  +/g, ". ")
      .replace(/^\s+/, "")
      .trim();

    const paragraphs = kdp.split(/\n\n+/).map(
      (para) =>
        new Paragraph({
          children: [
            new TextRun({
              text: para.replace(/\n/g, " "),
              size: 24, // 12pt
              font: "Times New Roman",
            }),
          ],
          spacing: { after: 200 },
          indent: { firstLine: 720 }, // 0.5 inch
          alignment: AlignmentType.LEFT,
        })
    );

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "kdp-ready-manuscript.docx");
    toast.success("KDP-ready DOCX exported!");
  };

  const exportPDF = () => {
    if (!cleanedText) return;
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lineHeight = 7;
    let y = margin;

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(cleanedText, pageWidth);
    for (const line of lines) {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }

    doc.save("detoxed-text.pdf");
    toast.success("PDF exported!");
  };

  const handleAiRewrite = async (mode: "rewrite" | "tone") => {
    if (!cleanedText) return;
    if (!effectiveSubscription.subscribed) {
      toast.error("AI features require a Pro or Lifetime plan");
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-rewrite", {
        body: { text: cleanedText, mode, tone: selectedTone },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.result) {
        setCleanedText(data.result);
        toast.success(mode === "rewrite" ? "Text rewritten!" : `Tone adjusted to ${selectedTone}!`);
      }
    } catch (err: any) {
      toast.error(err.message || "AI rewrite failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckout = async (plan: "pro" | "lifetime") => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PLANS[plan].priceId, mode: PLANS[plan].mode },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to open portal");
    }
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
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {effectiveSubscription.subscribed && (
                  <Badge className="bg-green-600 text-white">
                    {effectiveSubscription.lifetime ? "LIFETIME" : testProMode ? "TEST MODE" : "PRO"}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={handleManageSubscription} className="text-gray-300 hover:text-white">
                  <User className="h-4 w-4 mr-1" />
                  Account
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-300 hover:text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => navigate("/auth")}>SIGN UP</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">TEXT DETOX™</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">CLEAN. FORMAT. EXPORT.</h2>
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

              <div className="flex items-center mb-6">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              <Textarea
                placeholder="Paste your raw text here... (broken quotes, weird formatting, messy line breaks - we'll fix it all)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
              />
              <div className="flex justify-center mt-4">
                <Button onClick={cleanText} className="bg-red-600 hover:bg-red-700 px-8 py-3 font-bold">
                  DETOX TEXT
                </Button>
              </div>
            </Card>

            {cleanedText && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cleaned Text</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={copyToClipboard} className="bg-white text-black hover:bg-gray-200 font-bold">
                      <Copy className="h-4 w-4 mr-2" />
                      COPY
                    </Button>
                    <Button size="sm" onClick={downloadText} className="bg-white text-black hover:bg-gray-200 font-bold">
                      <Download className="h-4 w-4 mr-2" />
                      TXT
                    </Button>
                    {effectiveSubscription.subscribed ? (
                      <>
                        <Button variant="outline" size="sm" onClick={exportPDF} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button size="sm" onClick={exportKDP} className="bg-red-600 hover:bg-red-700 text-white">
                          <FileText className="h-4 w-4 mr-2" />
                          DOCX (KDP)
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                        <FileText className="h-4 w-4 mr-2" />
                        PDF / DOCX (Pro)
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Tools Section */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {effectiveSubscription.subscribed ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAiRewrite("rewrite")}
                        disabled={aiLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        {aiLoading ? "REWRITING..." : "AI REWRITE"}
                      </Button>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1.5"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="academic">Academic</option>
                        <option value="creative">Creative</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => handleAiRewrite("tone")}
                        disabled={aiLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        {aiLoading ? "ADJUSTING..." : "ADJUST TONE"}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI Rewrite & Tone (Pro)
                    </Button>
                  )}
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm">{cleanedText}</pre>
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
            <Card className="bg-gray-900 border-2 border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Free</h3>
              <p className="text-3xl font-bold mb-4 text-white">$0</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />Basic text cleanup</li>
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />Export to TXT</li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" onClick={() => document.getElementById('app-demo')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </Button>
            </Card>

            <Card className={`bg-red-950 border-2 p-6 relative ${effectiveSubscription.isSubscription ? 'border-green-500 ring-2 ring-green-500/30' : 'border-red-700 hover:border-red-500'}`}>
              {effectiveSubscription.isSubscription ? (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">YOUR PLAN</Badge>
              ) : (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">POPULAR</Badge>
              )}
              <h3 className="text-xl font-bold mb-4 text-white">Pro</h3>
              <p className="text-3xl font-bold mb-4 text-white">$9.99<span className="text-base text-gray-300">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />AI rewrite & tone adjust</li>
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />All format templates</li>
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />PDF & DOCX export</li>
              </ul>
              {effectiveSubscription.isSubscription ? (
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" onClick={handleManageSubscription}>
                  MANAGE PLAN
                </Button>
              ) : (
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={checkoutLoading} onClick={() => handleCheckout("pro")}>
                  {checkoutLoading ? "Loading..." : "START DETOXING"}
                </Button>
              )}
            </Card>

            <Card className={`bg-gray-900 border-2 p-6 ${effectiveSubscription.lifetime ? 'border-green-500 ring-2 ring-green-500/30' : 'border-gray-700 hover:border-gray-500'}`}>
              {effectiveSubscription.lifetime && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">YOUR PLAN</Badge>
              )}
              <h3 className="text-xl font-bold mb-4 text-white">Lifetime</h3>
              <p className="text-3xl font-bold mb-4 text-white">$29<span className="text-base text-gray-300"> once</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />Everything in Pro</li>
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />Lifetime access</li>
                <li className="flex items-center text-gray-200"><Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />Priority support</li>
              </ul>
              {effectiveSubscription.lifetime ? (
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" disabled>
                  PURCHASED ✓
                </Button>
              ) : (
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" disabled={checkoutLoading} onClick={() => handleCheckout("lifetime")}>
                  {checkoutLoading ? "Loading..." : "Limited Offer"}
                </Button>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-20 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Text Detox™. Built by creators, for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
