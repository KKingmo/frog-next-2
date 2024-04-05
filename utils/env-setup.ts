import { neynarClient } from "@/utils/neynar/neynar"

export class Env {
  public static get NEYNAR_API_KEY(): string {
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
    if (!NEYNAR_API_KEY || process.env.NODE_ENV === "development") {
      return "NEYNAR_FROG_FM"
    }
    return NEYNAR_API_KEY
  }

  public static get NEXT_PUBLIC_URL(): string {
    const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL
    if (!NEXT_PUBLIC_URL) {
      throw new Error("NEXT_PUBLIC_URL is not defined")
    }
    return NEXT_PUBLIC_URL
  }

  public static get FROG_SECRET(): string {
    const FROG_SECRET = process.env.FROG_SECRET
    if (!FROG_SECRET) {
      throw new Error("FROG_SECRET is not defined")
    }
    return FROG_SECRET
  }

  public static get MY_FID(): string {
    const MY_FID = process.env.MY_FID
    if (!MY_FID) {
      throw new Error("MY_FID is not defined")
    }
    return MY_FID
  }
}
