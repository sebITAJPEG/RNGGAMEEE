import React, { useState } from 'react';
import { NightmareEelCutscene } from '../cutscenes/NightmareEelCutscene';
import { NightmareEelView } from '../htmlviews/NightmareEelView';

interface Props {
    skipCutscene?: boolean;
}

export const NightmareEelHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <NightmareEelCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <NightmareEelView />
            )}
        </div>
    );
};
