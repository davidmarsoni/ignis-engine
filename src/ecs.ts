import { Hashable, HashMap } from "./utils/hashmap.js";
import { Result } from "./utils/wrapper-type.js";

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

interface Component {
  getTypeId(): number;
};
const MAX_COMPONENTS: number = 32;

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

interface System extends Hashable{
  getComponentsSignature(): Signature
}

// started EntityManager, need heavy refactoring

class EcsManager {
  private entities = new HashMap<Entity, Component[]>();
  private sytemsMap = new HashMap<System, Entity[]>();

  registerSystem(system: System) {
    this.sytemsMap.set(system, []);
  }

  updateSystemMap(){
    this.sytemsMap
  }

  createEntity(): Entity {
    if (this.entities.count() >= MAX_ENTITIES) {
      throw new Error("Too many entities in existence.");
    }

    // TODO, better way to create id and being able to reuse ids when we delete entities
    const id = this.entities.count() + 1;
    return new Entity(id, new Signature());
    }

  destroyEntity(entity: Entity): Result<void, string>{
    return this.entities.delete(entity);
  }

  setEntityComponents(entity: Entity, components: Component[]){
    for (const component of components){
      entity.components_signature.setFlag(component.getTypeId())
    }
    this.entities.set(entity, components);
  }
}