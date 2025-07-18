'use client';

import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  TrendingUp, 
  Users,
  Filter,
  Search,
  ArrowRight,
  Gamepad2 as Gamepad,
  Award as Trophy,
  Wallet as Coins,
  ShieldCheck as Shield,
  Clock as ClockIcon,
  DollarSign as DollarIcon
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/stellar';
import Link from 'next/link';

type AssetStatus = 'live' | 'upcoming' | 'pre_launch';
type AssetType = 'game_project' | 'in_game_assets' | 'game_currency' | 'virtual_real_estate';
type RiskLevel = 'low' | 'medium' | 'high';

interface MarketplaceAsset {
  id: string;
  name: string;
  location: string;
  type: AssetType;
  description: string;
  totalValue: string;
  availableTokens: string;
  pricePerToken: string;
  projectedYield: string;
  riskLevel: RiskLevel;
  status: AssetStatus;
  images: string[];
  launchDate: number;
  investors: number;
  contractId: string | null;
}

// Mock marketplace data
const marketplaceAssets: MarketplaceAsset[] = [
  {
    id: '1',
    name: 'Cosmic Warriors',
    location: 'Global',
    type: 'game_project',
    description: 'Next-gen multiplayer RPG with blockchain integration',
    totalValue: '1000000',
    availableTokens: '500000',
    pricePerToken: '2.00',
    projectedYield: '12.5',
    riskLevel: 'medium',
    status: 'pre_launch',
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() + 7776000000, // 90 days in future
    investors: 250,
    contractId: 'CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6'
  },
  {
    id: '2',
    name: 'Pixel Legends Collection',
    location: 'Multiplatform',
    type: 'in_game_assets',
    description: 'Exclusive NFT collectibles from the Pixel Legends universe',
    totalValue: '500000',
    availableTokens: '250000',
    pricePerToken: '2.00',
    projectedYield: '10.0',
    riskLevel: 'medium',
    status: 'live',
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() - 86400000,
    investors: 180,
    contractId: 'CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6'
  },
  {
    id: '3',
    name: 'Battle Arena Tokens',
    location: 'In-game',
    type: 'game_currency',
    description: 'Utility tokens for the Battle Arena ecosystem',
    totalValue: '2000000',
    availableTokens: '1000000',
    pricePerToken: '2.00',
    projectedYield: '15.0',
    riskLevel: 'high',
    status: 'upcoming',
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() + 2592000000, // 30 days from now
    investors: 0,
    contractId: null
  },
  {
    id: '4',
    name: 'Fantasy Game Land',
    location: 'Metaverse',
    type: 'virtual_real_estate',
    description: 'Premium virtual land in the Fantasy Game metaverse',
    totalValue: '750000',
    availableTokens: '375000',
    pricePerToken: '2.00',
    projectedYield: '8.0',
    riskLevel: 'low',
    status: 'live',
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() - 43200000,
    investors: 300,
    contractId: 'CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6'
  }
];

export default function MarketplacePage() {
  const { isConnected } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | AssetType>('all');
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="gaming-grid"></div>
      </div>

      <div className="container py-8 space-y-8 relative z-10">
        {/* Hero Section */}
        <section className="gaming-container mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-50"></div>
          <div className="flex flex-col items-center text-center space-y-4 py-12 px-4">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="gaming-title text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Gaming Assets Marketplace
              </h1>
              <Trophy className="h-8 w-8 text-secondary animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Discover and invest in the future of gaming. From virtual real estate to in-game assets,
              find your next investment opportunity.
            </p>
          </div>
        </section>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {(['all', 'game_project', 'in_game_assets', 'game_currency', 'virtual_real_estate'] as const).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`gaming-button rounded-full transition-all hover:scale-105 ${
                selectedCategory === category ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {category.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gaming assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-primary/20 focus:border-primary/40 gaming-input"
            />
          </div>
          <Button variant="outline" className="gaming-button variant-outline group">
            <Filter className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform" />
            Filters
          </Button>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaceAssets
            .filter(asset => selectedCategory === 'all' || asset.type === selectedCategory)
            .map((asset) => (
            <Card key={asset.id} className="gaming-card group hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge 
                      variant={
                        asset.status === 'live' ? 'default' : 
                        asset.status === 'upcoming' ? 'secondary' : 
                        'outline'
                      }
                      className="mb-2 animate-pulse"
                    >
                      {asset.status === 'live' ? '🔥 Live' : 
                       asset.status === 'upcoming' ? '🚀 Upcoming' : 
                       '🎮 Pre-launch'}
                    </Badge>
                    <CardTitle className="gaming-title hover:text-primary transition-colors">
                      {asset.name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      {asset.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gaming-badge glow">
                    {asset.type.split('_').map((word: string) => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="font-medium flex items-center text-primary">
                      <DollarIcon className="h-3 w-3 mr-1" />
                      {formatCurrency(parseFloat(asset.totalValue))}
                    </p>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <p className="text-xs text-muted-foreground">Price/Token</p>
                    <p className="font-medium flex items-center text-secondary">
                      <Coins className="h-3 w-3 mr-1" />
                      ${asset.pricePerToken}
                    </p>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <p className="text-xs text-muted-foreground">Projected Yield</p>
                    <p className="font-medium flex items-center text-green-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatPercentage(parseFloat(asset.projectedYield))}%
                    </p>
                  </div>
                  <div className="space-y-1 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <div className="flex items-center">
                      <Shield className={cn(
                        "h-3 w-3 mr-1",
                        asset.riskLevel === 'low' ? "text-green-500" :
                        asset.riskLevel === 'medium' ? "text-yellow-500" :
                        "text-red-500"
                      )} />
                      <span className="capitalize">{asset.riskLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{asset.investors}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(asset.launchDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/marketplace/${asset.id}`}>
                    <Button 
                      className="gaming-button group-hover:translate-x-1 transition-all duration-300"
                      disabled={!isConnected}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}