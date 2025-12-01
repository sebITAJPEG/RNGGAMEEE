import React, { useState, useCallback } from 'react';
import { WakingLifeCutscene } from '../cutscenes/WakingLifeCutscene';
import { WakingLifeView } from '../htmlviews/WakingLifeView';

interface Props {
    skipCutscene?: boolean;
}

export const WakingLifeHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = useCallback(() => {
        setShowCutscene(false);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {showCutscene ? (
                <WakingLifeCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <WakingLifeView />
            )}
        </div>
    );
};
