import { engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, TextShape, Transform } from "@dcl/sdk/ecs";
import { addBuilderHUDAsset } from "./dcl-builder-hud";
import { Color4, Vector3 } from "@dcl/sdk/math";
import resources from "./helpers/resources";
import { sendServerMessage } from "./server";
import { formatTimeToHHMM } from "./helpers/functions";
import { utils } from "./helpers/libraries";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";

let streamLocationId:number = 0
let reservationsByLocation: any[] = []; // All reservations from the server grouped by location
let selectedSlots: number[] = []; // Track the user's selected slots

let currentPage = 0; // Current page index (corresponds to the day)
let currentLocation = 0; // Current location ID

let dayPlanes:Map<number, any> = new Map()
let leftDay:Entity
let rightDay:Entity
let nameText:Entity
let streamText:Entity

const slotsPerDay = 12; // Number of slots per day
const slotDuration = 2 * 60 * 60; // Slot duration in seconds (2 hours)

// Generate days as timestamps (start of day in seconds)
const days = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + i); // Move to the current day + i days
    date.setUTCHours(0, 0, 0, 0); // Set to midnight (00:00:00) UTC
    return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp in seconds
  });

// Generate slots for a day
function generateSlots(dayTimestamp: number): number[] {
  return Array.from({ length: slotsPerDay }, (_, i) => dayTimestamp + i * slotDuration);
}

export function initStreams(data:any){
    
    reservationsByLocation = data
    .filter((res: any) => res.id === streamLocationId) // Filter by location ID
    .flatMap((res: any) => // Flatten the reservations arrays into a single array
      res.reservations
        // .filter((reservation: any) =>
        //   Math.floor(reservation.timestamp / 86400) * 86400 === days[currentPage] // Match the day
        // )
        .map((reservation: any) => ({
          ...reservation,
          locationId: res.id // Include the location ID for reference
        }))
    );
    
    console.log('reservations for this location are ', reservationsByLocation)

    createReservationPlanes()
    updateSlots()
}

function clearPlanes(){
    dayPlanes.forEach((day:any)=>{
        MeshRenderer.deleteFrom(day.plane)
        TextShape.getMutable(day.text).text = ""
    })
}

function createReservationPlanes(){
    // utils.triggers.enableDebugDraw(true)
    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(39.45, 3, 75.1)})
    addBuilderHUDAsset(parent, "Reserve-P")

    let trigger = engine.addEntity()
    Transform.create(trigger, {parent:parent, position:Vector3.create(0,0,-3)})
    utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:"box", scale:Vector3.create(9,7,5)}],//
        ()=>{
            console.log('editing triggers')
            showStreamNavigation()
        },
        ()=>{
            hideStreamNavigation()
        }
    )

    leftDay = engine.addEntity()
    rightDay = engine.addEntity()
    MeshRenderer.setPlane(leftDay)
    MeshCollider.setPlane(leftDay)
    MeshRenderer.setPlane(rightDay)
    MeshCollider.setPlane(rightDay)

    Transform.create(leftDay, {parent:parent, position: Vector3.create(-3.5,3,-0.02), scale:Vector3.create(0.5, 0.3, 1)})
    Transform.create(rightDay, {parent:parent, position: Vector3.create(-2.5,3,-.02), scale:Vector3.create(0.5, 0.3, 1)})

    pointerEventsSystem.onPointerDown({entity:leftDay, opts:{
        button: InputAction.IA_POINTER, maxDistance:15, hoverText:"Prev Day",
    }}, 
        ()=>{
            if (currentPage > 0) {
                currentPage--;
                updateSlots()
              } else {
                // Try to add a previous day, or notify if it's already there
                addPreviousDay();
                updateSlots()
              }
          
        }
    )

    pointerEventsSystem.onPointerDown({entity:rightDay, opts:{
        button: InputAction.IA_POINTER, maxDistance:15, hoverText:"Next Day",
    }}, 
        ()=>{
            if (currentPage < days.length - 1) {
                currentPage++;
                updateSlots()
              } else {
                // Try to add the next day
                addNextDay();
                currentPage++;
                updateSlots()
              }
        }
    )
    

    // createDayPlanes(-3, parent)
    createDayPlanes(0.55, parent)
    // createDayPlanes(4.15, parent)
}

function showStreamNavigation(){}
function hideStreamNavigation(){}

function createDayPlanes(xOffset:number, parent:Entity){
    let yOffset = 6
    for(let i = 0; i < slotsPerDay; i++){
        let plane = engine.addEntity()
        MeshRenderer.setPlane(plane)
        MeshCollider.setPlane(plane)
        Transform.create(plane, {parent:parent, position:Vector3.create(xOffset, yOffset, 0), scale:Vector3.create(2.5,0.4,1)})

        let text = engine.addEntity()
        TextShape.create(text, {text:"Time slot", textColor:Color4.White(), fontSize:3})
        Transform.create(text, {parent:parent, position:Vector3.create(xOffset, yOffset, -.02)})//

        yOffset -= 0.5
        dayPlanes.set(i, {plane:plane, text:text})
    }
}

// Display current page slots
function updateSlots() {
    clearPlanes()

    const dayTimestamp = days[currentPage];
    const daySlots = generateSlots(dayTimestamp);

    console.log('day slots', daySlots)

    // Create planes for the current day//
    daySlots.forEach((slotTimestamp, index) => {
        const reservation = reservationsByLocation.find((res) => res.timestamp === slotTimestamp); // Find reservation for this slot
        const isReserved = !!reservation;
        const isSelected = selectedSlots.includes(slotTimestamp);

        let dayPlane = dayPlanes.get(index)
        if(!dayPlane){
            console.log('no day planes')
            return
        }
        MeshRenderer.setPlane(dayPlane.plane)
        Material.setPbrMaterial(dayPlane.plane, {albedoColor: isReserved ? Color4.Red() : resources.colors.opaqueBlue})

        let slotText =  "" + formatTimeToHHMM(slotTimestamp) 

        if(isReserved){
            slotText += " - " + reservation.name
        }else{
            slotText += " - Free"
        }

        TextShape.getMutable(dayPlane.text).text =slotText

        // isReserved ?
        pointerEventsSystem.onPointerDown({entity: dayPlane.plane, opts:{
            hoverText:"Reserve", maxDistance:25, button:InputAction.IA_POINTER
        }}, ()=>{
            console.log('reserving time')
            sendServerMessage('reserve-stream', {name:"Test-rs", timestamp:slotTimestamp, locationId:streamLocationId})
        })
        // : null
    })
}

export function updateStreamReservations(data:any){
    let locationId = data.locationId
    let newReservation = data.newReservation

    const isCurrentDay = Math.floor(newReservation.timestamp / 86400) * 86400 === days[currentPage];
    if (isCurrentDay) {
        console.log('is current day, update reservations')
        // Add the new reservation to the current reservations list
        reservationsByLocation.push({...newReservation, id:locationId});

        // Re-render the slots
        updateSlots();
    }
}

function addPreviousDay() {
    // Get the timestamp for the first day in the current array
    const firstDayTimestamp = days[0];
  
    // Calculate the previous day's timestamp
    const previousDayTimestamp = firstDayTimestamp - 86400;
  
    // Check if the previous day is already in the array
    if (!days.includes(previousDayTimestamp)) {
      // Add the previous day to the beginning of the array
      days.unshift(previousDayTimestamp);
  
      // Increment currentPage to maintain the same day view
      currentPage++;
  
      // Refresh the display (if needed)
      updateSlots()
  
      console.log("Added previous day. Updated days array:", days);
    } else {
      console.log("Previous day already exists in the array.");
    }
  }

function addNextDay() {
    // Get the timestamp for the last day in the current array
    const lastDayTimestamp = days[days.length - 1];
  
    // Calculate the next day's timestamp
    const nextDayTimestamp = lastDayTimestamp + 86400;
  
    // Check if the next day is already in the array
    if (!days.includes(nextDayTimestamp)) {
      // Add the next day to the end of the array
      days.push(nextDayTimestamp);
  
      // Refresh the display (if needed)
      updateSlots()
  
      console.log("Added next day. Updated days array:", days);
    } else {
      console.log("Next day already exists in the array.");
    }
  }