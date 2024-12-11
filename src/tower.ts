import { ColliderLayer, engine, Entity, GltfContainer, Transform } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { addBuilderHUDAsset } from "./dcl-builder-hud";

export let tower:Entity

export function initTower(){
    tower = engine.addEntity()
    GltfContainer.create(tower, {src: "assets/colosseum.glb", visibleMeshesCollisionMask:ColliderLayer.CL_NONE, invisibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS})
    Transform.create(tower, 
        {
            position: Vector3.create(40,0,56), 
            rotation:Quaternion.fromEulerDegrees(0,0,0), 
            scale:Vector3.create(.81,.81,.81)
        })
    addBuilderHUDAsset(tower, "colosseum")
}//