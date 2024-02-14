import { EduzzCreateMultipleCouponsBlock } from "./EduzzCreateMultipleCouponsBlock";
import { EduzzLoginBlock } from "./EduzzLoginBlock";
import { GoogleAnalyticsCreatePropertyBlock } from "./GoogleAnalyticsCreatePropertyBlock";
import { JivoCreateChannelBlock } from "./JivoCreateChannelBlock";
import { MyNutrorCreateModulesAndLessonsBlock } from "./MyNutrorCreateModulesAndLessonsBlock";
import { ScrapePlaylistBlock } from "./ScrapePlaylistBlock";
import { YTEvalDurationScraperConverterBlock } from "./YTEvalDurationScraperConverterBlock";

export const FlowBlocks = [
   JivoCreateChannelBlock,
   GoogleAnalyticsCreatePropertyBlock,
   MyNutrorCreateModulesAndLessonsBlock,
   EduzzLoginBlock,
   EduzzCreateMultipleCouponsBlock,
   ScrapePlaylistBlock,
   YTEvalDurationScraperConverterBlock
];