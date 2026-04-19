import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function Meta({
  title = 'Hansika Jain — Fashion Portfolio',
  description = 'High-fidelity fashion design and digital artistry by Hansika Jain.',
  image = '/og-image.jpg',
  url = 'https://hansikajain.com',
}: MetaProps) {
  const pageTitle = title.includes('Hansika Jain') ? title : `${title} | Hansika Jain`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
