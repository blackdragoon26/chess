import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
export const Landing = () => {

    const navigate=useNavigate();

  return <div className="align justify-center">


    <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            <div className="align justify-center">
                <img src="/sddefault.jpg" alt="kirat bhaiya yo" />

            </div>

            <div className="pt-69">
                <div className="flex justify-center mt-39">

                <h1 className="text-4xl font-bold mb-4">Play Chess online</h1>
                </div>
                
                <div className="mt-9 flex justify-center">
                    <Button onClick={()=>{
                        navigate("/game")
                    }} >
                        find a bitch
                    </Button>
                </div>

            </div>

            
            </div>   

    </div>




  </div>

}