import {
  BytesValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  TransactionPayload,
  TypedValue,
} from '@elrondnetwork/erdjs';
import { useCallback } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTransaction } from '../../hooks/core/useTransaction';
import { builtInEsdtSC, esdtOperationsGasLimit } from '../../config/config';
import { TransactionCb } from '../../hooks/core/common-helpers/sendTxOperations';

const PauseTokensForm = ({ cb }: { cb: (params: TransactionCb) => void }) => {
  const { triggerTx } = useTransaction({ cb });

  const handleSendTx = useCallback(
    (data: TransactionPayload, payment: number, gas: number) => {
      triggerTx({
        address: builtInEsdtSC,
        data: data,
        gasLimit: gas,
        value: payment,
      });
    },
    [triggerTx]
  );

  const {
    isOpen: isAreYouSureOpen,
    onToggle: onAreYouSureToggle,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit(values: any) {
    return new Promise<void>((resolve) => {
      const gas = esdtOperationsGasLimit;
      const cost = 0;

      const args: TypedValue[] = [
        BytesValue.fromUTF8(values.ticker),
      ];

      const data = new ContractCallPayloadBuilder()
        .setFunction(
          new ContractFunction(
            values.pauseOrUnpause === 'pause' ? 'pause' : 'unPause'
          )
        )
        .setArgs(args)
        .build();

      handleSendTx(data, cost, gas);
      resolve();
      reset();
    });
  }

  ///// Form Placeholders & Default Values
  const formTicker = 'ABC-123456';
  const formSupply = 1000000000;

  return (
    <Flex direction="row" justifyContent="center" mt="10px">
      <Box
        width={['full', 'full', '400px']}
        height="fit-content"
        borderWidth="1px"
        borderRadius="5px"
        bg={useColorModeValue('gray.300', 'gray.800')}
        borderColor={useColorModeValue('teal.400', 'teal.800')}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box width="full" height="30px" px="5px" pt="5px" mb="10px">
          <Center
            bg={useColorModeValue('teal.400', 'teal.800')}
            color={useColorModeValue('gray.500', 'gray.900')}
            borderColor={useColorModeValue('gray.500', 'gray.900')}
            borderWidth="1px"
            borderRadius="5px"
            fontWeight="bold"
          >
            Pause or Unpause ESDT
          </Center>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateRows={'repeat(2, 1fr)'}
            templateColumns={'repeat(7, 1fr)'}
          >
            <GridItem rowSpan={1} colSpan={7}>
              <FormControl>
                <FormLabel
                  mb="2px"
                  textAlign="center"
                  color={useColorModeValue('blackAlpha.700', 'whiteAlpha.600')}
                >
                  Select Action
                </FormLabel>
                <RadioGroup colorScheme="teal" defaultValue="mint">
                  <Stack spacing={5} direction="row" justifyContent="center">
                    <Radio
                      value="pause"
                      color={useColorModeValue(
                        'blackAlpha.700',
                        'whiteAlpha.600'
                      )}
                      {...register('pauseOrUnpause')}
                    >
                      Pause
                    </Radio>
                    <Radio
                      value="unpause"
                      color={useColorModeValue(
                        'blackAlpha.700',
                        'whiteAlpha.600'
                      )}
                      {...register('pauseOrUnpause')}
                    >
                      Unpause
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={7} px={['2px', '5px']}>
              <FormControl isInvalid={!!errors?.ticker}>
                <FormLabel
                  htmlFor="ticker"
                  mb="0px"
                  color={useColorModeValue('blackAlpha.700', 'whiteAlpha.600')}
                  fontSize={['sm', 'md']}
                >
                  Token Ticker
                </FormLabel>
                <Input
                  id="ticker"
                  placeholder={formTicker}
                  variant="owner"
                  {...register('ticker', {
                    required: 'This is required',
                    minLength: {
                      value: 10,
                      message: 'At least 10 characters',
                    },
                    maxLength: {
                      value: 17,
                      message: 'No more than 17 characters',
                    },
                    pattern: {
                      value: /^[A-Z0-9]{3,10}-[a-z0-9]{6}$/,
                      message: 'Invalid Tocken Ticker',
                    },
                  })}
                />
                <FormErrorMessage color="red.700" mb="4px" mt="0px">
                  {errors.ticker && errors.ticker.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem
              rowStart={3}
              colStart={2}
              rowSpan={1}
              colSpan={2}
              px="5px"
            >
              <Center>
                {isAreYouSureOpen ? (
                  <Button
                    onClick={onAreYouSureToggle}
                    mt="30px"
                    variant="owner"
                    width="fit-content"
                  >
                    Change
                  </Button>
                ) : (
                  <Button
                    onClick={onAreYouSureToggle}
                    mt="30px"
                    variant="owner"
                    width="fit-content"
                  >
                    Submit
                  </Button>
                )}
              </Center>
            </GridItem>
            <GridItem
              rowStart={3}
              colStart={5}
              rowSpan={1}
              colSpan={2}
              px="5px"
            >
              <Center>
                {isAreYouSureOpen && (
                  <Button variant="owner" type="submit" mt="30px" width="fit-content">
                    Confirm
                  </Button>
                )}
              </Center>
            </GridItem>
            <GridItem rowSpan={1} colSpan={2} />
          </Grid>
        </form>
      </Box>
    </Flex>
  );
};
export default PauseTokensForm;
