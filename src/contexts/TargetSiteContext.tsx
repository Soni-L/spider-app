import { createContext, useContext } from "react";

export const TargetSiteContext = createContext(null);
export const TargetSiteDispatchContext = createContext(null);

export function useTargetSiteDispatch() {
  return useContext(TargetSiteDispatchContext);
}

export function useTargetSite() {
  return useContext(TargetSiteContext);
}
