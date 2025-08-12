import { useState } from "react"

export const InventoryList = ({ picture, name, category, price, dealers_price, quantity}) => {
    
    return(
        <div className="p-2 border-2 border-gray-300 shadow flex">
            <div className="h-8 w-8 rounded">
                <img src={picture}/>
            </div>
            
        </div>
    )
}