import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlForImage } from '@/sanity/image';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).fit('max').auto('format').url();
      return <img src={url} alt={value.alt || ''} loading="lazy" />;
    },
  },
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="value-list">{children}</ul>,
  },
};

export function PostBody({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
