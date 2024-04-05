import { createSystem } from "frog/ui"

import { theme } from "@/app/theme"

export const {
  Box,
  Columns,
  Column,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem({
  colors: {
    text: theme.colors.text,
    background: theme.colors.background,
    blue: theme.colors.blue,
    green: theme.colors.green,
    red: theme.colors.red,
    orange: theme.colors.orange,
    fname: theme.colors.fname,
  },
  fonts: {
    default: [
      {
        name: "Open Sans",
        source: "google",
        weight: 400,
      },
      {
        name: "Open Sans",
        source: "google",
        weight: 600,
      },
      {
        name: "Open Sans",
        source: "google",
        weight: 700,
      },
    ],
    madimi: [
      {
        name: "Madimi One",
        source: "google",
      },
    ],
  },
})
