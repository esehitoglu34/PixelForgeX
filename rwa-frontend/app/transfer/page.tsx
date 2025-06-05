'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  Wallet
} from 'lucide-react';
import { formatTokenAmount, isValidStellarAddress, toContractAmount, estimateNetworkFee } from '@/lib/stellar';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TransferPage() {
  const { isConnected, address, connect } = useWalletStore();
  const { 
    userBalance, 
    isWhitelisted, 
    compliance,
    transfer,
    isLoading,
    fetchUserData,
    fetchContractData
  } = useContractStore();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [recipientCompliance, setRecipientCompliance] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load data on mount and when wallet connects
  useEffect(() => {
    fetchContractData();
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchContractData, fetchUserData]);

  // Validate recipient address
  useEffect(() => {
    if (recipient) {
      const valid = isValidStellarAddress(recipient);
      setIsValidRecipient(valid);
      
      if (valid) {
        // In a real app, this would check recipient compliance
        setRecipientCompliance({
          isWhitelisted: true,
          kyc_verified: true,
          jurisdiction: 'US'
        });
      } else {
        setRecipientCompliance(null);
      }
    } else {
      setIsValidRecipient(false);
      setRecipientCompliance(null);
    }
  }, [recipient]);

  const handleMaxAmount = () => {
    setAmount(formatTokenAmount(userBalance));
  };

  const canTransfer = () => {
    if (!isConnected || !address) return false;
    if (!isWhitelisted) return false;
    if (!isValidRecipient) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parseFloat(amount) > parseFloat(formatTokenAmount(userBalance))) return false;
    return true;
  };

  const handleTransfer = async () => {
    if (!canTransfer() || !address) return;

    try {
      const contractAmount = toContractAmount(amount);
      const success = await transfer(address, recipient, contractAmount);
      
      if (success) {
        toast.success('Transfer completed successfully!');
        setAmount('');
        setRecipient('');
        setShowConfirmation(false);
      } else {
        toast.error('Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed. Please check the details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Asset Transfer</h1>
            <p className="text-muted-foreground mt-2">
              Transfer your game assets, project tokens, or beta access rights to other players
            </p>
          </div>

          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet to transfer gaming assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connect}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>
                  Enter the recipient's Player ID and the amount to transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Player ID (Recipient)</Label>
                  <Input
                    placeholder="Enter recipient's Player ID"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transfer Amount</Label>
                  <Input
                    type="number"
                    placeholder="Amount of tokens to transfer"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Available Balance: {formatTokenAmount(userBalance)} tokens
                  </p>
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Transfers are final and cannot be reversed. Make sure the recipient's Player ID is correct.
                  </AlertDescription>
                </Alert>

                <Button 
                  className="w-full" 
                  onClick={() => setShowConfirmation(true)}
                  disabled={!isValidRecipient || !amount || isLoading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Transfer Assets
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}