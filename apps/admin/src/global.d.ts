/** Novus by Pendo web SDK global, defined by the install snippet in index.html. */

type PendoMetadataValue = string | number | boolean;

interface PendoIdentity {
  visitor: { id: string } & Record<string, PendoMetadataValue>;
  account?: { id: string } & Record<string, PendoMetadataValue>;
}

interface PendoAgent {
  initialize: (options: PendoIdentity) => void;
  identify: (identity: PendoIdentity) => void;
  /** Not stubbed by the install snippet: undefined until the agent script has loaded. */
  clearSession?: () => void;
}

declare var pendo: PendoAgent;
