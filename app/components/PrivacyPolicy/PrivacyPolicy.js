import ReturnArrow from '@/app/SvgIcons/ReturnArrow';
import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
     return (
          <div className="px-5 pt-20 sm:pt-24 pb-6">
               <div className="max-w-[1296px] w-full mx-auto bg-white p-5 md:p-6 rounded-[20px] sm:rounded-[30px]">
                    <Link href='/' className='mb-4 md:mb-8 flex items-center gap-2'>
                        <ReturnArrow/> <h2 className='text-[#000000] text-[16px] font-normal'>Return to Main page</h2> 
                    </Link>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-3 md:mb-4">Privacy Policy</h1>
                    <p className="text-black text-sm sm:text-base mb-3 md:mb-4">Effective Date: 17 April 2025</p>

                    <p className="text-black text-sm sm:text-base mb-6">
                         Welcome to Finer Lux (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). We are committed to protecting and respecting your privacy.
                         This Privacy Policy explains how we collect, use, store, and share your personal information when you
                         use our website https://finerlux.com/ and our services.
                    </p>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">1. Who We Are</h2>
                         <p className="text-black text-sm sm:text-base mb-3">
                              Finer Lux is a UK-based business specialising in the buying and selling of luxury watches and jewellery.
                         </p>
                         <p className="text-black text-sm sm:text-base mb-2"><strong>Contact Details:</strong></p>
                         <p className="text-black text-sm sm:text-base">Email: <a href="mailto:info@finerlux.com" className="text-black hover:underline">info@finerlux.com</a></p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">2. What Personal Information We Collect</h2>
                         <p className="text-black text-sm sm:text-base mb-3">We may collect the following types of personal information:</p>
                         <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1 text-black text-sm sm:text-base">
                              <li>Name</li>
                              <li>Contact details (email address and postal address)</li>
                              <li>Payment details (processed via secure third-party providers)</li>
                              <li>Proof of identity (for high-value transactions and anti-fraud checks)</li>
                              <li>Purchase and sales history</li>
                              <li>Website usage data (via cookies and analytics tools)</li>
                         </ul>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">3. How We Use Your Information</h2>
                         <p className="text-black text-sm sm:text-base mb-3">We use your personal data to:</p>
                         <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1 text-black text-sm sm:text-base">
                              <li>Process purchases and sales</li>
                              <li>Verify your identity</li>
                              <li>Respond to your enquiries</li>
                              <li>Send transactional or promotional emails (if opted-in)</li>
                              <li>Prevent fraud and meet legal obligations</li>
                              <li>Improve our website and customer experience</li>
                         </ul>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">4. Legal Basis for Processing</h2>
                         <p className="text-black text-sm sm:text-base mb-3">
                              Under the UK GDPR, the lawful bases we rely on to process this information include:
                         </p>
                         <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1 text-black text-sm sm:text-base">
                              <li>Contractual necessity - to fulfill our sales and purchase agreements</li>
                              <li>Legal obligation - for fraud prevention and tax compliance</li>
                              <li>Legitimate interests - to improve our services and protect our business</li>
                              <li>Consent - for marketing communications (you can withdraw at any time)</li>
                         </ul>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">5. How We Share Your Information</h2>
                         <p className="text-black text-sm sm:text-base mb-3">We may share your data with:</p>
                         <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1 text-black text-sm sm:text-base">
                              <li>Payment processors (e.g., Stripe, PayPal)</li>
                              <li>Delivery and courier services</li>
                              <li>Identity verification providers</li>
                              <li>Legal or regulatory authorities (if required)</li>
                              <li>IT and marketing service providers (under strict confidentiality)</li>
                         </ul>
                         <p className="text-black text-sm sm:text-base">We do not sell or rent your personal data to third parties.</p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">6. How We Store and Protect Your Information</h2>
                         <p className="text-black text-sm sm:text-base mb-3">
                              We store your data on secure servers and take appropriate security measures to prevent unauthorised access,
                              disclosure, or loss.
                         </p>
                         <p className="text-black text-sm sm:text-base">
                              Your personal data is retained only as long as necessary for the purposes outlined above or as required by law.
                         </p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">7. International Data Transfers</h2>
                         <p className="text-black text-sm sm:text-base">
                              If we transfer your data outside the UK, we ensure appropriate safeguards are in place
                              (e.g., Standard Contractual Clauses) to protect your information in accordance with UK GDPR.
                         </p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">8. Your Data Protection Rights</h2>
                         <p className="text-black text-sm sm:text-base mb-3">You have the right to:</p>
                         <ul className="list-disc pl-5 sm:pl-6 mb-4 space-y-1 text-black text-sm sm:text-base">
                              <li>Access the personal data we hold about you</li>
                              <li>Request correction or deletion of your data</li>
                              <li>Object to or restrict processing</li>
                              <li>Withdraw consent at any time (for marketing)</li>
                              <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO)</li>
                         </ul>
                         <p className="text-black text-sm sm:text-base">
                              Contact the ICO: <a href="https://ico.org.uk/" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">https://ico.org.uk/</a>
                         </p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">9. Cookies</h2>
                         <p className="text-black text-sm sm:text-base">
                              Our website uses cookies to enhance your browsing experience. For details on the types of cookies
                              we use and how to manage your preferences, please see our <a href="#" className="text-black hover:underline">Cookie Policy</a>.
                         </p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">10. Changes to This Policy</h2>
                         <p className="text-black text-sm sm:text-base">
                              We may update this Privacy Policy from time to time. The latest version will always be posted
                              on our website with the effective date noted above.
                         </p>
                    </section>

                    <section className="mb-6 sm:mb-8">
                         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">11. Contact Us</h2>
                         <p className="text-black text-sm sm:text-base mb-1">If you have any questions about this policy or your data, please contact us at:</p>
                         <p className="text-black text-sm sm:text-base">Email: <a href="mailto:info@finerlux.com" className="text-black hover:underline">info@finerlux.com</a></p>
                    </section>
               </div>
          </div>
     );
};

export default PrivacyPolicy;