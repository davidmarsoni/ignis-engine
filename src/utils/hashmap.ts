import { ErrValue, NoneValue, OkValue, Result, SomeValue, type Option } from "./wrapper-type.js";

export interface Hashable {
  hash(): number;
}

export class HashMap<K extends Hashable, V> {
  private buckets: Map<number, [K, V][]>;

  constructor() {
    this.buckets = new Map();
  }

  // Ajoute ou met à jour une entrée
  set(key: K, value: V): void {
    const hash = key.hash();
    const bucket = this.buckets.get(hash) || [];

    // Chercher si la clé existe déjà et mettre à jour
    const idx = bucket.findIndex(
      ([k]) => k.hash() === hash && this.isEqual(k, key),
    );
    if (idx >= 0) {
      bucket[idx][1] = value;
    } else {
      bucket.push([key, value]);
    }
    this.buckets.set(hash, bucket);
  }

  // Récupère la valeur associée à la clé sous forme d'Option
  get(key: K): Option<V> {
    const hash = key.hash();
    const bucket = this.buckets.get(hash);
    if (!bucket) return NoneValue();

    const pair = bucket.find(
      ([k]) => k.hash() === hash && this.isEqual(k, key),
    );
    return pair ? SomeValue(pair[1]) : NoneValue();
  }

  // Supprime une entrée et retourne sa valeur
  delete(key: K): Result<void, string> {
    const hash = key.hash();
    const bucket = this.buckets.get(hash);
    if (!bucket) return ErrValue(`key ${key} is not in hashmap`);

    const idx = bucket.findIndex(
      ([k]) => k.hash() === hash && this.isEqual(k, key),
    );
    if (idx === -1) return ErrValue(`key ${key} is not in hashmap`);
    if (bucket.length === 0) {
      this.buckets.delete(hash);
    } else {
      this.buckets.set(hash, bucket);
    }
    return OkValue(undefined);
  }

  count(): number {
    let count = 0;
    for (const bucket of this.buckets.values()) {
      count += bucket.length;
    }
    return count;
  }

  clear(): void {
    this.buckets.clear();
  }

  // Comparaison d'égalité des clés (par défaut réf. stricte, peut être surchargée)
  protected isEqual(a: K, b: K): boolean {
    return a === b;
  }
}
