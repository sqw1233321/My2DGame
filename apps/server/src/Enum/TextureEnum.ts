export enum TextureId {
    Actor1Idle = "Actor1Idle",
    Actor1Run = "Actor1Run",
    Actor2Idle = "Actor2Idle",
    Actor2Run = "Actor2Run",
    Weapon1Idle = "Weapon1Idle",
    Weapon1Attack = "Weapon1Attack",
    Weapon2Idle = "Weapon2Idle",
    Weapon2Attack = "Weapon2Attack",
    ExplosionIdle = "ExplosionIdle",
}

export const TexturePath = new Map<TextureId, string>([
    [TextureId.Actor1Idle, "texture/actor/actor1/idle"],
    [TextureId.Actor1Run, "texture/actor/actor1/run"],
    [TextureId.Actor2Idle, "texture/actor/actor2/idle"],
    [TextureId.Actor2Run, "texture/actor/actor2/run"],
    [TextureId.Weapon1Idle, "texture/weapon/weapon1/idle"],
    [TextureId.Weapon1Attack, "texture/weapon/weapon1/attack"],
    [TextureId.Weapon2Idle, "texture/weapon/weapon2/idle"],
    [TextureId.Weapon2Attack, "texture/weapon/weapon2/attack"],
    [TextureId.ExplosionIdle, "texture/explosion"],
]);

