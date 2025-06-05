'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatTokenAmount, formatCurrency, formatPercentage } from '@/lib/stellar';
import Link from 'next/link';

export default function Dashboard() {
  const { isConnected, address, checkConnection, connect } = useWalletStore();
  const { 
    assetMetadata, 
    userBalance, 
    isWhitelisted, 
    compliance,
    isLoading,
    fetchContractData,
    fetchUserData 
  } = useContractStore();

  // Check wallet connection and fetch data on mount
  useEffect(() => {
    checkConnection();
    fetchContractData();
  }, [checkConnection, fetchContractData]);

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchUserData]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="gaming-title text-4xl md:text-5xl">
                PixelForgeX Gaming Asset Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Invest in game projects, own in-game assets, and get early access to upcoming games 
                through blockchain technology on Stellar.
              </p>
              <Button 
                onClick={connect}
                size="lg" 
                className="gaming-button mt-4"
              >
                Connect Wallet to Start
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
              <Link href="/marketplace" className="w-full">
                <div className="gaming-card h-full group">
                  <CardHeader className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 p-2.5 transition-transform group-hover:scale-110">
                      <Building2 className="w-full h-full text-primary" />
                    </div>
                    <div>
                      <CardTitle className="gaming-title">Game Projects</CardTitle>
                      <CardDescription>
                        Invest in upcoming games and earn from their success
                      </CardDescription>
                    </div>
                  </CardHeader>
                </div>
              </Link>

              <Link href="/marketplace" className="w-full">
                <div className="gaming-card h-full group">
                  <CardHeader className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 p-2.5 transition-transform group-hover:scale-110">
                      <CheckCircle className="w-full h-full text-primary" />
                    </div>
                    <div>
                      <CardTitle className="gaming-title">Beta Access</CardTitle>
                      <CardDescription>
                        Get exclusive early access to games and special in-game items
                      </CardDescription>
                    </div>
                  </CardHeader>
                </div>
              </Link>

              <Link href="/marketplace" className="w-full">
                <div className="gaming-card h-full group">
                  <CardHeader className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 p-2.5 transition-transform group-hover:scale-110">
                      <TrendingUp className="w-full h-full text-primary" />
                    </div>
                    <div>
                      <CardTitle className="gaming-title">Invest & Earn</CardTitle>
                      <CardDescription>
                        Trade gaming assets and earn from their growth
                      </CardDescription>
                    </div>
                  </CardHeader>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="gaming-container space-y-4 text-center md:text-left">
            <h1 className="gaming-title text-3xl">Welcome to PixelForgeX</h1>
            <p className="text-lg text-muted-foreground">
              Your blockchain-powered gaming asset platform
            </p>
          </div>

          {/* Portfolio Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="gaming-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium gaming-title">Portfolio Value</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTokenAmount(userBalance)} PFX
                </div>
                <p className="text-sm text-muted-foreground">
                  ≈ {formatCurrency(
                    (parseFloat(formatTokenAmount(userBalance)) * 1000).toString()
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium gaming-title">Account Status</CardTitle>
                {isWhitelisted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isWhitelisted ? 'Verified' : 'Pending'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {compliance?.kyc_verified ? 'Identity Verified' : 'Verification Required'}
                </p>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium gaming-title">Projected Returns</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.5%</div>
                <p className="text-sm text-muted-foreground">
                  Annual growth rate
                </p>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium gaming-title">Active Games</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">
                  Games with active assets
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Asset */}
          {assetMetadata && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{assetMetadata.name}</CardTitle>
                    <CardDescription className="text-base">
                      {assetMetadata.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {assetMetadata.asset_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Valuation</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(formatTokenAmount(assetMetadata.valuation, 7))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Share</p>
                    <p className="text-2xl font-bold">
                      {((parseFloat(formatTokenAmount(userBalance)) / 2500) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Token Symbol</p>
                    <p className="text-2xl font-bold font-mono">{assetMetadata.symbol}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/transfer">
                      Transfer Tokens
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/marketplace">
                      View More Assets
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Opportunities</CardTitle>
                <CardDescription>
                  Discover new tokenized assets to diversify your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Downtown Office Building</p>
                      <p className="text-sm text-muted-foreground">Commercial Real Estate</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">9.2% APY</p>
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Gold Storage Facility</p>
                      <p className="text-sm text-muted-foreground">Commodities</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">6.8% APY</p>
                      <Badge variant="outline" className="text-xs">Q2 2025</Badge>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/marketplace">
                    View All Opportunities
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest transactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome to RWA Investor</p>
                      <p className="text-xs text-muted-foreground">Account created successfully</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Compliance Verification</p>
                      <p className="text-xs text-muted-foreground">KYC status updated</p>
                    </div>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/transfer">
                    Make Your First Transfer
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
