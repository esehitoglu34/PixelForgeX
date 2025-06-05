import { config } from 'dotenv';
import fetch from 'node-fetch';
import { Keypair, Networks, ServerApi, TransactionBuilder } from 'stellar-sdk';

// Load environment variables
config({ path: '.env.local' });

async function deployRWA() {
    try {
        // Get secret key from environment
        const secretKey = process.env.STELLAR_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STELLAR_SECRET_KEY environment variable is required');
        }

        // Create keypair from secret key
        const keypair = Keypair.fromSecret(secretKey);
        console.log('Using account:', keypair.publicKey());

        // Create server object
        const server = new ServerApi.Server('https://horizon-testnet.stellar.org');

        // Load account
        const account = await server.loadAccount(keypair.publicKey());
        console.log('Account loaded successfully');

        // Build transaction
        const transaction = new TransactionBuilder(account, {
            fee: '100',
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(ServerApi.Operation.manageData({
            name: 'asset_type',
            value: 'rwa_gaming_token'
        }))
        .addOperation(ServerApi.Operation.manageData({
            name: 'asset_name',
            value: 'PixelForgeX Gaming Asset'
        }))
        .setTimeout(30)
        .build();

        // Sign transaction
        transaction.sign(keypair);

        // Submit transaction
        const result = await server.submitTransaction(transaction);
        console.log('Transaction successful!');
        console.log('Transaction hash:', result.hash);
        
        return {
            success: true,
            transactionHash: result.hash
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Execute deployment
deployRWA().then(console.log).catch(console.error);
