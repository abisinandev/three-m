export interface FinnhubStock {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

export interface NormalizedStock {
  symbol: string;
  name: string;
  exchange: string;

  isVisible: boolean;
  isTracked: boolean;
  isTradable: boolean;
  sector: string;

  logo: string | undefined;
}