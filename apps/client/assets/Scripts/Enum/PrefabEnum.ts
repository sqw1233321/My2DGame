export enum PrefabId {
    Map = "Map",
    Actor1 = "Actor1",
    Actor2 = "Actor2",
    Weapon1 = "Weapon1",
    Weapon2 = "Weapon2",
    Bullet2 = "Bullet2",
    Explosion = "Explosion",
}

export const PrefabPath = new Map<PrefabId, string>([
    [PrefabId.Map, "perfab/map"],
    [PrefabId.Actor1, "perfab/actor1"],
    [PrefabId.Actor2, "perfab/actor2"],
    [PrefabId.Weapon1, "perfab/weapon1"],
    [PrefabId.Weapon2, "perfab/weapon2"],
    [PrefabId.Bullet2, "perfab/bullet2"],
    [PrefabId.Explosion, "perfab/explosion"],
]);


