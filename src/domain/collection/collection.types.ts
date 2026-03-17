import type { LogoState } from "#/domain/logo/logo.types";

export interface CollectionItem extends LogoState {
  id: string;
  savedAt: number;
}
