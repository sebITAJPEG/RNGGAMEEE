import React, { useState } from 'react';
import { TheSpectrumCutscene } from '../cutscenes/TheSpectrumCutscene';
import { TheSpectrumView } from '../htmlviews/TheSpectrumView';

interface Props {
    skipCutscene?: boolean;
}

export const TheSpectrumHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <TheSpectrumCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <TheSpectrumView />
            )}
        </div>
    );
};
