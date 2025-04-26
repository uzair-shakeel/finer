import ReturnArrow from '@/app/SvgIcons/ReturnArrow'
import Link from 'next/link'
import React from 'react'

const TermsCondition = () => {
     return (
          <div className="px-5 pt-20 sm:pt-24 pb-6">
               <div className="max-w-[1296px] w-full mx-auto bg-white p-5 md:p-6 rounded-[20px] sm:rounded-[30px]">
                    <Link href='/' className='mb-4 md:mb-8 flex items-center gap-2'>
                         <ReturnArrow /> <h2 className='text-[#000000] text-[16px] font-normal'>Return to Main page</h2>
                    </Link>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-3 md:mb-4">Terms and Conditions</h1>
                    <p className="text-black text-sm sm:text-base mb-3 md:mb-4">Last Updated: April 12, 2025</p>

                    <div className="space-y-8 md:space-y-12">
                         {/* Introduction */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">1. Introduction</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <p>
                                        Welcome to Finer Lux&apos;s website (the &apos;Site&apos;). These Terms and Conditions (&apos;Terms&apos;) govern your use of the Site and any purchase or service provided by Finer Lux (&apos;we,&apos; &apos;us,&apos; or &apos;our&apos;). Finer Lux is a company based in London, UK, involved in buying and selling new and pre-owned luxury watches and jewellery, as well as related services such as sourcing, part exchanging, and authentication. By accessing our Site or engaging in a transaction with us, you agree to these Terms. If you do not agree, you must refrain from using our Site or services.
                                   </p>
                                   <p>
                                        Finer Lux is an independent luxury watch and jewellery dealer and is not affiliated with Rolex, Patek Philippe, Cartier, Van Cleef & Arpels, or any other brands mentioned on our Site. All brand names and trademarks are the property of their respective owners, and use on our Site is for identification and description purposes only.
                                   </p>
                              </div>
                         </section>

                         {/* Eligibility */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">2. Eligibility and Age Restriction</h2>
                              <div className="text-sm sm:text-base">
                                   <p>
                                        Our products and services are intended for adults only (18 years and older). By using this Site or placing an order, you represent and warrant that you are at least 18
                                        years of age and legally capable of forming a binding contract. We do not knowingly collect information from or transact with individuals under 18. If you are under 18, please do not use this Site or provide any personal information.
                                   </p>
                              </div>
                         </section>

                         {/* Use of Website */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">3. Use of the Website and Acceptable Use</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <p>
                                        You agree to use the Finer Lux Site only for lawful purposes and in accordance with these Terms. Prohibited uses of the Site include (but are not limited to):
                                   </p>
                                   <ul className="pl-4 sm:pl-6 space-y-3 list-disc">
                                        <li>
                                             <h3 className="font-semibold">No Illegal or Harmful Use:</h3>
                                             <p>You must not use the Site for any unlawful, fraudulent, or malicious activities. You also must not misuse the Site by knowingly introducing viruses, trojans, worms, logic bombs or other malicious or technologically harmful material.</p>
                                        </li>
                                        <li>
                                             <h3 className="font-semibold">No Unauthorized Access:</h3>
                                             <p>You must not attempt to gain unauthorized access to any part of our Site, the server on which the Site is hosted, or any server, computer, or database connected to our Site. Likewise, you agree not to attack our Site via a denial-of-service attack or similar.</p>
                                        </li>
                                        <li>
                                             <h3 className="font-semibold">No Data Mining or Scraping:</h3>
                                             <p>You must not use any robot, spider, scraper, or other automated means to access the Site for any purpose without our express written permission. Also, you may not harvest or collect information about other users of the Site.</p>
                                        </li>
                                        <li>
                                             <h3 className="font-semibold">No Abuse of Content:</h3>
                                             <p>You may not use our Site&apos;s content for any commercial purpose (other than for its intended e-commerce use) without permission. You must not copy, reproduce, modify, or distribute any portion of the Site (except as allowed under Section 4 below regarding Intellectual Property).</p>
                                        </li>
                                   </ul>
                                   <p>
                                        Violation of this Acceptable Use policy may result in immediate termination of your right to use our Site, and we may take legal action where appropriate. We reserve the right to monitor use of the Site and to disable any user account or block access for any reason, including suspected violations of these Terms.
                                   </p>
                              </div>
                         </section>

                         {/* Intellectual Property */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">4. Intellectual Property and Trademarks</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <p>
                                        All content on the Site, including text, descriptions, images, graphics, logos, design, and software, is owned by Finer Lux or its content licensors and is protected by copyright, trademark and other intellectual property laws. Finer Lux retains all rights, title, and interest in this content. You are authorized to view and print materials from our Site for your personal, non-commercial use only. Any other use (such as copying, reproducing, publishing, uploading, posting, or transmitting content) requires our prior written consent.
                                   </p>
                                   <p>
                                        All trademarks, brand names, and logos (e.g. Rolex, Patek Philippe, Cartier, Van Cleef & Arpels) mentioned on our Site are trademarks of their respective owners. Nothing in these Terms or on our Site grants you any license or right to use any trademarks displayed on the Site. Specifically, Finer Lux is an independent reseller and not an authorized agent of or affiliated with any of the luxury brands listed. Use of brand names is solely to describe the products, and trademark owners have no responsibility for our Site&apos;s content. You agree not to remove or obscure any copyright, trademark, or other proprietary rights notices on the Site.
                                   </p>
                              </div>
                         </section>

                         {/* Products and Services */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">5. Our Products and Services</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <p>
                                        Finer Lux specializes in luxury wristwatches and jewellery, including both new and pre-owned items from high-end brands. We also offer related services such as watch sourcing (finding specific items on request), part-exchange (trading in your existing watch/jewellery toward a purchase), and authentication services. All products and services are provided in accordance with these Terms, as well as any additional terms we communicate to you for particular services.
                                   </p>

                                   <div>
                                        <h3 className="font-semibold mb-2">Product Authenticity:</h3>
                                        <p>
                                             We make every effort to ensure that every watch or piece of jewellery we sell is authentic and as described. Each pre-owned item undergoes a thorough inspection and authentication process by our experts. However, since we are not an authorized dealer of the brands, manufacturer certificates or warranties may not always be available. In the unlikely event that any item sold by Finer Lux is later found not to be authentic, we will take appropriate action, such as offering you a full refund or equivalent remedy. Beyond that remedy, Finer Lux disclaims any further liability for losses arising from an item&apos;s authenticity (see Section 12 on Limitation of Liability). We are committed to ethical business, and cases of counterfeit or inauthentic items are exceptionally rare, but this disclaimer is included for transparency.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Product Descriptions and Images:</h3>
                                        <p>
                                             We strive to describe and depict our products accurately. This includes detailing whether an item is new or pre-owned, its condition, and inclusion of original packaging, certificates (&apos;papers&apos;), or accessories if applicable. The images of products on our Site are high-resolution and may show fine details (including any minor wear on pre-owned items). Please note: While we endeavor to display colors and details accurately, your viewing experience may vary - for example, colors can appear slightly different on different screens or devices. Your actual item may have minor variations in appearance compared to the online photos, especially for pre-owned items which may show subtle wear. Such minor differences that do not affect the described quality or functionality of the product shall not be considered misrepresentation.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Availability:</h3>
                                        <p>
                                             All products shown on our Site are subject to availability. Many of our items (especially pre-owned or rare watches) are unique pieces. We do our best to keep inventory status updated, but listing on the Site does not guarantee that a particular item is in stock at the exact moment of your order. If you place an order for an item that has just sold or is otherwise unavailable, we will inform you promptly. No contract for sale is formed until we have confirmed availability and accepted your order (see Section 6 below). We reserve the right to withdraw or discontinue any product or service at any time without prior notice.
                                        </p>
                                   </div>
                              </div>
                         </section>

                         {/* Orders and Contract */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">6. Orders and Contract Formation</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <p>
                                        By placing an order through our Site (or via phone/email as applicable), you are making an offer to purchase the specified product(s) under these Terms. All orders are subject to acceptance by Finer Lux. We reserve the right to decline or cancel any order for any reason prior to acceptance - for example, if a product is out of stock, if we suspect fraud, or if there was an obvious error in price or description.
                                   </p>

                                   <div>
                                        <h3 className="font-semibold mb-2">Order Process:</h3>
                                        <p>
                                             When you place an order online, you will typically go through a checkout process to provide necessary details (e.g. shipping address, payment information). Please review your order carefully before submission and correct any errors. After you place an order, we will acknowledge receipt of the order by email. This order receipt email is not an acceptance of your order; it is a confirmation that we received your request.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Acceptance / Confirmation:</h3>
                                        <p>
                                             Our acceptance of your order will take place when we send you a confirmation email that the product has been dispatched or is ready for pickup. At that point, a binding contract is formed between you and Finer Lux for the sale of the item(s). If for any reason we cannot accept your order in full or in part, we will let you know. Only the items which we have confirmed as dispatched or ready will form part of the contract; any other items in your order that are not confirmed as dispatched do not form part of that contract and will not be charged.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Part Exchange and Sourcing Orders:</h3>
                                        <p>
                                             If your purchase involves a part exchange (trading in an item) or a special sourcing request, additional terms may apply which we will communicate to you. In general, when you offer an item for sale or part-exchange to Finer Lux, you warrant that you have full ownership rights to that item and that it is authentic and not stolen or counterfeit. Our acceptance of a part-exchange item and the valuation offered will be confirmed in writing. The value of the part exchange will be applied toward your new purchase as agreed. A contract for a sourced item (an item we locate on your behalf) is only formed once we have found the item, agreed on a price with you, and taken payment or a deposit as appropriate. Sourcing requests are subject to availability of the requested item on the market, and any timeframes given are estimates, not guarantees.
                                        </p>
                                   </div>
                              </div>
                         </section>

                         {/* Pricing and Payment */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">7. Pricing and Payment</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <div>
                                        <h3 className="font-semibold mb-2">Currency and Taxes:</h3>
                                        <p>
                                             All prices on our Site are listed in Great British Pounds (GBP) by default, and unless stated otherwise, are inclusive of UK VAT or applicable taxes. If you are viewing or purchasing from outside the UK, note that the price you see may not include any import duties, taxes, or fees that your local customs authorities might impose. You, as the customer, are responsible for any such additional charges related to importing goods into your country (if applicable).
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Price Accuracy:</h3>
                                        <p>
                                             We strive to ensure that all pricing information on our Site is accurate. However, pricing errors may occasionally occur. If we discover an error in the price of any item you have ordered, we will inform you as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it. If we are unable to contact you, we will treat the order as cancelled for the incorrectly priced item. If your order is cancelled in such a case, we will issue a full refund of any amount you have paid for that item. We are not obliged to supply products at an incorrect price, even after we have sent you an Order Confirmation, if the pricing error is obvious and unmistakable and could reasonably have been recognized by you as a mispricing.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Price Fluctuations:</h3>
                                        <p>
                                             Prices for luxury watches and jewellery can be subject to market fluctuation. Finer Lux reserves the right to change the prices of any product at any time before your order is placed and accepted, without prior notice. Once your order is confirmed by us, the price is fixed for that transaction - you will not be charged more even if our costs increase, and conversely we do not offer refunds or credits if the market value of an item or our listed price decreases after your purchase. In summary, the price applicable to your purchase is the price at the time your order is accepted.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Payment Terms:</h3>
                                        <p>
                                             Payment must be made in full for your order (minus any agreed part-exchange value, if applicable) before we dispatch the product. We accept various payment methods (e.g. bank transfer, credit/debit cards, or other methods as indicated on our Site). All payments are processed through secure and encrypted channels. If you choose a third-party financing or payment plan (if offered), the financing agreement may be subject to additional terms from that provider. We retain full ownership of any goods until the purchase price and any applicable charges (such as shipping) are paid in full.
                                        </p>
                                        <p className="mt-2">
                                             In the event of suspected fraud or if payment is not received/confirmed, we may cancel the transaction and have no obligation to ship the product. We also reserve the right to request additional verification or identification information from you before accepting a payment, to ensure security and compliance with anti-fraud measures.
                                        </p>
                                   </div>
                              </div>
                         </section>

                         {/* Delivery and Shipping */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">8. Delivery and Shipping</h2>
                              <div className="text-sm sm:text-base space-y-4">
                                   <div>
                                        <h3 className="font-semibold mb-2">Delivery Method:</h3>
                                        <p>
                                             Finer Lux will arrange secure shipping of purchased items to the address you provide. We typically use fully insured, tracked delivery services that require a signature upon arrival (for example, Royal Mail Special Delivery or reputable couriers for high-value items). We will provide you with tracking details once your order is shipped, so you can monitor its progress. For high-value items, our shipments are insured up to the value of the item for your protection. We currently ship to addresses within the UK. If you require international shipping, please contact us for availability and a tailored quote, as different terms or fees may apply for overseas delivery.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Delivery Timeframe:</h3>
                                        <p>
                                             While we aim to dispatch items promptly (often within 1-3 working days after order confirmation, unless otherwise stated or agreed), all delivery times provided are estimates. We cannot guarantee delivery on a specific date, as delays might occur due to courier issues, customs clearance (if international), or other unforeseen factors. We will not be liable for any delays in delivery that are outside our reasonable control (see Section 12, &apos;Events Outside Our Control&apos;). However, if we are aware of a significant delay or problem with your shipment, we will inform you and work to resolve it.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Receipt of Delivery:</h3>
                                        <p>
                                             A signature from you (or an adult at the delivery address) will be required to receive the product. Once delivered (or if delivery is attempted and you fail to collect or arrange redelivery), you become responsible for the item. Please inspect the package upon arrival for any signs of damage or tampering. If there is any noticeable damage to the package, you should note this with the courier if possible and contact us immediately.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Risk and Title:</h3>
                                        <p>
                                             The risk of loss or damage to the products passes to you when the item is delivered to the address you provided (or when delivery is attempted and failed due to your fault). Title (ownership) of the goods passes to you only when we have received full payment for the goods.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Failure to Deliver:</h3>
                                        <p>
                                             If a parcel is returned to us because of an incorrect address provided by you, or because it was not collected or accepted by you, we may charge you for the cost of re-delivery. If we cannot contact you or rearrange delivery, we may treat the contract as cancelled and refund you the price paid minus any reasonable costs incurred by us.
                                        </p>
                                   </div>
                              </div>
                         </section>

                         {/* Returns, Cancellations and Refunds */}
                         <section>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 md:mb-4">9. Returns, Cancellations and Refunds</h2>
                              <div className="text-sm sm:text-base space-y-6">
                                   <div>
                                        <h3 className="font-semibold mb-2">9.1 14-Day Money Back Guarantee (Online Purchases)</h3>
                                        <p>
                                             For purchases made online or via distance communication (phone/email), we offer a 14-day money back guarantee in compliance with UK consumer law for distance selling. This means that if for any reason you are not satisfied with your purchase, you have the right to cancel the purchase and return the item to us within 14 days of receiving it, for a full refund of the purchase price. This 14-day return policy applies only to online/remote purchases and not to in-person transactions (see Section 9.2 below for in-person sales).
                                        </p>
                                        <p className="mt-2">
                                             To initiate a return under this policy, you must contact us within 14 days of receiving the product (via email or phone as listed on our Site) to inform us that you wish to return it. We will provide you with return instructions. You then have another 14 days from the date you notify us to actually send the item back.
                                        </p>

                                        <div className="mt-3">
                                             <h4 className="font-semibold mb-2">Conditions for Returns:</h4>
                                             <p>To qualify for a full refund, the item must be returned in the same condition you received it, with all original packaging, boxes, papers/documents (e.g. warranty cards or certificates), links/accessories, and any other contents that were included. Specifically:</p>

                                             <ul className="list-disc pl-5 mt-2 space-y-2">
                                                  <li>The product must be unused and unworn beyond the amount necessary to inspect and evaluate it. It should show no signs of wear, alteration, or damage.</li>
                                                  <li>Any tamper-evident seals or stickers (if applied to the item) must be intact. If we supplied the watch with a security/tag or sticker to allow examination, do not remove it until you are certain you will keep the item. Returns will not be accepted if such seal/tag is removed or broken, as that indicates use beyond mere inspection (in line with industry practice).</li>
                                                  <li>You must include all original packaging (e.g. branded watch box, jewelry case) and all original contents (such as instruction booklets, certificates, appraisal documents, extra straps or links, etc.). Missing accessories or documentation may result in a reduction of the refundable amount.</li>
                                                  <li>The item should be securely packaged for the return shipment to avoid damage in transit. Ideally, use the same packaging materials it came with.</li>
                                             </ul>
                                        </div>

                                        <div className="mt-3">
                                             <h4 className="font-semibold mb-2">Return Shipping:</h4>
                                             <p>
                                                  When returning an item, you are responsible for arranging shipment back to us. We require that returns be sent via a tracked and insured delivery service. This means you should use a reputable courier or postal service that provides tracking and insure the parcel for the full value of the item. This protects you in case the item is lost or damaged in transit. We strongly recommend using services such as Royal Mail Special Delivery (within the UK) or similarly secure courier options. Please retain proof of postage and tracking information. Until the returned item reaches us, you remain responsible for it; if it gets lost or damaged en route back to us and was not adequately insured/tracked, we may not be able to process the refund (or the refund may be adjusted for the damage).
                                             </p>
                                        </div>

                                        <div className="mt-3">
                                             <h4 className="font-semibold mb-2">Inspection and Refund Processing:</h4>
                                             <p>
                                                  Once we receive the returned item, our team will inspect it to verify that it meets the return conditions outlined above. If everything is in order, we will process your refund within 14 days of receipt of the returned item (often sooner). The refund will be made to the original payment method you used, unless otherwise agreed. Please note that initial shipping costs (the cost we incurred to send the item to you) will be refunded only if the entire order is returned (or if we choose to do so as a courtesy); if you purchased multiple items and are only returning one, we may not refund the original shipping since other items were delivered. We do not charge any re-stocking fees, provided the return conditions are met. If the item is returned damaged, used, or missing components, we reserve the right to deduct an appropriate amount from the refund to cover the diminished value, or to refuse the return and send the item back to you (in which case you would be notified).
                                             </p>
                                        </div>

                                        <div className="mt-3">
                                             <h4 className="font-semibold mb-2">Exceptions:</h4>
                                             <p>
                                                  The 14-day money back guarantee is intended for change-of-mind or initial dissatisfaction cases. If the product you received is faulty or not as described, you also have rights under law to return it, which are not limited to the 14-day window (see Statutory Rights below). If you discover a functional problem or misdescription beyond 14 days, please contact us to discuss remedies (e.g. repair, exchange or refund depending on circumstances).
                                             </p>
                                        </div>

                                        <div className="mt-3">
                                             <h4 className="font-semibold mb-2">How to Cancel (prior to shipment):</h4>
                                             <p>
                                                  If you place an order and then decide to cancel before we have dispatched the item, please contact us as soon as possible. If we have not yet shipped the item, we can cancel the order and issue you a full refund. If the item has already been shipped, you may still utilize the above return process once you receive it.
                                             </p>
                                        </div>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">9.2 In-Person Purchases (Inspection & Final Sale Policy)</h3>
                                        <p>
                                             For items purchased in person (for example, if you visit us in London or meet with us and buy directly after inspecting the item), different return rules apply. When you purchase face-to-face, you have the opportunity to inspect the item fully before completing the sale. As such, we do not generally offer returns or refunds for change of mind on in-person purchases after you have inspected and accepted the item. All in-person sales are considered final once the transaction is completed.
                                        </p>
                                        <p className="mt-2">
                                             However, we understand that exceptional circumstances can arise. While we are not obligated to do so, we may, at our sole discretion, discuss a possible exchange or store credit if you contact us within a reasonable time after an in-person purchase. Such exceptions are handled case-by-case as a courtesy and may require the item to be in unworn condition. For example, if you purchased a watch in person and later wish to exchange it for a different model, we might allow it if the watch is still unworn and in original condition, but this is not guaranteed. No cash refunds will be given for in-person purchases except as required by law. This policy of exchange/credit (and not refund) for in-person sales is a standard practice among luxury watch dealers.
                                        </p>
                                   </div>

                                   <div>
                                        <h3 className="font-semibold mb-2">Statutory Rights (Faulty or Misdescribed Goods):</h3>
                                        <p>
                                             It&apos;s important to note that nothing in these Terms seeks to limit your statutory rights as a consumer. Whether your purchase was online or in person, if an item is faulty, not authentic, or not as described, you may have the right to a repair, replacement or refund under the Consumer Rights Act 2015 or other applicable laws. For in-person purchases, while we generally do not allow returns for change of mind, if the item turns out to have a material defect or discrepancy that was not apparent during your inspection and not disclosed, we will honor our legal obligations to remedy the situation. For example, if a watch you bought is later found to have an undisclosed mechanical fault, or if it was sold as a particular model and it turns out to be a different model, we will correct the issue (which may involve repair, replacement, or taking the item back for refund) as required.
                                        </p>
                                        <p className="mt-2">
                                             The 14-day money back guarantee for online purchases is in addition to (not in place of) your legal rights. In summary, &apos;change of mind&apos; returns are offered for 14 days for distance sales but not for in-person sales, while faulty/misdescribed item returns are available as needed for all sales, per your statutory protections.
                                        </p>
                                   </div>
                              </div>
                         </section>

                          {/* Product Warranty and After-Sales */}
                          <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">10. Product Warranty and After-Sales</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p>Unless explicitly stated on the product page or in writing at the time of sale, pre-owned watches and jewellery sold by Finer Lux do not come with a manufacturer&apos;s warranty (as we are not an authorized dealer) and may not be eligible for manufacturer service coverage. However, many modern luxury watches still carry remaining international warranty from the original purchase - if such original paperwork (&apos;papers&apos;) or cards are included and valid, it will be noted in the product description and those manufacturer warranty terms would apply to the extent they are transferable.</p>
                                   <p>Finer Lux may offer its own limited warranty on certain items (for example, a timekeeping guarantee or service warranty for a specified period after purchase). If such a warranty is provided, the details and duration will be clearly communicated to you. For instance, we might guarantee the functionality of a pre-owned watch for 12 months from purchase date and offer to repair it if something goes wrong in that period (excluding damage caused by misuse or accidents). Any Finer Lux provided warranty does not affect your legal rights but is an additional benefit. All warranty claims or after-sales issues can be initiated by contacting us.</p>
                                   <p>Please note that routine maintenance (such as battery changes for quartz watches or re-stringing for pearl necklaces) and wear-and-tear are typically not covered by any warranties unless explicitly stated. We do assure that at the time of sale, items are in good working condition (or we will inform you if an item is sold &apos;as is&apos; with known issues).</p>
                              </div>
                         </div>
                         
                         {/* Limitation of Liability and Disclaimers */}
                         <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">11. Limitation of Liability and Disclaimers</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p><strong>Website Content Disclaimer:</strong> While we aim to ensure that information on our Site is correct, up-to-date, and free from errors, we cannot guarantee the accuracy and completeness of all content at all times. The Site, including all information and materials contained therein, is provided on an &apos;as is&apos; and &apos;as available&apos; basis. We do not warrant that the Site will be uninterrupted or error-free, that defects will be corrected, or that the Site or server that makes it available will be free of viruses or other harmful components. Any reliance you place on information from the Site is at your own risk. We reserve the right to correct any errors, inaccuracies, or omissions on the Site and to change or update information at any time without prior notice (including after you have submitted an order, subject to Section 7 on pricing errors).</p>
                                   <p><strong>Third-Party Links:</strong> Our Site may contain links to third-party websites or resources (for example, links to official brand websites, articles, or payment processing gateways). These links are provided for your convenience only. Finer Lux has no control over the content of those sites or resources and does not endorse or accept any responsibility for them. If you decide to access any third-party links, you do so at your own risk, and you should read their terms and privacy policies.</p>
                                   <p><strong>Limitation of Liability for Use of Site:</strong> To the fullest extent permitted by law, Finer Lux will not be liable for any loss or damage that you incur as a result of using our Site or services, except as explicitly set out in these Terms. This means that Finer Lux disclaims liability for:</p>
                                   <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>Indirect or Consequential Losses:</strong> We will not be responsible for losses that were not directly caused by our breach or negligence, or that were not reasonably foreseeable by both parties at the time of your purchase or use of the Site. This includes, for example, loss of opportunity, loss of goodwill or reputation, or loss of data.</li>
                                        <li><strong>Business Losses:</strong> We only supply products for domestic and private use. If you use the products or Site for any commercial, business, or re-sale purpose, we will have no liability for any loss of profit, loss of business, business interruption, or loss of business opportunity.</li>
                                        <li><strong>Special or Incidental Damages:</strong> Any special, incidental, punitive, or exemplary damages. For instance, we are not liable for damages like emotional distress or inconvenience caused by a delay in delivery or a pricing error, etc.</li>
                                        <li><strong>Events Outside Our Control:</strong> Any failure to perform, or delay in performance of, any of our obligations under these Terms caused by events outside our reasonable control (e.g. natural disasters, strikes, war, epidemics, courier company failures, internet outages, etc.). If such an event occurs, we will notify you and our obligations will be suspended for the duration of the event; we will arrange a new schedule for fulfilling the obligations as soon as feasible.</li>
                                   </ul>
                                   <p>In any event, if Finer Lux is found liable for any claim, our total aggregate liability to you for any and all losses or damages arising out of or in connection with your use of the Site or purchase of products shall not exceed the total amount paid by you for the product(s) in question. If the claim is not related to a purchase, but to the use of the Site itself, our liability shall not exceed a reasonable amount (for example, £100). This limitation reflects the allocated risks between us: product pricing and the free provision of Site access would need to be different if we were to assume greater liability to users.</p>
                                   <p><strong>No limitation or exclusion of liability for certain matters:</strong> We do not exclude or limit in any way our liability where it would be unlawful to do so. In particular, nothing in these Terms shall limit or exclude our liability for: (a) death or personal injury caused by our negligence; (b) fraud or fraudulent misrepresentation; or (c) any breach of your consumer rights in relation to the goods, including the right to receive goods that are as described and of satisfactory quality. Also, any statutory rights you have as a consumer (such as rights under the Consumer Rights Act 2015) are not restricted by these Terms. The disclaimers and limitations in this section are only applicable to the extent allowed by applicable law.</p>
                                   <p>By using this Site or purchasing products, you acknowledge that you understand the limitations of liability stated herein. If you disagree with any part of this, you should not proceed with using the Site or making any purchase.</p>
                              </div>
                         </div>
                         
                         {/* Privacy and Data Protection */}
                         <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">12. Privacy and Data Protection</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p>Your privacy is important to us. We collect and process personal information in accordance with our Privacy Policy (if available separately) and applicable data protection laws (including the UK General Data Protection Regulation UK GDPR and Data Protection Act 2018). Finer Lux limits its collection of personal data to what you voluntarily provide to us through the Site or during our transactions. In short, we only collect personal information that you provide to us. This typically includes information such as your name, contact details (email, phone, address), and payment details when you make a purchase, as well as any details you submit through enquiry or contact forms on our Site.</p>
                                   <p>We do not engage in covert data collection techniques. This means we do not collect personal data about you without your knowledge (for example, we do not buy marketing lists or harvest data from third parties about our visitors). We also do not use your personal information for any purposes other than those you would reasonably expect in the context of our dealings with you, unless we obtain your consent. For instance, if you fill out an enquiry form requesting information on a particular watch, we will use your contact information to respond to that enquiry. If you make a purchase, we will use the provided details to process and deliver your order, and possibly to follow up for customer satisfaction or post-sale support.</p>
                                   <p><strong>No Unnecessary Data:</strong> We do not collect any sensitive personal information (such as race, religion, health data, etc.) and we do not profile you beyond basic analytics. We may use cookies or similar technologies on our Site, but these are generally limited to enabling site functionality (e.g. keeping track of your shopping cart) or basic analytics to improve our service. We do not use invasive tracking or targeted advertising cookies without your explicit consent.</p>
                                   <p><strong>Data Security:</strong> We implement appropriate technical and organizational measures to protect your personal information. This includes using secure connections (HTTPS) on our website, encrypting payment transactions, and limiting access to personal data to only those who need it for the tasks at hand. However, no method of transmission over the Internet or electronic storage is 100% secure, so while we strive to protect your data, we cannot guarantee absolute security.</p>
                                   <p><strong>Data Sharing:</strong> Finer Lux does not sell your personal data to third parties. We will share your information only in very limited circumstances, such as: with service providers involved in fulfilling your order (e.g. providing your address to a shipping courier, or your card details to a payment processor), or if required by law or a lawful request by authorities. Any third-party service providers we use are also obligated to keep your data secure and use it only for the purposes we specify.</p>
                                   <p><strong>Retention:</strong> We will retain your personal information for as long as necessary to fulfill the purposes we collected it for, including any legal or reporting requirements. For example, we may retain transaction records to comply with accounting and tax regulations, or to have proof in case of any dispute.</p>
                                   <p>For more details, please refer to our full Privacy Policy (if available on the Site), or contact us with any privacy-related questions. By using our Site and providing your personal data, you agree to such processing as described. If you do not agree, please do not submit personal information and refrain from using our services.</p>
                              </div>
                         </div>
                         
                         {/* Changes to These Terms */}
                         <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">13. Changes to These Terms</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p>Finer Lux reserves the right to modify or update these Terms from time to time. We may make changes for various reasons, including to reflect changes in law, changes in our business practices, or to clarify our policies. Whenever we update the Terms, we will post the new version on this page with an updated &apos;Last Updated&apos; date at the top. It is your responsibility to review these Terms periodically to ensure you understand the terms that apply at that time. We may, if feasible, also notify registered users or recent customers of material changes (for example, via email or a notification on the Site), but this is not guaranteed.</p>
                                   <p>If you continue to use the Site or our services after the Terms have been updated, you will be deemed to have accepted those changes. If you do not agree to the amended Terms, you should stop using the Site and (if applicable) exercise any right to cancel outstanding orders if you are within a cancellation period.</p>
                              </div>
                         </div>
                         
                         {/* Governing Law and Jurisdiction */}
                         <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">14. Governing Law and Jurisdiction</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p>These Terms and any contracts for the sale of products or services through this Site (and any dispute or claim arising out of or in connection with them) shall be governed by and construed in accordance with the laws of England and Wales. This means that the interpretation of the Terms and any issues arising will be determined under English law.</p>
                                   <p>In the event of any dispute or claim between you and Finer Lux arising from these Terms or your use of our Site or purchase of our products, we both agree that the courts of England and Wales will have exclusive jurisdiction. You and we each irrevocably submit to the exclusive jurisdiction of the English courts. If you are a consumer residing in Scotland or Northern Ireland, you may also bring proceedings in your local courts if you wish (as is your right).</p>
                                   <p>Regardless of the jurisdiction, you will always be entitled to the protections of the mandatory provisions of the law of your country of residence (if you are in the UK). These Terms do not affect any consumer rights under law that cannot be waived or limited by agreement.</p>
                              </div>
                         </div>
                         
                         {/* Miscellaneous Provisions */}
                         <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3">15. Miscellaneous Provisions</h2>
                              <div className="space-y-4 text-sm sm:text-base">
                                   <p><strong>Entire Agreement:</strong> These Terms (along with any other policies or documents expressly referenced herein, such as our Privacy Policy or any specific service terms) constitute the entire agreement between you and Finer Lux regarding the use of our Site and any purchases. They supersede any prior agreements or communications between us, whether oral or written. In entering into a transaction with us, you acknowledge that you have not relied on any representation that is not stated in these Terms (unless such misrepresentation was made fraudulently, in which case you retain your rights/remedies).</p>
                                   <p><strong>Severability:</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court or competent authority, that provision shall be deemed modified to the minimum extent necessary to make it valid and enforceable. If such modification is not possible, the relevant provision shall be deemed removed. In any event, this shall not affect the validity and enforceability of the remaining provisions, which shall remain in full force.</p>
                                   <p><strong>No Waiver:</strong> If we do not insist immediately that you do something you are required to do under these Terms, or if we delay in taking action against you in respect of a breach of these Terms, that will not mean that we have waived our rights against you. Any waiver of rights would only be effective if in writing and signed by our authorized representative. A single waiver of a breach will not constitute a waiver of any later breach.</p>
                                   <p><strong>Transfer of Rights:</strong> We may transfer or assign our rights and obligations under these Terms to another organization (for example, if our business is sold or merged). If that happens, we will notify you if required. You may not transfer or assign your rights or obligations under these Terms to any other person without our prior written consent, as these Terms are personal to you as our customer.</p>
                                   <p><strong>Third-Party Rights:</strong> These Terms are between you and Finer Lux. No other person shall have any rights to enforce any of these Terms, except that if you purchased a product as a gift for someone, that recipient may benefit from any warranty or guarantee stated, but we and you will still have the right to cancel or vary the agreement by mutual consent without the need for any third party&apos;s consent.</p>
                                   <p><strong>Contact Information:</strong> If you have any questions about these Terms or need to contact us for any reason, you can reach us at:</p>
                                   <p>Finer Lux, London, United Kingdom - Email: info@finerlux.com - Phone: [+44 (0)XXXX XXXXXX].</p>
                                   <p>We value our customers and will do our best to address any concerns or inquiries. Using our Site or services signifies your understanding and acceptance of these Terms. Thank you for choosing Finer Lux for your luxury watch and jewellery needs.</p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default TermsCondition