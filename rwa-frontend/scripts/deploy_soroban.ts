import { Server, Keypair, TransactionBuilder, Networks, Contract, SorobanRpc } from '@stellar/stellar-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

async function deployRWAContract() {
  try {
    const secretKey = process.env.STELLAR_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STELLAR_SECRET_KEY environment variable is required');
    }

    // Create keypair from secret key
    const sourceKeypair = Keypair.fromSecret(secretKey);

    // Create Soroban RPC server instance
    const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org:443', { 
      allowHttp: true 
    });

    // Get the compiled WASM
    const wasmPath = join(__dirname, '../../target/wasm32-unknown-unknown/release/rwa_temp.wasm');
    const wasmCode = readFileSync(wasmPath);

    // Create contract deployment
    const contract = new Contract(wasmCode);

    // Deploy contract
    const deployResponse = await contract.deploy(rpc, sourceKeypair);
    
    console.log('Contract deployed successfully!');
    console.log('Contract ID:', deployResponse.contractId);
    console.log('Transaction hash:', deployResponse.hash);
    
    return deployResponse;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

deployRWAContract();
