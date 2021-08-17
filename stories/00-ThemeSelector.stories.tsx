import React, { useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  ChakraProvider,
  ColorMode,
  ColorModeScript,
  IconButton,
  Input,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { appTheme } from "../theme";
import { EditIcon, SmallCloseIcon } from "@chakra-ui/icons";

interface Props {
  colorMode: ColorMode;
  colorScheme: string;
}

function Wrapper({
  colorMode: colorModeProp,
  colorScheme: colorSchemeProp,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const bg = useColorModeValue("white", "gray.800");
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(colorModeProp);
  }, [colorModeProp]);

  return (
    <Box bg={bg}>
      <FormControl isInvalid={errors.name !== undefined}>
        <FormLabel htmlFor="name">Room name</FormLabel>
        <Controller
          render={({ field }) => (
            <Input
              focusBorderColor={`${colorSchemeProp}.500`}
              {...field}
              type="text"
            />
          )}
          name="name"
          control={control}
          rules={{
            required: "This field is required.",
          }}
        />

        <Box height={21} mt={1}>
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </Box>
      </FormControl>

      <IconButton
        minWidth="var(--chakra-sizes-6)"
        height="var(--chakra-sizes-6)"
        variant="ghost"
        colorScheme={colorSchemeProp}
        aria-label="Edit"
        icon={<EditIcon />}
      />

      <IconButton
        minWidth="var(--chakra-sizes-6)"
        height="var(--chakra-sizes-6)"
        variant="ghost"
        colorScheme={colorSchemeProp}
        aria-label="Cancel"
        icon={<SmallCloseIcon />}
      />

      <Button colorScheme={colorSchemeProp}>Sample text</Button>
    </Box>
  );
}

export default {
  title: "Example/Theme Selector",
  component: Wrapper,
  argTypes: {
    colorMode: { options: ["light", "dark"], control: { type: "radio" } },
    colorScheme: {
      options: [
        "black",
        "white",
        "whiteAlpha",
        "blackAlpha",
        "gray",
        "red",
        "orange",
        "yellow",
        "green",
        "teal",
        "blue",
        "cyan",
        "purple",
        "pink",
        "linkedin",
        "facebook",
        "messenger",
        "whatsapp",
        "twitter",
        "telegram",
      ],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Wrapper>;

const Template: ComponentStory<typeof Wrapper> = (args) => (
  <ChakraProvider theme={appTheme}>
    <Wrapper {...args} />
  </ChakraProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  colorMode: "dark",
  colorScheme: "teal",
};
