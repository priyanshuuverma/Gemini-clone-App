import { createContext, useState} from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{


    const [input, setInput]  = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delaypara = (index,nextword) => {
        setTimeout(function ()
    {
            setResultData(prev=>prev + nextword);
    }, 75*index)

    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }
    const onSent = async (prompt) => {
         setResultData("")
         setLoading(true)
         setShowResult(true)
         let response;

         if(prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(input)
        }
        else {
            setPrevPrompts(prev => [...prev,input])
            setRecentPrompt(input)
            response = await run(input)

        }

        
        
         let responseArray = response.split("**");
         let newResponse = "";
         for(let i=0; i <responseArray.length; i++)
         {
            if(i === 0|| i%2 !== 1){
                newResponse +=  responseArray[i];

            }

            else{
                newResponse += `<b>${responseArray[i]}</b>`
            }
         }


         let newres2 = newResponse.split("*").join("<br>")
         let newresponsearray = newres2.split(" ");
         for(let i=0; i<newresponsearray.length; i++)
         {
            const nextword = newresponsearray[i]
            delaypara(i,nextword + " ")
         }
         setLoading(false)
         setInput("")

        
    }

   
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
        }

    return(
        <Context.Provider value={contextValue}>
                {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;