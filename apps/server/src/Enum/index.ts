export enum FsmParamTypeEnum {
  Number = "Number",
  Trigger = "Trigger",
}

export enum StateMachineType {
  Actor1 = "Actor1",
  Actor2 = "Actor2",
  Weapon1 = "Weapon1",
  Weapon2 = "Weapon2",
  Explosion = "Explosion",
}

export enum EntityStateEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum EventEnum {
  Shoot = "Shoot",
  Explosion = "Explosion",
  ExplosionOver = "ExplosionOver",
  ClientSync = "ClientSync",
}


export enum InputType {
  ActorMove = "ActorMove",
  Shoot = "Shoot",
  Explosion = "Explosion",

  TimePast = "TimePast",
}

export enum ApiMsgEnum {
  MsgClientSync = "MsgClientSync",
  MsgServerSync = "MsgServerSync",
}