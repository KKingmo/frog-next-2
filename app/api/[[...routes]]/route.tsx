/** @jsxImportSource frog/jsx */

import { paths } from "@/utils/config"
import { Env } from "@/utils/env-setup"
import { neynarClient } from "@/utils/neynar/neynar"
import { FollowResponseUser } from "@neynar/nodejs-sdk/build/neynar-api/v1"
import { Button, Frog, TextInput } from "frog"
import { devtools } from "frog/dev"
import { neynar } from "frog/middlewares"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"

import { Box, Heading, HStack, Image, Text, vars, VStack } from "@/app/ui"

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
            <VStack gap="2">
              <Text>🤝❌🔍</Text>
              <Text size={"16"}>Find users who don't follow me back.</Text>
              <Text size={"12"}>Exclude users with a power badge.</Text>
              <Text size={"12"}>Exclude user @m-o 😉.</Text>
            </VStack>
          </VStack>
          <VStack gap="4">
            <Text>If you like it, please follow @m-o 😉</Text>
          </VStack>
        </Box>
      </SquareContainer>
    ),
    intents: [<Button action="/start">Start</Button>],
  })
})

interface userType {
  powerBadge?: boolean
}
type filteredUserType = {
  fid: number
  username: string
  displayName: string
  pfp: { url: string }
}
let nextCursor: null | string = null
let chunkedFilteredUsers: filteredUserType[][] = []
let filteredUsers: filteredUserType[] = []

const chunkSize = 12

function chunkArray(array: filteredUserType[], size: number) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size)
    result.push(chunk)
  }
  return result
}

app.frame("/start", async (c) => {
  const { buttonValue, deriveState } = c
  const cVar = c.var
  const { interactor, cast } = cVar
  const iFid = interactor?.fid || 0
  const myFid = Number(Env.MY_FID) || 0

  if (!buttonValue || buttonValue === "more") {
    const result = await neynarClient.fetchUserFollowing(iFid, {
      viewerFid: iFid,
      limit: 150,
      ...(nextCursor && { cursor: nextCursor }),
    })

    const users: Array<FollowResponseUser & userType> = result.result.users
    nextCursor = result.result.next.cursor

    if (users.length > 0) {
      filteredUsers = users
        .filter(({ powerBadge, viewerContext, fid }) =>
          viewerContext
            ? !viewerContext.followedBy && !powerBadge && fid !== myFid
            : false
        )
        .map((user) => ({
          fid: user.fid,
          username: user.username,
          displayName: user.displayName,
          pfp: user.pfp,
        }))

      chunkedFilteredUsers = [
        ...chunkedFilteredUsers,
        ...(filteredUsers.length > 0
          ? [...chunkArray(filteredUsers, chunkSize)]
          : []),
      ]
    }
  }

  const state = deriveState((previousState) => {
    if (buttonValue === "prev") {
      previousState.pageNumber--
    }
    if (buttonValue === "next") previousState.pageNumber++
  })

  return c.res({
    image: (
      <SquareContainer>
        <Box grow gap={"4"} alignVertical={"center"}>
          <Text size={"20"}>
            {buttonValue === "more"
              ? "Loading Success. Press Next."
              : "People not following me 😢"}
          </Text>
          <VStack gap="2" alignVertical={"center"}>
            {chunkedFilteredUsers[state.pageNumber].length === 0
              ? "Nobody 😢Press More"
              : chunkedFilteredUsers[state.pageNumber].map((item, i) => (
                  <HStack gap={"2"} key={item.fid}>
                    <Image
                      borderRadius={"256"}
                      width={"20"}
                      height={"20"}
                      objectFit={"cover"}
                      src={item.pfp.url}
                    />
                    <Text
                      color={"fname"}
                      size={"12"}
                    >{`@${item.username}`}</Text>
                    <Text size={"12"}>{`${item.displayName}`}</Text>
                  </HStack>
                ))}
            <HStack grow alignHorizontal={"right"}>
              <Text size={"12"}>{`Page: ${state.pageNumber + 1}`}</Text>
            </HStack>
          </VStack>
        </Box>
      </SquareContainer>
    ),
    intents: [
      state.pageNumber > 0 && <Button value={"prev"}>{"Back"}</Button>,
      state.pageNumber + 1 !== chunkedFilteredUsers.length &&
      chunkedFilteredUsers.length > 0 ? (
        <Button value={"next"}>{`Next`}</Button>
      ) : (
        <Button value={"more"}>{`More`}</Button>
      ),
    ],
  })
})

devtools(app, { serveStatic })
export const GET = handle(app)
export const POST = handle(app)

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
