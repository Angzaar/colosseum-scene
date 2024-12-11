import { AvatarShape, engine, Entity, Transform } from "@dcl/sdk/ecs"
import {spawn} from "~system/PortableExperiences"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import * as npc from 'dcl-npc-toolkit'
// import { showWelcomeDisplay } from "./ui/npcWelcome"
import { welcomeDialog } from "./dialogs"
import { addBuilderHUDAsset } from "../dcl-builder-hud"
import { showWelcomeDisplay } from "../ui/npcWelcome"
import { showDialogPanel } from "../ui/DialogPanel"

export let npcs:Map<Entity, any> = new Map()
export let startedReservationPX = false

export function createNPCs(){
    console.log('creating npcs')

    let myNPC = npc.create(
		{
			position: Vector3.create(49,0,99),
			rotation: Quaternion.Zero(),
			scale: Vector3.create(1, 1, 1),
		},
		//NPC Data Object
		{
			type: npc.NPCType.CUSTOM,
			model: '',
			coolDownDuration:2,
            faceUser:true,
			onActivate: () => {
                // showWelcomeDisplay(true)
				// npc.talk(myNPC, welcomeDialog, 0)
				showDialogPanel(true, {dialogs:welcomeDialog})
			},
            onWalkAway: () => {
                // showWelcomeDisplay(false)
				showDialogPanel(false)
            },
		}
	)

	let avatar = engine.addEntity()
	Transform.create(avatar, {position: Vector3.create(49,0,99)})
	AvatarShape.create(avatar, {
		id:'SR',
		name:"Shrouded Wanderer",
		wearables:["urn:decentraland:matic:collections-v2:0x327aeb54030201d79a2ea702332e2c57d76bb1d5:11"],
		emotes:[]
	})


    npcs.set(myNPC, {})
}

//

export async function startReservationPX(){
	startedReservationPX = true
	const { pid } = await spawn({ ens: 'LANDRealEstate.dcl.eth'})
}