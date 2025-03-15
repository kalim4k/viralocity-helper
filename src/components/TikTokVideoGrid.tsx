import React from 'react';
import { TikTokProfile } from './TikTokConnectModal';
import { formatNumber } from '@/utils/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
interface TikTokVideoGridProps {
  videos: TikTokProfile['videos'];
  maxVideos?: number;
}
export const TikTokVideoGrid: React.FC<TikTokVideoGridProps> = ({
  videos,
  maxVideos = Infinity
}) => {
  const displayVideos = videos ? videos.slice(0, maxVideos) : [];
  return;
};