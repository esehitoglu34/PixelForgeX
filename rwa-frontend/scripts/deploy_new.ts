import { config } from 'dotenv';
import { Networks, Keypair, Contract, SorobanRpc } from '@stellar/stellar-sdk';

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

    // Create Soroban RPC client
    const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org', {
      allowHttp: true
    });

    // Create contract instance
    const contract = new Contract({
      networkPassphrase: Networks.TESTNET,
      contractId: '',
      source: sourceKeypair.publicKey(),
    });

    // Deploy the contract
    console.log('Deploying contract...');
    const result = await contract.deploy(server, sourceKeypair);
    console.log('Contract deployed successfully!');
    console.log('Contract ID:', result.contractId);

    // Initialize contract
    console.log('Initializing contract...');
    const admin = process.env.ADMIN_PUBLIC_KEY;
    if (!admin) {
      throw new Error('ADMIN_PUBLIC_KEY environment variable is required');
    }

    const assetMetadata = {
      name: 'PixelForgeX Gaming Asset',
      symbol: 'PFX',
      description: 'Gaming asset tokenization platform on Stellar',
      asset_type: 'gaming_asset',
      legal_doc_hash: '',
      valuation: '1000000',
      last_valuation_date: Math.floor(Date.now() / 1000),
    };

    // Call initialize function
    await contract.call('initialize', [
      admin,
      assetMetadata,
      '1000000000' // 1 billion tokens
    ]);

    console.log('Contract initialized successfully!');
    return result.contractId;

  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};

// Run deployment
deploy().catch(console.error);
