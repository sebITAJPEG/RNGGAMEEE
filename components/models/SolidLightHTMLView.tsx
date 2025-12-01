import React, { useState } from 'react';
import { SolidLightCutscene } from '../cutscenes/SolidLightCutscene';
import { SolidLightView } from '../htmlviews/SolidLightView';

interface Props {
    skipCutscene?: boolean;
}

export const SolidLightHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <SolidLightCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <SolidLightView />
            )}
        </div>
    );
};