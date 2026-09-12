/**
 * Policy content. Kept as structured data so the same renderer handles every
 * page and the store's real details are injected from settings at render time.
 *
 * These are sensible starting-point policies for an India-based fragrance
 * retailer (Consumer Protection Act 2019, Legal Metrology, DPDP Act 2023).
 * Have them reviewed by a lawyer before you rely on them.
 */

export const LEGAL_PAGES = {
  privacy: {
    title: "Privacy Policy",
    intro: (s) =>
      `${s.storeName} ("we", "us") respects your privacy. This policy explains what personal data we collect, why, and the choices you have. It applies to ${s.storeName} and our website. Questions: ${s.supportEmail}.`,
    sections: [
      {
        heading: "What we collect",
        body: [
          "Account details you give us: name, email, phone, password (stored only as a secure hash).",
          "Order details: shipping address, items ordered, order history, and — for cash-on-delivery — no card data at all.",
          "Payment data: when you pay online, card/UPI details are handled by our payment processor and are never stored on our servers. We keep only a transaction reference and status.",
          "Technical data: IP address, browser type, and pages visited, used to keep the site secure and working.",
          "Communications: messages you send us through the contact form or email.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "To take payment, fulfil and deliver your orders, and handle returns and refunds.",
          "To send transactional email you'd expect — order confirmations, shipping updates, password resets.",
          "To provide customer support and respond to enquiries.",
          "To detect and prevent fraud and abuse, and to meet legal and tax obligations.",
          "Marketing email is sent only if you opt in, and every marketing email has an unsubscribe link.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Service providers who work on our behalf: payment processors, shipping and logistics partners, email delivery, and cloud hosting. They may only use the data to provide their service to us.",
          "Authorities, where we are legally required to disclose it.",
          "We do not sell your personal data.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Order and invoice records are kept for as long as tax and accounting law requires (generally 8 years in India).",
          "Account data is kept while your account is active. You can ask us to delete it (see 'Your rights').",
        ],
      },
      {
        heading: "Security",
        body: [
          "Data is encrypted in transit (HTTPS). Passwords are hashed. Access to personal data is limited to staff who need it.",
          "No system is perfectly secure; if a breach affects you we will notify you and the relevant authority as required by law.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can access, correct, or delete your personal data, and ask for a copy of it, by emailing {supportEmail}.",
          "You can object to or restrict certain processing, and withdraw marketing consent at any time.",
          "If you're not satisfied with our response you may complain to the Data Protection Board of India.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use a small number of cookies and similar local storage. Strictly-necessary ones keep you signed in and remember your cart. Analytics or marketing cookies, if any, load only after you accept them in the cookie banner.",
          "You can clear cookies in your browser at any time; some site features may then not work.",
        ],
      },
      {
        heading: "Children",
        body: ["The site is not intended for anyone under 18, and we do not knowingly collect their data."],
      },
      {
        heading: "Changes",
        body: [
          "We may update this policy. Material changes will be posted here with a new 'last updated' date.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    intro: (s) =>
      `These terms govern your use of the ${s.storeName} website and any purchase you make. By placing an order you agree to them.`,
    sections: [
      {
        heading: "Ordering",
        body: [
          "All orders are subject to acceptance and product availability. We may decline or cancel an order — for example if an item is mispriced or out of stock — and will refund any payment taken.",
          "Prices are shown in Indian Rupees and include applicable taxes unless stated otherwise. Shipping is shown at checkout.",
          "A contract is formed when we send your order confirmation email.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "You can pay online (card / UPI / netbanking via our payment processor) or, where offered, by cash on delivery.",
          "Online payments are authorised at checkout. If a payment fails or is reversed we may cancel the order.",
        ],
      },
      {
        heading: "Delivery",
        body: [
          "We ship within India. Estimated delivery times are shown at checkout and in your confirmation email; they are estimates, not guarantees.",
          "Risk passes to you on delivery. Please check your parcel on arrival and tell us within 48 hours if anything is damaged or missing.",
        ],
      },
      {
        heading: "Fragrance products",
        body: [
          "Perfumes and attars contain alcohol and/or aromatic compounds. Patch-test before full use. Discontinue use if irritation occurs.",
          "Because fragrances are flammable, we ship by ground transport only and cannot deliver to certain restricted locations.",
          "Colour and scent can vary slightly between batches — this is normal for hand-blended products.",
        ],
      },
      {
        heading: "Returns",
        body: ["Returns are covered by our separate Returns & Refunds policy."],
      },
      {
        heading: "Acceptable use",
        body: [
          "Don't misuse the site: no attempts to break security, scrape at scale, submit false orders, or post unlawful content in reviews or messages.",
          "We may suspend or close accounts that break these terms.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Nothing in these terms limits liability that cannot be limited by law (including under the Consumer Protection Act 2019).",
          "Subject to that, our liability for any order is limited to the amount you paid for it.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of India. Disputes are subject to the courts having jurisdiction over our registered place of business.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about these terms: {supportEmail}."],
      },
    ],
  },

  returns: {
    title: "Returns & Refunds",
    intro: (s) =>
      `We want you to be happy with your fragrance. If something isn't right, here's how returns and refunds work. For anything not covered here, email ${s.supportEmail}.`,
    sections: [
      {
        heading: "Return window",
        body: [
          "You can request a return within {returnWindowDays} days of delivery.",
          "Start a return from your account: open the order and choose 'Request a return'. We'll email you the next steps within one working day.",
        ],
      },
      {
        heading: "What can be returned",
        body: [
          "Unopened items in their original, undamaged packaging with any seals intact.",
          "Items that arrived damaged, faulty, or not as described — we cover return shipping for these, and you can choose a replacement or a refund.",
        ],
      },
      {
        heading: "What can't be returned",
        body: [
          "Opened or used fragrances, for hygiene and safety reasons, unless they are faulty.",
          "Free samples and gift-with-purchase items.",
          "Items returned after the return window, or without a return request approved by us.",
        ],
      },
      {
        heading: "How refunds work",
        body: [
          "Once we receive and check the returned items, we approve the refund.",
          "Refunds go back to your original payment method by default. For cash-on-delivery orders we refund by bank transfer or UPI — we'll ask for the details securely.",
          "After we mark a refund as issued, it typically takes 3–7 working days to appear, depending on your bank.",
          "Original shipping charges are refunded only when the return is due to our error (wrong or faulty item).",
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "You can cancel an order yourself from your account while it is still 'pending' or 'processing'. After it ships, use the returns process instead.",
          "If you paid online, a cancellation refund is issued to your original payment method.",
        ],
      },
      {
        heading: "Damaged or wrong items",
        body: [
          "Tell us within 48 hours of delivery, with a photo if possible, and we'll make it right at no cost to you.",
        ],
      },
    ],
  },

  shipping: {
    title: "Shipping Policy",
    intro: (s) =>
      `Where we ship, how long it takes, and what it costs. Questions about a specific order? Email ${s.supportEmail} with your order number.`,
    sections: [
      {
        heading: "Where we ship",
        body: [
          "We currently ship across India.",
          "Because fragrances are classed as flammable goods, we ship by surface (ground) transport only. A few remote PIN codes and some transport hubs cannot be served — if that affects your order we'll contact you.",
        ],
      },
      {
        heading: "Processing time",
        body: [
          "Orders are packed within 1–2 working days. Orders placed on weekends or holidays are processed the next working day.",
          "Every order includes complimentary sample vials.",
        ],
      },
      {
        heading: "Delivery time & cost",
        body: [
          "Metro cities: typically 2–4 working days after dispatch. Rest of India: typically 4–8 working days.",
          "Shipping is a flat {shippingFee} and is free on orders over {freeShippingThreshold}.",
          "You'll get an email with a tracking number once your order ships.",
        ],
      },
      {
        heading: "Delays",
        body: [
          "Couriers can be delayed by weather, festivals, or regional disruptions. If your parcel is significantly overdue, contact us and we'll chase it.",
        ],
      },
      {
        heading: "Incorrect address",
        body: [
          "Please double-check your address at checkout. If a parcel is returned to us because the address was wrong or undeliverable, we'll refund the items but not the original shipping, and re-delivery is chargeable.",
        ],
      },
    ],
  },
};
