'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Wallet, 
  Network, 
  Settings, 
  LogOut,
  ExternalLink,
  Copy,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateAddress, getExplorerUrl } from '@/lib/stellar';
import { toast } from 'sonner';

export function Header() {
  const {
    isConnected,
    address,
    balance,
    network,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    checkConnection
  } = useWalletStore();

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const handleNetworkSwitch = async (newNetwork: 'testnet' | 'mainnet') => {
    if (newNetwork === network) return;
    
    try {
      await switchNetwork(newNetwork);
      toast.success(`Switched to ${newNetwork}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to switch to ${newNetwork}`;
      
      // Check if this is a manual switch required error
      if (errorMessage.includes('Please switch to')) {
        toast.error(errorMessage, {
          duration: 6000, // Show longer for important instructions
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(getExplorerUrl(address, 'account', network), '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Building2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="hidden md:inline-block text-lg font-bold gaming-title">
              PixelForgeX
            </span>
          </Link>

          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/dashboard" 
              className="gaming-button variant-ghost px-3 py-2 text-sm hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/marketplace" 
              className="gaming-button variant-ghost px-3 py-2 text-sm hover:text-primary transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              href="/tokenize" 
              className="gaming-button variant-ghost px-3 py-2 text-sm hover:text-primary transition-colors"
            >
              Tokenize
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              <Badge 
                variant={network === 'mainnet' ? 'default' : 'secondary'}
                className="gaming-badge capitalize hover-glow"
              >
                {network}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gaming-button variant-outline"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden md:inline-block">
                      {truncateAddress(address || '')}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="gaming-container w-56 animate-in fade-in-0 zoom-in-95"
                >
                  <DropdownMenuItem onClick={copyAddress}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openInExplorer}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View in Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNetworkSwitch('mainnet')}
                  >
                    <Network className="mr-2 h-4 w-4" />
                    Switch to Mainnet
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNetworkSwitch('testnet')}
                  >
                    <Network className="mr-2 h-4 w-4" />
                    Switch to Testnet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="gaming-button"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}