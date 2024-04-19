export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqListInput {
  items: FaqItem[];
  context?: string;
}

export const generateFaqJsonLd = (input: FaqListInput): object => {
  const context = input.context ?? 'https://schema.org';
  const faqItemList = input.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  return {
    '@context': context,
    '@type': 'FAQPage',
    mainEntity: faqItemList,
  };
};
