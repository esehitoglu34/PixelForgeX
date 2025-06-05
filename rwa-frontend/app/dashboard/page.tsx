'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Hero Section */}
      <div className="gaming-container mb-8">
        <h1 className="gaming-title text-4xl mb-4">Welcome back, Player</h1>
        <p className="text-gray-400">Your gaming investment headquarters</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="gaming-card p-6">
          <h3 className="text-lg mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-primary">$25,430</p>
          <Badge className="gaming-badge mt-2">+15.4%</Badge>
        </Card>
        <Card className="gaming-card p-6">
          <h3 className="text-lg mb-2">Active Investments</h3>
          <p className="text-3xl font-bold text-primary">12</p>
          <Badge className="gaming-badge mt-2">Gaming Assets</Badge>
        </Card>
        <Card className="gaming-card p-6">
          <h3 className="text-lg mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-primary">$1,250</p>
          <Button className="gaming-button mt-4">Add Funds</Button>
        </Card>
      </div>

      {/* Investment Opportunities */}
      <section className="mb-8">
        <h2 className="gaming-title text-2xl mb-4">Hot Investment Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl">Cyber Arena #{i}</h3>
                <Badge className="gaming-badge">New</Badge>
              </div>
              <p className="text-gray-400 mb-4">High-potential esports tournament platform</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">$5,000</span>
                <Button className="gaming-button">Invest Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="gaming-title text-2xl mb-4">Recent Activity</h2>
        <Card className="gaming-card p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                  <h4 className="text-lg">Investment in GameVault #{i}</h4>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
                <Badge className="gaming-badge">+$1,200</Badge>
              </div>
            ))}
          </div>
          <Button className="gaming-button w-full mt-4">View All Activity</Button>
        </Card>
      </section>
    </div>
  );
}