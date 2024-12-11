import { engine, GltfContainer, Transform } from "@dcl/sdk/ecs"
import { create } from "dcl-npc-toolkit"
import { addBuilderHUDAsset } from "../dcl-builder-hud"

export let adminCounter = 0

export let adminJSON:any = {}

export function addAdminItem(type:any){
    let ent = engine.addEntity()
    Transform.create(ent, {position: Transform.get(engine.PlayerEntity).position})
    GltfContainer.create(ent, {src: type})
    addBuilderHUDAsset(ent, "Admin-Item-" + adminCounter)
    adminCounter++
}