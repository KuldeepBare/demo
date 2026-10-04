import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Why are deliveries only permitted between 11:00 PM and 5:00 AM?',
    answer:
      'Nocturne operates in strict compliance with municipal late-night commerce notifications and state excise directives governing nocturnal beverage facilitation. Delivery dispatches are synchronized exclusively with our licensed retail partner cellars during this permitted nocturnal window.'
  },
  {
    question: 'How does the privacy-first age verification work without storing Aadhaar?',
    answer:
      'We comply fully with the Digital Personal Data Protection (DPDP) Act. Our integration interfaces with authorized age validation providers (e.g. DigiLocker / IDCentral API) to verify that the year of birth satisfies the legal threshold (21+). We do not record or retain your 12-digit Aadhaar number, biometrics, or scanned identity cards. Only an ephemeral zero-knowledge age verification token is held for the nocturnal session.'
  },
  {
    question: 'What physical documentation must I show at the door?',
    answer:
      'By state excise law, our certified delivery agent must inspect an original physical government photo ID (such as a Passport, Driver’s License, or Voter ID) of the person receiving the parcel. Handover will be respectfully declined if valid original ID is not produced.'
  },
  {
    question: 'How are beverages packaged and transported?',
    answer:
      'Consignments are transported in discreet, unmarked thermal hardcases maintained at constant cellaring temperatures (14°C–16°C for wines and spirits, chilled for champagnes). The packaging does not advertise alcohol contents to respect resident privacy.'
  },
  {
    question: 'What is the maximum purchase limit per order?',
    answer:
      'Under current excise guidelines, individual delivery orders are capped at a maximum of 3 bottles per customer per nocturnal delivery cycle. Orders attempting to exceed this limit are automatically blocked at checkout.'
  },
  {
    question: 'What happens if I place an order outside the 11 PM – 5 AM window?',
    answer:
      'Checkout is automatically locked outside the active service window to prevent non-compliant order intake. You may browse and save items to your Reserve Bag, but final order submission and dispatch become active at 11:00 PM.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="border-b border-[#181a20] bg-[#070809] py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
            Clarity & Protocol
          </span>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8e887d]">
            Everything you need to know about our nocturnal cellar concierge, legal hours, and verification standards.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-[#1e2029] bg-[#0c0d10] transition-colors hover:border-[#2b2e3b]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-[#f4efe6] hover:text-[#d4af37] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#d4af37] ml-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#8e887d] ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-[#b3ada2] border-t border-[#181a20]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
