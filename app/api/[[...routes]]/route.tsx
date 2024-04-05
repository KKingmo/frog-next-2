/** @jsxImportSource frog/jsx */

import { paths } from "@/utils/config"
import { Env } from "@/utils/env-setup"
import { neynarClient } from "@/utils/neynar/neynar"
import { CastParamType } from "@neynar/nodejs-sdk"
import { Button, Frog, TextInput } from "frog"
import { devtools } from "frog/dev"
import { neynar } from "frog/middlewares"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"

import { theme } from "@/app/theme"
import {
  Box,
  Column,
  Columns,
  Divider,
  Heading,
  HStack,
  Icon,
  Row,
  Rows,
  Spacer,
  Text,
  vars,
  VStack,
} from "@/app/ui"

const secrets = {
  FROG_SECRET: Env.FROG_SECRET,
  NEYNAR_API_KEY: Env.NEYNAR_API_KEY,
}

const DEV_MODE = process.env.NODE_ENV === "development"

type State = {
  State: {
    pageNumber: number
  }
}

const app = new Frog<State>({
  assetsPath: "/",
  basePath: paths.f4fChecker,
  secret: secrets.FROG_SECRET,
  ui: { vars },
  initialState: {
    pageNumber: 0,
  },
  imageAspectRatio: "1:1",
}).use(
  neynar({
    apiKey: secrets.NEYNAR_API_KEY,
    features: ["interactor", "cast"],
  })
)

/** 루트 화면 */
app.frame("/", (c) => {
  return c.res({
    image: (
      <SquareContainer>
        <Box grow borderRadius="8" justifyContent="center" gap="16">
          <VStack gap="4">
            <Heading>F4F checker 🔍</Heading>
            <VStack gap="4">
              <Text>🤝❌🔍</Text>
              <Text>Find users who don't follow me back.</Text>
            </VStack>
          </VStack>
          <VStack gap="4">
            <Text>Requirements</Text>
            <Text>1. Like and Recast</Text>
            <Text>2. follow @m-o</Text>
          </VStack>
        </Box>
      </SquareContainer>
    ),
    intents: [
      <Button action="/start">Like, Recast, follow @m-o 👉 Start</Button>,
    ],
  })
})

app.frame("/start", async (c) => {
  const { buttonValue, inputText, deriveState } = c
  const cVar = c.var
  const { interactor, cast } = cVar

  const viewContext = interactor?.viewerContext
  const isFollowing = viewContext ? viewContext.following : false
  console.log(isFollowing)
  if (!isFollowing && !DEV_MODE) {
    return c.res(renderFail("Please follow @m-o"))
  }

  // const iFid = interactor?.fid || 0
  // const likes = cast ? cast.reactions.likes : []
  // const recasts = cast ? cast.reactions.recasts : []
  //
  // const isLiked = likes.some((like) => like.fid === iFid)
  // const isRecasted = recasts.some((like) => like.fid === iFid)
  //
  // if (!DEV_MODE && (!isLiked || !isRecasted)) {
  //   return c.res(renderFail("Please like and recast this cast."))
  // }

  return c.res({
    image: (
      <Box
        backgroundColor="background"
        grow
        paddingLeft={"160"}
        paddingRight={"160"}
      >
        <Box grow borderRadius="8" justifyContent="center" gap="16">
          <VStack gap="4">
            <Heading>F4F checker 🔍</Heading>
            <VStack gap="4">
              <Text>🤝❌🔍</Text>
              <Text>Find users who don't follow me back.</Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    ),
    intents: [<Button value={"next"}>{`Next`}</Button>],
  })
})

devtools(app, { serveStatic })
export const GET = handle(app)
export const POST = handle(app)

/** 실패화면 */
const renderFail = (phrase: string) => {
  return {
    image: (
      <SquareContainer>
        <Box grow borderRadius="8" justifyContent="center" gap="16">
          <Text size={"20"}>{phrase}</Text>
        </Box>
      </SquareContainer>
    ),
    intents: [<Button action={"/"}>Reset</Button>],
  }
}

interface SquareContainerProps {
  children: React.ReactNode
}
const SquareContainer = ({ children }: SquareContainerProps) => {
  return (
    <Box
      backgroundColor="background"
      grow
      paddingLeft={"160"}
      paddingRight={"160"}
    >
      {children}
    </Box>
  )
}
