import { Dialog } from "dcl-npc-toolkit"
import { showWelcomeDisplay } from "../ui/npcWelcome"
import { startReservationPX } from "./npcs"
import { showDialogPanel } from "../ui/DialogPanel"
import { changeRealm, teleportTo } from "~system/RestrictedActions"


export let welcomeDialog: Dialog[] = [
	{
		text: `Welcome to the Angzaar Plaza! This place has been transformed and includes so many great areas! The OG Angzaar Outpost has been deployed on a far away world. Jump in to start battling enemies, collection resources, and navigating the faction quests!`,
        isQuestion: true,
		buttons: [
			{ label: `Learn More`, goToDialog: 1 },
			{ label: `Reserve Land`, goToDialog:-1, triggeredActions:()=>{
				startReservationPX()
				showDialogPanel(false)
			} },
            { label: `Visit Outpost`, goToDialog: -1, triggeredActions:()=>{
				showDialogPanel(false)
				changeRealm({realm:"AngZaarOutpost.dcl.eth"})
			} },
		],
	},
	{
		text: `The redeveloped Angzaar Plaza includes an Art Gallery, Shopping District, Conference Center, Colosseum Venue, and rentable land! Reserve the Angzaar Colosseum inside lower level!`,
		isQuestion: true,
		buttons: [
			{ label: `Conference`, goToDialog: 2 },
			{ label: `Art & Shoppes`, goToDialog: 3 },
            { label: `Colosseum`, goToDialog: 4 },
			{ label: `Reservable Land`, goToDialog: 5 },
		],
	},

	{
		text: `The Angzaar Conference Center is great for hosting live streams and meetings. You can make a reservation right out front at the NPC. Once reserved, you can edit the building banner images and change the video and audio streams!`,
		isQuestion: true,
		buttons: [
			{ label: `Go Back`, goToDialog: 0 },
			{ label: `Visit`, goToDialog: -1, triggeredActions:()=>{
				teleportTo({worldCoordinates:{x:7, y:-80}})
			} },
			{ label: `Close`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
		],
	},

	{
		text: `The Angzaar Arts & Shoppes area is great to explore fellow user galleries, the main Art Gallery, or shop for Decentraland wearables and emotes! Users can reserve individual shoppes and show off their nft collections or sell items. The main Art Gallery is also available for reservation!`,
		isQuestion: true,
		buttons: [
			{ label: `Go Back`, goToDialog: 0 },
			{ label: `Visit`, goToDialog: -1, triggeredActions:()=>{
				teleportTo({worldCoordinates:{x:6, y:-79}})
			} },
			{ label: `Close`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
		],
	},

	{
		text: `The Angzaar Colosseum is an enterainment venue available for reservation! Live stream concerts or events into the main area or the lower level!`,
		isQuestion: true,
		buttons: [
			{ label: `Go Back`, goToDialog: 0 },
			{ label: `Visit`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
			{ label: `Close`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
		],
	},

	{
		text: `The Angzaar Plaza now includes subdivided sections available for reservation! This is a great for new users with no access to land, for short pop up events, or for tinkering and learning more about Decentraland. Choose a spot and you will be able to deploy your scenes immediately! No coding required to deploy.`,
		isQuestion: true,
		buttons: [
			{ label: `Go Back`, goToDialog: 0 },
			{ label: `Reserve`, goToDialog: 4 },
			{ label: `Close`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
		],
	},
]