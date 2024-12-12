import React, { useContext } from "react";
import { GlobalContext } from "../globalStates.js/GlobalContext";

const MeltAnimation = () => {
    const globalStates = useContext(GlobalContext);

    function hideAnimation() {
        const timer = setTimeout(() => {
            globalStates.setShowAnimation(false);
        }, 1500);
    }

    return (
        <>
            <section className="melt-animation-area">
                <img className="melt-desktop" src={require("../assets/images/Transition_transparent_desk.gif")} onLoad={() => hideAnimation()} />
                <img className="melt-tab" src={require("../assets/images/Transition_transparent_tablet.gif")} onLoad={() => hideAnimation()} />
                {/* <img className="melt-mobile pa-transition" src={require("../assets/images/480_pa_transition.gif")} /> */}
                <img className="melt-mobile" src={require("../assets/images/Transition_transparent_mobile.gif")} onLoad={() => hideAnimation()} />
            </section>
        </>
    )
};
export default MeltAnimation;