import { engine, Entity, GltfContainer, Transform } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export let stage:Entity

export function initStage(){
    stage = engine.addEntity()
    // GltfContainer.create(stage, {src: "assets/screen.glb"})
    Transform.create(stage, 
        {
            position: Vector3.create(32,0,22), 
            rotation:Quaternion.fromEulerDegrees(0,180,0), 
            scale:Vector3.create(3,3,3)
        })
}