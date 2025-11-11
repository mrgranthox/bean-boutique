export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-6xl mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </section>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Bean Boutique, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website, make a purchase, 
              or interact with our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Information We Collect</h2>
            
            <h3 className="text-xl mb-3">Personal Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-6">
              <li>Create an account on our website</li>
              <li>Make a purchase or place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us with questions or feedback</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-xl mb-3">Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you visit our website, we may automatically collect certain information about your device, 
              including information about your web browser, IP address, time zone, and some of the cookies 
              that are installed on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-6">
              <li>To process and fulfill your orders</li>
              <li>To send you information about your purchases</li>
              <li>To improve our website and customer service</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-6">
              <li>With service providers who help us operate our business</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and property</li>
              <li>With your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar tracking technologies to improve your browsing experience, 
              analyze website traffic, and understand where our visitors are coming from. You can 
              control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to review their privacy 
              policies before providing any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you become aware that a child 
              has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="text-muted-foreground leading-relaxed">
              <p>Bean Boutique<br />
              123 Coffee Street<br />
              Downtown District, City 12345<br />
              Email: privacy@beanboutique.com<br />
              Phone: (555) 123-BEAN</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}