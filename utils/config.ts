export const NEXT_PUBLIC_URL_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL

export const paths = {
  f4fChecker: "/api",
}

export const siteMetadata = {
  title: "Reaction Hall of Fame",
  description:
    "Enter a cast URL, and I'll show you users who have liked, recast, and tipped 🎩$DEGEN it.",
}
