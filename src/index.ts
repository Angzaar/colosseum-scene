import { AvatarShape, engine, GltfContainer, MeshRenderer, Transform } from '@dcl/ecs'
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { initTower } from './tower'
import { setupUi } from './ui/ui'
import { getPreview } from './helpers/functions'
import {getPlayer} from "@dcl/sdk/players";
import { utils } from "./helpers/libraries";
import { joinServer, setLocalUserId } from './server'
import { enableBuilderHUD } from './dcl-builder-hud/ui/builderpanel'
import './polyfill'
import { createNPCs } from './npcs/npcs'
import { showAdminPanel } from './ui/admin'

let groundModel = "assets/7f2f746c-98ce-4a47-bccc-d8d2d6161a0b.glb"
let admins:string[] = ["0xceba6b4186aae99bc8c3c467601bd344b1d62764"]

export function main() {
  createGround()
  initTower()

  getPreview().then(()=>{
    let data:any
    try{
      checkPlayer(data)
    }
    catch(e){
        console.log('cannot run deprecated function get explorer configuration', e)
    }
  })
}


let xStart = 0
let yStart = 0
function createGround(){
  for(let x = 0; x < 5; x++){
    for(let y = 0; y < 7;y++){
      let ent = engine.addEntity()
      GltfContainer.create(ent, {src:groundModel})
      // MeshRenderer.setPlane(ent)
      Transform.create(ent, {
          position: Vector3.create(xStart * 16 + 8, 0, yStart * 16 + 8), 
          rotation:Quaternion.fromEulerDegrees(0,0,0),
          scale:Vector3.create(1,1,1)
        })
      yStart++
    }
    xStart++
    yStart = 0
  }
}

function checkPlayer(hardwareData:any){
  let player = getPlayer()
  console.log('player is', player)
  if(!player){
      console.log('player data not set, backing off and trying again')
      utils.timers.setTimeout(()=>{
          checkPlayer(hardwareData)
      }, 100)
  }
  else{
      createPlayer(hardwareData, player)
  }
}

async function createPlayer(hardwareData:any, player:any){
  const playerData = setLocalUserId(player)
  if (playerData) {
    setupUi()

    if(admins.includes(playerData.userId)){
      enableBuilderHUD(true)
      showAdminPanel(true)
    }
    

      // const sceneInfo = await getSceneInformation({})
      // if (!sceneInfo) return

      // const sceneJson = JSON.parse(sceneInfo.metadataJson)
      // console.log("scene json is", sceneJson)

      // if(!sceneJson.iwb) return
      // await setRealm(sceneJson, hardwareData.clientUri)

      joinServer()
  }
}