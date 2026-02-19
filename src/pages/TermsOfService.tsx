import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center text-red-400 hover:text-red-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Text Detox Alchemy ("the Service"), operated by Text Detox Alchemy ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>Text Detox Alchemy is a text cleaning and formatting tool that removes hidden characters, emojis, and formatting artifacts from text. Premium features include AI-powered rewriting, tone adjustment, and document export capabilities.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Free and Paid Plans</h2>
            <p className="mb-2"><strong className="text-white">Free Plan:</strong> Basic text cleaning features are available at no cost.</p>
            <p className="mb-2"><strong className="text-white">Pro Plan ($9.99/month):</strong> Includes AI rewrite, tone adjustment, all format templates, and PDF/DOCX export.</p>
            <p><strong className="text-white">Lifetime Plan ($29 one-time):</strong> Includes everything in Pro with lifetime access and priority support.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Payments and Billing</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All payments are processed securely through Stripe.</li>
              <li>Pro subscriptions are billed monthly and renew automatically unless cancelled.</li>
              <li>Lifetime purchases are one-time payments with no recurring charges.</li>
              <li>Prices are in USD and may be subject to applicable taxes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Refund Policy</h2>
            <p>We offer refunds on a case-by-case basis. If you are unsatisfied with the Service, please contact us within 7 days of purchase at <a href="mailto:customer.service@textdetoxalchemy.com" className="text-red-400 hover:text-red-300 underline">customer.service@textdetoxalchemy.com</a>. Refund requests after 7 days may not be honored.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit content that is illegal, harmful, or infringes on third-party rights</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Use automated tools to scrape or overload the Service</li>
              <li>Resell or redistribute the Service without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Intellectual Property</h2>
            <p>The Service, including its design, features, and content (excluding user-submitted text), is owned by Text Detox Alchemy. You retain all rights to the text you submit and the cleaned output.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that it will meet your specific requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Text Detox Alchemy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Cancellation</h2>
            <p>You may cancel your Pro subscription at any time through the Stripe customer portal. Upon cancellation, you will retain access to Pro features until the end of your current billing period. Lifetime purchases are non-cancellable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the "Last updated" date. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable law, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
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

export default TermsOfService;
