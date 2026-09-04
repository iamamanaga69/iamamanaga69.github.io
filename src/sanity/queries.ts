import { groq } from 'next-sanity';

// Only posts whose publishedAt is at or before now — hides scheduled/future posts.
export const postsQuery = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc){
    "slug": slug.current,
    cluster,
    title,
    description,
    service,
    intro
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && publishedAt <= now()][0]{
    "slug": slug.current,
    cluster,
    title,
    description,
    service,
    intro,
    body,
    publishedAt
  }
`;
