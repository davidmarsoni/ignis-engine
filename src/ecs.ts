import { Hashable, HashMap } from "./utils/hashmap.js";

// implementation of ecs based on https://austinmorlan.com/posts/entity_component_system/

export class Signature {
  private sig: number;

  constructor(initialSig = 0) {
    this.sig = initialSig;
  }

  setFlag(i: number): void {
    this.sig = this.sig | (1 << i);
  }

  clearFlag(i: number): void {
    this.sig = this.sig & ~(1 << i);
  }

  checkFlag(i: number): boolean {
    return (this.sig & (1 << i)) !== 0;
  }

  // Optionnel : récupérer la valeur entière brute
  getValue(): number {
    return this.sig;
  }

  // Optionnel : définir la valeur entière brute
  setValue(val: number): void {
    this.sig = val;
  }
}

type ComponentType = number;
const MAX_COMPONENTS: ComponentType = 32;

export class Entity implements Hashable {
  id: number;
  components_signature: Signature;

  constructor(id: number, components_signature: Signature) {
    this.id = id;
    this.components_signature = components_signature;
  }

  hash(): number {
    return this.id;
  }
}

const MAX_ENTITIES: number = 5000;

// started EntityManager, need heavy refactoring

// class EntityManager {
//   private availableEntities = new HashMap<Entity, ComponentType[]>();

//   createEntity(): Entity {
//     if (this.availableEntities.count() >= MAX_ENTITIES) {
//       throw new Error("Too many entities in existence.");
//     }

//     const id = this.availableEntities.count() + 1;

//     }

//     // Ici _tag est "Some", on peut accéder à value
//     this.mAvailableEntities.dequeue();
//     ++this.mLivingEntityCount;
//     return idOption.value;
//   }

//   destroyEntity(entity: Entity): void {
//     if (entity >= MAX_ENTITIES) {
//       throw new Error("Entity out of range.");
//     }
//     this.mSignatures[entity] = 0; // Equivalent to .reset bitset
//     this.mAvailableEntities.enqueue(entity);
//     --this.mLivingEntityCount;
//   }

//   setSignature(entity: Entity, signature: Signature): void {
//     if (entity >= MAX_ENTITIES) {
//       throw new Error("Entity out of range.");
//     }
//     this.mSignatures[entity] = signature;
//   }

//   getSignature(entity: Entity): Signature {
//     if (entity >= MAX_ENTITIES) {
//       throw new Error("Entity out of range.");
//     }
//     return this.mSignatures[entity];
//   }
// }
