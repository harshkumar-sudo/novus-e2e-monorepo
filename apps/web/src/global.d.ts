/** Global `pendo` object defined by the Novus by Pendo install snippet in index.html. */

type PendoMetadata = Record<string, string | number | boolean | string[]>;

interface PendoIdentity {
  visitor: PendoMetadata & { id: string };
  account?: PendoMetadata & { id: string };
}

interface Pendo {
  initialize: (options: PendoIdentity) => void;
  identify: (identity: PendoIdentity) => void;
  track: (eventName: string, metadata?: PendoMetadata) => void;
  // Not stubbed by the install snippet; only defined once the agent script has loaded.
  clearSession?: () => void;
}

declare var pendo: Pendo;
