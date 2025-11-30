import React, { useState } from 'react';
import { BlackHoleCutscene } from '../cutscenes/BlackHoleCutscene';
import { BlackHoleView } from '../htmlviews/BlackHoleView';

interface Props {
    skipCutscene?: boolean;
}

export const BlackHoleCoreHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <BlackHoleCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <BlackHoleView />
            )}
        </div>
    );
};
