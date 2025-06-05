import StellarSdk from '@stellar/stellar-sdk';
import fetch from 'node-fetch';

const createTestnetAccount = async () => {
  try {
    // Generate new keypair
    const keypair = StellarSdk.Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    console.log('Generated new Stellar testnet account:');
    console.log('Public Key:', publicKey);
    console.log('Secret Key:', secretKey);

    // Get testnet XLM from Friendbot
    console.log('\nRequesting testnet XLM from Friendbot...');
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${publicKey}`
    );
    
    if (response.ok) {
      console.log('Successfully funded account with testnet XLM!');
      console.log('\nAdd these to your .env.local file:');
      console.log(`STELLAR_SECRET_KEY=${secretKey}`);
      console.log(`ADMIN_PUBLIC_KEY=${publicKey}`);

      // Create a server connection
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      
      // Check account balance
      const account = await server.loadAccount(publicKey);
      console.log('\nAccount Balance:', account.balances[0].balance, 'XLM');
    } else {
      console.error('Failed to fund account:', await response.text());
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestnetAccount();
