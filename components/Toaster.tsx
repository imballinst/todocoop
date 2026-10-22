import {
  HStack,
  Portal,
  Stack,
  Toast,
  Toaster as ChakraToaster,
  createToaster
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true
});

export function Toaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} width={{ md: 'sm' }}>
            <Toast.Indicator />
            <Stack gap={1} flex={1} maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            <HStack gap={2}>
              {toast.action && (
                <Toast.ActionTrigger>
                  {toast.action.label}
                </Toast.ActionTrigger>
              )}
              {toast.closable && <Toast.CloseTrigger />}
            </HStack>
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
