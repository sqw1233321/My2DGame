import { _decorator, Component, IVec2, Node } from 'cc';
import {  InputType, StateMachineType } from '../Enum';
import { PrefabId } from '../Enum/PrefabEnum';
const { ccclass, property } = _decorator;

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
    prefabId:PrefabId;
    id: number,
    pos: Ivec2,
    direct: Ivec2,
    weapon: IWeaponState,
}

export interface IBulletState {
    ownerId: number,
    bulletId: number,
    pos: Ivec2,
    direct: Ivec2,
}

export interface IWeaponState {
    prefabId:PrefabId;
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
    direct: IVec2,
    pos: IVec2,
    dt: number
}


export interface IShoot {
    inputType: InputType,
    id: number,
    direct: IVec2,
    pos: IVec2,
}

export interface ITimePast {
    inputType: InputType,
    dt: number,
}

export interface IExplosion {
    inputType: InputType,
    bulletId: number,
    pos: IVec2
}
