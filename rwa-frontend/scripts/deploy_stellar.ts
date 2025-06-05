import { config } from 'dotenv';
import { Networks, Keypair, TransactionBuilder, Server } from '@stellar/stellar-sdk';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Deploy the contract
const deploy = async () => {
  try {
    // Get the secret key from environment
    const sourceSecretKey = process.env.STELLAR_SECRET_KEY;
    if (!sourceSecretKey) {
      throw new Error('STELLAR_SECRET_KEY environment variable is required');
    }

    // Create keypair from secret key
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey);

    // Create Stellar server instance
    const server = new Server('https://horizon-testnet.stellar.org');

    // Get account
    const account = await server.loadAccount(sourceKeypair.publicKey());

    // Create transaction
    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation({
      type: 'manageData',
      name: 'contract_type',
      value: 'rwa_token'
    })
    .setTimeout(30)
    .build();

    // Sign transaction
    transaction.sign(sourceKeypair);

    // Submit transaction
    const result = await server.submitTransaction(transaction);
    console.log('Contract deployed successfully!');
    console.log('Transaction:', result.hash);

    return result;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};

// Run deployment
deploy().catch(console.error);
