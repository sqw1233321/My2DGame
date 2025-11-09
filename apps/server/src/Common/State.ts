import { InputType, StateMachineType } from '../Enum';
import { PrefabId } from '../Enum/PrefabEnum';

export interface Ivec2 {
    x: number,
    y: number
}

export interface IState {
    actors: IActorState[],
    bullets: IBulletState[],
    nextBulletId: number,
    explosions: IExplosionState[],
    nextExplosionId: number,
}

export interface IActorState {
    type: StateMachineType,
    prefabId: PrefabId;
    id: number,
    pos: Ivec2,
    direct: Ivec2,
    weapon: IWeaponState,
    hp: number, //血量百分比
}

export interface IBulletState {
    ownerId: number,
    bulletId: number,
    pos: Ivec2,
    direct: Ivec2,
    damage: number,
}

export interface IWeaponState {
    prefabId: PrefabId;
    type: StateMachineType,
}

export interface IExplosionState {
    explosionId: number
    bulletId: number,
    pos: Ivec2
}


export type IClientInput = IActorMove | IShoot | ITimePast | IExplosion;

export interface IActorMove {
    inputType: InputType,
    id: number,
    direct: Ivec2,
    pos: Ivec2,
    dt: number
}


export interface IShoot {
    inputType: InputType,
    id: number,
    direct: Ivec2,
    pos: Ivec2,
}

export interface ITimePast {
    inputType: InputType,
    dt: number,
}

export interface IExplosion {
    inputType: InputType,
    bulletId: number,
    pos: Ivec2
}
