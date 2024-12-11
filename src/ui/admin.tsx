import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { models } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { IWBButton } from './button';
import { startReservationPX } from '../npcs/npcs';
import { changeRealm } from '~system/RestrictedActions';
import { addAdminItem } from '../npcs/admin';

let show = false

export function showAdminPanel(value:boolean){
    show = value
}

let buttons:any[] = [
    {label:"Add Shop", pressed:false, func:()=>{
        addAdminItem(models.containers.blue)
    }
    },
    {label:"Add Floor", pressed:false, func:()=>{
        addAdminItem(models.containers.blue)
    }
    },
    // {label:"2D Map", pressed:false, func:()=>{
    //     }
    // },
    {label:"Add Tent", pressed:false, func:()=>{
        addAdminItem(models.containers.blue)
        // startReservationPX()
        // showWelcomeDisplay(false)
    // }
    },
    // {label:"Client Map", pressed:false, func:()=>{
    //     }
    // },
    // {label:"Visit Outpost", pressed:false, func:()=>{
    //     changeRealm({realm:"AngZaarOutpost.dcl.eth"})
    // }
}
]

export function createAdmin() {
    return (
        <UiEntity
            key={resources.slug + "admin-panel"}
            uiTransform={{
                display: show ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                width: '15%',
                height: '25%',
                positionType: 'absolute',
                position: {right: '5%', top: '20%'}
            }}
        >

            {generateButtons(buttons)}

        </UiEntity>
    );
}

export function generateButtons(data:any){
    let arr:any[] = []
    data.forEach((button:any)=>{
        arr.push(<IWBButton button={button} buttons={data.buttons} />)
    })
    return arr
  }