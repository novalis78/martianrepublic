declare module 'bcrypt' {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function compareSync(data: string, encrypted: string): boolean;
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function genSalt(rounds?: number, minor?: string): Promise<string>;
  export function genSaltSync(rounds?: number, minor?: string): string;
}