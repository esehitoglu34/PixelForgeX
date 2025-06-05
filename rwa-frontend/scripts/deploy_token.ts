import { config } from 'dotenv';
import fetch from 'node-fetch';
import StellarSdk from '@stellar/stellar-sdk';

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
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

    // Create Stellar server instance
    const horizonServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    // Create contract account
    const contractKeypair = StellarSdk.Keypair.random();
    
    // Fund the contract account using friendbot
    console.log('Funding contract account...');
    await fetch(`https://friendbot.stellar.org?addr=${contractKeypair.publicKey()}`);
    
    // Get the contract account
    const contractAccount = await horizonServer.loadAccount(contractKeypair.publicKey());

    // Create and submit transaction
    console.log('Creating token...');
    const transaction = new StellarSdk.TransactionBuilder(contractAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.setOptions({
      homeDomain: 'pixelforgex.com',
      masterWeight: 0,
      lowThreshold: 0,
      medThreshold: 0,
      highThreshold: 0,
      signer: {
        ed25519PublicKey: sourceKeypair.publicKey(),
        weight: 1
      }
    }))
    .addOperation(StellarSdk.Operation.manageData({
      name: 'ASSET_METADATA',
      value: JSON.stringify({
        name: 'PixelForgeX Gaming Asset',
        symbol: 'PFX',
        description: 'Gaming asset tokenization platform on Stellar',
        type: 'gaming_asset'
      })
    }))
    .setTimeout(30)
    .build();

    // Sign and submit
    transaction.sign(contractKeypair);
    const result = await horizonServer.submitTransaction(transaction);
    
    console.log('Contract deployed successfully!');
    console.log('Contract Address:', contractKeypair.publicKey());
    console.log('Transaction:', result.hash);
    
    return {
      contractId: contractKeypair.publicKey(),
      transactionHash: result.hash
    };
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};

// Run deployment
deploy().catch(console.error);
