export interface repoDetails {
  username?: string,
  repo?: string,
  follow?: boolean,
  star?: boolean,
  fork?: boolean,
  download?: boolean,
  color?: string,
  stars?: number,
  contributors?: [{
    name: string;
    contributions: number;
  }] | undefined
}