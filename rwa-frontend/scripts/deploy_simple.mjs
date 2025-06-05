import StellarSdk from '@stellar/stellar-sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function deployToken() {
    try {
        // Get secret key from environment
        const sourceSecretKey = process.env.STELLAR_SECRET_KEY;
        if (!sourceSecretKey) {
            throw new Error('STELLAR_SECRET_KEY is required');
        }        // Connect to Stellar testnet
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        
        // Create issuer account from secret key
        const issuerKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
        
        // Get the issuer account
        const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
          // Create the token asset
        const pfxAsset = new StellarSdk.Asset('PFX', issuerKeypair.publicKey());
        
        // Build the transaction
        const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
            fee: '100',
            networkPassphrase: StellarSdk.Networks.TESTNET
        })
        .addOperation(StellarSdk.Operation.manageData({
            name: 'asset_name',
            value: 'PixelForgeX Gaming Asset'
        }))
        .addOperation(Operation.manageData({
            name: 'asset_description',
            value: 'Gaming asset tokenization platform on Stellar'
        }))
        .setTimeout(30)
        .build();
        
        // Sign the transaction
        transaction.sign(issuerKeypair);
        
        // Submit the transaction
        const result = await server.submitTransaction(transaction);
        console.log('Token deployed successfully!');
        console.log('Transaction hash:', result.hash);
        console.log('Asset code:', pfxAsset.code);
        console.log('Asset issuer:', pfxAsset.issuer);
        
        return {
            success: true,
            asset: pfxAsset,
            transactionHash: result.hash
        };
        
    } catch (error) {
        console.error('Error deploying token:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

deployToken().then(console.log).catch(console.error);
