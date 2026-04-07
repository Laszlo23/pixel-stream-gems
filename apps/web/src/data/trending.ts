export interface TrendingCreator {
  id: string;
  name: string;
  tokenSymbol: string;
  sparkLabel: string;
  sparkValue: string;
  tipSpike: string;
  avatar: string;
  thumbnailColor: string;
}

export const TRENDING_CREATORS: TrendingCreator[] = [
  {
    id: "studyloop",
    name: "StudyLoop",
    tokenSymbol: "LOOP",
    sparkLabel: "Watch velocity",
    sparkValue: "+240%",
    tipSpike: "Love pouring in · +$420 / hr",
    avatar: "◈",
    thumbnailColor: "linear-gradient(135deg, hsl(230 30% 20%), hsl(255 28% 22%))",
  },
  {
    id: "maya",
    name: "Maya",
    tokenSymbol: "MAYA",
    sparkLabel: "New followers",
    sparkValue: "+18%",
    tipSpike: "Top supporters circling · +$1.1k / hr",
    avatar: "✦",
    thumbnailColor: "linear-gradient(145deg, hsl(220 35% 18%), hsl(260 28% 22%))",
  },
  {
    id: "pixelpanda",
    name: "PixelPanda",
    tokenSymbol: "PANDA",
    sparkLabel: "Clip shares",
    sparkValue: "+62%",
    tipSpike: "Send love streak · +$880 / hr",
    avatar: "◆",
    thumbnailColor: "linear-gradient(135deg, hsl(270 30% 20%), hsl(330 30% 20%))",
  },
  {
    id: "coachriver",
    name: "CoachRiver",
    tokenSymbol: "RIVER",
    sparkLabel: "Raid traffic",
    sparkValue: "+95%",
    tipSpike: "New faces in chat · +$310 / hr",
    avatar: "⬡",
    thumbnailColor: "linear-gradient(135deg, hsl(150 28% 18%), hsl(185 32% 20%))",
  },
];

export interface ViralClip {
  id: string;
  title: string;
  creatorName: string;
  creatorId: string;
  fanHandle: string;
  views: string;
  rewardNote: string;
}

export const VIRAL_CLIPS: ViralClip[] = [
  {
    id: "c1",
    title: "PixelPanda — 0.01s PB reaction",
    creatorName: "PixelPanda",
    creatorId: "pixelpanda",
    fanHandle: "clip_fairy",
    views: "42k",
    rewardNote: "Fan + creator token pool (demo)",
  },
  {
    id: "c2",
    title: "Maya — live loop build",
    creatorName: "Maya",
    creatorId: "maya",
    fanHandle: "orbit.eth",
    views: "28k",
    rewardNote: "Viral clip bonus scheduled",
  },
  {
    id: "c3",
    title: "ChefVibes — knife skills ASMR",
    creatorName: "ChefVibes",
    creatorId: "chefvibes",
    fanHandle: "sizzleDAO",
    views: "19k",
    rewardNote: "NFT moment mint triggered",
  },
];
