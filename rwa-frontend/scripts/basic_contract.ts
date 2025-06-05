import { Contract, SorobanRpc, Server, Keypair, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

async function deployBasicContract() {
  try {
    const secretKey = process.env.STELLAR_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STELLAR_SECRET_KEY environment variable is required');
    }

    // Create keypair from secret key
    const sourceKeypair = Keypair.fromSecret(secretKey);

    // Create Soroban RPC server instance
    const server = new Server('https://soroban-testnet.stellar.org', { allowHttp: true });

    // Create a basic contract payload
    const contractCode = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
    ]);

    // Create transaction
    const transaction = new TransactionBuilder(
      await server.getAccount(sourceKeypair.publicKey()),
      {
        fee: '100',
        networkPassphrase: Networks.TESTNET
      }
    )
    .addOperation({
      type: 'deployContract',
      sourceAccount: sourceKeypair.publicKey(),
      contractCode: contractCode
    })
    .setTimeout(30)
    .build();

    // Sign transaction
    transaction.sign(sourceKeypair);

    // Submit transaction
    const response = await server.sendTransaction(transaction);
    console.log('Deployment response:', response);

    return response;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

deployBasicContract();
