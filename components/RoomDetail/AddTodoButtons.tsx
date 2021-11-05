import { Button } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';

export function AddTodoButtons({
  onSingleAdd,
  onBulkAdd
}: {
  onSingleAdd: () => void;
  onBulkAdd: () => void;
}) {
  return (
    <HStack spacing={2} direction="row" mt={3} ml={3}>
      <Button colorScheme="teal" onClick={onSingleAdd}>
        Add New...
      </Button>

      <Button colorScheme="teal" onClick={onBulkAdd}>
        Add Bulk from List...
      </Button>
    </HStack>
  );
}
