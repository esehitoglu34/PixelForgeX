import { config } from 'dotenv';
import { Networks, Keypair, Transaction, TransactionBuilder, Operation, Asset, Server } from '@stellar/stellar-sdk';
import { wasmCode } from '../lib/contract-template';

// Load environment variables from .env.local
config({ path: '.env.local' });

import { wasmCode } from '../lib/contract-template';

// Get WASM code as base64
const getWasmCode = () => {
  return Buffer.from(wasmCode).toString('base64');
};

// Deploy the contract
const deploy = async () => {
  try {
    // Your testnet secret key (never use in production)
    const sourceSecretKey = process.env.STELLAR_SECRET_KEY;
    if (!sourceSecretKey) {
      throw new Error('STELLAR_SECRET_KEY environment variable is required');
    }    // Get WASM code as base64
    const wasmB64 = getWasmCode();
    
    // Deploy the contract
    console.log('Deploying contract...');
    const contractId = await deployContract(sourceSecretKey, wasmB64);
    console.log('Contract deployed successfully!');
    console.log('Contract ID:', contractId);

    // Initialize the contract
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
      legal_doc_hash: '', // Add your legal document hash
      valuation: '1000000',
      last_valuation_date: Math.floor(Date.now() / 1000),
    };

    await initializeContract(
      contractId,
      sourceSecretKey,
      admin,
      assetMetadata,
      '10000000' // Initial supply
    );
    
    console.log('Contract initialized successfully!');
    
    // Save contract ID to environment
    fs.writeFileSync(
      path.resolve(__dirname, '../.env.local'),
      `NEXT_PUBLIC_CONTRACT_ID=${contractId}\n`,
      { flag: 'a' }
    );

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

// Run deployment
deploy();
