import { useContext } from "react"
import { FlowValidationContext } from "../context/FlowValidationContext"

const useFlowValidation = () => {
  const context = useContext(FlowValidationContext)

  if (!context) {
    throw new Error("useFlowValidation must be used with a FlowValidationContext")
  }

  return context
}

export default useFlowValidation