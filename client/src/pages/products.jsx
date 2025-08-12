import Loader from "../components/loader"
import Topbar from "../components/topbar"

export const Products = () => {
    return(
        <div className="bg-white w-full h-screen">
        <Topbar title={"Repairs"}/>
        <Loader/>
    </div>
    )
}