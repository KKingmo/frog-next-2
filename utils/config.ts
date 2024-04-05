export const NEXT_PUBLIC_URL_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL

export const paths = {
  f4fChecker: "/api",
}

export const siteMetadata = {
  title: "F4F checker",
  description: "Find users who don't follow me back.",
}
