import Link from "next/link";
import {
  ArrowRight,
  Accessibility,
  Volume2,
  Languages,
  Image as ImageIcon,
  Cpu,
  Globe,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-accent-blue/20 text-accent-blue text-sm font-medium animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Accessibility Solutions</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight text-balance">
            Accessibility for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-blue-400">
              Every Human.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed text-balance">
            OpenVoice is the world&apos;s most advanced accessibility platform. We use state-of-the-art AI
            to bridge communication gaps and make the world readable, audible, and accessible for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/sign-language"
              className="px-8 py-4 bg-accent-blue text-navy-950 font-bold rounded-xl hover:bg-accent-bright transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
              className="px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
            >
              Customize Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Languages}
            title="Sign Language"
            description="Real-time translation of sign language into text and voice using advanced computer vision."
            href="/sign-language"
            color="bg-purple-500"
          />
          <FeatureCard
            icon={Volume2}
            title="Voice Assistant"
            description="Intelligent voice-to-text and text-to-voice processing with emotion detection."
            href="/voice-assistant"
            color="bg-accent-blue"
          />
          <FeatureCard
            icon={ImageIcon}
            title="Image Describer"
            description="Detailed visual descriptions for users with visual impairments, powered by multimodal LLMs."
            href="/image-describer"
            color="bg-green-500"
          />
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="bg-navy-900/50 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 grid col-cols-2 lg:grid-cols-4 gap-12 text-center">
          <StatItem value="99.9%" label="Accuracy Rate" />
          <StatItem value="50+" label="Languages Supported" />
          <StatItem value="1M+" label="Active Users" />
          <StatItem value="WCAG" label="2.1 Compliant" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, href, color }: any) {
  return (
    <Link href={href} className="group relative glass p-8 rounded-3xl border border-white/5 hover:border-accent-blue/30 transition-all duration-500 hover:-translate-y-2">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center text-accent-blue font-semibold group-hover:translate-x-2 transition-transform">
        <span>Try it now</span>
        <ArrowRight className="w-5 h-5 ml-2" />
      </div>
    </Link>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-4xl font-black text-white">{value}</div>
      <div className="text-accent-blue font-medium uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
}
