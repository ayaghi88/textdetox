import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center text-red-400 hover:text-red-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>Text Detox Alchemy ("we," "our," or "us") operates the website textdetoxalchemy.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-2">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Account Information:</strong> Email address and authentication credentials when you create an account.</li>
              <li><strong className="text-white">Payment Information:</strong> Payment details are processed securely by Stripe. We do not store your credit card information on our servers.</li>
              <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our service, including text submitted for cleaning (processed in real-time and not stored permanently).</li>
              <li><strong className="text-white">Device & Log Data:</strong> Browser type, IP address, and access times collected automatically.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>To provide, maintain, and improve our text cleaning services</li>
              <li>To process payments and manage subscriptions</li>
              <li>To communicate with you about your account or our services</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Text Data Processing</h2>
            <p>Text you submit for cleaning is processed in real-time to provide our service. We do not permanently store the text you input or the cleaned output. AI-powered features (rewrite, tone adjust) are processed through third-party AI providers, and your text is not used to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Stripe:</strong> For payment processing. Stripe's privacy policy can be found at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">stripe.com/privacy</a>.</li>
              <li><strong className="text-white">AI Providers:</strong> For AI-powered text rewriting features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Object to or restrict processing of your personal data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
            <p>We use essential cookies required for authentication and service functionality. We do not use third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
            <p>Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">
              <strong className="text-white">Text Detox Alchemy</strong><br />
              Email: <a href="mailto:customer.service@textdetoxalchemy.com" className="text-red-400 hover:text-red-300 underline">customer.service@textdetoxalchemy.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
