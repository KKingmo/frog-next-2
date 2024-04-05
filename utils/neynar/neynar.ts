import { Env } from "@/utils/env-setup"
import { NeynarAPIClient } from "@neynar/nodejs-sdk"

export const neynarClient = new NeynarAPIClient(Env.NEYNAR_API_KEY)
