import Auth from "./auth";
import Providers from "./providers";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL("https://www.ladyish.in/"),
  title: "Ladyish | Buy Handmade Crochet Gifts, Products, & Unique Home Decor",
  description:
    "Discover Ladyish's handmade crochet products, from unique gifts and stylish home decor to custom crochet clothing and accessories. Perfect for thoughtful gifting, home styling, and adding a personal touch to any occasion.",
  openGraph: {
    title: "Ladyish | Handmade Crochet Gifts & Custom Designs",
    description:
      "Ladyish specializes in handmade crochet products crafted with love. Explore unique gifts, home decor, and stylish accessories that make every moment special.",
    url: "https://www.ladyish.in/",
    siteName: "Ladyish",
    images: [
      {
        url: "https://res.cloudinary.com/dxaey2vvg/image/upload/v1732127865/cvj7fkunco9kz6pxf5sn.jpg",
        width: 1200,
        height: 630,
        alt: "Handmade Crochet Products from Ladyish",
      },
    ],
    locale: "en_US",
    type: "website",
    keywords:
      "lady crochet, ladies crochet, ladies, crochet, handmade crochet gifts, aesthetic, anime crochet, ladyish meaning, ledish, crochet home decor, crochet clothing, crochet products, crochet accessories, custom crochet designs, handmade, learn crochet, unique crochet gifts, gifting ideas, crochet products online, buy crochet products, crochet gifts, handmade crochet, woolen, buy wool, buy handmade crochet, crochet decor, handmade clothing, crochet accessories online, best crochet gifts, crochet shop, crochet store, crochet items, handmade crochet items, crochet for gifting, crochet for home, crochet for clothing, custom crochet gifts, crochet gift ideas",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ladyishh_",
    title: "Ladyish | Handmade Crochet Gifts & Accessories",
    description:
      "Shop Ladyish for beautiful handmade crochet gifts, home decor, and accessories. Perfect for gifting or adding a personal touch to your home.",
    image:
      "https://res.cloudinary.com/dxaey2vvg/image/upload/v1732127865/cvj7fkunco9kz6pxf5sn.jpg",
  },
  whatsapp: {
    title: "Ladyish | Unique Handmade Crochet Gifts & Home Decor",
    description:
      "Looking for unique gifts or stylish home decor? Ladyish offers handmade crochet products crafted with love. Perfect for gifting and home styling.",
    image:
      "https://res.cloudinary.com/dxaey2vvg/image/upload/v1732127865/cvj7fkunco9kz6pxf5sn.jpg",
    url: "https://www.ladyish.in/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.openGraph.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metadata.openGraph.images[0].width}
        />
        <meta
          property="og:image:height"
          content={metadata.openGraph.images[0].height}
        />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <meta name="pinterest-rich-pin" content="true" />
        <link rel="icon" href={metadata.icons.icon} />
        <link rel="shortcut icon" href={metadata.icons.shortcut} />
        <link rel="apple-touch-icon" href={metadata.icons.apple} />
      </head>
      <body>
        <Providers>
          <Auth>{children}</Auth>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
