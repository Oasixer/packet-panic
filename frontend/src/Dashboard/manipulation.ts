interface DelayerConfig {
  minDelay: number; // Assuming time.Duration can be represented as number
  maxDelay: number; // Assuming time.Duration can be represented as number
}

interface CorruptorConfig {
  numBitsToFlipPayload: number;
  l2HeaderCorruptionProbability: number; // float32 in Go translates to number in TypeScript
  l3HeaderCorruptionProbability: number; // float32 in Go translates to number in TypeScript
}

interface CorruptorManipulation {
  cfg: CorruptorConfig;
  headerBitFlips: HeaderBitFlip[];
  payloadBitFlips: PayloadBitFlip[];
}

interface DelayerManipulation {
  cfg: DelayerConfig;
  delayMs: number;
  // 'delay' field is omitted as it doesn't have a json tag
}

interface DelayApplied {
  delayMs: number;
  prevValue: string;
  newValue: string;
}

interface HeaderBitFlip {
  headerLayer: number;
  fieldName: string;
  prevValue: string;
  newValue: string;
}

interface PayloadBitFlip {
  byte: number;
  bit: number;
  prevValue: string;
  newValue: string;
}
