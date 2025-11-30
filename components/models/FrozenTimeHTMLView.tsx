import React, { useState } from 'react';
import { FrozenTimeCutscene } from '../cutscenes/FrozenTimeCutscene';
import { FrozenTimeView } from '../htmlviews/FrozenTimeView';

interface Props {
    skipCutscene?: boolean;
}

export const FrozenTimeHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <FrozenTimeCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <FrozenTimeView />
            )}
        </div>
    );
};
