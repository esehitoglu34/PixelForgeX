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

// Rest of the marketplace page code...
