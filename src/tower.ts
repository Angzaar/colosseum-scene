import { Animator, ColliderLayer, EasingFunction, engine, Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, Tween } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { addBuilderHUDAsset } from "./dcl-builder-hud";
import { models } from "./helpers/resources";
import * as npc from 'dcl-npc-toolkit'
import { showDialogPanel } from "./ui/DialogPanel";
import { iwbDialog } from "./npcs/dialogs";
import { getRandomIntInclusive } from "./helpers/functions";
import {spawn} from "~system/PortableExperiences"
import { utils } from "./helpers/libraries";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";
import { movePlayerTo } from "~system/RestrictedActions";

export let tower:Entity
let containerModels:string[] = []

export function initTower(){
    tower = engine.addEntity()
    GltfContainer.create(tower, {src: "assets/colosseum.glb", visibleMeshesCollisionMask:ColliderLayer.CL_NONE, invisibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS})
    Transform.create(tower, {
            position: Vector3.create(40,0,56), 
            rotation:Quaternion.fromEulerDegrees(0,0,0), 
            scale:Vector3.create(.81,.81,.81)
    })
    Animator.create(tower, {states:[
        {clip:'rightbanner', playing:true, loop:true},
        {clip:'leftbanner', playing:true, loop:true},
        {clip:'firepit', playing:true, loop:true},
        {clip:'elevator', playing:true, loop:true},
        {clip:'elevatorcollider', playing:true, loop:true},
    ]})
    addBuilderHUDAsset(tower, "colosseum")
    createTents()
    createContainers()
    createIWB()
    createNeurolinkTerminal()
}

function createNeurolinkTerminal(){
    let ent = engine.addEntity()
    Transform.create(ent, {position:Vector3.create(66, 0, 22)})
    GltfContainer.create(ent, {src:'assets/2880b7bc-7d3c-46da-8994-024ae2d4d0fd.glb'})
    Animator.create(ent, {
        states:[
            {clip:"idle", playing:true, loop:false},
            {clip:"play", playing:true, loop:true},
        ]
    })
    pointerEventsSystem.onPointerDown({entity:ent,
        opts:{button:InputAction.IA_SECONDARY, hoverText:"Connect to Neurolink", maxDistance:7}
    },
    ()=>{
        spawnNeurolink()
    })
    // addBuilderHUDAsset(ent, "Neurolink")
}

function createIWB(){
    let ent = engine.addEntity()
    Transform.create(ent, {position: Vector3.create(11.2, 0, 100.8), rotation:Quaternion.fromEulerDegrees(0,90,0), scale:Vector3.create(0.7,0.7,0.7)})
    GltfContainer.create(ent, {src: 'assets/iwb.glb'})
    addBuilderHUDAsset(ent, "iwb")

let myNPC = npc.create(
        {
            position: Vector3.create(21.63,0, 103.39),
            rotation: Quaternion.fromEulerDegrees(0,90,0),
            scale: Vector3.create(1, 1, 1),
        },
        //NPC Data Object
        {
            type: npc.NPCType.CUSTOM,
            model: 'assets/RobotNPC.glb',
            idleAnim:"idle",
            coolDownDuration:2,
            faceUser:true,
            onActivate: () => {
                // showWelcomeDisplay(true)
                // npc.talk(myNPC, welcomeDialog, 0)
                showDialogPanel(true, {dialogs:iwbDialog})
            },
            onWalkAway: () => {
                // showWelcomeDisplay(false)
                showDialogPanel(false)
            },
        }
    )
}

function createTents(){
    topRightTentConfigs.forEach((container:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, container.transform)
        GltfContainer.create(ent, {src: container.model})
        if(container.type === 1){
            let interior = engine.addEntity()
            Transform.create(interior, {parent:ent})
            GltfContainer.create(interior, {src: models.tents.interior})
        }
        // addBuilderHUDAsset(ent, "tents-"+i)
    })
}

function createContainers(){
    for(let key in models.containers){
        containerModels.push(models.containers[key])
    }

    rubbleConfigs.forEach((container:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, container.transform)
        GltfContainer.create(ent, {src: getRandomModel()})
        // addBuilderHUDAsset(ent, "rubble-c-"+i)
    })

    backFloorConfigs.forEach((container:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, container.transform)
        GltfContainer.create(ent, {src: container.model})
        addBuilderHUDAsset(ent, "back-floor-"+i)
    })

    backContainerConfigs.forEach((container:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, container.transform)
        GltfContainer.create(ent, {src: getRandomModel()})
        if(container.type === 1){
            let interior = engine.addEntity()
            Transform.create(interior, {parent:ent})
            GltfContainer.create(interior, {src: models.interiors.interiorDark})
        }
        // addBuilderHUDAsset(ent, "back-c-"+i)
    })

    // utils.triggers.enableDebugDraw(true)

    triggerConfigs.forEach((trigger:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, trigger.transform)
        utils.triggers.addTrigger(ent, NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,2,2), position: Vector3.create(0,1,0)}],
        ()=>{
            movePlayerTo({newRelativePosition:{x:Transform.get(ent).position.x , y:Transform.get(ent).position.y + 4.5, z:Transform.get(ent).position.z}})
            }
        )
        addBuilderHUDAsset(ent, "trigger-"+i)
    })

    downTriggerConfigs.forEach((trigger:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, trigger.transform)
        utils.triggers.addTrigger(ent, NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,2,2), position: Vector3.create(0,1,0)}],
        ()=>{
            movePlayerTo({newRelativePosition:{x:Transform.get(ent).position.x , y:Transform.get(ent).position.y - 1, z:Transform.get(ent).position.z}})
            }
        )
        addBuilderHUDAsset(ent, "down-trigger-"+i)
    })
}

function getRandomModel(){
    return containerModels[ getRandomIntInclusive(0, containerModels.length-1)]
}

let topRightTentConfigs:any = [
    //first floor
    {type:1, model:models.tents.exteriors.sage, transform:{position:Vector3.create(74,0.2,106), rotation:Quaternion.fromEulerDegrees(0,45,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.tents.exteriors.navy, transform:{position:Vector3.create(74,0.2,94), rotation:Quaternion.fromEulerDegrees(0,150,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.tents.exteriors.navy, transform:{position:Vector3.create(66,0.2,93), rotation:Quaternion.fromEulerDegrees(0,195,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.tents.exteriors.navy, transform:{position:Vector3.create(60,0.2,98), rotation:Quaternion.fromEulerDegrees(0,240,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.tents.exteriors.navy, transform:{position:Vector3.create(60,0.2,106), rotation:Quaternion.fromEulerDegrees(0,300,0), scale:Vector3.create(1,1,1)}},
]

let rubbleConfigs:any = [
    {type:2, model:models.containers.sunsteel, transform:{position:Vector3.create(73,2,80), rotation:Quaternion.fromEulerDegrees(0,315,270), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(73,1,65), rotation:Quaternion.fromEulerDegrees(15,0,270), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(9,1,65), rotation:Quaternion.fromEulerDegrees(15,0,270), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(9,2,70), rotation:Quaternion.fromEulerDegrees(90,75,0), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(5,-.4,74.4), rotation:Quaternion.fromEulerDegrees(0,45,270), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(13.2,2.10,41.4), rotation:Quaternion.fromEulerDegrees(45,240,270), scale:Vector3.create(1,1,1)}},
    {type:2, model:models.containers.sage, transform:{position:Vector3.create(13.2,2.10,35.4), rotation:Quaternion.fromEulerDegrees(0,240,270), scale:Vector3.create(1,1,1)}},
]

let backContainerConfigs:any[] =[
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(66,0.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(70,0.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(66,4.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(70,4.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(66,8.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(70,8.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(66,12.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(70,12.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(66,16.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(70,16.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(50,0.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(54,0.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(14,0.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(10,0.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(30,0.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(26,0.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(14,4.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(30,4.2,16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(26,4.2,16), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,0.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},



    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,4.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,8.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,12.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,16.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},

    {type:1, model:models.containers.blue, transform:{position:Vector3.create(4,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(12,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(20,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(28,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(36,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(44,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(52,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(60,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(68,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},
    {type:1, model:models.containers.blue, transform:{position:Vector3.create(76,20.2,2), rotation:Quaternion.fromEulerDegrees(0,-90,0), scale:Vector3.create(1,1,1)}},


]

let backFloorConfigs:any = [
    {type:0, model:models.platforms.baseDown, transform:{position:Vector3.create(44,8.2,18), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
//
    {type:0, model:models.platforms.openbase, transform:{position:Vector3.create(38,8.2,20), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.openbase, transform:{position:Vector3.create(44,4.2,18), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(44,4.2,10), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(36,4.2,10), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseDown, transform:{position:Vector3.create(36,4.2,18), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},


    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(28,4.2,10), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(28,4.2,18), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseDown, transform:{position:Vector3.create(76,0.2,2), rotation:Quaternion.fromEulerDegrees(0,270,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,0.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,0.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseDown, transform:{position:Vector3.create(46,0.2,20), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,0.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},


    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    // {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,0.2,28), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},


    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,4.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,4.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,4.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,4.2,12), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,4.2,20), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},



    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,8.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,12.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,16.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},

    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(74,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(66,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(58,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(50,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(42,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(34,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(26,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(18,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(10,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {type:0, model:models.platforms.baseSolid, transform:{position:Vector3.create(2,20.2,4), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
]

let triggerConfigs:any[] = [
    // {direction:-1,transform:{position:Vector3.create(46,4,22), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {direction:1, transform:{position:Vector3.create(42,0,22), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {dirction:1, transform:{position:Vector3.create(78,0,6), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {dirction:-1, transform:{position:Vector3.create(38,4,22), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
]

let downTriggerConfigs:any[] = [
    {dirction:-1, transform:{position:Vector3.create(34,8,22), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
    {dirction:-1, transform:{position:Vector3.create(46,4,22), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)}},
]

async function spawnNeurolink(){
    const { pid } = await spawn({ ens: 'DCLNeurolink.dcl.eth'})

}