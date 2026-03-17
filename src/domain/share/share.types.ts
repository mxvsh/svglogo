import type { LogoState } from "#/domain/logo/logo.types";

export interface SharePayload {
  logoState: LogoState;
}

export interface ShareResponse {
  id: string;
}
