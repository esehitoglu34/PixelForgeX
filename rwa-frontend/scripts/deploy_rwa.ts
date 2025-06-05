import { Server, Keypair, TransactionBuilder, Networks, Operation, Asset, SorobanRpc, Contract } from '@stellar/stellar-sdk';
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
    const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org', { allowHttp: true });

    // Get source account
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Create RWA asset
    const rwaAsset = new Asset('RWA', sourceKeypair.publicKey());    // Get the compiled WASM
    const wasmPath = join(__dirname, '../../target/wasm32-unknown-unknown/release/rwa_temp.wasm');
    const wasmCode = readFileSync(wasmPath);
      // Create deploy contract operation
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(new Contract.installContractCodeOperation({
      code: wasmCode,
      sourceAccount: sourceKeypair.publicKey(),
    }))
    .setTimeout(30)
    .build();

    // Sign and submit transaction
    transaction.sign(sourceKeypair);
    const response = await server.submitTransaction(transaction);
    
    console.log('RWA Token deployed successfully!');
    console.log('Transaction hash:', response.hash);
    console.log('Asset code:', rwaAsset.code);
    console.log('Asset issuer:', rwaAsset.issuer);
    
    return response;
  } catch (error) {
    console.error('Error deploying RWA token:', error);
    throw error;
  }
}

deployRWAContract();
